import React from 'react';
import { Box, Typography, Chip, Card, CardContent } from '@mui/material';

const CourseHeader = ({ course, studyPlan }) => {
  if (!course) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Course {course.id}
        </Typography>
        {studyPlan && (
          <>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Study Year {studyPlan.studyYear} - Semester {studyPlan.semester}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <Chip label={`${studyPlan.totalHours} Total Hours`} />
              <Chip label={`${studyPlan.creditUnits} Credits`} />
              <Chip label={`${studyPlan.totalAuditoryHours} Auditory Hours`} />
              <Chip label={`${studyPlan.lectureHours} Lecture Hours`} />
              <Chip label={`${studyPlan.practiceHours} Practice Hours`} />
              <Chip label={`${studyPlan.labHours} Lab Hours`} />
              <Chip label={studyPlan.attestationForm} color="primary" />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseHeader;