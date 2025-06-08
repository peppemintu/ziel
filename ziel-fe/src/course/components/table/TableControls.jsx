import React from 'react';
import {
  Box, Typography, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ELEMENT_TYPES } from '../../utils/constants';

const TableControls = ({
  filterType,
  onFilterChange,
  onExpandAll,
  onCollapseAll,
  onAddElement,
  userRole
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h5">Course Elements</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filterType} onChange={(e) => onFilterChange(e.target.value)} label="Filter">
            <MenuItem value="">All Types</MenuItem>
            {Object.keys(ELEMENT_TYPES).map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          size="small"
          onClick={onExpandAll}
        >
          Expand All
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={onCollapseAll}
        >
          Collapse All
        </Button>
        {userRole === 'TEACHER' && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAddElement}>
            Add Element
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TableControls;