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
import Register from './auth/Register.js'
import Login from './auth/Login.js'
import CreateCoursePage from './course/CreateCoursePage.js'

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
                <ListItemLink to="/dashboard" primary="Dashboard" />
              </ListItem>
              <ListItem disablePadding>
                <ListItemLink to="/courses/new" primary="Create Course" />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses/new" element={<CreateCoursePage />} />
        </Routes>
      </Box>
    </Router>
  );
}

function Dashboard() {
  return <h2>Dashboard</h2>;
}
