import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  rememberMe: Yup.boolean(),
});

export const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required('First name is required'),
  lastName: Yup.string()
    .trim()
    .required('Last name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password must contain 1 uppercase, 1 lowercase, and 1 number/special character',
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export const resetPasswordSchema = Yup.object().shape({
  token: Yup.string().required('Reset token is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password must contain 1 uppercase, 1 lowercase, and 1 number/special character',
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const tripSchema = Yup.object().shape({
  name: Yup.string().trim().required('Trip name is required'),
  destination: Yup.string().trim().required('Destination is required'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End date is required'),
  numberOfTravelers: Yup.number().min(1, 'At least 1 traveler required').required('Travelers count is required'),
  travelStyle: Yup.string().required('Travel style is required'),
  budget: Yup.number().min(0, 'Budget cannot be negative').required('Budget is required'),
  currency: Yup.string().required('Currency is required'),
  notes: Yup.string(),
});

export const bookingSchema = Yup.object().shape({
  bookingType: Yup.string().required('Booking type is required'),
  title: Yup.string().required('Title is required'),
  provider: Yup.string().required('Provider is required'),
  confirmationNumber: Yup.string(),
  startDateTime: Yup.string().required('Start date & time is required'),
  endDateTime: Yup.string(),
  cost: Yup.number().min(0, 'Cost must be positive').required('Cost is required'),
  currency: Yup.string().required('Currency is required'),
  status: Yup.string().required('Status is required'),
  notes: Yup.string(),
});

export const expenseSchema = Yup.object().shape({
  title: Yup.string().trim().required('Expense description is required'),
  amount: Yup.number().positive('Amount must be greater than 0').required('Amount is required'),
  category: Yup.string().required('Category is required'),
  date: Yup.string().required('Date is required'),
  paymentMethod: Yup.string(),
  notes: Yup.string(),
});

export const reviewSchema = Yup.object().shape({
  rating: Yup.number().min(1).max(5).required('Please provide a rating (1-5 stars)'),
  title: Yup.string().trim().required('Review title is required'),
  comment: Yup.string().trim().min(10, 'Review comment must be at least 10 characters').required('Comment is required'),
});
