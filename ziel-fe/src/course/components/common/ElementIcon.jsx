import React from 'react';
import {
  School as LectureIcon,
  Science as LabIcon,
  Assignment as PracticeIcon,
  Quiz as AttestationIcon
} from '@mui/icons-material';

const ElementIcon = ({ type }) => {
  const icons = {
    LECTURE: LectureIcon,
    LABWORK: LabIcon,
    PRACTICE: PracticeIcon,
    ATTESTATION: AttestationIcon
  };

  const Icon = icons[type] || LectureIcon;
  return <Icon />;
};

export default ElementIcon;