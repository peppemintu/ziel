import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
} from '@mui/material';

import { useState } from 'react';

import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      name: "",
      surname: "",
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
            console.log(formData.role);

            axios.post("http://localhost:8080/api/auth/register", formData)
              .then((res) => {
                console.log("✅ Success:", res.data);
              })
              .catch((error) => {
                if (error.response) {
                  console.error("❌ Backend returned an error response:", error.response);
                } else if (error.request) {
                  console.error("❌ No response received:", error.request);
                } else {
                  console.error("❌ Axios error:", error.message);
                }
              });
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
                    label="name"
                    variant="outlined"
                    margin="normal"
                    name="name"
                    onChange={handleChange("name")}
                />
                <TextField
                    sx={{margin: 2}}
                    label="surname"
                    variant="outlined"
                    margin="normal"
                    name="surname"
                    onChange={handleChange("surname")}
                />
                <FormControl required sx={{ m: 2, minWidth: 200 }}>
                    <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            value={formData.role}
                            label="role *"
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