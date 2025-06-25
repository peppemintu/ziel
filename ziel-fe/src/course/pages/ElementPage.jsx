import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Avatar,
  Collapse,
  Alert,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tooltip,
  Badge,
  Stack,
  Grid,
  ButtonGroup
} from '@mui/material';
import {
  Close,
  Edit,
  Save,
  Cancel,
  Upload,
  Download,
  Delete,
  Chat,
  Send,
  ExpandMore,
  ExpandLess,
  Attachment,
  CheckCircle,
  Schedule,
  Assignment,
  CloudUpload,
  InsertDriveFile,
  Person,
  Warning,
  Add,
  Comment,
  Feedback,
  AssignmentTurnedIn,
  CheckCircleOutline,
  ErrorOutline,
  HourglassEmpty,
  PlayArrow,
  AccessTime
} from '@mui/icons-material';
import authAxios from '../../auth/utils/authFetch';
import { API_BASE } from '../utils/constants';
import { useAuth } from '../../auth/hooks/useAuth';
import StudentProgressTable from '../components/element/StudentProgressTable.jsx';

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
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [messagesByStudent, setMessagesByStudent] = useState({});
  const [newMessages, setNewMessages] = useState({});
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submissionComment, setSubmissionComment] = useState('');
  const [expandedSubmissions, setExpandedSubmissions] = useState({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressStatuses, setProgressStatuses] = useState({});
  const [updatingProgress, setUpdatingProgress] = useState({});

  useEffect(() => {
    if (element) {
      setEditedElement(element);
      loadElementData();
      if (userRole === 'TEACHER') {
        loadProgressStatuses();
      }
    }
  }, [element, open]);

  const loadMessages = async (submissionsData = null) => {
    try {
      const response = await authAxios.get(`${API_BASE}/message/element/${element.id}`);
      const messages = response.data;

      if (userRole === 'STUDENT') {
        setMessagesByStudent({ [user.id]: messages });
      } else {
        const grouped = {};

        const currentSubmissions = submissionsData || submissions;

        const studentIds = [...new Set(currentSubmissions.map(s => s.studentId))];

        studentIds.forEach(studentId => {
          grouped[studentId] = messages.filter(msg =>
            msg.userId === studentId ||
            (msg.userId === user.id) // Teacher's messages - this needs better logic
          );
        });

        setMessagesByStudent(grouped);
      }

      console.log('Loaded messages:', messages); // Debug log
    } catch (e) {
      console.error('Failed to load messages:', e);
    }
  };

  const loadElementData = async () => {
    if (!element?.id) return;

    try {
      setLoading(true);
      const response = await authAxios.get(`${API_BASE}/file/element/${element.id}`);
      const allFiles = response.data || [];

      console.log('Loaded files:', allFiles); // Debug log

      const refFiles = allFiles.filter(file =>
        file.uploadedByRole === 'TEACHER'
      );

      const studentFiles = allFiles.filter(file =>
        file.uploadedByRole === 'STUDENT'
      );

      const submissionsByStudent = studentFiles.reduce((acc, file) => {
        const studentId = file.uploadedById;
        if (!acc[studentId]) {
          acc[studentId] = {
            studentId,
            studentEmail: file.uploadedByEmail,
            studentName: file.uploadedByEmail.split('@')[0], // Extract name from email as fallback
            files: [],
            latestUpload: null,
            comment: '' // You might need to store this separately or get from file metadata
          };
        }

        acc[studentId].files.push({
          ...file,
          size: file.size || 0 // Add default size if missing from backend
        });

        if (
          !acc[studentId].latestUpload ||
          new Date(file.uploadedAt) > new Date(acc[studentId].latestUpload)
        ) {
          acc[studentId].latestUpload = file.uploadedAt;
        }

        return acc;
      }, {});

      setReferenceFiles(refFiles);
      setSubmissions(Object.values(submissionsByStudent));

      await loadMessages(Object.values(submissionsByStudent));
    } catch (error) {
      console.error('Error loading element data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgressStatuses = async () => {
    if (!element?.id) return;

    try {
      const response = await authAxios.get(`${API_BASE}/progress/element/${element.id}`);
      const progressData = response.data || [];

      const statusMap = {};
      progressData.forEach(progress => {
        statusMap[progress.studentId] = {
          id: progress.id,
          status: progress.status,
          grade: progress.grade
        };
      });

      setProgressStatuses(statusMap);
    } catch (error) {
      console.error('Error loading progress statuses:', error);
    }
  };

  const updateProgressStatus = async (studentId, newStatus, grade = null) => {
    try {
      setUpdatingProgress(prev => ({ ...prev, [studentId]: true }));

      const currentProgress = progressStatuses[studentId];

      if (currentProgress?.id) {
        await authAxios.put(`${API_BASE}/progress/${currentProgress.id}`, {
          status: newStatus,
          grade: grade,
          elementId: element.id,
          studentId: studentId
        });
      } else {
        await authAxios.post(`${API_BASE}/progress`, {
          status: newStatus,
          grade: grade,
          elementId: element.id,
          studentId: studentId
        });
      }

      setProgressStatuses(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          status: newStatus,
          grade: grade
        }
      }));

    } catch (error) {
      console.error('Error updating progress status:', error);
    } finally {
      setUpdatingProgress(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NOT_STARTED': return 'default';
      case 'IN_PROGRESS': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'NEEDS_CHANGES': return 'error';
      case 'OVERDUE': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'NOT_STARTED': return <HourglassEmpty />;
      case 'IN_PROGRESS': return <PlayArrow />;
      case 'ACCEPTED': return <CheckCircle />;
      case 'NEEDS_CHANGES': return <ErrorOutline />;
      case 'OVERDUE': return <AccessTime />;
      default: return <HourglassEmpty />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'NOT_STARTED': return 'Не начато';
      case 'IN_PROGRESS': return 'В процессе';
      case 'ACCEPTED': return 'Принято';
      case 'NEEDS_CHANGES': return 'Нужны изменения';
      case 'OVERDUE': return 'Просрочено';
      default: return 'Неизвестно';
    }
  };

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

  const handleSubmissionUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setUploading(true);

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('elementId', element.id);
        formData.append('userId', user.id);
        formData.append('comment', submissionComment);
        formData.append('isSubmission', 'true');

        await authAxios.post(`${API_BASE}/file/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (userRole === 'STUDENT') {
        await updateProgressStatus(user.id, 'IN_PROGRESS');
      }

      await loadElementData();
      setUploadDialogOpen(false);
      setSelectedFiles([]);
      setSubmissionComment('');
    } catch (error) {
      console.error('Error uploading submission:', error);
    } finally {
      setUploading(false);
    }
  };

  const uploadReferenceFile = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('elementId', element.id);
      formData.append('userId', user.id);
      formData.append('isReference', 'true');

      await authAxios.post(`${API_BASE}/file/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await loadElementData();
    } catch (error) {
      console.error('Error uploading reference file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleReferenceUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadReferenceFile(file);
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      await authAxios.delete(`${API_BASE}/file/${fileId}`);
      await loadElementData();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleFileDownload = async (fileId, fileName) => {
    try {
      const response = await authAxios.get(`${API_BASE}/file/download/${fileId}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleSendMessage = async (studentId) => {
    const messageText = newMessages[studentId]?.trim();
    if (!messageText) return;

    try {
      await authAxios.post(`${API_BASE}/message`, {
        content: messageText,
        userId: user.id,
        elementId: element.id
      });

      await loadMessages();
      setNewMessages(prev => ({ ...prev, [studentId]: '' }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  const toggleSubmissionExpansion = (studentId) => {
    setExpandedSubmissions(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Байт', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isSubmissionRequired = element?.elementType === "LABWORK" || element?.elementType === "PRACTICE";
  const currentUserSubmission = submissions.find(s => s.studentId === user.id);
  console.log(progressStatuses);
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
          width: 'auto',
          maxWidth: '90vw',
          maxHeight: '95vh',
          overflow: 'auto',
          borderRadius: 3,
          boxShadow: 24,
          minWidth: '550px',
        }}
      >
        {/* Header */}
        <Box sx={{
          p: 3,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #21d375 0%, #6bbf59 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isEditing ? (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  value={editedElement.name || ''}
                  onChange={(e) => setEditedElement({ ...editedElement, name: e.target.value })}
                  size="small"
                  sx={{
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                    }
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: 'white' }}>Type</InputLabel>
                  <Select
                    value={editedElement.type || ''}
                    onChange={(e) => setEditedElement({ ...editedElement, type: e.target.value })}
                    label="Type"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                    }}
                  >
                    <MenuItem value="LECTURE">Лекция</MenuItem>
                    <MenuItem value="LABWORK">Лабораторная</MenuItem>
                    <MenuItem value="PRACTICE">Практик</MenuItem>
                    <MenuItem value="ATTESTATION">Проверка знаний</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                  {element.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    label={element.elementType}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 500
                    }}
                    size="small"
                  />
                  {/* Show current user's progress status for students */}
                  {userRole === 'STUDENT' && currentUserProgress && (
                    <Chip
                      icon={getStatusIcon(currentUserProgress.status)}
                      label={getStatusText(currentUserProgress.status)}
                      color={getStatusColor(currentUserProgress.status)}
                      sx={{ color: 'white' }}
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {userRole === 'TEACHER' && (
              <>
                {isEditing ? (
                  <>
                    <IconButton onClick={handleSave} sx={{ color: 'white' }}>
                      <Save />
                    </IconButton>
                    <IconButton onClick={() => setIsEditing(false)} sx={{ color: 'white' }}>
                      <Cancel />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => setIsEditing(true)} sx={{ color: 'white' }}>
                    <Edit />
                  </IconButton>
                )}
              </>
            )}
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* ATTESTATION view: Show progress table only */}
          {element?.elementType === 'ATTESTATION' ? (
            <Box sx={{ p: 2 }}>
              <StudentProgressTable
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
                  {/* Description Section */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Assignment color="primary" />
                      Описание
                    </Typography>
                    {isEditing ? (
                      <TextField
                        multiline
                        rows={6}
                        fullWidth
                        value={editedElement.description || ''}
                        onChange={(e) => setEditedElement({ ...editedElement, description: e.target.value })}
                        placeholder="Введите описание, критерии оценки, дополнительную информацию..."
                        sx={{ mt: 1 }}
                      />
                    ) : (
                      <Card variant="outlined" sx={{ mt: 1 }}>
                        <CardContent>
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            {element.description || 'Нет описания.'}
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                  </Box>

                  {/* Reference Materials Section */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                      p: 2,
                      backgroundColor: 'success.main',
                      color: 'white',
                      borderRadius: 2
                    }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InsertDriveFile />
                        Методические материалы
                        <Badge badgeContent={referenceFiles.length} color="secondary" />
                      </Typography>
                      {userRole === 'TEACHER' && (
                        <Button
                          variant="contained"
                          startIcon={uploading ? <LinearProgress size={20} /> : <CloudUpload />}
                          component="label"
                          disabled={uploading}
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                          }}
                        >
                          {uploading ? 'Загрузка...' : 'Загрузить файл'}
                          <input
                            type="file"
                            hidden
                            onChange={handleReferenceUpload}
                            disabled={uploading}
                          />
                        </Button>
                      )}
                    </Box>

                    {loading ? (
                      <LinearProgress />
                    ) : referenceFiles.length > 0 ? (
                      <Stack spacing={1}>
                        {referenceFiles.map((file) => (
                          <Card key={file.id} variant="outlined" sx={{ '&:hover': { boxShadow: 2 } }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                              <InsertDriveFile color="primary" sx={{ mr: 2 }} />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                  {file.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Загружено: {formatDate(file.uploadedAt)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Download">
                                  <IconButton
                                    color="primary"
                                    onClick={() => handleFileDownload(file.id, file.name)}
                                  >
                                    <Download />
                                  </IconButton>
                                </Tooltip>
                                {userRole === 'TEACHER' && (
                                  <Tooltip title="Delete">
                                    <IconButton
                                      color="error"
                                      onClick={() => handleFileDelete(file.id)}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <Alert severity="info" sx={{ mt: 1 }}>
                        Нет методических материалов.
                      </Alert>
                    )}
                  </Box>
                </Grid>

                {/* Right Column - Submissions */}
                <Grid item xs={12} lg={6}>
                  {isSubmissionRequired && (
                    <Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        p: 2,
                        backgroundColor: 'success.main',
                        color: 'white',
                        borderRadius: 2
                      }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssignmentTurnedIn />
                          {userRole === 'TEACHER' ? 'Работы студентов' : 'Ваши работы'}
                          {userRole === 'TEACHER' && (
                            <Badge badgeContent={submissions.length} color="secondary" />
                          )}
                        </Typography>
                        {userRole === 'STUDENT' && (
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setUploadDialogOpen(true)}
                            sx={{
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                            }}
                          >
                            {currentUserSubmission ? 'Добавьте файлы' : 'Отправить работу'}
                          </Button>
                        )}
                      </Box>

                      {/* Student View - Own Submission */}
                      {userRole === 'STUDENT' && (
                        <Box>
                          {currentUserSubmission ? (
                            <Card variant="outlined" sx={{ mb: 2 }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <CheckCircle color="success" sx={{ mr: 2 }} />
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" color="success.main">
                                      Загрузка завершена
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Изменено: {formatDate(currentUserSubmission.latestUpload)}
                                    </Typography>
                                  </Box>
                                  {currentUserProgress && (
                                    <Chip
                                      icon={getStatusIcon(currentUserProgress.status)}
                                      label={getStatusText(currentUserProgress.status)}
                                      color={getStatusColor(currentUserProgress.status)}
                                      sx={{ ml: 2 }}
                                    />
                                  )}
                                </Box>

                                {currentUserSubmission.comment && (
                                  <Alert severity="info" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>Your Comment:</Typography>
                                    {currentUserSubmission.comment}
                                  </Alert>
                                )}

                                <Typography variant="subtitle2" gutterBottom>
                                  Загруженные файлы ({currentUserSubmission.files.length}):
                                </Typography>
                                <Stack spacing={1}>
                                  {currentUserSubmission.files.map((file) => (
                                    <Box key={file.id} sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 2,
                                      p: 2,
                                      backgroundColor: 'grey.50',
                                      borderRadius: 1
                                    }}>
                                      <InsertDriveFile color="primary" />
                                      <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                          {file.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                                        </Typography>
                                      </Box>
                                      <Button
                                        size="small"
                                        startIcon={<Download />}
                                        onClick={() => handleFileDownload(file.id, file.name)}
                                      >
                                        Загрузить
                                      </Button>
                                    </Box>
                                  ))}
                                </Stack>

                                {/* Feedback Section for Student */}
                                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Feedback color="primary" />
                                    Обратная связь и обсуждение
                                  </Typography>

                                  <Box sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                                    {(messagesByStudent[currentUserSubmission.studentId] || []).length > 0 ? (
                                      messagesByStudent[currentUserSubmission.studentId].map((message) => (
                                        <Box
                                          key={message.id}
                                          sx={{
                                            display: 'flex',
                                            justifyContent: message.userId === user.id ? 'flex-end' : 'flex-start',
                                            mb: 1
                                          }}
                                        >
                                          <Paper
                                            sx={{
                                              p: 1.5,
                                              maxWidth: '80%',
                                              bgcolor: message.userId === user.id ? 'secondary.dark' : 'background.paper',
                                              color: message.userId === user.id ? 'common.white' : 'primary.dark',
                                            }}
                                          >
                                            <Typography variant="body2" sx={{ color: 'inherit'}}>{message.content}</Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7, color: 'inherit' }}>
                                              {formatDate(message.sentAt)}
                                            </Typography>
                                          </Paper>
                                        </Box>
                                      ))
                                    ) : (
                                      <Alert severity="info" variant="outlined">
                                        Обратной связи пока нет. Ваш преподаватель оставит ее здесь.
                                      </Alert>
                                    )}
                                  </Box>

                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      placeholder="Задайте вопрос или прокомментируйте работу..."
                                      value={newMessages[currentUserSubmission.studentId] || ''}
                                      onChange={(e) => setNewMessages(prev => ({
                                        ...prev,
                                        [currentUserSubmission.studentId]: e.target.value
                                      }))}
                                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(currentUserSubmission.studentId)}
                                    />
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={<Send />}
                                      onClick={() => handleSendMessage(currentUserSubmission.studentId)}
                                      disabled={!newMessages[currentUserSubmission.studentId]?.trim()}
                                    >
                                      Отправить
                                    </Button>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          ) : (
                            <Card variant="outlined" sx={{ textAlign: 'center', py: 4 }}>
                              <CardContent>
                                <Upload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                  Нет работ
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                  Отправьте свою работу на оценку
                                </Typography>
                                <Button
                                  variant="contained"
                                  size="large"
                                  startIcon={<CloudUpload />}
                                  onClick={() => setUploadDialogOpen(true)}
                                >
                                  Отправить
                                </Button>
                              </CardContent>
                            </Card>
                          )}
                        </Box>
                      )}

                      {/* Teacher View - All Submissions */}
                      {userRole === 'TEACHER' && (
                        <Box>
                          {submissions.length > 0 ? (
                            <Stack spacing={2}>
                              {submissions.map((submission) => {
                                const studentProgress = progressStatuses[submission.studentId];
                                const isUpdating = updatingProgress[submission.studentId];

                                return (
                                  <Card key={submission.studentId} variant="outlined">
                                    <CardContent>
                                      <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        mb: 2
                                      }}
                                        onClick={() => toggleSubmissionExpansion(submission.studentId)}
                                      >
                                        <Avatar sx={{ mr: 2 }}>
                                          <Person />
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            {submission.studentName}
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary">
                                            {submission.studentEmail}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            Изменено: {formatDate(submission.latestUpload)}
                                          </Typography>
                                        </Box>

                                        {/* Progress Status Chip */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
                                          {studentProgress && (
                                            <Chip
                                              icon={getStatusIcon(studentProgress.status)}
                                              label={getStatusText(studentProgress.status)}
                                              color={getStatusColor(studentProgress.status)}
                                              size="small"
                                            />
                                          )}
                                          {studentProgress?.grade && (
                                            <Chip
                                              label={`Оценка: ${studentProgress.grade}`}
                                              color="primary"
                                              size="small"
                                              variant="outlined"
                                            />
                                          )}
                                        </Box>

                                        {/* Quick Action Buttons */}
                                        <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                                          <Tooltip title="Принять работы">
                                            <IconButton
                                              color="success"
                                              size="small"
                                              disabled={isUpdating}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                updateProgressStatus(submission.studentId, 'ACCEPTED');
                                              }}
                                            >
                                              <CheckCircle />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Запросить изменения">
                                            <IconButton
                                              color="error"
                                              size="small"
                                              disabled={isUpdating}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                updateProgressStatus(submission.studentId, 'NEEDS_CHANGES');
                                              }}
                                            >
                                              <ErrorOutline />
                                            </IconButton>
                                          </Tooltip>
                                        </Box>

                                        <IconButton size="small">
                                          {expandedSubmissions[submission.studentId] ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                      </Box>

                                      {/* Progress Status Controls */}
                                      <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                          Статус:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                          <ButtonGroup size="small" disabled={isUpdating}>
                                            <Button
                                              variant={studentProgress?.status === 'NOT_STARTED' ? 'contained' : 'outlined'}
                                              onClick={() => updateProgressStatus(submission.studentId, 'NOT_STARTED')}
                                              startIcon={<HourglassEmpty />}
                                            >
                                              Не начато
                                            </Button>
                                            <Button
                                              variant={studentProgress?.status === 'IN_PROGRESS' ? 'contained' : 'outlined'}
                                              onClick={() => updateProgressStatus(submission.studentId, 'IN_PROGRESS')}
                                              startIcon={<PlayArrow />}
                                            >
                                              В процессе
                                            </Button>
                                            <Button
                                              variant={studentProgress?.status === 'ACCEPTED' ? 'contained' : 'outlined'}
                                              color="success"
                                              onClick={() => updateProgressStatus(submission.studentId, 'ACCEPTED')}
                                              startIcon={<CheckCircle />}
                                            >
                                              Принято
                                            </Button>
                                            <Button
                                              variant={studentProgress?.status === 'NEEDS_CHANGES' ? 'contained' : 'outlined'}
                                              color="error"
                                              onClick={() => updateProgressStatus(submission.studentId, 'NEEDS_CHANGES')}
                                              startIcon={<ErrorOutline />}
                                            >
                                              Нужны изменения
                                            </Button>
                                            <Button
                                              variant={studentProgress?.status === 'OVERDUE' ? 'contained' : 'outlined'}
                                              color="warning"
                                              onClick={() => updateProgressStatus(submission.studentId, 'OVERDUE')}
                                              startIcon={<AccessTime />}
                                            >
                                              Просрочено
                                            </Button>
                                          </ButtonGroup>

                                          {/* Grade Input */}
                                          <TextField
                                            size="small"
                                            type="number"
                                            label="Оценка"
                                            value={studentProgress?.grade || ''}
                                            onChange={(e) => {
                                              const grade = e.target.value ? parseInt(e.target.value) : null;
                                              updateProgressStatus(submission.studentId, studentProgress?.status || 'IN_PROGRESS', grade);
                                            }}
                                            inputProps={{ min: 0, max: 100 }}
                                            sx={{ width: 100, ml: 1 }}
                                            disabled={isUpdating}
                                          />

                                          {isUpdating && (
                                            <LinearProgress sx={{ width: 50, ml: 1 }} />
                                          )}
                                        </Box>
                                      </Box>

                                      <Collapse in={expandedSubmissions[submission.studentId]}>
                                        {submission.comment && (
                                          <Alert severity="info" sx={{ mb: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom>Student Comment:</Typography>
                                            {submission.comment}
                                          </Alert>
                                        )}

                                        <Typography variant="subtitle2" gutterBottom>
                                          Загруженные файлы ({submission.files.length}):
                                        </Typography>
                                        <Stack spacing={1} sx={{ mb: 2 }}>
                                          {submission.files.map((file) => (
                                            <Box key={file.id} sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: 2,
                                              p: 2,
                                              backgroundColor: 'grey.50',
                                              borderRadius: 1
                                            }}>
                                              <InsertDriveFile color="primary" />
                                              <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                  {file.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                  {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                                                </Typography>
                                              </Box>
                                              <Button
                                                size="small"
                                                startIcon={<Download />}
                                                onClick={() => handleFileDownload(file.id, file.name)}
                                              >
                                                Загрузить
                                              </Button>
                                            </Box>
                                          ))}
                                        </Stack>

                                        {/* Teacher-Student Chat */}
                                        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <Chat color="primary" />
                                            Обратная связь и обсуждение
                                          </Typography>

                                          <Box sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                                            {(messagesByStudent[submission.studentId] || []).length > 0 ? (
                                              messagesByStudent[submission.studentId].map((message) => (
                                                <Box
                                                  key={message.id}
                                                  sx={{
                                                    display: 'flex',
                                                    justifyContent: message.userId === user.id ? 'flex-end' : 'flex-start',
                                                    mb: 1
                                                  }}
                                                >
                                                  <Paper
                                                    sx={{
                                                      p: 1.5,
                                                      maxWidth: '80%',
                                                      bgcolor: message.userId === user.id ? 'secondary.dark' : 'background.paper',
                                                      color: message.userId === user.id ? 'common.white' : 'primary.dark',
                                                    }}
                                                  >
                                                    <Typography variant="body2" sx={{ color: 'inherit'}}>{message.content}</Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.7, color: 'inherit' }}>
                                                      {formatDate(message.sentAt)}
                                                    </Typography>
                                                  </Paper>
                                                </Box>
                                              ))
                                            ) : (
                                              <Alert severity="info" variant="outlined">
                                                Нет обратной связи. Начните общение со студентом.
                                              </Alert>
                                            )}
                                          </Box>

                                          <Box sx={{ display: 'flex', gap: 1 }}>
                                            <TextField
                                              fullWidth
                                              size="small"
                                              placeholder="Оставьте обратную связь или задайте вопрос..."
                                              value={newMessages[submission.studentId] || ''}
                                              onChange={(e) => setNewMessages(prev => ({
                                                ...prev,
                                                [submission.studentId]: e.target.value
                                              }))}
                                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(submission.studentId)}
                                            />
                                            <Button
                                              variant="contained"
                                              size="small"
                                              startIcon={<Send />}
                                              onClick={() => handleSendMessage(submission.studentId)}
                                              disabled={!newMessages[submission.studentId]?.trim()}
                                            >
                                              Отправить
                                            </Button>
                                          </Box>
                                        </Box>
                                      </Collapse>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </Stack>
                          ) : (
                            <Card variant="outlined" sx={{ textAlign: 'center', py: 4 }}>
                              <CardContent>
                                <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                  Нет работ
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Студенты пока что не загрузили свои работы для этого задания.
                                </Typography>
                              </CardContent>
                            </Card>
                          )}
                        </Box>
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>
          )}
        </Box>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Загрузить работу</DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ mb: 2, py: 2 }}
              >
                Выбрать файлы
                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleFileSelect}
                />
              </Button>

              {selectedFiles.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Выбранные файлы:
                  </Typography>
                  {selectedFiles.map((file, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <InsertDriveFile color="primary" />
                      <Typography variant="body2">{file.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({formatFileSize(file.size)})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmissionUpload}
              variant="contained"
              disabled={selectedFiles.length === 0 || uploading}
              startIcon={uploading ? <LinearProgress size={20} /> : <Upload />}
            >
              {uploading ? 'Загрузка...' : 'Загрузите работу'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Modal>
  );
};

export default ElementPageModal;