import Joi from 'joi';

/**
 * ==========================================
 * Create Worker
 * ==========================================
 */
export const createWorkerSchema = Joi.object({
    // employeeCode: Joi.string()
    //     .trim()
    //     .uppercase()
    //     .required(),

    fullName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    fatherName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    mobileNumber: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            'string.pattern.base':
                'Invalid mobile number.',
        }),

    alternateMobileNumber: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .allow('', null)
        .messages({
            'string.pattern.base':
                'Invalid alternate mobile number.',
        }),

    email: Joi.string()
        .email()
        .trim()
        .lowercase()
        .allow('', null),

    gender: Joi.string()
        .valid(
            'MALE',
            'FEMALE',
            'OTHER'
        )
        .required(),

    dateOfBirth: Joi.date().required(),

    bloodGroup: Joi.string().valid(
        'A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-'
    ),

    aadhaarNumber: Joi.string()
        .pattern(/^\d{12}$/)
        .required()
        .messages({
            'string.pattern.base':
                'Aadhaar must be 12 digits.',
        }),

    panNumber: Joi.string()
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .allow('', null)
        .messages({
            'string.pattern.base':
                'Invalid PAN number.',
        }),

    esicNumber: Joi.string()
        .allow('', null),

    pfNumber: Joi.string()
        .allow('', null),

    address: Joi.string()
        .trim()
        .required(),

    state: Joi.string()
        .trim()
        .required(),

    district: Joi.string()
        .trim()
        .required(),

    city: Joi.string()
        .trim()
        .required(),

    pincode: Joi.string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
            'string.pattern.base':
                'Invalid pincode.',
        }),

    trade: Joi.string()
        .valid(
            'MASON',
            'HELPER',
            'ELECTRICIAN',
            'PLUMBER',
            'CARPENTER',
            'WELDER',
            'PAINTER',
            'STEEL_FIXER',
            'OPERATOR',
            'OTHER'
        )
        .required(),

    skillLevel: Joi.string().valid(
        'UNSKILLED',
        'SEMI_SKILLED',
        'SKILLED'
    ),

    site: Joi.string()
        .hex()
        .length(24)
        .allow(null, ''),

    contractor: Joi.string()
        .hex()
        .length(24)
        .allow(null, ''),

    joiningDate: Joi.date()
        .required(),

    salaryType: Joi.string()
        .valid(
            'DAILY',
            'MONTHLY'
        )
        .required(),

    dailyWage: Joi.number()
        .min(0)
        .default(0),

    monthlySalary: Joi.number()
        .min(0)
        .default(0),

    bankName: Joi.string()
        .allow('', null),

    accountNumber: Joi.string()
        .allow('', null),

    ifscCode: Joi.string()
        .allow('', null),

    upiId: Joi.string()
        .allow('', null),

    emergencyContactName: Joi.string()
        .required(),

    emergencyContactNumber: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
            'string.pattern.base':
                'Invalid emergency contact number.',
        }),

    relationship: Joi.string()
        .allow('', null),

    documents: Joi.object({
        photo: Joi.string()
            .allow('', null),

        aadhaar: Joi.string()
            .allow('', null),

        pan: Joi.string()
            .allow('', null),

        bankPassbook: Joi.string()
            .allow('', null),
    }).default({}),
});

/**
 * ==========================================
 * Update Worker
 * ==========================================
 */
export const updateWorkerSchema =
    createWorkerSchema
        .fork(
            [
                // 'employeeCode',
                'fullName',
                'fatherName',
                'mobileNumber',
                'gender',
                'dateOfBirth',
                'aadhaarNumber',
                'address',
                'state',
                'district',
                'city',
                'pincode',
                'trade',
                'joiningDate',
                'salaryType',
                'emergencyContactName',
                'emergencyContactNumber',
            ],
            (schema) => schema.optional()
        )
        .min(1)
        .messages({
            'object.min':
                'At least one field is required to update.',
        });

/**
 * ==========================================
 * Change Worker Status
 * ==========================================
 */
export const changeWorkerStatusSchema =
    Joi.object({
        status: Joi.string()
            .valid(
                'ACTIVE',
                'INACTIVE'
            )
            .required(),
    });

/**
 * ==========================================
 * Get Workers Query
 * ==========================================
 */
export const getWorkersQuerySchema =
    Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .default(1),

        limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10),

        search: Joi.string()
            .trim()
            .allow(''),

        status: Joi.string()
            .valid(
                'ACTIVE',
                'INACTIVE'
            )
            .allow(''),

        trade: Joi.string()
            .valid(
                'MASON',
                'HELPER',
                'ELECTRICIAN',
                'PLUMBER',
                'CARPENTER',
                'WELDER',
                'PAINTER',
                'STEEL_FIXER',
                'OPERATOR',
                'OTHER'
            )
            .allow(''),

        salaryType: Joi.string()
            .valid(
                'DAILY',
                'MONTHLY'
            )
            .allow(''),

        site: Joi.string()
            .hex()
            .length(24)
            .allow(''),

        sortBy: Joi.string()
            .valid(
                'employeeCode',
                'fullName',
                'joiningDate',
                'createdAt'
            )
            .default('createdAt'),

        sortOrder: Joi.string()
            .valid(
                'asc',
                'desc'
            )
            .default('desc'),
    });