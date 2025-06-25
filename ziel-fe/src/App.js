import React from "react";
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { GlobalStyles, ThemeProvider, createTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import HomeIcon from '@mui/icons-material/Home';
import GradeIcon from '@mui/icons-material/Grade';
import LogoutIcon from '@mui/icons-material/Logout';

import Register from './auth/pages/Register.js'
import Login from './auth/pages/Login.js'
import StudyPlanPage from './course/StudyPlanPage.jsx'
import CourseCreationPage from './course/CourseCreationPage.jsx'
import CoursePage from './course/pages/CoursePage.jsx'
import Homepage from './course/pages/Homepage.jsx'
import AdminLayout from './admin/AdminLayout';
import DisciplineAdminPage from './admin/DisciplineAdminPage';
import SpecialtyAdminPage from './admin/SpecialtyAdminPage';
import StudentAdminPage from './admin/StudentAdminPage';
import StudentGroupAdminPage from './admin/StudentGroupAdminPage';
import TeacherAdminPage from './admin/TeacherAdminPage';
import StudentProgressTable from './course/components/element/StudentProgressTable.jsx'

import { useAuth } from './auth/hooks/useAuth';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: '#073b3a', // Dark teal
      light: '#0b6e4f', // Medium teal
      dark: '#05312f', // Darker teal
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#08a045', // Green
      light: '#6bbf59', // Light green
      dark: '#067038', // Dark green
      contrastText: '#ffffff',
    },
    success: {
      main: '#21d375', // Bright green
      light: '#4ddd8a',
      dark: '#1ba760',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fffe',
      paper: '#ffffff',
    },
    text: {
      primary: '#073b3a',
      secondary: '#0b6e4f',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#073b3a',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#073b3a',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#073b3a',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#0b6e4f',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      color: '#0b6e4f',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#0b6e4f',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#073b3a',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#0b6e4f',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#073b3a',
          color: '#ffffff',
          '& .MuiToolbar-root': {
            borderBottom: '1px solid #0b6e4f',
            minHeight: '120px !important',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          },
          '& .MuiListItemText-primary': {
            color: '#ffffff',
          },
          '& .MuiListItemIcon-root': {
            color: '#6bbf59',
          },
          '& .MuiListItemButton-root': {
            '&:hover': {
              backgroundColor: '#0b6e4f',
            },
            '&.Mui-selected': {
              backgroundColor: '#08a045',
              '&:hover': {
                backgroundColor: '#21d375',
              },
            },
          },
          '& .MuiDivider-root': {
            borderColor: '#0b6e4f',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(7, 59, 58, 0.15)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(7, 59, 58, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(7, 59, 58, 0.08)',
          border: '1px solid rgba(107, 191, 89, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6bbf59',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#08a045',
            },
          },
        },
      },
    },
  },
});

function ListItemLink(props) {
  const { icon, primary, to } = props;
  const location = useLocation();
  return (
    <ListItemButton
      component={Link}
      to={to}
      selected={location.pathname === to}
    >
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItemButton>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

function AppContent() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
              variant="permanent"
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
              }}
            >
              <Toolbar>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  gap: 1
                }}>
                  <Box sx={{
                    width: '60%',
                    aspectRatio: '1',
                    maxWidth: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    margin: 2,
                  }}>
                    <img
                      src="/logobgreenpink.webp"
                      alt="ZIEL GARDEN"
                      style={{
                        width: '90%',
                        height: '90%',
                        objectFit: 'contain'
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      color: '#ADCC7F',
                      fontWeight: 600,
                      fontSize: '1.6rem',
                      letterSpacing: '0.5px',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      mb: 3,
                    }}
                  >
                    САД МЭТАЎ
                  </Typography>
                </Box>
              </Toolbar>
              <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <List>
                  <ListItem disablePadding>
                    <ListItemLink to="/" primary="Главная страница" icon={<HomeIcon />} />
                  </ListItem>
                </List>

                <Box sx={{ flexGrow: 1 }} />

                <Divider />
                <List>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText primary="Выйти" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Drawer>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/test" element={<StudentProgressTable />} />
              <Route path="/plan" element={<StudyPlanPage />} />
              <Route path="/courses/create/:id" element={<CourseCreationPage />} />
              <Route path="/courses/:id" element={<CoursePage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="disciplines" element={<DisciplineAdminPage />} />
                <Route path="specialties" element={<SpecialtyAdminPage />} />
                <Route path="students" element={<StudentAdminPage />} />
                <Route path="student-groups" element={<StudentGroupAdminPage />} />
                <Route path="teachers" element={<TeacherAdminPage />} />
              </Route>
            </Routes>
          </Box>
  );
}


export default function App() {
  return (
  <ThemeProvider theme={theme}>
    <GlobalStyles
      styles={{
        '@import': 'url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap")',
        body: {
          backgroundImage: 'url(/colorfulsky.webp)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          minHeight: '100vh',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        },
        '*': {
          boxSizing: 'border-box',
        },
        'html, body': {
          margin: 0,
          padding: 0,
        },
      }}
    />
    <Router>
      <AppContent />
    </Router>
  </ThemeProvider>
  );
}