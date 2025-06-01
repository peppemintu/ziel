// ReusableAdminTable.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
  TextField, Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

export default function ReusableAdminTable({ title, columns, endpoint, emptyRow }) {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyRow);
  const [editingId, setEditingId] = useState(null);

  const fetchData = useCallback(async () => {
    const res = await axios.get(endpoint);
    setRows(res.data);
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [endpoint, fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (editingId) {
      await axios.put(`${endpoint}/${editingId}`, form);
    } else {
      await axios.post(endpoint, form);
    }
    fetchData();
    setOpen(false);
    setForm(emptyRow);
    setEditingId(null);
  };

  const handleEdit = (row) => {
    setForm(row);
    setEditingId(row.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${endpoint}/${id}`);
    fetchData();
  };

  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    renderCell: (params) => (
      <>
        <IconButton onClick={() => handleEdit(params.row)}><Edit /></IconButton>
        <IconButton onClick={() => handleDelete(params.row.id)}><Delete /></IconButton>
      </>
    ),
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>{title}</Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>Add</Button>
      <Box mt={2} style={{ height: 600 }}>
        <DataGrid
          rows={rows}
          columns={[...columns, actionColumn]}
          getRowId={(row) => row.id}
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingId ? 'Edit' : 'Add'} Entry</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 400 }}>
          {Object.keys(emptyRow).map((field) => (
            <TextField
              key={field}
              name={field}
              label={field}
              value={form[field] || ''}
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
