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
  Tab,
  Tabs,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  Assignment
} from '@mui/icons-material';

const ElementPageModal = ({
  open,
  onClose,
  element,
  userRole,
  onElementUpdate,
  onFileUpload,
  students = [],
  submissions = [],
  onSubmissionStatusUpdate,
  onChatOpen
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedElement, setEditedElement] = useState(element || {});
  const [files, setFiles] = useState([]);
  const [studentFiles, setStudentFiles] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [uploadComment, setUploadComment] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [expandedSubmissions, setExpandedSubmissions] = useState({});

  useEffect(() => {
    if (element) {
      setEditedElement(element);
      // Load element files and submissions
      loadElementData();
    }
  }, [element]);

  const loadElementData = async () => {
    // Mock data - replace with actual API calls
    setFiles([
      { id: 1, name: 'lecture_slides.pdf', size: '2.5 MB', uploadDate: '2024-01-15' },
      { id: 2, name: 'assignment_guide.docx', size: '1.2 MB', uploadDate: '2024-01-15' }
    ]);

    if (userRole === 'STUDENT') {
      setStudentFiles([
        { id: 1, name: 'my_solution.zip', uploadDate: '2024-01-20', status: 'SUBMITTED', comment: 'Solution implementation' }
      ]);
    }

    setChatMessages([
      { id: 1, sender: 'TEACHER', text: 'Good work on this assignment!', timestamp: '2024-01-21 10:30' },
      { id: 2, sender: 'STUDENT', text: 'Thank you! I have a question about the bonus task.', timestamp: '2024-01-21 11:15' }
    ]);
  };

  const handleSave = () => {
    onElementUpdate(editedElement);
    setIsEditing(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (userRole === 'TEACHER') {
        const newFile = {
          id: Date.now(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        setFiles([...files, newFile]);
      } else {
        setSelectedFile(file);
        setSubmissionDialogOpen(true);
      }
    }
  };

  const handleSubmissionUpload = () => {
    if (selectedFile) {
      const newSubmission = {
        id: Date.now(),
        name: selectedFile.name,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'SUBMITTED',
        comment: uploadComment
      };
      setStudentFiles([...studentFiles, newSubmission]);
      onFileUpload(element.id, selectedFile, uploadComment);
      setSubmissionDialogOpen(false);
      setSelectedFile(null);
      setUploadComment('');
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: userRole,
        text: newMessage,
        timestamp: new Date().toLocaleString()
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const toggleSubmissionExpansion = (submissionId) => {
    setExpandedSubmissions(prev => ({
      ...prev,
      [submissionId]: !prev[submissionId]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NOT_VERIFIED': return 'default';
      case 'CREDITED': return 'success';
      case 'FINALIZED': return 'primary';
      case 'SUBMITTED': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CREDITED': return <CheckCircle />;
      case 'SUBMITTED': return <Assignment />;
      default: return <Schedule />;
    }
  };

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
          width: '90%',
          maxWidth: 1200,
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 2,
          boxShadow: 24
        }}
      >
        {/* Header */}
        <Box sx={{
          p: 3,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isEditing ? (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  value={editedElement.name || ''}
                  onChange={(e) => setEditedElement({ ...editedElement, name: e.target.value })}
                  size="small"
                  sx={{ minWidth: 200 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={editedElement.type || ''}
                    onChange={(e) => setEditedElement({ ...editedElement, type: e.target.value })}
                    label="Type"
                  >
                    <MenuItem value="lecture">Lecture</MenuItem>
                    <MenuItem value="laboratory">Laboratory</MenuItem>
                    <MenuItem value="practice">Practice</MenuItem>
                    <MenuItem value="control">Knowledge Control</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" component="h1">
                  {element.name}
                </Typography>
                <Chip
                  label={element.type}
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {userRole === 'TEACHER' && (
              <>
                {isEditing ? (
                  <>
                    <IconButton onClick={handleSave} color="primary">
                      <Save />
                    </IconButton>
                    <IconButton onClick={() => setIsEditing(false)}>
                      <Cancel />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => setIsEditing(true)} color="primary">
                    <Edit />
                  </IconButton>
                )}
              </>
            )}
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Description Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            {isEditing ? (
              <TextField
                multiline
                rows={6}
                fullWidth
                value={editedElement.description || ''}
                onChange={(e) => setEditedElement({ ...editedElement, description: e.target.value })}
                placeholder="Enter assignment description, guidelines, evaluation criteria..."
              />
            ) : (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {element.description || 'No description provided.'}
              </Typography>
            )}
          </Box>

          {/* Files Section */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {userRole === 'TEACHER' ? 'Attached Files' : 'Teacher Files'}
              </Typography>
              {userRole === 'TEACHER' && (
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  component="label"
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                  />
                </Button>
              )}
            </Box>

            <List>
              {files.map((file) => (
                <ListItem key={file.id} divider>
                  <ListItemText
                    primary={file.name}
                    secondary={`${file.size} • ${file.uploadDate}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <Download />
                    </IconButton>
                    {userRole === 'TEACHER' && (
                      <IconButton edge="end" color="error">
                        <Delete />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Student Submission Section */}
          {userRole === 'STUDENT' && (element.type === 'laboratory' || element.type === 'practice') && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Your Submission
              </Typography>

              {studentFiles.length > 0 ? (
                <Card>
                  <CardContent>
                    {studentFiles.map((file) => (
                      <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Attachment />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2">{file.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Uploaded: {file.uploadDate}
                          </Typography>
                        </Box>
                        <Chip
                          label={file.status}
                          color={getStatusColor(file.status)}
                          size="small"
                          icon={getStatusIcon(file.status)}
                        />
                      </Box>
                    ))}
                    {studentFiles[0]?.comment && (
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                        Comment: {studentFiles[0].comment}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No submission yet. Upload your work to get started.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Upload />}
                      component="label"
                    >
                      Upload Submission
                      <input
                        type="file"
                        hidden
                        onChange={handleFileUpload}
                      />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {/* Teacher Verification Section */}
          {userRole === 'TEACHER' && (element.type === 'laboratory' || element.type === 'practice') && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Student Submissions
              </Typography>

              {submissions.length > 0 ? (
                <List>
                  {submissions.map((submission) => (
                    <ListItem key={submission.id} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', p: 1 }}>
                        <Avatar sx={{ mr: 2 }}>{submission.studentName.charAt(0)}</Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1">{submission.studentName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {submission.fileName} • {submission.uploadDate}
                          </Typography>
                        </Box>
                        <Chip
                          label={submission.status}
                          color={getStatusColor(submission.status)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <IconButton onClick={() => toggleSubmissionExpansion(submission.id)}>
                          {expandedSubmissions[submission.id] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>

                      <Collapse in={expandedSubmissions[submission.id]}>
                        <Box sx={{ pl: 7, pb: 2 }}>
                          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Button size="small" startIcon={<Download />}>
                              Download
                            </Button>
                            <Button size="small" startIcon={<Chat />} onClick={() => onChatOpen?.(submission.studentId, element.id)}>
                              Open Chat
                            </Button>
                          </Box>
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={submission.status}
                              onChange={(e) => onSubmissionStatusUpdate?.(submission.id, e.target.value)}
                              label="Status"
                            >
                              <MenuItem value="NOT_VERIFIED">Not Verified</MenuItem>
                              <MenuItem value="CREDITED">Credited</MenuItem>
                              <MenuItem value="FINALIZED">Finalized</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Collapse>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">No submissions yet.</Alert>
              )}
            </Box>
          )}

          {/* Chat Section */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Feedback & Discussion</Typography>
              <Button
                variant="outlined"
                startIcon={chatOpen ? <ExpandLess /> : <ExpandMore />}
                onClick={() => setChatOpen(!chatOpen)}
              >
                {chatOpen ? 'Hide Chat' : 'Show Chat'}
              </Button>
            </Box>

            <Collapse in={chatOpen}>
              <Card>
                <CardContent>
                  <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                    {chatMessages.map((message) => (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent: message.sender === userRole ? 'flex-end' : 'flex-start',
                          mb: 1
                        }}
                      >
                        <Paper
                          sx={{
                            p: 1,
                            maxWidth: '70%',
                            bgcolor: message.sender === userRole ? 'primary.light' : 'grey.100'
                          }}
                        >
                          <Typography variant="body2">{message.text}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {message.timestamp}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      variant="contained"
                      startIcon={<Send />}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Collapse>
          </Box>
        </Box>

        {/* Submission Dialog */}
        <Dialog open={submissionDialogOpen} onClose={() => setSubmissionDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Upload Submission</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Attachment />
              <Typography>{selectedFile?.name}</Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Comment (optional)"
              value={uploadComment}
              onChange={(e) => setUploadComment(e.target.value)}
              placeholder="Add any comments about your submission..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSubmissionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmissionUpload} variant="contained">Upload</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Modal>
  );
};

export default ElementPageModal;