import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Alert,
  Paper,
  TextField,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  CloudUpload,
  Download,
  InsertDriveFile,
  Upload,
  Feedback,
  Send,
  Add
} from '@mui/icons-material';
import { formatDate, formatFileSize } from '../../utils/formatUtils.js';
import { getStatusIcon, getStatusColor, getStatusText } from '../../utils/progressUtils.js';

const StudentSubmissionView = ({
  currentUserSubmission,
  currentUserProgress,
  chatMessages,
  newMessages,
  userRole,
  onUploadDialogOpen,
  onFileDownload,
  onSendMessage,
  onMessageUpdate
}) => {
  if (!currentUserSubmission) {
    return (
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
            onClick={onUploadDialogOpen}
          >
            Отправить
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
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
                onClick={() => onFileDownload(file.id, file.name)}
              >
                Загрузить
              </Button>
            </Box>
          ))}
        </Stack>

        {/* Feedback Section */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Feedback color="primary" />
            Обратная связь и обсуждение
          </Typography>

          <Box sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
            {(chatMessages[currentUserSubmission.studentId] || []).length > 0 ? (
              chatMessages[currentUserSubmission.studentId].map((message) => (
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
                      p: 1.5,
                      maxWidth: '80%',
                      bgcolor: message.sender === userRole ? 'secondary.dark' : 'background.paper',
                      color: message.sender === userRole ? 'common.white' : 'primary.dark',
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
              onChange={(e) => onMessageUpdate(currentUserSubmission.studentId, e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSendMessage(currentUserSubmission.studentId)}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<Send />}
              onClick={() => onSendMessage(currentUserSubmission.studentId)}
              disabled={!newMessages[currentUserSubmission.studentId]?.trim()}
            >
              Отправить
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentSubmissionView;