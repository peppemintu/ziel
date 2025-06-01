import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import { useNavigate } from 'react-router-dom';

const items = [
  { text: 'Disciplines', path: '/admin/disciplines', icon: <BookIcon /> },
  { text: 'Specialties', path: '/admin/specialties', icon: <SchoolIcon /> },
  { text: 'Students', path: '/admin/students', icon: <PeopleIcon /> },
  { text: 'Student Groups', path: '/admin/student-groups', icon: <GroupIcon /> },
  { text: 'Teachers', path: '/admin/teachers', icon: <PersonIcon /> },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" anchor="left">
      <List sx={{ width: 240 }}>
        {items.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
