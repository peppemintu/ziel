import React from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Stack,
  Card,
  CardContent,
  IconButton,
  Badge,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  InsertDriveFile,
  CloudUpload,
  Download,
  Delete
} from '@mui/icons-material';
import { formatDate } from '../../utils/formatUtils.js';

const ReferenceFilesSection = ({
  referenceFiles,
  userRole,
  uploading,
  loading,
  onReferenceUpload,
  onFileDownload,
  onFileDelete
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        p: 2,
        backgroundColor: 'success.main',
        color: 'white',
        borderRadius: 2
      }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InsertDriveFile />
          Методические материалы
          <Badge badgeContent={referenceFiles.length} color="secondary" />
        </Typography>
        {userRole === 'TEACHER' && (
          <Button
            variant="contained"
            startIcon={uploading ? <LinearProgress size={20} /> : <CloudUpload />}
            component="label"
            disabled={uploading}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
            {uploading ? 'Загрузка...' : 'Загрузить файл'}
            <input
              type="file"
              hidden
              onChange={onReferenceUpload}
              disabled={uploading}
            />
          </Button>
        )}
      </Box>

      {loading ? (
        <LinearProgress />
      ) : referenceFiles.length > 0 ? (
        <Stack spacing={1}>
          {referenceFiles.map((file) => (
            <Card key={file.id} variant="outlined" sx={{ '&:hover': { boxShadow: 2 } }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                <InsertDriveFile color="primary" sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Загружено: {formatDate(file.uploadedAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Download">
                    <IconButton
                      color="primary"
                      onClick={() => onFileDownload(file.id, file.name)}
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                  {userRole === 'TEACHER' && (
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => onFileDelete(file.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <Alert severity="info" sx={{ mt: 1 }}>
          Нет методических материалов.
        </Alert>
      )}
    </Box>
  );
};

export default ReferenceFilesSection;