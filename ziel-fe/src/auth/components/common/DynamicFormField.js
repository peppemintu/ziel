import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';

export default function DynamicFormField({ id, config, value, onChange, error }) {
  if (config.type === "select") {
    return (
      <FormControl required={config.required} sx={{ m: 2, minWidth: 200 }}>
        <InputLabel id={`${id}-label`}>{config.label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          value={value}
          label={`${config.label} ${config.required ? "*" : ""}`}
          onChange={(e) => onChange(id, e.target.value)}
        >
          {config.options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      sx={{ margin: 2 }}
      label={config.label}
      type={config.type}
      required={config.required}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      error={!!error}
      helperText={error}
    />
  );
}
