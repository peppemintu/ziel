import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Button, Box, Switch, FormControlLabel
} from '@mui/material';
import { ELEMENT_TYPES, ATTESTATION_FORMS } from '../../utils/constants';

const ElementFormDialog = ({ open, onClose, onSave, element = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hours: 0,
    elementType: 'LECTURE',
    attestationForm: 'EXAM',
    published: true
  });

  const ATTESTATION_FORM_LABELS = {
    EXAM: 'Экзамен',
    CREDIT: 'Зачет',
    QUESTIONING: 'Устный опрос',
    REPORT: 'Отчет'
  };

  const ELEMENT_TYPE_LABELS = {
    LECTURE: 'Лекция',
    LABWORK: 'Лабораторная работа',
    PRACTICE: 'Практическая работа',
    ATTESTATION: 'Контроль знаний'
  };

  useEffect(() => {
    if (element) {
      setFormData({
        name: element.name || '',
        description: element.description || '',
        hours: element.hours || 0,
        elementType: element.elementType || 'LECTURE',
        attestationForm: element.attestationForm || 'EXAM',
        published: element.published !== false
      });
    } else {
      setFormData({
        name: '',
        description: '',
        hours: 0,
        elementType: 'LECTURE',
        attestationForm: 'QUESTIONING',
        published: true
      });
    }
  }, [element, open]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{element ? 'Изменить элемент' : 'Добавить элемент'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Название"
            value={formData.name}
            fullWidth
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Описание"
            value={formData.description}
            fullWidth
            multiline
            rows={3}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            label="Часов"
            type="number"
            value={formData.hours}
            fullWidth
            required
            onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })}
            inputProps={{ min: 0 }}
          />
          <FormControl fullWidth>
            <InputLabel>Тип элемента</InputLabel>
            <Select
              value={formData.elementType}
              label="Тип элемента"
              onChange={(e) => setFormData({ ...formData, elementType: e.target.value })}
            >
              {Object.keys(ELEMENT_TYPES).map(type => (
                <MenuItem key={type} value={type}>{ELEMENT_TYPE_LABELS[type] || type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Форма аттестации</InputLabel>
            <Select
              value={formData.attestationForm}
              label="Форма аттестации"
              onChange={(e) => setFormData({ ...formData, attestationForm: e.target.value })}
            >
              {Object.keys(ATTESTATION_FORMS)
                .filter(form => {
                  if (formData.elementType === 'ATTESTATION') return true;
                  return form !== 'EXAM' && form !== 'CREDIT';
                })
                .map(form => (
                  <MenuItem key={form} value={form}>
                    {ATTESTATION_FORM_LABELS[form] || form}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained">
          {element ? 'Изменить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ElementFormDialog;
