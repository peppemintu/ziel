import React, { useState, useEffect } from 'react';
import { Modal, Paper, Grid, Box } from '@mui/material';
import { useAuth } from '../../auth/hooks/useAuth';

// Hooks
import { useElementData } from '../hooks/useElementData';
import { useFileOperations } from '../hooks/useFileOperations';
import { useChat } from '../hooks/useChat';
import { useProgressManagement } from '../hooks/useProgressManagement';

// Components
import ElementHeader from '../components/element/ElementHeader';
import DescriptionSection from '../components/element/DescriptionSection';
import ReferenceFilesSection from '../components/element/ReferenceFilesSection';
import StudentSubmissionView from '../components/element/StudentSubmissionView';
import TeacherSubmissionsView from '../components/element/TeacherSubmissionsView';
import StudentProgressManagement from '../components/element/StudentProgressManagement';
import UploadDialog from '../components/element/UploadDialog';

// Utils
import { isSubmissionRequired, isAttestationType } from '../utils/elementTypes';

const ElementPageModal = ({
  open,
  onClose,
  element,
  userRole,
  onElementUpdate,
  students = [],
  onChatOpen
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedElement, setEditedElement] = useState(element || {});
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submissionComment, setSubmissionComment] = useState('');
  const [expandedSubmissions, setExpandedSubmissions] = useState({});

  // Custom hooks
  const {
    referenceFiles,
    submissions,
    loading,
    loadElementData
  } = useElementData(element?.id, open);

  const {
    uploading,
    handleSubmissionUpload,
    handleReferenceUpload,
    handleFileDelete,
    handleFileDownload
  } = useFileOperations(element?.id, user?.id, loadElementData);

  const {
    chatMessages,
    newMessages,
    setNewMessages,
    handleSendMessage
  } = useChat();

  const {
    progressStatuses,
    updatingProgress,
    loadProgressStatuses,
    updateProgressStatus
  } = useProgressManagement(element?.id);

  useEffect(() => {
    if (element) {
      setEditedElement(element);
      if (userRole === 'TEACHER') {
        loadProgressStatuses();
      }
    }
  }, [element, open, userRole, loadProgressStatuses]);

  const handleSave = () => {
    onElementUpdate(editedElement);
    setIsEditing(false);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    if (files.length > 0) {
      setUploadDialogOpen(true);
    }
  };

  const handleSubmissionUploadComplete = async () => {
    if (selectedFiles.length === 0) return;

    try {
      await handleSubmissionUpload(selectedFiles, submissionComment, user.id);

      // Update progress status to IN_PROGRESS when student submits files
      if (userRole === 'STUDENT') {
        await updateProgressStatus(user.id, 'IN_PROGRESS');
      }

      setUploadDialogOpen(false);
      setSelectedFiles([]);
      setSubmissionComment('');
    } catch (error) {
      console.error('Error uploading submission:', error);
    }
  };

  const toggleSubmissionExpansion = (studentId) => {
    setExpandedSubmissions(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleNewMessageChange = (studentId, message) => {
    setNewMessages(prev => ({
      ...prev,
      [studentId]: message
    }));
  };

  const currentUserSubmission = submissions.find(s => s.studentId === user?.id);
  const currentUserProgress = progressStatuses[user?.id];

  if (!element) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper
        sx={{
          width: '95%',
          maxWidth: 1400,
          maxHeight: '95vh',
          overflow: 'auto',
          borderRadius: 3,
          boxShadow: 24
        }}
      >
        <ElementHeader
          element={element}
          editedElement={editedElement}
          setEditedElement={setEditedElement}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={handleSave}
          onClose={onClose}
          userRole={userRole}
          currentUserProgress={currentUserProgress}
        />

        <Box sx={{ p: 3 }}>
          {/* ATTESTATION view: Show progress table only */}
          {isAttestationType(element?.elementType) ? (
            <Box sx={{ p: 2 }}>
              <StudentProgressManagement
                courseId={element.courseId}
                userRole={userRole}
                onGradeUpdate={(studentId, grade) => {
                  console.log(`Grade updated for student ${studentId}:`, grade);
                }}
              />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Left Column - Description and Reference Materials */}
              <Grid item xs={12} lg={6}>
                <DescriptionSection
                  element={element}
                  editedElement={editedElement}
                  setEditedElement={setEditedElement}
                  isEditing={isEditing}
                />

                <ReferenceFilesSection
                  referenceFiles={referenceFiles}
                  loading={loading}
                  uploading={uploading}
                  userRole={userRole}
                  onReferenceUpload={handleReferenceUpload}
                  onFileDelete={handleFileDelete}
                  onFileDownload={handleFileDownload}
                />
              </Grid>

              {/* Right Column - Submissions */}
              <Grid item xs={12} lg={6}>
                {isSubmissionRequired(element?.elementType) && (
                  <Box>
                    {userRole === 'STUDENT' ? (
                      <StudentSubmissionView
                        currentUserSubmission={currentUserSubmission}
                        currentUserProgress={currentUserProgress}
                        chatMessages={chatMessages}
                        newMessages={newMessages}
                        userRole={userRole}
                        onUploadClick={() => setUploadDialogOpen(true)}
                        onFileDownload={handleFileDownload}
                        onSendMessage={handleSendMessage}
                        onNewMessageChange={handleNewMessageChange}
                      />
                    ) : (
                      <TeacherSubmissionsView
                        submissions={submissions}
                        progressStatuses={progressStatuses}
                        updatingProgress={updatingProgress}
                        expandedSubmissions={expandedSubmissions}
                        chatMessages={chatMessages}
                        newMessages={newMessages}
                        userRole={userRole}
                        onToggleExpansion={toggleSubmissionExpansion}
                        onUpdateProgress={updateProgressStatus}
                        onFileDownload={handleFileDownload}
                        onSendMessage={handleSendMessage}
                        onNewMessageChange={handleNewMessageChange}
                      />
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          )}
        </Box>

        <UploadDialog
          open={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          selectedFiles={selectedFiles}
          submissionComment={submissionComment}
          setSubmissionComment={setSubmissionComment}
          uploading={uploading}
          onFileSelect={handleFileSelect}
          onUpload={handleSubmissionUploadComplete}
        />
      </Paper>
    </Modal>
  );
};

export default ElementPageModal;