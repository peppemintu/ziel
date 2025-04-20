import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SuccessDialog() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate("/dashboard");
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          {"Success!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            The action was successful.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK!</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}