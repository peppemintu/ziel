import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon, Lock as LockIcon } from '@mui/icons-material';
import authAxios from '../../../auth/utils/authFetch.js';

const API_BASE = 'http://localhost:8080/api';

const StudentProgressTable = ({ courseId, onGradeUpdate, userRole = 'TEACHER' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState({});
  const [courseElements, setCourseElements] = useState([]);
  const [studentProgress, setStudentProgress] = useState({});
  const [finalGrades, setFinalGrades] = useState({});
  const [gradeSheet, setGradeSheet] = useState(null);
  const [isExamCourse, setIsExamCourse] = useState(true);


  const isReadOnly = userRole === 'STUDENT';

  const fetchCourseData = async (courseId) => {
    const response = await authAxios.get(`${API_BASE}/course/${courseId}`);
    return response.data;
  };

  const fetchStudyPlan = async (studyPlanId) => {
    const response = await authAxios.get(`${API_BASE}/plan/${studyPlanId}`);
    return response.data;
  };

  const fetchStudentsByGroup = async (groupId) => {
    const response = await authAxios.get(`${API_BASE}/student`);
    const allStudents = response.data;
    return allStudents.filter(student => student.groupId === groupId);
  };

  const fetchAllUsers = async () => {
    try {
      const response = await authAxios.get(`${API_BASE}/user`);
      return response.data;
    } catch (error) {
      console.warn('Cannot fetch user data:', error);
      return [];
    }
  };

  const fetchCourseElements = async (courseId) => {
    const response = await authAxios.get(`${API_BASE}/element/course/${courseId}`);
    return response.data;
  };

  const fetchElementProgress = async (elementId, studentId) => {
    try {
      const response = await authAxios.get(`${API_BASE}/progress`);
      const allProgress = response.data;
      return allProgress.find(p => p.elementId === elementId && p.studentId === studentId);
    } catch (err) {
      return null;
    }
  };

  const fetchGradeSheet = async (courseId) => {
    try {
      const response = await authAxios.get(`${API_BASE}/grade-sheet`);
      const allSheets = response.data;
      return allSheets.find(sheet => sheet.courseId === courseId);
    } catch (err) {
      return null;
    }
  };

  const fetchFinalGrades = async (gradeSheetId) => {
    try {
      const response = await authAxios.get(`${API_BASE}/final-grade`);
      const allGrades = response.data;
      return allGrades.filter(grade => grade.gradeSheetId === gradeSheetId);
    } catch (err) {
      return [];
    }
  };

  const saveFinalGrade = async (studentId, grade, ticketNumber = 1) => {
    try {
      if (!gradeSheet) {
        throw new Error('No grade sheet found for this course');
      }


      const existingGrade = finalGrades[studentId];
      console.log(existingGrade);

      if (existingGrade) {

        const response = await authAxios.put(`${API_BASE}/final-grade/${existingGrade.id}`, {
          ticketNumber: existingGrade.ticketNumber,
          numericGrade: isExamCourse ? grade : (grade === 'credited' ? 1 : 0),
          gradeSheetId: gradeSheet.id,
          studentId: studentId
        });
        return response.data;
      } else {

        const response = await authAxios.post(`${API_BASE}/final-grade`, {
          ticketNumber: ticketNumber,
          numericGrade: isExamCourse ? grade : (grade === 'credited' ? 1 : 0),
          gradeSheetId: gradeSheet.id,
          studentId: studentId
        });
        return response.data;
      }
    } catch (err) {
      console.error('Error saving final grade:', err);
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);


        const course = await fetchCourseData(courseId);
        setCourseData(course);


        let plan = null;
        if (course.studyPlanId) {
          plan = await fetchStudyPlan(course.studyPlanId);
          setStudyPlan(plan);

          setIsExamCourse(plan.attestationForm === 'EXAM' || false);
        }


        const studentsData = await fetchStudentsByGroup(course.groupId);
        setStudents(studentsData);


        const allUsers = await fetchAllUsers();
        const usersMap = {};
        allUsers.forEach(user => {
          usersMap[user.id] = user;
        });
        setUsers(usersMap);


        const elements = await fetchCourseElements(courseId);

        const filteredElements = elements.filter(
          element => element.type === 'LABWORK' || element.type === 'PRACTICE'
        );
        setCourseElements(filteredElements);


        const progressMap = {};
        for (const student of studentsData) {
          progressMap[student.id] = {};
          for (const element of filteredElements) {
            const progress = await fetchElementProgress(element.id, student.id);
            if (progress) {
              progressMap[student.id][element.id] = {
                completed: progress.status === 'COMPLETED',
                points: progress.grade || 0
              };
            }
          }
        }
        setStudentProgress(progressMap);


        const sheet = await fetchGradeSheet(courseId);
        setGradeSheet(sheet);

        if (sheet) {
          const grades = await fetchFinalGrades(sheet.id);
          const gradesMap = {};
          grades.forEach(grade => {
            if (isExamCourse) {
              gradesMap[grade.studentId] = grade.numericGrade;
            } else {
              gradesMap[grade.studentId] = grade.numericGrade > 0 ? 'credited' : 'not_credited';
            }
          });
          setFinalGrades(gradesMap);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadData();
    }
  }, [courseId, isExamCourse]);

  const handleGradeChange = (studentId, newGrade) => {
    if (isReadOnly) return;
    setFinalGrades(prev => ({
      ...prev,
      [studentId]: newGrade
    }));
  };

  const handleSaveGrade = async (studentId) => {
    if (isReadOnly) return;
    try {
      await saveFinalGrade(studentId, finalGrades[studentId]);
      if (onGradeUpdate) {
        onGradeUpdate(studentId, finalGrades[studentId]);
      }
    } catch (err) {
      setError(`Failed to save grade: ${err.message}`);
    }
  };

  const getProgressChip = (elementId, studentId) => {
    const progress = studentProgress[studentId]?.[elementId];
    if (!progress) {
      return (
        <Tooltip title="Нет прогресса">
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={0}
              color="default"
              size={32}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" component="div" color="text.secondary">
                -
              </Typography>
            </Box>
          </Box>
        </Tooltip>
      );
    }

    const value = progress.points || 0;
    const completed = progress.completed;

    return (
      <Tooltip title={`Очки: ${value}`}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={completed ? 100 : 50}
            color={completed ? 'success' : 'warning'}
            size={32}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {value}
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    );
  };

  const renderGradeControl = (student) => {
    const currentGrade = finalGrades[student.id] || '';
    const studentUser = users[student.userId];

    if (isReadOnly) {
      if (isExamCourse) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color={currentGrade ? 'text.primary' : 'text.secondary'}>
              {currentGrade || 'Нет оценки'}
            </Typography>
            <Tooltip title="Только для чтения">
              <LockIcon fontSize="small" color="disabled" />
            </Tooltip>
          </Box>
        );
      } else {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={currentGrade === 'credited' ? 'Зачет' :
                     currentGrade === 'not_credited' ? 'Незачет' : 'Нет оценки'}
              size="small"
              color={currentGrade === 'credited' ? 'success' :
                     currentGrade === 'not_credited' ? 'error' : 'default'}
            />
            <Tooltip title="Только для чтения">
              <LockIcon fontSize="small" color="disabled" />
            </Tooltip>
          </Box>
        );
      }
    }

    if (isExamCourse) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <InputLabel>Оценка</InputLabel>
            <Select
              value={currentGrade}
              label="Оценка"
              onChange={(e) => handleGradeChange(student.id, e.target.value)}
            >
              <MenuItem value="">-</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            size="small"
            onClick={() => handleSaveGrade(student.id)}
            disabled={!currentGrade}
            color="primary"
          >
            <SaveIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Оценка</InputLabel>
            <Select
              value={currentGrade}
              label="Status"
              onChange={(e) => handleGradeChange(student.id, e.target.value)}
            >
              <MenuItem value="">-</MenuItem>
              <MenuItem value="credited">Зачет</MenuItem>
              <MenuItem value="not_credited">Незачет</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            size="small"
            onClick={() => handleSaveGrade(student.id)}
            disabled={!currentGrade}
            color="primary"
          >
            <SaveIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!courseData || students.length === 0) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Студенты не найдены.
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          Список студентов — Курс {courseData.id}
          {isReadOnly && (
            <Chip
              label="Только для чтения"
              size="small"
              color="default"
              icon={<LockIcon />}
              sx={{ ml: 2 }}
            />
          )}
        </Typography>
        <IconButton onClick={() => window.location.reload()} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {isReadOnly && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Обратитесь к преподавателю если у вас есть вопросы!
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
                Студент
              </TableCell>
              {courseElements.map((element) => (
                <TableCell
                  key={element.id}
                  sx={{ fontWeight: 'bold', minWidth: 120 }}
                >
                  <Tooltip title={`${element.type} - Max: ${element.maxPoints || 'N/A'}pts`}>
                    <Typography variant="caption" display="block">
                      {element.name || `Элемент ${element.id}`}
                    </Typography>
                  </Tooltip>
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>
                {isExamCourse ? 'Оценка' : 'Зачет'}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => {
              const studentUser = users[student.userId];
              return (
                <TableRow key={student.id} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {studentUser ? `${studentUser.firstName || ''} ${studentUser.lastName || ''}` : `User ID: ${student.userId}`}
                    </Typography>
                  </TableCell>
                  {courseElements.map((element) => (
                    <TableCell key={element.id}>
                      {getProgressChip(element.id, student.id)}
                    </TableCell>
                  ))}
                  <TableCell>
                    {renderGradeControl(student)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Всего студентов: {students.length}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Форма: {isExamCourse ? 'Экзамен' : 'Зачет'} |
          Режим: {isReadOnly ? 'Чтение' : 'Изменение'}
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentProgressTable;