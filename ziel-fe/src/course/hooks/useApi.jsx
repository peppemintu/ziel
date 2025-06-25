import { useState, useCallback } from 'react';
import authAxios from '../../auth/utils/authFetch';
import { API_BASE } from '../utils/constants';
import { useAuth } from '../../auth/hooks/useAuth';

const useApi = (courseId, userRole) => {
  const { user } = useAuth();

  const [data, setData] = useState({
    course: null,
    studyPlan: null,
    elements: [],
    relationships: [],
    progress: []
  });

  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const courseRes = await authAxios.get(`${API_BASE}/course/${courseId}`);
      const courseData = courseRes.data;

      const fetchPromises = [
        authAxios.get(`${API_BASE}/element/course/${courseId}`),
        authAxios.get(`${API_BASE}/relationship/course/${courseId}`)
      ];

      if (courseData.studyPlanId) {
        fetchPromises.push(authAxios.get(`${API_BASE}/plan/${courseData.studyPlanId}`));
      }

      if (userRole === 'STUDENT') {
        fetchPromises.push(authAxios.get(`${API_BASE}/progress?courseId=${courseId}&studentId=${user?.id}`));
      }

      const responses = await Promise.all(fetchPromises);

      const elementsData = responses[0].data;
      const relationshipsData = responses[1].data;
      let studyPlanData = null;
      let progressData = [];

      if (courseData.studyPlanId && responses[2]) {
        studyPlanData = responses[2].data;
      }

      if (userRole === 'STUDENT') {
        const progressResponseIndex = courseData.studyPlanId ? 3 : 2;
        if (responses[progressResponseIndex]) {
          progressData = responses[progressResponseIndex].data;
        }
      }

      const elementsWithProgress = elementsData.map(element => {
        const elementProgress = progressData.find(p => p.elementId === element.id);
        return {
          ...element,
          progressStatus: elementProgress?.status || 'NOT_STARTED',
          grade: elementProgress?.grade || null
        };
      });

      setData({
        course: courseData,
        studyPlan: studyPlanData,
        elements: elementsWithProgress,
        relationships: relationshipsData,
        progress: progressData
      });
    } catch (error) {
      console.error('Error fetching course data:', error);
      showSnackbar('Error loading course data', 'error');
    } finally {
      setLoading(false);
    }
  }, [courseId, userRole, user?.id]);

  const apiCall = async (url, options = {}) => {
    try {
      const response = await authAxios({
        url: `${API_BASE}${url}`,
        ...options,
        headers: {
          ...(options.headers || {}),
          // Only add content-type if it's not FormData (browser handles that)
          ...(options.data instanceof FormData ? {} : { 'Content-Type': 'application/json' })
        }
      });

      if (response.status >= 200 && response.status < 300) {
        fetchData();
        return true;
      }

      return false;
    } catch (error) {
      console.error('API call error:', error);
      return false;
    }
  };

  const handleElementAdd = async (formData) => {
    const success = await apiCall('/element', {
      method: 'POST',
      data: { ...formData, courseId: parseInt(courseId) }
    });
    showSnackbar(success ? 'Element added successfully' : 'Error adding element', success ? 'success' : 'error');
  };

  const handleElementEdit = async (updatedElement) => {
    const success = await apiCall(`/element/${updatedElement.id}`, {
      method: 'PUT',
      data: updatedElement
    });
    showSnackbar(success ? 'Element updated successfully' : 'Error updating element', success ? 'success' : 'error');
  };

  const handleElementDelete = async (elementId) => {
    const success = await apiCall(`/element/${elementId}`, { method: 'DELETE' });
    showSnackbar(success ? 'Element deleted successfully' : 'Error deleting element', success ? 'success' : 'error');
  };

  const handleFileUpload = async (elementId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('elementId', elementId);
    formData.append('userId', user?.id);

    const success = await apiCall('/file/upload', {
      method: 'POST',
      data: formData
    });

    showSnackbar(success ? 'File uploaded successfully' : 'Error uploading file', success ? 'success' : 'error');
  };

  const handleConnectionCreate = async (sourceElementId, targetElementId) => {
    const success = await apiCall('/relationship', {
      method: 'POST',
      data: { sourceElementId, targetElementId, courseId: parseInt(courseId) }
    });
    showSnackbar(success ? 'Connection created successfully' : 'Error creating connection', success ? 'success' : 'error');
  };

  const handleRelationshipUpdate = async (parentElementId, childElementId) => {
    try {
      const existingRelationships = data.relationships.filter(rel => rel.targetElementId === childElementId);

      for (const rel of existingRelationships) {
        await authAxios.delete(`${API_BASE}/relationship/${rel.id}`);
      }

      const success = await apiCall('/relationship', {
        method: 'POST',
        data: {
          sourceElementId: parentElementId,
          targetElementId: childElementId,
          courseId: parseInt(courseId)
        }
      });

      showSnackbar(success ? 'Element hierarchy updated successfully' : 'Error updating element hierarchy', success ? 'success' : 'error');
    } catch (error) {
      console.error('Error updating relationship:', error);
      showSnackbar('Error updating element hierarchy', 'error');
    }
  };

  return {
    data,
    loading,
    snackbar,
    showSnackbar,
    setSnackbar,
    fetchData,
    handleElementAdd,
    handleElementEdit,
    handleElementDelete,
    handleFileUpload,
    handleConnectionCreate,
    handleRelationshipUpdate
  };
};

export default useApi;
