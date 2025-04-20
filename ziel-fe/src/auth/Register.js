import {
    Button,
    CircularProgress,
    Paper,
    Stack,
} from '@mui/material';

import { useState } from 'react';
import axios from 'axios';
import SuccessDialog from './SuccessDialog.js';
import DynamicFormField from './DynamicFormField.js'

export default function Register() {
    const formConfig = {
      email: {
        type: "text",
        label: "e-mail",
        required: true,
        validator: (val) =>
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val.trim()),
      },
      password: {
        type: "password",
        label: "Password",
        required: true,
      },
      name: {
        type: "text",
        label: "Name",
      },
      surname: {
        type: "text",
        label: "Surname",
      },
      role: {
        type: "select",
        label: "Role",
        required: true,
        options: [
          { value: "STUDENT", label: "Student" },
          { value: "TEACHER", label: "Teacher" },
          { value: "ADMIN", label: "Admin" },
        ],
      },
    };


    const [formData, setFormData] = useState({
      email: "",
      password: "",
      name: "",
      surname: "",
      role: "",
    });

    const isValidEmail = (email) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim());

    const handleFieldChange = (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const getValidationError = (key, value) => {
      const field = formConfig[key];
      if (field.required && !value) return "This field is required.";
      if (field.validator && !field.validator(value)) return "Invalid value.";
      return "";
    };


    const [formSubmitStatus, setFormSubmitStatus] = useState("notSubmitted");

    function handleSubmit(event) {
        event.preventDefault();

        if (isValidEmail(formData.email)) {

            setFormSubmitStatus("loading");

            axios.post("http://localhost:8080/api/auth/register", formData)
              .then((res) => {
                console.log("✅ Success:", res.data);
                setFormSubmitStatus("submitted");

                setFormData({
                  email: "",
                  password: "",
                  name: "",
                  surname: "",
                  role: "",
                });

              })
              .catch((error) => {
                setFormSubmitStatus("notSubmitted");
                if (error.response) {
                  console.error("❌ Backend returned an error response:", error.response);
                } else if (error.request) {
                  console.error("❌ No response received:", error.request);
                } else {
                  console.error("❌ Axios error:", error.message);
                }
              });


        }
    }

    const RegisterForm = (
    <form onSubmit={handleSubmit}>
          <Paper elevation={2} sx={{ m: 10, p: 5 }}>
            <Stack spacing={2}>
              {Object.keys(formConfig).map((key) => (
                <DynamicFormField
                  key={key}
                  id={key}
                  config={formConfig[key]}
                  value={formData[key]}
                  onChange={handleFieldChange}
                  error={getValidationError(key, formData[key])}
                />
              ))}

              <Button
                variant="contained"
                sx={{ margin: 2 }}
                type="submit"
              >
                Register
              </Button>
            </Stack>
          </Paper>
        </form>
    );

  return (
    <div>
      {formSubmitStatus === 'notSubmitted' && RegisterForm}
      {formSubmitStatus === 'loading' && <CircularProgress />}
      {formSubmitStatus === 'submitted' && (
        <SuccessDialog/>
      )}
    </div>
  );
}