import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState("");
  const [empty, setEmpty] = useState(false);

  function handleInputChange(event) {
      setEmail(event.target.value);
  }

  function handleSubmit(event) {
      event.preventDefault();

      if (email.trim() === "") {
        setEmpty(true);
      }
    }

  return (
    <Box sx={{p: 10}}>
    <form onSubmit={handleSubmit}>
      <Paper elevation={2}>
        <div>
          <TextField
            sx={{margin: 2}}
            label="e-mail"
            variant="outlined"
            margin="normal"
            helperText={empty ? "Cannot be empty." : ""}
            autoFocus
            onChange={handleInputChange}
            error={empty}
          />
        </div>
        <div>
          <TextField
            sx={{margin: 2}}
            label="password"
            variant="outlined"
            margin="normal"
            name="password"
          />
        </div>
        <div>
          <Button
            variant="contained"
            sx={{margin: 2}}
            type="submit"
          >
            Register
          </Button>
        </div>
      </Paper>
    </form>
    </Box>
  );
}