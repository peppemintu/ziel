import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const CourseTabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Таблица" />
        <Tab label="Roadmap" />
      </Tabs>
    </Box>
  );
};

export default CourseTabNavigation;