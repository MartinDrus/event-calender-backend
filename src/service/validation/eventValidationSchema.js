import { checkSchema } from 'express-validator';

export const eventValidationMiddleware = checkSchema({
    title: {
        in: ['body'],
        isString: true,
        errorMessage: 'Title must be a string',
        bail: true,
        isLength: {
            options: {
                min:3,
                max:30
            },
            errorMessage: 'Title must have min 3 and max 30 chars'
        },
    },

    beginning: {
        in: ['body'],
        isString: true,
        bail: true,
        errorMessage: 'Invalid date format. Please use ISO 8601 format (e.g. YYYY-MM-DDTHH:mm:ss.sssZ).',
    },

    description: {
        in: ['body'],
        isString: true,
        errorMessage: 'Description must be a string',
        bail: true
    }
});