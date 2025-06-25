import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem, Select, Typography
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';

const API_BASE = 'http://localhost:8080/api';

const ELEMENT_TYPES = ['LECTURE', 'LABWORK', 'PRACTICE', 'ATTESTATION'];
const ATTESTATION_FORMS = ['EXAM', 'CREDIT', 'QUESTIONING', 'REPORT'];

export default function CourseElementTable() {
  const { courseId } = useParams();
  const [elements, setElements] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    elementType: 'LECTURE',
    hours: 2,
    attestationForm: 'EXAM',
  });

  useEffect(() => {
    const fetchElements = async () => {
      const res = await axios.get(`${API_BASE}/element`);
      const filtered = res.data.filter(e => e.courseId === +courseId);
      setElements(filtered);
    };
    fetchElements();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    const payload = {
      elementType: form.elementType,
      hours: form.hours,
      attestationForm: form.attestationForm,
      courseId: +courseId, // force number here
    };

    console.log('Payload being sent:', payload);

    const res = await axios.post(`${API_BASE}/element`, payload);
    setElements(prev => [...prev, res.data]);
    setForm({
      elementType: 'LECTURE',
      hours: 2,
      attestationForm: 'EXAM',
    });
    setOpen(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE}/element/${id}`);
    setElements(prev => prev.filter(e => e.id !== id));
  };

  const columns = [
    {
      field: 'elementType',
      headerName: 'Type',
      width: 130,
      editable: true
    },
    {
      field: 'hours',
      headerName: 'Hours',
      type: 'number',
      width: 100,
      editable: true
    },
    {
      field: 'attestationForm',
      headerName: 'Attestation',
      width: 150,
      editable: true
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDelete(params.id)} />,
        <GridActionsCellItem icon={<LinkIcon />} label="Link" onClick={() => console.log('TODO: link modal')} />
      ],
    },
  ];

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>Course Elements (Course ID: {courseId})</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Element
      </Button>

      <Box mt={3} style={{ height: 600 }}>
        <DataGrid
          rows={elements}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10]}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          processRowUpdate={async (newRow) => {
            const updated = await axios.put(`${API_BASE}/element/${newRow.id}`, newRow);
            setElements(prev => prev.map(r => r.id === newRow.id ? updated.data : r));
            return updated.data;
          }}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>

      {/* Modal: Add Element */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Element</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Hours"
            name="hours"
            type="number"
            value={form.hours}
            onChange={handleChange}
          />
          <Select
            name="elementType"
            value={form.elementType}
            onChange={handleChange}
            fullWidth
          >
            {ELEMENT_TYPES.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
          <Select
            name="attestationForm"
            value={form.attestationForm}
            onChange={handleChange}
            fullWidth
          >
            {ATTESTATION_FORMS.map(form => (
              <MenuItem key={form} value={form}>{form}</MenuItem>
            ))}
          </Select>
          {/* File Upload Placeholder */}
          {/* <Button variant="outlined">Upload File</Button> */}
          {/* Publish Toggle Placeholder */}
          {/* <FormControlLabel control={<Switch />} label="Published" /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
