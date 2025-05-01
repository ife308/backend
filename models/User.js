const Joi = require('joi');

const signupSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.empty': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required',
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
});

  const validateResetPassword = Joi.object({
    token: Joi.string().required().messages({
        'string.empty': 'Token is required.',
        'any.required': 'Token is required.',
    }),
    newPassword: Joi.string().min(8).max(30).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')).required().messages({
        'string.empty': 'New password is required.',
        'string.min': 'New password must be at least 8 characters long.',
        'string.max': 'New password cannot exceed 30 characters.',
        'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        'any.required': 'New password is required.',
    }),
});


const validateAddAdmin = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.base': 'Name must be a string.',
        'string.empty': 'Name cannot be empty.',
        'string.min': 'Name must be at least 3 characters.',
        'string.max': 'Name cannot exceed 50 characters.',
        'any.required': 'Name is required.',
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Email must be a valid email address.',
        'string.empty': 'Email cannot be empty.',
        'any.required': 'Email is required.',
    }),
});



const validateEditUser = Joi.object({
    name: Joi.string().min(3).max(50).optional().messages({
        'string.base': 'Name must be a string.',
        'string.empty': 'Name cannot be empty.',
        'string.min': 'Name must be at least 3 characters.',
        'string.max': 'Name cannot exceed 50 characters.',
    }),
    email: Joi.string().email().optional().messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Email must be a valid email address.',
        'string.empty': 'Email cannot be empty.',
    }),
    password: Joi.string().min(6).optional().messages({
        'string.base': 'Password must be a string.',
        'string.empty': 'Password cannot be empty.',
        'string.min': 'Password must be at least 6 characters.',
    }),
    imageUrl: Joi.string().optional().allow(null).messages({
            'string.base': 'File path must be a string.',
            'string.empty': 'No file uploaded.',
        }),
        
}).or('name', 'email', 'password', 'imageUrl').messages({
        'object.missing': 'At least one field (name, email, password or image) must be provided for an update.',
    });


const validateContact = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'Name is required.',
        'string.min': 'Name must be at least 2 characters long.',
        'string.max': 'Name cannot exceed 100 characters.',
        'any.required': 'Name is required.',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address.',
        'string.empty': 'Email is required.',
        'any.required': 'Email is required.',
    }),
    phone: Joi.string().pattern(/^\+?[0-9]{7,15}$/).required().messages({
        'string.empty': 'Phone number is required.',
        'string.pattern.base': 'Phone number must be valid and between 7 to 15 digits.',
        'any.required': 'Phone number is required.',
    }),
    subject: Joi.string().min(3).max(200).required().messages({
        'string.empty': 'Subject is required.',
        'string.min': 'Subject must be at least 3 characters long.',
        'string.max': 'Subject cannot exceed 200 characters.',
        'any.required': 'Subject is required.',
    }),
    message: Joi.string().min(10).max(2000).required().messages({
        'string.empty': 'Message is required.',
        'string.min': 'Message must be at least 10 characters long.',
        'string.max': 'Message cannot exceed 2000 characters.',
        'any.required': 'Message is required.',
    }),
});

const validateSubject = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Subject name is required.',
        'string.min': 'Subject name must be at least 3 characters long.',
        'string.max': 'Subject name cannot exceed 100 characters.',
        'any.required': 'Subject name is required.',
    }),
});

const validateEvent = Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
        'string.empty': 'Title is required.',
        'string.min': 'Title must be at least 3 characters long.',
        'string.max': 'Title cannot exceed 200 characters.',
        'any.required': 'Title is required.',
    }),
    description: Joi.string().min(10).required().messages({
        'string.empty': 'Description is required.',
        'string.min': 'Description must be at least 10 characters long.',
        'any.required': 'Description is required.',
    }),
    start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/).required().messages({
        'string.empty': 'Start time is required.',
        'string.pattern.base': 'Start time must be in HH:mm format (24-hour).',
        'any.required': 'Start time is required.',
    }),
    end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/).required().messages({
        'string.empty': 'End time is required.',
        'string.pattern.base': 'End time must be in HH:mm format (24-hour).',
        'any.required': 'End time is required.',
    }),
    date: Joi.date().iso().required().messages({
        'date.base': 'Date must be a valid date.',
        'any.required': 'Date is required.',
    }),
    location: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Location is required.',
        'string.min': 'Location must be at least 3 characters long.',
        'string.max': 'Location cannot exceed 100 characters.',
        'any.required': 'Location is required.',
    }),
    image: Joi.string().required().messages({
        'string.empty': 'Image path is required.',
        'any.required': 'Image path is required.',
    }),
});

const validateEditEvent = Joi.object({
    title: Joi.string().min(3).max(200).optional().messages({
        'string.min': 'Title must be at least 3 characters long.',
        'string.max': 'Title cannot exceed 200 characters.',
    }),
    description: Joi.string().min(10).optional().messages({
        'string.min': 'Description must be at least 10 characters long.',
    }),
    start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/).optional().messages({
        'string.pattern.base': 'Start time must be in HH:mm format (24-hour).',
    }),
    end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/).optional().messages({
        'string.pattern.base': 'End time must be in HH:mm format (24-hour).',
    }),
    date: Joi.date().iso().optional().messages({
        'date.base': 'Date must be a valid date.',
    }),
    location: Joi.string().min(3).max(100).optional().messages({
        'string.min': 'Location must be at least 3 characters long.',
        'string.max': 'Location cannot exceed 100 characters.',
    }),
    image: Joi.string().optional().allow(null).messages({
        'string.empty': 'Image path is required.',
        'any.required': 'Image path is required.',
    }),
}).or('title','description','start_time','end_time', 'date', 'location', 'image').messages({
    'object.missing': 'At least one field (Title, Description, Start time, End time, Date, Location, or Image) must be provided for an update.',
});

const validateAddPrompt = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Name is required.',
        'string.min': 'Name must be at least 3 characters long.',
        'string.max': 'Name cannot exceed 100 characters.',
        'any.required': 'Name is required.',
    }),
    description: Joi.string().min(10).required().messages({
        'string.empty': 'Description is required.',
        'string.min': 'Description must be at least 10 characters long.',
        'any.required': 'Description is required.',
    }),
    subject_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Subject ID must be a number.',
        'number.positive': 'Subject ID must be a positive integer.',
        'any.required': 'Subject ID is required.',
    }),
    grade_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Grade ID must be a number.',
        'number.positive': 'Grade ID must be a positive integer.',
        'any.required': 'Grade is required.',
    }),
});


const validateAdminAddPrompt = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Name is required.',
        'string.min': 'Name must be at least 3 characters long.',
        'string.max': 'Name cannot exceed 100 characters.',
        'any.required': 'Name is required.',
    }),
    description: Joi.string().min(10).optional().messages({
        'string.empty': 'Description is required.',
        'string.min': 'Description must be at least 10 characters long.',
        'any.required': 'Description is required.',
    }),
    subject_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Subject ID must be a number.',
        'number.positive': 'Subject ID must be a positive integer.',
        'any.required': 'Subject ID is required.',
    }),
    grade_id: Joi.number().integer().positive().required().messages({
        'number.base': 'Grade ID must be a number.',
        'number.positive': 'Grade ID must be a positive integer.',
        'any.required': 'Grade is required.',
    }),
});


const validateEditPrompt = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
        'string.empty': 'Name is required.',
        'string.min': 'Name must be at least 3 characters long.',
        'string.max': 'Name cannot exceed 100 characters.',
        'any.required': 'Name is required.',
    }),
    description: Joi.string().min(10).optional().messages({
        'string.empty': 'Description is required.',
        'string.min': 'Description must be at least 10 characters long.',
        'any.required': 'Description is required.',
    }),
}).or('name', 'description').messages({
    'object.missing': 'At least one field (name or description) must be provided for an update.',
});


const validateFilterPrompt = Joi.object({
        subject_id: Joi.number().integer().positive().required().messages({
            'number.base': 'Subject ID must be a number.',
            'number.positive': 'Subject ID must be a positive integer.',
            'any.required': 'Subject is required.',
        }),
        grade_id: Joi.number().integer().positive().required().messages({
            'number.base': 'Grade ID must be a number.',
            'number.positive': 'Grade ID must be a positive integer.',
            'any.required': 'Grade is required.',
        }),
    });




const validateNews = Joi.object({
    author: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Author is required.',
        'string.min': 'Author must be at least 3 characters long.',
        'string.max': 'Author cannot exceed 100 characters.',
        'any.required': 'Author is required.',
    }),
    title: Joi.string().min(5).max(200).required().messages({
        'string.empty': 'Title is required.',
        'string.min': 'Title must be at least 5 characters long.',
        'string.max': 'Title cannot exceed 200 characters.',
        'any.required': 'Title is required.',
    }),
    description: Joi.string().min(10).required().messages({
        'string.empty': 'Description is required.',
        'string.min': 'Description must be at least 10 characters long.',
        'any.required': 'Description is required.',
    }),
    image: Joi.string().required().messages({
        'string.empty': 'Image path is required.',
        'any.required': 'Image path is required.',
    }),
});

const validateEditNews = Joi.object({
    author: Joi.string().min(3).max(100).optional().messages({
        'string.empty': 'Author is required.',
        'string.min': 'Author must be at least 3 characters long.',
        'string.max': 'Author cannot exceed 100 characters.',
    }),
    title: Joi.string().min(5).max(200).optional().messages({
        'string.empty': 'Title is required.',
        'string.min': 'Title must be at least 5 characters long.',
        'string.max': 'Title cannot exceed 200 characters.',
    }),
    description: Joi.string().min(10).optional().messages({
        'string.empty': 'Description is required.',
        'string.min': 'Description must be at least 10 characters long.',
    }),
    image: Joi.string().optional().allow(null).messages({
        'string.empty': 'Image path is required.',
    }),
}).or('author', 'title', 'description', 'image').messages({
    'object.missing': 'At least one field (author, title, description or image) must be provided for an update.',
});


const validateAiTool = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Name is required.',
        'string.min': 'Name must be at least 3 characters long.',
        'string.max': 'Name cannot exceed 100 characters.',
        'any.required': 'Name is required.',
    }),
    description: Joi.string().min(10).required().messages({
        'string.empty': 'Description is required.',
        'string.min': 'Description must be at least 10 characters long.',
        'any.required': 'Description is required.',
    }),
    url: Joi.string().uri().required().messages({
        'string.empty': 'URL is required.',
        'string.uri': 'URL must be a valid URL.',
        'any.required': 'URL is required.',
    }),
    image: Joi.string().required().messages({
        'string.empty': 'Image path is required.',
        'any.required': 'Image path is required.',
    }),
});


const validateEditAiTool = Joi.object({
    name: Joi.string().min(3).max(100).optional().messages({
        'string.empty': 'Name is required.',
        'string.min': 'Name must be at least 3 characters long.',
        'string.max': 'Name cannot exceed 100 characters.',
    }),
    description: Joi.string().min(10).optional().messages({
        'string.empty': 'Description is required.',
        'any.required': 'Description is required.',
    }),
    url: Joi.string().uri().optional().messages({
        'string.empty': 'URL is required.',
        'string.uri': 'URL must be a valid URL.',
    }),
    image: Joi.string().optional().allow(null).messages({
        'string.empty': 'Image path is required.',
    }),
}).or('name', 'description', 'url', 'image').messages({
    'object.missing': 'At least one field (name, description, url or image) must be provided for an update.',});




const validateTeamMember = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Name is required.',
        'string.min': 'Name must be at least 3 characters long.',
        'string.max': 'Name cannot exceed 100 characters.',
        'any.required': 'Name is required.',
    }),
    role: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Role is required.',
        'string.min': 'Role must be at least 3 characters long.',
        'string.max': 'Role cannot exceed 100 characters.',
        'any.required': 'Role is required.',
    }),
    image: Joi.string().required().messages({
        'string.empty': 'Image path is required.',
        'any.required': 'Image path is required.',
    }),
});



const validateGrade = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.empty': 'Grade name is required.',
        'string.min': 'Grade name must be at least 2 characters long.',
        'string.max': 'Grade name cannot exceed 50 characters.',
        'any.required': 'Grade name is required.',
    }),
});

const validateForgotPassword = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required.',
        'string.email': 'Email must be a valid email address.',
        'any.required': 'Email is required.',
    }),
});




const validateSignup = (data) => {
    const { error } = signupSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};


const ValidateLogin = (data) => {
    const { error } = loginSchema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const AddadminValidator = (data) => {
    const { error } = validateAddAdmin.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const EditUserValidator = (data) => {
    const { error } = validateEditUser.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};


const ContactValidator = (data) => {
    const { error } = validateContact.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};


const SubjectValidator = (data) => {
    const { error } = validateSubject.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};


const EventValidator = (data) => {
    const { error } = validateEvent.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const EditEventValidator = (data) => {
    const { error } = validateEditEvent.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};


const NewsValidator = (data) => {
    const { error } = validateNews.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const NewsEditValidator = (data) => {
    const { error } = validateEditNews.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const AiToolValidator = (data) => {
    const { error } = validateAiTool.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const EditAiToolValidator = (data) => {
    const { error } = validateEditAiTool.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};


const TeamValidator = (data) => {
    const { error } = validateTeamMember.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const ForgotPasswordValidator = (data) => {
    const { error } = validateForgotPassword.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const ResetPasswordValidator = (data) => {
    const { error } = validateResetPassword.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const GradeValidator = (data) => {
    const { error } = validateGrade.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const AddPromptValidator = (data) => {
    const { error } = validateAddPrompt.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const AdminAddPromptValidator = (data) => {
    const { error } = validateAdminAddPrompt.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const EditPromptValidator = (data) => {
    const { error } = validateEditPrompt.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};

const filterPromptValidator = (data) => {
    const { error } = validateFilterPrompt.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        return { isValid: false, errors };
    }
    return { isValid: true };
};



module.exports = { validateSignup, ValidateLogin, AddadminValidator, EditUserValidator, ContactValidator, SubjectValidator, EventValidator, NewsValidator, EditEventValidator, NewsEditValidator, AiToolValidator, EditAiToolValidator, TeamValidator, ForgotPasswordValidator, ResetPasswordValidator, GradeValidator, AddPromptValidator, EditPromptValidator, filterPromptValidator, AdminAddPromptValidator };
