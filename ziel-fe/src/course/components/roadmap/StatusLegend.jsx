import React from 'react';
import { Box, Typography } from '@mui/material';
import { STATUS_COLORS } from '../../utils/constants';

const StatusLegend = ({ userRole }) => {
  if (userRole !== 'STUDENT') return null;

  return (
    <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      {Object.entries(STATUS_COLORS).map(([status, color]) => (
        <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 12,
            height: 12,
            backgroundColor: color,
            borderRadius: '50%'
          }} />
          <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
            {status.replace('_', ' ').toLowerCase()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default StatusLegend;