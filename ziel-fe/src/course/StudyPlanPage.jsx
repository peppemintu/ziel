import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Select, TextField, Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import authAxios from '../auth/utils/authFetch.js';

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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [plansRes, disciplinesRes, specialtiesRes] = await Promise.all([
          authAxios.get(`${API_BASE}/plan`),
          authAxios.get(`${API_BASE}/discipline`),
          authAxios.get(`${API_BASE}/specialty`)
        ]);

        setDisciplines(disciplinesRes.data);
        setSpecialties(specialtiesRes.data);

        const mappedPlans = plansRes.data.map(plan => ({
          ...plan,
          disciplineName: disciplinesRes.data.find(d => d.id === plan.disciplineId)?.name || 'Неизвестно',
          specialtyName: specialtiesRes.data.find(s => s.id === plan.specialtyId)?.name || 'Неизвестно',
          id: plan.id,
        }));
        setStudyPlans(mappedPlans);
      } catch (err) {
        console.error('Failed to fetch study plan data:', err);
      }
    };

    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await authAxios.post(`${API_BASE}/plan`, form);
      const createdPlan = response.data;

      setOpen(false);
      setForm(initialForm);

      const disciplineName = disciplines.find(d => d.id === +form.disciplineId)?.name || 'Неизвестно';
      const specialtyName = specialties.find(s => s.id === +form.specialtyId)?.name || 'Неизвестно';

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

  const fieldLabels = {
    studyYear: 'Курс обучения',
    semester: 'Семестр',
    totalHours: 'Общее количество часов',
    creditUnits: 'Зачетные единицы',
    totalAuditoryHours: 'Общие аудиторные часы',
    lectureHours: 'Часы лекций',
    practiceHours: 'Часы практики',
    labHours: 'Часы лабораторных'
  };

  const columns = [
    { field: 'studyYear', headerName: 'Курс', width: 100 },
    { field: 'semester', headerName: 'Семестр', width: 100 },
    { field: 'attestationForm', headerName: 'Аттестация', width: 130 },
    { field: 'disciplineName', headerName: 'Дисциплина', width: 200 },
    { field: 'specialtyName', headerName: 'Специальность', width: 250 },
    {
      field: 'createCourse',
      headerName: 'Создать курс',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/courses/create/${params.row.id}`, { state: { studyPlan: params.row } })}
        >
          Создать курс
        </Button>
      ),
    }
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Учебные планы
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Добавить учебный план
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
        <DialogTitle>Создать учебный план</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            'studyYear', 'semester', 'totalHours', 'creditUnits',
            'totalAuditoryHours', 'lectureHours', 'practiceHours', 'labHours'
          ].map(field => (
            <TextField
              key={field}
              name={field}
              label={fieldLabels[field]}
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
            <MenuItem value="EXAM">Экзамен</MenuItem>
            <MenuItem value="CREDIT">Зачет</MenuItem>
          </Select>

          <Select
            name="disciplineId"
            value={form.disciplineId}
            onChange={handleChange}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>Выберите дисциплину</MenuItem>
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
            <MenuItem value="" disabled>Выберите специальность</MenuItem>
            {specialties.map(s => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}