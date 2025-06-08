import { STATUS_COLORS } from './constants';

export const getStatusColor = (status) => STATUS_COLORS[status] || STATUS_COLORS.NOT_STARTED;