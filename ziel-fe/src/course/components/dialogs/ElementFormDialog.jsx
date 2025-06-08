import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Button, Box, Switch, FormControlLabel
} from '@mui/material';
import { ELEMENT_TYPES, ATTESTATION_FORMS } from '../../utils/constants';

const ElementFormDialog = ({ open, onClose, onSave, element = null }) => {
  const [formData, setFormData] = useState({
    hours: 0,
    elementType: 'LECTURE',
    attestationForm: 'EXAM',
    published: true
  });

  useEffect(() => {
    if (element) {
      setFormData({
        hours: element.hours || 0,
        elementType: element.elementType || 'LECTURE',
        attestationForm: element.attestationForm || 'EXAM',
        published: element.published !== false
      });
    } else {
      setFormData({
        hours: 0,
        elementType: 'LECTURE',
        attestationForm: 'EXAM',
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
      <DialogTitle>{element ? 'Edit Element' : 'Add Element'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Hours"
            type="number"
            value={formData.hours}
            fullWidth
            required
            onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })}
            inputProps={{ min: 0 }}
          />
          <FormControl fullWidth>
            <InputLabel>Element Type</InputLabel>
            <Select
              value={formData.elementType}
              label="Element Type"
              onChange={(e) => setFormData({ ...formData, elementType: e.target.value })}
            >
              {Object.keys(ELEMENT_TYPES).map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Attestation Form</InputLabel>
            <Select
              value={formData.attestationForm}
              label="Attestation Form"
              onChange={(e) => setFormData({ ...formData, attestationForm: e.target.value })}
            >
              {Object.keys(ATTESTATION_FORMS).map(form => (
                <MenuItem key={form} value={form}>{form}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
            }
            label="Published"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {element ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ElementFormDialog;