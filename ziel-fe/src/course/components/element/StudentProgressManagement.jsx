import React from 'react';
import { Box } from '@mui/material';
import StudentProgressTable from './StudentProgressTable.jsx';

const StudentProgressManagement = ({
  elementId,
  courseId,
  userRole,
  onGradeUpdate
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <StudentProgressTable
        courseId={courseId}
        userRole={userRole}
        onGradeUpdate={onGradeUpdate}
      />
    </Box>
  );
};

export default StudentProgressManagement;