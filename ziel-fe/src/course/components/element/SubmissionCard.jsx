import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Alert,
  Stack,
  ButtonGroup,
  Button,
  TextField,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  Person,
  CheckCircle,
  ErrorOutline,
  ExpandMore,
  ExpandLess,
  HourglassEmpty,
  PlayArrow,
  AccessTime,
  Chat,
  Send,
  Download,
  InsertDriveFile
} from '@mui/icons-material';
import { getStatusColor, getStatusIcon, getStatusText } from '../../utils/progressUtils.js';

const SubmissionCard = ({
  submission,
  studentProgress,
  isUpdating,
  isExpanded,
  chatMessages,
  newMessage,
  onProgressUpdate,
  onToggleExpansion,
  onNewMessageChange,
  onSendMessage,
  onFileDownload
}) => {
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

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          mb: 2
        }}
          onClick={() => onToggleExpansion(submission.studentId)}
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
                  onProgressUpdate(submission.studentId, 'ACCEPTED');
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
                  onProgressUpdate(submission.studentId, 'NEEDS_CHANGES');
                }}
              >
                <ErrorOutline />
              </IconButton>
            </Tooltip>
          </Box>

          <IconButton size="small">
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
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
                onClick={() => onProgressUpdate(submission.studentId, 'NOT_STARTED')}
                startIcon={<HourglassEmpty />}
              >
                Не начато
              </Button>
              <Button
                variant={studentProgress?.status === 'IN_PROGRESS' ? 'contained' : 'outlined'}
                onClick={() => onProgressUpdate(submission.studentId, 'IN_PROGRESS')}
                startIcon={<PlayArrow />}
              >
                В процессе
              </Button>
              <Button
                variant={studentProgress?.status === 'ACCEPTED' ? 'contained' : 'outlined'}
                color="success"
                onClick={() => onProgressUpdate(submission.studentId, 'ACCEPTED')}
                startIcon={<CheckCircle />}
              >
                Принято
              </Button>
              <Button
                variant={studentProgress?.status === 'NEEDS_CHANGES' ? 'contained' : 'outlined'}
                color="error"
                onClick={() => onProgressUpdate(submission.studentId, 'NEEDS_CHANGES')}
                startIcon={<ErrorOutline />}
              >
                Нужны изменения
              </Button>
              <Button
                variant={studentProgress?.status === 'OVERDUE' ? 'contained' : 'outlined'}
                color="warning"
                onClick={() => onProgressUpdate(submission.studentId, 'OVERDUE')}
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
                onProgressUpdate(submission.studentId, studentProgress?.status || 'IN_PROGRESS', grade);
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

        <Collapse in={isExpanded}>
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
                  onClick={() => onFileDownload(file.id, file.name)}
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
              {chatMessages.length > 0 ? (
                chatMessages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'TEACHER' ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: '80%',
                        bgcolor: message.sender === 'TEACHER' ? 'secondary.dark' : 'background.paper',
                        color: message.sender === 'TEACHER' ? 'common.white' : 'primary.dark',
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'inherit' }}>{message.text}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, color: 'inherit' }}>
                        {message.senderName} • {message.timestamp}
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
                value={newMessage}
                onChange={(e) => onNewMessageChange(submission.studentId, e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSendMessage(submission.studentId)}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<Send />}
                onClick={() => onSendMessage(submission.studentId)}
                disabled={!newMessage.trim()}
              >
                Отправить
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;