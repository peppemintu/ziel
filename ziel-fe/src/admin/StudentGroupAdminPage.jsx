import ReusableAdminTable from './ReusableAdminTable';

export default function StudentGroupAdminPage() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'specialtyId', headerName: 'Specialty ID', width: 150 },
    { field: 'groupNumber', headerName: 'Group Number', width: 150 },
  ];
  const emptyRow = { specialtyId: '', groupNumber: '' };
  return (
    <ReusableAdminTable
      title="Student Groups"
      columns={columns}
      endpoint="http://localhost:8080/api/student-group"
      emptyRow={emptyRow}
    />
  );
}
