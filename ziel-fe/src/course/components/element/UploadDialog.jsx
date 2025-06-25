import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload,
  Upload,
  InsertDriveFile
} from '@mui/icons-material';

const UploadDialog = ({
  open,
  onClose,
  selectedFiles,
  onFileSelect,
  onUpload,
  uploading,
  submissionComment,
  onCommentChange
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Байт', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Загрузить работу</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
            fullWidth
            sx={{ mb: 2, py: 2 }}
          >
            Выбрать файлы
            <input
              type="file"
              multiple
              hidden
              onChange={onFileSelect}
            />
          </Button>

          {selectedFiles.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Выбранные файлы:
              </Typography>
              {selectedFiles.map((file, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <InsertDriveFile color="primary" />
                  <Typography variant="body2">{file.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({formatFileSize(file.size)})
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onUpload}
          variant="contained"
          disabled={selectedFiles.length === 0 || uploading}
          startIcon={uploading ? <LinearProgress size={20} /> : <Upload />}
        >
          {uploading ? 'Загрузка...' : 'Загрузите работу'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;