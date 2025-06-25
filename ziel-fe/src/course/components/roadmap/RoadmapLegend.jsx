import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  School as LectureIcon,
  Science as LabIcon,
  Assignment as PracticeIcon,
  Quiz as AttestationIcon
} from '@mui/icons-material';

const RoadmapLegend = () => {
  return (
    <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
      <Typography variant="subtitle2" gutterBottom>
        Расположение Roadmap:
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PracticeIcon sx={{ color: '#ff9800' }} />
          <Typography variant="caption">Практики (Верхний ряд)</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LectureIcon sx={{ color: '#2196f3' }} />
          <AttestationIcon sx={{ color: '#9c27b0' }} />
          <Typography variant="caption">Лекции и аттестации (Центр)</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LabIcon sx={{ color: '#4caf50' }} />
          <Typography variant="caption">Лабораторные работы (Нижний ряд)</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RoadmapLegend;