import {
    Button,
    CircularProgress,
    Paper,
    Stack,
    Typography,
    Container,
    Box,
    CssBaseline,
    Avatar,
    Alert,
    Link
} from '@mui/material';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DynamicFormField from '../components/common/DynamicFormField';

export default function Register() {
    const { register, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const formConfig = {
        email: {
            type: "text",
            label: "Email Address",
            required: true,
            validator: (val) =>
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val.trim()),
            autoComplete: "email"
        },
        password: {
            type: "password",
            label: "Password",
            required: true,
            validator: (val) => val.length >= 8,
            helperText: "Must be at least 8 characters",
            autoComplete: "new-password"
        },
        confirmPassword: {
            type: "password",
            label: "Confirm Password",
            required: true,
            validator: (val) => val === formData.password,
            helperText: "Passwords must match"
        },
        firstName: {
            type: "text",
            label: "First Name",
            required: true,
            autoComplete: "given-name"
        },
        lastName: {
            type: "text",
            label: "Last Name",
            required: true,
            autoComplete: "family-name"
        },
        patronymic: {
            type: "text",
            label: "Patronymic",
            autoComplete: "additional-name"
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
        firstName: "",
        lastName: "",
        patronymic: "",
        role: "",
    });

    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: ""
    });

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user types
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        Object.keys(formConfig).forEach(key => {
            const error = getValidationError(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setFieldErrors(newErrors);
        return isValid;
    };

    const getValidationError = (key, value) => {
        const field = formConfig[key];
        if (field.required && !value) return "This field is required";
        if (field.validator && !field.validator(value)) {
            if (key === 'email') return "Please enter a valid email address";
            if (key === 'password') return "Password must be at least 8 characters";
            return "Invalid value";
        }
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        try {
            await register(formData);
            navigate('/login'); // Redirect to login after successful registration
        } catch (err) {
            // Error is already handled in the useAuth hook
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: '#ADCC7F' }}>
                    <HowToRegOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create an account
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1, width: '100%' }}
                >
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Stack spacing={3}>
                            {Object.keys(formConfig).map((key) => (
                                <DynamicFormField
                                    key={key}
                                    id={key}
                                    config={formConfig[key]}
                                    value={formData[key]}
                                    onChange={handleFieldChange}
                                    error={fieldErrors[key]}
                                />
                            ))}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, py: 1.5 }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Box>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
}