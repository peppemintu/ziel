import ReusableAdminTable from './ReusableAdminTable';

export default function StudentAdminPage() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'groupId', headerName: 'Group ID', width: 150 },
    { field: 'userId', headerName: 'User ID', width: 150 },
  ];
  const emptyRow = { groupId: '', userId: '' };
  return (
    <ReusableAdminTable
      title="Students"
      columns={columns}
      endpoint="http://localhost:8080/api/student"
      emptyRow={emptyRow}
    />
  );
}
