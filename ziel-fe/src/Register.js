import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from '@mui/material';

import { useState } from 'react';

export default function Register() {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      username: "",
      role: "",
    });

    const [invalid, setInvalid] = useState(false);
    const isValidEmail = (email) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim());

    const handleChange = (fieldName) => (event) => {
        setFormData({
            ...formData,
            [fieldName]: event.target.value,
        });
    }


    function handleSubmit(event) {
        event.preventDefault();

        if (isValidEmail(formData.email)) {
            setInvalid(false);
            console.log(formData.email);
            console.log(formData.password);
            console.log(formData.username);
            console.log(formData.role);
        } else {
            setInvalid(true);
        }
    }

  return (
    <form onSubmit={handleSubmit}>
    <Paper elevation={2} sx={{ m: 10, p: 5 }}>
      <Stack spacing={2}>
          <TextField
            sx={{margin: 2}}
            label="e-mail"
            variant="outlined"
            margin="normal"
            helperText={invalid ? "Invalid email." : ""}
            autoFocus
            onChange={handleChange("email")}
            error={invalid}
            required
          />
          <TextField
            name="password"
            sx={{margin: 2}}
            label="password"
            variant="outlined"
            margin="normal"
            onChange={handleChange("password")}
            required
          />
          <TextField
              sx={{margin: 2}}
              label="username"
              variant="outlined"
              margin="normal"
              name="username"
              onChange={handleChange("username")}
          />
        <FormControl required sx={{ m: 2, minWidth: 200 }}>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            value={formData.role}
            label="Role *"
            onChange={handleChange("role")}
          >
            <MenuItem value={"STUDENT"}>Student</MenuItem>
            <MenuItem value={"TEACHER"}>Teacher</MenuItem>
            <MenuItem value={"ADMIN"}>Admin</MenuItem>
          </Select>
        </FormControl>
          <Button
            variant="contained"
            sx={{margin: 2}}
            type="submit"
          >
            Register
          </Button>
      </Stack>
      </Paper>
    </form>
  );
}