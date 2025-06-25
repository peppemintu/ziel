import React from 'react';
import { Box, Typography, Chip, Card, CardContent } from '@mui/material';

const CourseHeader = ({ course, studyPlan }) => {
  if (!course) return null;

  const ATTESTATION_FORM_LABELS_RU = {
    EXAM: 'Экзамен',
    CREDIT: 'Зачёт',
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Курс
        </Typography>
        {studyPlan && (
          <>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Курс {studyPlan.studyYear} - Семестр {studyPlan.semester} - Группа {course.groupId}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
              <Chip label={`${studyPlan.totalHours} Всего часов`} />
              <Chip label={`${studyPlan.creditUnits} З.Е.`} />
              <Chip label={`${studyPlan.totalAuditoryHours} Аудиторных часов`} />
              <Chip label={`${studyPlan.lectureHours} Часов лекций`} />
              <Chip label={`${studyPlan.practiceHours} Часов практик`} />
              <Chip label={`${studyPlan.labHours} Часов лабораторных`} />
              <Chip label={ATTESTATION_FORM_LABELS_RU[studyPlan.attestationForm] || studyPlan.attestationForm} color="primary" />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseHeader;