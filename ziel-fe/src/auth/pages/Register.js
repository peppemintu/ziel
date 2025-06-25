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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText
} from '@mui/material';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DynamicFormField from '../components/common/DynamicFormField';
import authAxios from '../utils/authFetch';

export default function Register() {
    const { register, isLoading, error } = useAuth();
    const navigate = useNavigate();
    const [specialties, setSpecialties] = useState([]);
    const [loadingSpecialties, setLoadingSpecialties] = useState(false);

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
            validator: (val) => val.length >= 8,
            helperText: "Must be at least 8 characters",
            autoComplete: "new-password"
        },
        confirmPassword: {
            type: "password",
            label: "Подтвердите пароль",
            required: true,
            validator: (val) => val === formData.password,
            helperText: "Passwords must match"
        },
        firstName: {
            type: "text",
            label: "Имя",
            required: true,
            autoComplete: "Иван"
        },
        lastName: {
            type: "text",
            label: "Фамилия",
            required: true,
            autoComplete: "Иванов"
        },
        patronymic: {
            type: "text",
            label: "Отчество",
            autoComplete: "Иванович"
        },
        role: {
            type: "select",
            label: "Роль",
            required: true,
            options: [
                { value: "STUDENT", label: "Студент" },
                { value: "TEACHER", label: "Преподаватель" },
            ],
        },
        groupNumber: {
            type: "text",
            label: "Номер группы",
            required: true,
            showIf: (formData) => formData.role === "STUDENT"
        }
    };

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        patronymic: "",
        role: "",
        specialtyId: "",
        groupNumber: ""
    });

    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        role: "",
        specialtyId: "",
        groupNumber: ""
    });

    useEffect(() => {
        const fetchSpecialties = async () => {
            setLoadingSpecialties(true);
            try {
                const response = await fetch('http://localhost:8080/api/specialty');
                if (response.ok) {
                    const data = await response.json();
                    setSpecialties(data);
                } else {
                    console.error('Failed to fetch specialties');
                }
            } catch (error) {
                console.error('Error fetching specialties:', error);
            } finally {
                setLoadingSpecialties(false);
            }
        };

        fetchSpecialties();
    }, []);

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

        if (field === 'role' && value !== 'STUDENT') {
            setFormData(prev => ({
                ...prev,
                specialtyId: "",
                groupNumber: ""
            }));
            setFieldErrors(prev => ({
                ...prev,
                specialtyId: "",
                groupNumber: ""
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        Object.keys(formConfig).forEach(key => {
            const field = formConfig[key];

            if (field.showIf && !field.showIf(formData)) return;

            const error = getValidationError(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });


        if (formData.role === "STUDENT") {
            if (!formData.specialtyId) {
                newErrors.specialtyId = "Specialty is required for students";
                isValid = false;
            }
            if (!formData.groupNumber.trim()) {
                newErrors.groupNumber = "Group number is required for students";
                isValid = false;
            }
        }

        setFieldErrors(newErrors);
        return isValid;
    };

    const getValidationError = (key, value) => {
        const field = formConfig[key];
        if (field.required && !value) return "This field is required";
        if (field.validator && !field.validator(value)) {
            if (key === 'email') return "Please enter a valid email address";
            if (key === 'password') return "Password must be at least 8 characters";
            if (key === 'confirmPassword') return "Passwords must match";
            return "Invalid value";
        }
        return "";
    };

    const createStudentEntry = async (userId) => {
        try {
             const { specialtyId, groupNumber } = formData;
             const parsedGroupNumber = parseInt(groupNumber.trim());


             const allGroupsResponse = await authAxios.get('http://localhost:8080/api/student-group');
             const allGroups = allGroupsResponse.data;


             let existingGroup = allGroups.find(
                 group =>
                     group.specialtyId === specialtyId &&
                     group.groupNumber === parsedGroupNumber
             );

             let groupId;

             if (existingGroup) {

                 groupId = existingGroup.id;
             } else {

                 const groupData = {
                     specialtyId,
                     groupNumber: parsedGroupNumber
                 };

                 const groupResponse = await authAxios.post('http://localhost:8080/api/student-group', groupData);
                 groupId = groupResponse.data.id;
             }

             const studentData = {
                userId,
                groupId
             };

             const studentResponse = await authAxios.post('http://localhost:8080/api/student', studentData);
             if (!studentResponse.ok) {
                throw new Error('Failed to create student entry');
             }
             return studentResponse.data;
        } catch (error) {
            console.error('Error creating student entry:', error);
            throw error;
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        try {

            const registrationResult = await register(formData);
            console.log(registrationResult);


            if (formData.role === "STUDENT" && formData.specialtyId && formData.groupNumber.trim()) {
                try {
                    await createStudentEntry(registrationResult.userId || registrationResult.id);
                } catch (studentError) {

                    console.error('Failed to create student entry:', studentError);

                }
            }

            navigate('/');
        } catch (err) {
            // Error is already handled in the useAuth hook
        }
    };

    const renderSpecialtyField = () => {
        if (formData.role !== "STUDENT") return null;

        return (
            <FormControl fullWidth error={!!fieldErrors.specialtyId}>
                <InputLabel id="specialty-label">Специальность</InputLabel>
                <Select
                    labelId="specialty-label"
                    id="specialtyId"
                    name="specialtyId"
                    value={formData.specialtyId}
                    label="Специальность"
                    onChange={(e) => handleFieldChange('specialtyId', e.target.value)}
                    disabled={loadingSpecialties}
                >
                    <MenuItem value="" disabled>
                        {loadingSpecialties ? "Загрузка..." : "Выберите специальность"}
                    </MenuItem>
                    {specialties.map(specialty => (
                        <MenuItem key={specialty.id} value={specialty.id}>
                            {specialty.name}
                        </MenuItem>
                    ))}
                </Select>
                {fieldErrors.specialtyId && (
                    <FormHelperText>{fieldErrors.specialtyId}</FormHelperText>
                )}
            </FormControl>
        );
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
                    Регистрация
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
                            {Object.keys(formConfig).map((key) => {
                                const field = formConfig[key];

                                if (field.showIf && !field.showIf(formData)) return null;

                                return (
                                    <DynamicFormField
                                        key={key}
                                        id={key}
                                        config={field}
                                        value={formData[key]}
                                        onChange={handleFieldChange}
                                        error={fieldErrors[key]}
                                    />
                                );
                            })}

                            {/* Specialty field for students */}
                            {renderSpecialtyField()}

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
                                    "Зарегистрироваться"
                                )}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Link href="/login" variant="body2">
                                    Уже есть аккаунт? Войдите
                                </Link>
                            </Box>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
}