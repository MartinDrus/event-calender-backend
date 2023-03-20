import { checkSchema } from 'express-validator';

export const userValidationMiddleware = checkSchema({
    username: {
        in: ['body'],
        isString: true,
        errorMessage: 'Username must be a string',
        bail: true,
        isLength: {
            options: {
                min:3,
                max:20
            },
            errorMessage: 'Username must have min 3 and max 20 chars'
        },
    },

    email: {
        in: ['body'],
        isEmail: {
          bail: true,
        },
        errorMessage: 'Email is not valid',
    },

    password: {
        in: ['body'],
        matches: {
            options: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            errorMessage: 'Password must contain one lowercase letter, one lowercase letter and a number.'
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters long.'
        }
    }
});