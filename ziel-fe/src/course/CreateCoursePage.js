import React, { useState } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import DynamicFormField from '../auth/DynamicFormField';

import axios from 'axios';

const formConfig = {
  courseName: {
    label: 'Course Name',
    type: 'text',
    required: true,
  },
  majorCode: {
    label: 'Major Code',
    type: 'text',
    required: true,
  },
  majorName: {
    label: 'Major Name',
    type: 'text',
    required: true,
  },
  year: {
    label: 'Year',
    type: 'number',
    required: true,
  },
  semester: {
    label: 'Semester',
    type: 'number',
    required: true,
  },
  totalHours: {
    label: 'Total Study Hours',
    type: 'number',
    required: true,
  },
  creditUnits: {
    label: 'Credit Units',
    type: 'number',
    required: true,
  },
  auditoryHoursTotal: {
    label: 'Auditory Hours (Total)',
    type: 'number',
    required: true,
  },
  lectures: {
    label: 'Lectures',
    type: 'number',
    required: true,
  },
  labworks: {
    label: 'Labworks',
    type: 'number',
    required: false,
  },
  practices: {
    label: 'Practices',
    type: 'number',
    required: false,
  },
  attestationForm: {
    label: 'Form of Attestation',
    type: 'select',
    options: [
      { value: 'EXAM', label: 'Exam' },
      { value: 'CREDIT', label: 'Credit' },
    ],
    required: true,
  },
};

export default function CourseCreationPage() {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    Object.keys(formConfig).forEach((key) => (initial[key] = ''));
    return initial;
  });

  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(formConfig).forEach(([id, config]) => {
      if (config.required && !formData[id]) {
        newErrors[id] = `${config.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log('Course Data:', formData);
    try {
        const response = await axios.post('http://localhost:8080/api/course', formData);
        console.log('Created course:', response.data);
        // Optionally reset the form or redirect
      } catch (error) {
        console.error('Failed to create course:', error);
        // Optionally show error to the user
      }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Course
        </Typography>
        <form onSubmit={handleSubmit}>
          {Object.entries(formConfig).map(([id, config]) => (
            <DynamicFormField
              key={id}
              id={id}
              config={config}
              value={formData[id]}
              onChange={handleChange}
              error={errors[id]}
            />
          ))}
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" type="submit">
              Create Course
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
