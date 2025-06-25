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
    Link,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DynamicFormField from '../components/common/DynamicFormField.js';

export default function Login() {
    const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const formConfig = {
        email: {
            type: "text",
            label: "Email",
            required: true,
            validator: (val) =>
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val.trim()),
            autoComplete: "email@gmail.com"
        },
        password: {
            type: "password",
            label: "Пароль",
            required: true,
            autoComplete: "current-password"
        },
    };

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: ""
    });

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

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
        if (field.required && !value) return "Это поле обязательно";
        if (field.validator && !field.validator(value)) {
            if (key === 'email') return "Пожалуйста, введите действительный адрес";
            return "Неверное значение";
        }
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            // Error is already handled in the useAuth hook
        }
    };

    return (
        <Container component="main" maxWidth="xs">
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
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Вход в аккаунт
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
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Stack spacing={2}>
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
                                    "Войти"
                                )}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                              <Link href="/register" variant="body2">
                                Нет аккаунта? Зарегистрируйтесь
                              </Link>
                            </Box>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
}