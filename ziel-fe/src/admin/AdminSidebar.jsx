import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const items = [
  { text: 'Disciplines', path: '/admin/disciplines' },
  { text: 'Specialties', path: '/admin/specialties' },
  { text: 'Students', path: '/admin/students' },
  { text: 'Teachers', path: '/admin/teachers' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {items.map(item => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
