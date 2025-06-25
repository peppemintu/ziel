import { useState } from 'react';
import authAxios from '../../auth/utils/authFetch';
import { API_BASE } from '../utils/constants';

export const useFileOperations = (element, user, onDataReload) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submissionComment, setSubmissionComment] = useState('');

  const uploadReferenceFile = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('elementId', element.id);
      formData.append('userId', user.id);
      formData.append('isReference', 'true');

      await authAxios.post(`${API_BASE}/file/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await onDataReload();
    } catch (error) {
      console.error('Error uploading reference file:', error);
    } finally {
      setUploading(false);
    }
  };

  const uploadSubmission = async (updateProgressCallback) => {
    if (selectedFiles.length === 0) return;

    try {
      setUploading(true);

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('elementId', element.id);
        formData.append('userId', user.id);
        formData.append('comment', submissionComment);
        formData.append('isSubmission', 'true');

        await authAxios.post(`${API_BASE}/file/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (updateProgressCallback) {
        await updateProgressCallback(user.id, 'IN_PROGRESS');
      }

      await onDataReload();
      setSelectedFiles([]);
      setSubmissionComment('');
    } catch (error) {
      console.error('Error uploading submission:', error);
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await authAxios.delete(`${API_BASE}/file/${fileId}`);
      await onDataReload();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await authAxios.get(`${API_BASE}/file/download/${fileId}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return {
    uploading,
    selectedFiles,
    setSelectedFiles,
    submissionComment,
    setSubmissionComment,
    uploadReferenceFile,
    uploadSubmission,
    deleteFile,
    downloadFile
  };
};