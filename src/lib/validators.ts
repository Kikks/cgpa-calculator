/* eslint-disable no-useless-escape */
export const isEmpty = (value?: string | number) =>
  !value || typeof value === 'undefined' || String(value).trim() === '';

export const isNumber = (value: any) => !Number.isNaN(Number(value));

export const isEmail = (string: string) => {
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (string.match(regex)) {
    return true;
  }

  return false;
};

export const isPhoneNumber = (value: string) => {
  if (value.startsWith('0')) {
    if (value.length !== 11) return false;

    return true;
  }

  return /^\d{13,}$/.test(value.replace(/[\s()+\-\.]|ext/gi, ''));
};

export const isValid = (errors: { [key: string]: string }) => {
  const errorsArray = Object.values(errors);

  for (let i = 0; i < errorsArray.length; i += 1) {
    if (!isEmpty(errorsArray[i])) {
      return false;
    }
  }

  return true;
};

export const validateLoginPayload = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const errors = {
    email: '',
    password: '',
  };

  if (isEmpty(email)) errors.email = 'Email cannot be empty';
  else if (!isEmail(email)) errors.email = 'Invalid email address';

  if (isEmpty(password)) errors.password = 'Password cannot be empty';

  return {
    valid: isValid(errors),
    errors,
  };
};

export const validateSignupPayload = ({
  firstName,
  lastName,
  email,
  school,
  password,
  confirmPassword,
  gradingSystem,
}: {
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  password: string;
  confirmPassword: string;
  gradingSystem: string;
}) => {
  const errors = {
    firstName: '',
    lastName: '',
    email: '',
    school: '',
    password: '',
    confirmPassword: '',
    gradingSystem: '',
  };

  if (isEmpty(firstName)) errors.firstName = 'First name cannot be empty';
  if (isEmpty(lastName)) errors.lastName = 'Last name cannot be empty';
  if (isEmpty(email)) errors.email = 'Email cannot be empty';
  else if (!isEmail(email)) errors.email = 'Invalid email address';
  if (isEmpty(school)) errors.school = 'School cannot be empty';
  if (isEmpty(password)) errors.password = 'Password cannot be empty';
  if (isEmpty(confirmPassword))
    errors.confirmPassword = 'Confirm password cannot be empty';
  else if (password !== confirmPassword)
    errors.confirmPassword = 'Passwords do not match';
  if (isEmpty(gradingSystem))
    errors.gradingSystem = 'Grading system cannot be empty';

  return {
    valid: isValid(errors),
    errors,
  };
};
