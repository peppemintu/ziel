import { useState, useCallback } from 'react';
import authAxios from '../../auth/utils/authFetch';
import { API_BASE } from '../utils/constants';

export const useProgressManagement = (elementId) => {
  const [progressStatuses, setProgressStatuses] = useState({});
  const [updatingProgress, setUpdatingProgress] = useState({});

  const loadProgressStatuses = useCallback(async () => {
    if (!elementId) return;

    try {
      const response = await authAxios.get(`${API_BASE}/progress/element/${elementId}`);
      const progressData = response.data || [];

      const statusMap = {};
      progressData.forEach(progress => {
        statusMap[progress.studentId] = {
          id: progress.id,
          status: progress.status,
          grade: progress.grade
        };
      });

      setProgressStatuses(statusMap);
    } catch (error) {
      console.error('Error loading progress statuses:', error);
    }
  }, [elementId]);

  const updateProgressStatus = useCallback(async (studentId, newStatus, grade = null) => {
    try {
      setUpdatingProgress(prev => ({ ...prev, [studentId]: true }));

      const currentProgress = progressStatuses[studentId];

      if (currentProgress?.id) {
        // Update existing progress
        await authAxios.put(`${API_BASE}/progress/${currentProgress.id}`, {
          status: newStatus,
          grade: grade,
          elementId: elementId,
          studentId: studentId
        });
      } else {
        // Create new progress entry
        await authAxios.post(`${API_BASE}/progress`, {
          status: newStatus,
          grade: grade,
          elementId: elementId,
          studentId: studentId
        });
      }

      // Update local state
      setProgressStatuses(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          status: newStatus,
          grade: grade
        }
      }));

    } catch (error) {
      console.error('Error updating progress status:', error);
    } finally {
      setUpdatingProgress(prev => ({ ...prev, [studentId]: false }));
    }
  }, [elementId, progressStatuses]);

  return {
    progressStatuses,
    updatingProgress,
    loadProgressStatuses,
    updateProgressStatus
  };
};