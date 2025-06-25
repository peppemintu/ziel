import { useState, useEffect } from 'react';
import authAxios from '../../auth/utils/authFetch';
import { API_BASE } from '../utils/constants';

export const useElementData = (element, userRole, user) => {
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [progressStatuses, setProgressStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const [updatingProgress, setUpdatingProgress] = useState({});

  const loadElementData = async () => {
    if (!element?.id) return;

    try {
      setLoading(true);
      const response = await authAxios.get(`${API_BASE}/file/element/${element.id}`);
      const allFiles = response.data || [];

      const refFiles = allFiles.filter(file => file.uploadedByRole === 'TEACHER');
      const studentFiles = allFiles.filter(file => file.uploadedByRole === 'STUDENT');

      const submissionsByStudent = studentFiles.reduce((acc, file) => {
        const studentId = file.uploadedById;
        if (!acc[studentId]) {
          acc[studentId] = {
            studentId,
            studentEmail: file.uploadedByEmail,
            studentName: file.uploadedByEmail.split('@')[0],
            files: [],
            latestUpload: null,
            comment: ''
          };
        }

        acc[studentId].files.push({
          ...file,
          size: file.size || 0
        });

        if (
          !acc[studentId].latestUpload ||
          new Date(file.uploadedAt) > new Date(acc[studentId].latestUpload)
        ) {
          acc[studentId].latestUpload = file.uploadedAt;
        }

        return acc;
      }, {});

      setReferenceFiles(refFiles);
      setSubmissions(Object.values(submissionsByStudent));
    } catch (error) {
      console.error('Error loading element data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgressStatuses = async () => {
    if (!element?.id) return;

    try {
      const response = await authAxios.get(`${API_BASE}/progress/element/${element.id}`);
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
  };

  const updateProgressStatus = async (studentId, newStatus, grade = null) => {
    try {
      setUpdatingProgress(prev => ({ ...prev, [studentId]: true }));

      const currentProgress = progressStatuses[studentId];

      if (currentProgress?.id) {
        await authAxios.put(`${API_BASE}/progress/${currentProgress.id}`, {
          status: newStatus,
          grade: grade,
          elementId: element.id,
          studentId: studentId
        });
      } else {
        await authAxios.post(`${API_BASE}/progress`, {
          status: newStatus,
          grade: grade,
          elementId: element.id,
          studentId: studentId
        });
      }

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
  };

  useEffect(() => {
    if (element) {
      loadElementData();
      if (userRole === 'TEACHER') {
        loadProgressStatuses();
      }
    }
  }, [element]);

  return {
    referenceFiles,
    submissions,
    progressStatuses,
    loading,
    updatingProgress,
    loadElementData,
    updateProgressStatus
  };
};