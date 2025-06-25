import {
  HourglassEmpty,
  PlayArrow,
  CheckCircle,
  ErrorOutline,
  AccessTime
} from '@mui/icons-material';

export const getStatusColor = (status) => {
  switch (status) {
    case 'NOT_STARTED': return 'default';
    case 'IN_PROGRESS': return 'warning';
    case 'ACCEPTED': return 'success';
    case 'NEEDS_CHANGES': return 'error';
    case 'OVERDUE': return 'error';
    default: return 'default';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'NOT_STARTED': return <HourglassEmpty />;
    case 'IN_PROGRESS': return <PlayArrow />;
    case 'ACCEPTED': return <CheckCircle />;
    case 'NEEDS_CHANGES': return <ErrorOutline />;
    case 'OVERDUE': return <AccessTime />;
    default: return <HourglassEmpty />;
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'NOT_STARTED': return 'Не начато';
    case 'IN_PROGRESS': return 'В процессе';
    case 'ACCEPTED': return 'Принято';
    case 'NEEDS_CHANGES': return 'Нужны изменения';
    case 'OVERDUE': return 'Просрочено';
    default: return 'Неизвестно';
  }
};