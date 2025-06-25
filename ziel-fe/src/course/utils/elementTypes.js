export const ELEMENT_TYPES = {
  LECTURE: 'LECTURE',
  LABWORK: 'LABWORK',
  PRACTICE: 'PRACTICE',
  ATTESTATION: 'ATTESTATION'
};

export const ELEMENT_TYPE_LABELS = {
  [ELEMENT_TYPES.LECTURE]: 'Лекция',
  [ELEMENT_TYPES.LABWORK]: 'Лабораторная',
  [ELEMENT_TYPES.PRACTICE]: 'Практик',
  [ELEMENT_TYPES.ATTESTATION]: 'Проверка знаний'
};

export const isSubmissionRequired = (elementType) => {
  return elementType === ELEMENT_TYPES.LABWORK || elementType === ELEMENT_TYPES.PRACTICE;
};

export const isAttestationType = (elementType) => {
  return elementType === ELEMENT_TYPES.ATTESTATION;
};