import React from "react";
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
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

const drawerWidth = 240;

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

export default function App() {
  return (
    <Router>
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
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem disablePadding>
                <ListItemLink to="/register" primary="Register" />
              </ListItem>
              <ListItem disablePadding>
                <ListItemLink to="/login" primary="Login" />
              </ListItem>
              <ListItem disablePadding>
                <ListItemLink to="/" primary="Homepage" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
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
    </Router>
  );
}
