import ReusableAdminTable from './ReusableAdminTable';

export default function TeacherAdminPage() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'userId', headerName: 'User ID', width: 150 },
    { field: 'title', headerName: 'Title', width: 150 },
  ];
  const emptyRow = { userId: '', title: '' };
  return (
    <ReusableAdminTable
      title="Teachers"
      columns={columns}
      endpoint="http://localhost:8080/api/teacher"
      emptyRow={emptyRow}
    />
  );
}
