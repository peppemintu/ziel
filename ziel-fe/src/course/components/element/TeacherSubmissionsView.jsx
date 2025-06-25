import React from 'react';
import {
  Box,
  Badge,
  Typography,
  Card,
  CardContent,
  Stack,
  Alert
} from '@mui/material';
import { AssignmentTurnedIn, Assignment } from '@mui/icons-material';
import SubmissionCard from './SubmissionCard.jsx';

const TeacherSubmissionsView = ({
  submissions,
  progressStatuses,
  updatingProgress,
  onProgressUpdate,
  onSubmissionToggle,
  expandedSubmissions,
  chatMessages,
  newMessages,
  onNewMessageChange,
  onSendMessage,
  onFileDownload
}) => {
  return (
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
          Работы студентов
          <Badge badgeContent={submissions.length} color="secondary" />
        </Typography>
      </Box>

      {submissions.length > 0 ? (
        <Stack spacing={2}>
          {submissions.map((submission) => (
            <SubmissionCard
              key={submission.studentId}
              submission={submission}
              studentProgress={progressStatuses[submission.studentId]}
              isUpdating={updatingProgress[submission.studentId]}
              isExpanded={expandedSubmissions[submission.studentId]}
              chatMessages={chatMessages[submission.studentId] || []}
              newMessage={newMessages[submission.studentId] || ''}
              onProgressUpdate={onProgressUpdate}
              onToggleExpansion={onSubmissionToggle}
              onNewMessageChange={onNewMessageChange}
              onSendMessage={onSendMessage}
              onFileDownload={onFileDownload}
            />
          ))}
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
  );
};

export default TeacherSubmissionsView;