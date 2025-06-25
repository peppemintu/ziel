import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Select, MenuItem, InputLabel, FormControl,
  Button, TextField, OutlinedInput, Checkbox, ListItemText,
  Paper, Grid, Divider
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
  const [specialties, setSpecialties] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [selectedTeacherIds, setSelectedTeacherIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsRes, teachersRes, specialtiesRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE}/student-group`),
          axios.get(`${API_BASE}/teacher`),
          axios.get(`${API_BASE}/specialty`),
          axios.get(`${API_BASE}/user`),
        ]);
        setStudentGroups(groupsRes.data);
        setTeachers(teachersRes.data);
        setSpecialties(specialtiesRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!studyPlan) {
        try {
          const res = await axios.get(`${API_BASE}/plan/${studyPlanId}`);
          setStudyPlan(res.data);
        } catch (error) {
          console.error('Ошибка при загрузке учебного плана:', error);
        }
      }
    };
    fetchPlan();
  }, [studyPlan, studyPlanId]);

  const handleCreateCourse = async () => {
    if (!groupId || !studyPlan?.id) return;

    try {
      const courseRes = await axios.post(`${API_BASE}/course`, {
        studyPlanId: studyPlan.id,
        groupId: groupId,
      });
      const courseId = courseRes.data.id;

      await Promise.all(selectedTeacherIds.map(teacherId =>
        axios.post(`${API_BASE}/course-teacher`, {
          courseId,
          teacherId,
        })
      ));

      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error("Ошибка при создании курса:", error);
    }
  };

  // Функция для получения отображаемого имени группы
  const getGroupDisplayName = (group) => {
    const specialty = specialties.find(s => s.id === group.specialtyId);
    if (specialty) {
      return `${specialty.abbreviation}-${group.groupNumber}`;
    }
    return `Группа ${group.groupNumber}`;
  };

  // Функция для получения отображаемого имени учителя
  const getTeacherDisplayName = (teacher) => {
    const user = users?.find(u => u.id === teacher.userId);
    if (user) {
      return `${user.firstName} ${user.patronymic} ${user.lastName}`;
    }
    return teacher.title || 'Неизвестный преподаватель';
  };

  if (!studyPlan) return <Typography>Загрузка...</Typography>;

  return (
    <Box p={4} maxWidth="1000px" mx="auto">
      <Typography variant="h4" gutterBottom>Создание курса</Typography>

      {/* Study Plan Info */}
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>Обзор учебного плана</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Дисциплина" value={studyPlan.disciplineName} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Специальность" value={studyPlan.specialtyName} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Курс" value={studyPlan.studyYear} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Общее количество часов" value={studyPlan.totalHours} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Зачетные единицы" value={studyPlan.creditUnits} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Аудиторные часы" value={studyPlan.totalAuditoryHours} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField fullWidth label="Часы лекций" value={studyPlan.lectureHours} InputProps={{ readOnly: true }} />
          </Grid>
          {studyPlan.practiceHours != null && (
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Часы практики" value={studyPlan.practiceHours} InputProps={{ readOnly: true }} />
            </Grid>
          )}
          {studyPlan.labHours != null && (
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Часы лабораторных" value={studyPlan.labHours} InputProps={{ readOnly: true }} />
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Course Setup Form */}
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Настройка курса</Typography>
        <Box display="flex" flexDirection="column" gap={3}>
          <FormControl fullWidth>
            <InputLabel>Студенческая группа</InputLabel>
            <Select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              label="Студенческая группа"
            >
              {studentGroups.map(group => (
                <MenuItem key={group.id} value={group.id}>
                  {getGroupDisplayName(group)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Преподаватели</InputLabel>
            <Select
              multiple
              value={selectedTeacherIds}
              onChange={(e) => setSelectedTeacherIds(e.target.value)}
              input={<OutlinedInput label="Преподаватели" />}
              renderValue={(selected) => selected.map(id => {
                const teacher = teachers.find(t => t.id === id);
                return teacher ? getTeacherDisplayName(teacher) : id;
              }).join(', ')}
            >
              {teachers.map(teacher => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  <Checkbox checked={selectedTeacherIds.includes(teacher.id)} />
                  <ListItemText primary={getTeacherDisplayName(teacher)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Create Button */}
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateCourse}
          disabled={!groupId}
        >
          Создать курс
        </Button>
      </Box>
    </Box>
  );
}