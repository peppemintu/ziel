import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Container,
  Chip,
  CircularProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import useCourseCatalog from '../hooks/useCourses.jsx';
import { useAuth } from '../../auth/hooks/useAuth.js';

function TeacherDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { courses, loading: coursesLoading } = useCourseCatalog();

  if (authLoading) {
      return (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (!isAuthenticated) {
      return (
        <Container>
          <Typography variant="h5" align="center" mt={4}>
            Пожалуйста, войдите, чтобы увидеть курсы
          </Typography>
        </Container>
      );
    }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Главная страница
      </Typography>

      {/* Course Creation Widget */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, background: 'linear-gradient(180deg, #21d375 0%, #6bbf59 100%)' }}>
        <Box sx={{ color: 'white', textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            Создать новый курс
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Создайте курс и поделитесь им со своими студентами
          </Typography>
          <Button
            component={Link}
            to="/plan"
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            Начать создание курса
          </Button>
        </Box>
      </Paper>

      {/* All Courses Section */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        Доступные курсы
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} key={course.id}>
            <Card sx={{ height: '100%', width: '100%', minWidth: '550px', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Дисциплина: {course.discipline?.name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Специальность: {course.specialty?.name || 'N/A'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label={`Курс ${course.studyPlan?.studyYear}, Семестр ${course.studyPlan?.semester}`} size="small" />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/courses/${course.id}`}
                  size="small"
                  variant="outlined"
                >
                  ОТКРЫТЬ
                </Button>
                <Button
                  component={Link}
                  to={`/courses/create/${course.id}`}
                  size="small"
                >
                  ИЗМЕНИТЬ
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function StudentDashboard() {
  const { courses, loading } = useCourseCatalog();

  if (loading) {
    return <Typography>Загрука...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Главная страница
      </Typography>

      {/* Welcome Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BookIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h5" component="h2">
              Доступные курсы
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Растите и развивайтесь с прохождением курсов
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* All Courses Section */}
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course.id}>
            <Card sx={{ height: '100%', width: '100%', minWidth: '550px', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Дисциплина: {course.discipline?.name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Специальность: {course.specialty?.name || 'N/A'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label={`Курс ${course.studyPlan?.studyYear}, Семестр ${course.studyPlan?.semester}`} size="small" />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/courses/${course.id}`}
                  size="small"
                  variant="contained"
                >
                  Просмотреть курс
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function Homepage() {
  const { user, isLoading } = useAuth();
  const userType = user?.role?.toUpperCase(); // 'TEACHER' or 'STUDENT'

  if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!userType) {
      return (
        <Container>
          <Typography variant="h5" align="center" mt={4}>
            Пожалуйста, войдите в систему, чтобы увидеть курсы
          </Typography>
        </Container>
      );
    }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {userType === 'TEACHER' ? <TeacherDashboard /> : <StudentDashboard />}
    </Box>
  );
}

export default Homepage;