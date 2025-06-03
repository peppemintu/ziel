import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Select, TextField, Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api';

const initialForm = {
  studyYear: '',
  semester: '',
  totalHours: '',
  creditUnits: '',
  totalAuditoryHours: '',
  lectureHours: '',
  practiceHours: '',
  labHours: '',
  attestationForm: 'EXAM',
  disciplineId: '',
  specialtyId: '',
};

export default function StudyPlanPage() {
  const [studyPlans, setStudyPlans] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();


  // Fetch all data once
  useEffect(() => {
    const fetchAll = async () => {
      const [plansRes, disciplinesRes, specialtiesRes] = await Promise.all([
        axios.get(`${API_BASE}/plan`),
        axios.get(`${API_BASE}/discipline`),
        axios.get(`${API_BASE}/specialty`),
      ]);

      setDisciplines(disciplinesRes.data);
      setSpecialties(specialtiesRes.data);

      // Map names directly into plans
      const mappedPlans = plansRes.data.map(plan => ({
        ...plan,
        disciplineName: disciplinesRes.data.find(d => d.id === plan.disciplineId)?.name || 'Unknown',
        specialtyName: specialtiesRes.data.find(s => s.id === plan.specialtyId)?.name || 'Unknown',
        id: plan.id,
      }));
      setStudyPlans(mappedPlans);
    };

    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE}/plan`, form);
      const createdPlan = response.data; // assuming backend returns the created plan with `id`

      setOpen(false);
      setForm(initialForm);

      const disciplineName = disciplines.find(d => d.id === +form.disciplineId)?.name || 'Unknown';
      const specialtyName = specialties.find(s => s.id === +form.specialtyId)?.name || 'Unknown';

      const newPlan = {
        ...createdPlan,
        studyYear: +createdPlan.studyYear,
        semester: +createdPlan.semester,
        totalHours: +createdPlan.totalHours,
        creditUnits: +createdPlan.creditUnits,
        totalAuditoryHours: +createdPlan.totalAuditoryHours,
        lectureHours: +createdPlan.lectureHours,
        practiceHours: +createdPlan.practiceHours,
        labHours: +createdPlan.labHours,
        disciplineName,
        specialtyName,
      };

      setStudyPlans(prev => [...prev, newPlan]);
    } catch (error) {
      console.error('Failed to create study plan:', error);
    }
  };

  const columns = [
    { field: 'studyYear', headerName: 'Year', width: 100 },
    { field: 'semester', headerName: 'Semester', width: 100 },
    { field: 'totalHours', headerName: 'Total Hours', width: 130 },
    { field: 'creditUnits', headerName: 'Credits', width: 100 },
    { field: 'totalAuditoryHours', headerName: 'Auditory Hours', width: 150 },
    { field: 'lectureHours', headerName: 'Lecture Hours', width: 130 },
    { field: 'practiceHours', headerName: 'Practice Hours', width: 130 },
    { field: 'labHours', headerName: 'Lab Hours', width: 100 },
    { field: 'attestationForm', headerName: 'Attestation', width: 130 },
    { field: 'disciplineName', headerName: 'Discipline', width: 200 },
    { field: 'specialtyName', headerName: 'Specialty', width: 200 },
    {
      field: 'createCourse',
      headerName: 'Create Course',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/courses/create/${params.row.id}`, { state: { studyPlan: params.row } })}
        >
          Create Course
        </Button>
      ),
    }
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Study Plans
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Study Plan
      </Button>

      <Box mt={3} style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={studyPlans}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          autoHeight
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Study Plan</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            'studyYear', 'semester', 'totalHours', 'creditUnits',
            'totalAuditoryHours', 'lectureHours', 'practiceHours', 'labHours'
          ].map(field => (
            <TextField
              key={field}
              name={field}
              label={field}
              value={form[field]}
              onChange={handleChange}
              type="number"
              fullWidth
            />
          ))}

          <Select
            name="attestationForm"
            value={form.attestationForm}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="EXAM">Exam</MenuItem>
            <MenuItem value="CREDIT">Credit</MenuItem>
          </Select>

          <Select
            name="disciplineId"
            value={form.disciplineId}
            onChange={handleChange}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Select Discipline</MenuItem>
            {disciplines.map(d => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </Select>

          <Select
            name="specialtyId"
            value={form.specialtyId}
            onChange={handleChange}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Select Specialty</MenuItem>
            {specialties.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
