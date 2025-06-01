import ReusableAdminTable from './ReusableAdminTable';

export default function DisciplineAdminPage() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'abbreviation', headerName: 'Abbreviation', width: 150 },
  ];
  const emptyRow = { name: '', abbreviation: '' };
  return (
    <ReusableAdminTable
      title="Disciplines"
      columns={columns}
      endpoint="http://localhost:8080/api/discipline"
      emptyRow={emptyRow}
    />
  );
}
