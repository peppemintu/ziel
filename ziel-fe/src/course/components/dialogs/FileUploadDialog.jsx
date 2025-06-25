import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box
} from '@mui/material';

const FileUploadDialog = ({ open, onClose, onUpload, elementId }) => {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (file) {
      onUpload(elementId, file);
      setFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Загрузить работу</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleUpload} variant="contained" disabled={!file}>
          Загрузить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog;
