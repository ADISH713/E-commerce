import MESSAGES from "../constants/messages";

const { VALIDATION } = MESSAGES;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (name) => {
    const value = name.trim();

    if (!value) return VALIDATION.NAME_REQUIRED;
    if (value.length < 2) return VALIDATION.NAME_MIN;

    return "";
};

export const validateEmail = (email) => {
    const value = email.trim();

    if (!value) return VALIDATION.EMAIL_REQUIRED;
    if (!EMAIL_REGEX.test(value)) return VALIDATION.EMAIL_INVALID;

    return "";
};

export const validatePassword = (password) => {
    if (!password) return VALIDATION.PASSWORD_REQUIRED;
    if (password.length < 6) return VALIDATION.PASSWORD_MIN;
    if (/^\d+$/.test(password)) return VALIDATION.PASSWORD_NUMBERS_ONLY;

    return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return VALIDATION.CONFIRM_PASSWORD_REQUIRED;
    if (password !== confirmPassword) return VALIDATION.PASSWORDS_MISMATCH;

    return "";
};

export const validateLoginForm = ({ email, password }) => ({
    email: validateEmail(email),
    password: password ? "" : VALIDATION.PASSWORD_REQUIRED,
});

export const validateRegisterForm = ({ name, email, password, cpassword }) => ({
    name: validateName(name),
    email: validateEmail(email),
    password: validatePassword(password),
    cpassword: validateConfirmPassword(password, cpassword),
});

export const hasErrors = (errors) =>
    Object.values(errors).some((message) => message !== "");