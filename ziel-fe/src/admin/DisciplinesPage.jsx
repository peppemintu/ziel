import React from 'react';
import AdminTable from '../components/AdminTable';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'abbreviation', headerName: 'Abbreviation', flex: 1 },
];

const emptyRow = { name: '', abbreviation: '' };

export default function DisciplinesPage() {
  return (
    <AdminTable
      title="Disciplines"
      endpoint="/api/discipline"
      columns={columns}
      emptyRow={emptyRow}
    />
  );
}
