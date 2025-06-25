import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Snackbar, Alert } from '@mui/material';

import TableView from '../components/table/TableView.jsx';
import RoadmapView from '../components/roadmap/RoadmapView.jsx';
import useApi from '../hooks/useApi.jsx';
import { useAuth } from '../../auth/hooks/useAuth.js';
import CourseHeader from '../components/course/CourseHeader.jsx';
import CourseTabNavigation from '../components/course/CourseTabNavigation.jsx';
import ElementPage from './ElementPage.jsx'

export default function CoursePage() {
  const { id: courseId } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedElement, setSelectedElement] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const userRole = user?.role?.toUpperCase(); // 'TEACHER' or 'STUDENT'

  const {
    data: { course, studyPlan, elements, relationships },
    loading,
    snackbar,
    setSnackbar,
    fetchData,
    handleElementAdd,
    handleElementEdit,
    handleElementDelete,
    handleFileUpload,
    handleConnectionCreate,
    handleRelationshipUpdate
  } = useApi(courseId, userRole);

  useEffect(() => {
    fetchData();
  }, [courseId, userRole, fetchData]);

  const handleElementClick = (element) => {
      setSelectedElement(element);
      setModalOpen(true);
    };

    const handleModalClose = () => {
      setModalOpen(false);
      setSelectedElement(null);
    };

    const handleElementUpdate = (updatedElement) => {
      handleElementEdit(updatedElement);
    };

    const handleSubmissionStatusUpdate = (submissionId, newStatus) => {
      console.log('Update submission', submissionId, 'to', newStatus);
    };

    const handleChatOpen = (studentId, elementId) => {
      console.log('Open chat for student', studentId, 'and element', elementId);
    };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading course...</Typography>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Course not found</Alert>
      </Box>
    );
  }

  return (
  <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <CourseHeader course={course} studyPlan={studyPlan} />

      <CourseTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <Box
        sx={{
          mt: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 2,
          px: 4,
          py: 3,
          mx: 'auto',
          flexGrow: 1,
        }}
      >
        {activeTab === 0 && (
          <TableView
            elements={elements}
            relationships={relationships}
            onElementAdd={handleElementAdd}
            onElementEdit={handleElementEdit}
            onElementDelete={handleElementDelete}
            onFileUpload={handleFileUpload}
            onRelationshipUpdate={handleRelationshipUpdate}
            onElementClick={handleElementClick}
            userRole={userRole}
          />
        )}
        {activeTab === 1 && (
          <RoadmapView
            elements={elements}
            relationships={relationships}
            onConnectionCreate={handleConnectionCreate}
            onElementClick={handleElementClick}
            userRole={userRole}
          />
        )}
      </Box>

      <ElementPage
        open={modalOpen}
        onClose={handleModalClose}
        element={selectedElement}
        userRole={userRole}
        onElementUpdate={handleElementUpdate}
        onFileUpload={handleFileUpload}
        onSubmissionStatusUpdate={handleSubmissionStatusUpdate}
        onChatOpen={handleChatOpen}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  </Box>
  );
}
