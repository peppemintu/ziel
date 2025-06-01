import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Select, MenuItem, InputLabel, FormControl,
  Button, TextField, OutlinedInput, Checkbox, ListItemText
} from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export default function CourseCreationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id: studyPlanId } = useParams();
  const [studyPlan, setStudyPlan] = useState(state?.studyPlan || null);
  const [studentGroups, setStudentGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);

  // Fetch student groups and teachers
  useEffect(() => {
    const fetchData = async () => {
      const [groupsRes, teachersRes] = await Promise.all([
        axios.get(`${API_BASE}/student-group`),
        axios.get(`${API_BASE}/teacher`),
      ]);
      setStudentGroups(groupsRes.data);
      setTeachers(teachersRes.data);
    };
    fetchData();
  }, []);

  // Fallback: fetch studyPlan by ID if not passed from state
  useEffect(() => {
    const fetchPlan = async () => {
      if (!studyPlan) {
        const res = await axios.get(`${API_BASE}/plan/${studyPlanId}`);
        setStudyPlan(res.data);
      }
    };
    fetchPlan();
  }, [studyPlan, studyPlanId]);

  const handleCreateCourse = async () => {
    if (!groupId || !studyPlan?.id) return;

    // 1. Create Course
    const courseRes = await axios.post(`${API_BASE}/course`, {
      studyPlanId: studyPlan.id,
      groupId: groupId,
    });
    const courseId = courseRes.data.id;

    // 2. Link Teachers
    await Promise.all(selectedTeacherIds.map(teacherId =>
      axios.post(`${API_BASE}/course-teacher`, {
        courseId,
        teacherId,
      })
    ));

    // Navigate to courses list or show success message
    navigate('/courses'); // Adjust route as needed
  };

  if (!studyPlan) return <Typography>Loading...</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Create Course</Typography>

      <Box mt={2} display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={2}>
        <TextField label="Discipline" value={studyPlan.disciplineName} InputProps={{ readOnly: true }} />
        <TextField label="Specialty" value={studyPlan.specialtyName} InputProps={{ readOnly: true }} />
        <TextField label="Year" value={studyPlan.studyYear} InputProps={{ readOnly: true }} />
        <TextField label="Total Hours" value={studyPlan.totalHours} InputProps={{ readOnly: true }} />
        <TextField label="Credits" value={studyPlan.creditUnits} InputProps={{ readOnly: true }} />
        <TextField label="Auditory Hours" value={studyPlan.totalAuditoryHours} InputProps={{ readOnly: true }} />
        <TextField label="Lecture Hours" value={studyPlan.lectureHours} InputProps={{ readOnly: true }} />
        {studyPlan.practiceHours != null && (
          <TextField label="Practice Hours" value={studyPlan.practiceHours} InputProps={{ readOnly: true }} />
        )}
        {studyPlan.labHours != null && (
          <TextField label="Lab Hours" value={studyPlan.labHours} InputProps={{ readOnly: true }} />
        )}
      </Box>

      <Box mt={4} display="flex" flexDirection="column" gap={3} maxWidth={400}>
        <FormControl fullWidth>
          <InputLabel>Student Group</InputLabel>
          <Select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            label="Student Group"
          >
            {studentGroups.map(group => (
              <MenuItem key={group.id} value={group.id}>
                Specialty #{group.specialtyId} - Group {group.groupNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Teachers</InputLabel>
          <Select
            multiple
            value={selectedTeacherIds}
            onChange={(e) => setSelectedTeacherIds(e.target.value)}
            input={<OutlinedInput label="Teachers" />}
            renderValue={(selected) => selected.map(id => {
              const teacher = teachers.find(t => t.id === id);
              return teacher ? teacher.title : id;
            }).join(', ')}
          >
            {teachers.map(teacher => (
              <MenuItem key={teacher.id} value={teacher.id}>
                <Checkbox checked={selectedTeacherIds.includes(teacher.id)} />
                <ListItemText primary={teacher.title} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateCourse}
          disabled={!groupId}
        >
          Create Course
        </Button>
      </Box>
    </Box>
  );
}
