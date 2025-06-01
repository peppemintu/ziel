import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, TextField, Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

export default function AdminTable({ title, columns, endpoint, initialForm }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get(endpoint).then(res => setRows(res.data));
  }, [endpoint]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (editingId) {
      await axios.put(`${endpoint}/${editingId}`, form);
    } else {
      await axios.post(endpoint, form);
    }
    const res = await axios.get(endpoint);
    setRows(res.data);
    setForm(initialForm);
    setOpen(false);
    setEditingId(null);
  };

  const handleDelete = async id => {
    await axios.delete(`${endpoint}/${id}`);
    setRows(prev => prev.filter(row => row.id !== id));
  };

  const handleEdit = row => {
    setForm(row);
    setEditingId(row.id);
    setOpen(true);
  };

  return (
    <Box p={4} ml={30}>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      <Button variant="contained" onClick={() => { setOpen(true); setEditingId(null); setForm(initialForm); }}>Add</Button>
      <Box mt={3}>
        <DataGrid
          rows={rows}
          columns={[
            ...columns,
            {
              field: 'actions',
              headerName: 'Actions',
              width: 150,
              renderCell: (params) => (
                <>
                  <IconButton onClick={() => handleEdit(params.row)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(params.row.id)}><Delete /></IconButton>
                </>
              ),
            }
          ]}
          autoHeight
          pageSize={10}
        />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingId ? 'Edit' : 'Add'} Entry</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.keys(initialForm).map(key => (
            <TextField
              key={key}
              name={key}
              label={key}
              value={form[key] || ''}
              onChange={handleChange}
              fullWidth
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
