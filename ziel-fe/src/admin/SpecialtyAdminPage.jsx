import ReusableAdminTable from './ReusableAdminTable';

export default function SpecialtyAdminPage() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'code', headerName: 'Code', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'abbreviation', headerName: 'Abbreviation', width: 150 },
  ];
  const emptyRow = { code: '', name: '', abbreviation: '' };
  return (
    <ReusableAdminTable
      title="Specialties"
      columns={columns}
      endpoint="http://localhost:8080/api/specialty"
      emptyRow={emptyRow}
    />
  );
}
