export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Байт', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const separateFiles = (allFiles) => {
  const refFiles = allFiles.filter(file =>
    file.uploadedByRole === 'TEACHER'
  );

  const studentFiles = allFiles.filter(file =>
    file.uploadedByRole === 'STUDENT'
  );

  const submissionsByStudent = studentFiles.reduce((acc, file) => {
    const studentId = file.uploadedById;
    if (!acc[studentId]) {
      acc[studentId] = {
        studentId,
        studentEmail: file.uploadedByEmail,
        studentName: file.uploadedByEmail.split('@')[0], // Extract name from email as fallback
        files: [],
        latestUpload: null,
        comment: '' // You might need to store this separately or get from file metadata
      };
    }

    acc[studentId].files.push({
      ...file,
      size: file.size || 0 // Add default size if missing from backend
    });

    if (
      !acc[studentId].latestUpload ||
      new Date(file.uploadedAt) > new Date(acc[studentId].latestUpload)
    ) {
      acc[studentId].latestUpload = file.uploadedAt;
    }

    return acc;
  }, {});

  return {
    referenceFiles: refFiles,
    submissions: Object.values(submissionsByStudent)
  };
};