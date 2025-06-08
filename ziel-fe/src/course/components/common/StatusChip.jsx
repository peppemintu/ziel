import React from 'react';
import { Box, Typography } from '@mui/material';
import { getStatusColor } from '../../utils/statusUtils';

const StatusChip = ({ status, level = 0 }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: level > 0 ? 8 : 12,
          height: level > 0 ? 8 : 12,
          borderRadius: '50%',
          backgroundColor: getStatusColor(status)
        }}
      />
      <Typography
        variant="body2"
        sx={{
          textTransform: 'capitalize',
          fontSize: level > 0 ? '0.75rem' : '0.875rem'
        }}
      >
        {status.replace('_', ' ').toLowerCase()}
      </Typography>
    </Box>
  );
};

export default StatusChip;