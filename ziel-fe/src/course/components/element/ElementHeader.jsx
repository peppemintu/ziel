import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip
} from '@mui/material';
import { Save, Cancel, Edit, Close } from '@mui/icons-material';
import { getStatusIcon, getStatusColor, getStatusText } from '../../utils/progressUtils';

const ElementHeader = ({
  element,
  editedElement,
  setEditedElement,
  isEditing,
  setIsEditing,
  onSave,
  onClose,
  userRole,
  currentUserProgress
}) => {
  return (
    <Box sx={{
      p: 3,
      borderBottom: 1,
      borderColor: 'divider',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'linear-gradient(180deg, #21d375 0%, #6bbf59 100%)',
      color: 'white'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {isEditing ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              value={editedElement.name || ''}
              onChange={(e) => setEditedElement({ ...editedElement, name: e.target.value })}
              size="small"
              sx={{
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' }
                }
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ color: 'white' }}>Type</InputLabel>
              <Select
                value={editedElement.type || ''}
                onChange={(e) => setEditedElement({ ...editedElement, type: e.target.value })}
                label="Type"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                }}
              >
                <MenuItem value="LECTURE">Лекция</MenuItem>
                <MenuItem value="LABWORK">Лабораторная</MenuItem>
                <MenuItem value="PRACTICE">Практик</MenuItem>
                <MenuItem value="ATTESTATION">Проверка знаний</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              {element.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip
                label={element.elementType}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 500
                }}
                size="small"
              />
              {userRole === 'STUDENT' && currentUserProgress && (
                <Chip
                  icon={getStatusIcon(currentUserProgress.status)}
                  label={getStatusText(currentUserProgress.status)}
                  color={getStatusColor(currentUserProgress.status)}
                  sx={{ color: 'white' }}
                  size="small"
                />
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        {userRole === 'TEACHER' && (
          <>
            {isEditing ? (
              <>
                <IconButton onClick={onSave} sx={{ color: 'white' }}>
                  <Save />
                </IconButton>
                <IconButton onClick={() => setIsEditing(false)} sx={{ color: 'white' }}>
                  <Cancel />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={() => setIsEditing(true)} sx={{ color: 'white' }}>
                <Edit />
              </IconButton>
            )}
          </>
        )}
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ElementHeader;