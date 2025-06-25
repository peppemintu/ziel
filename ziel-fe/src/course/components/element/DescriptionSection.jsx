import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent
} from '@mui/material';
import { Assignment } from '@mui/icons-material';

const DescriptionSection = ({
  element,
  editedElement,
  setEditedElement,
  isEditing
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Assignment color="primary" />
        Описание
      </Typography>
      {isEditing ? (
        <TextField
          multiline
          rows={6}
          fullWidth
          value={editedElement.description || ''}
          onChange={(e) => setEditedElement({ ...editedElement, description: e.target.value })}
          placeholder="Введите описание, критерии оценки, дополнительную информацию..."
          sx={{ mt: 1 }}
        />
      ) : (
        <Card variant="outlined" sx={{ mt: 1 }}>
          <CardContent>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {element.description || 'Нет описания.'}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DescriptionSection;