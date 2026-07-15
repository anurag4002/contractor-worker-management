import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema(
    {
        employeeCode: {
            type: String,
            required: [true, 'Employee code is required'],
            unique: true,
            trim: true,
            uppercase: true,
        },

        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        fatherName: {
            type: String,
            required: [true, "Father's name is required"],
            trim: true,
            maxlength: 100,
        },

        mobileNumber: {
            type: String,
            required: [true, 'Mobile number is required'],
            unique: true,
            trim: true,
            match: [/^[6-9]\d{9}$/, 'Invalid mobile number'],
        },

        alternateMobileNumber: {
            type: String,
            trim: true,
            default: null,
            match: [/^[6-9]\d{9}$/, 'Invalid mobile number'],
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: null,
        },

        gender: {
            type: String,
            required: true,
            enum: ['MALE', 'FEMALE', 'OTHER'],
        },

        dateOfBirth: {
            type: Date,
            required: true,
        },

        bloodGroup: {
            type: String,
            enum: [
                'A+',
                'A-',
                'B+',
                'B-',
                'AB+',
                'AB-',
                'O+',
                'O-',
            ],
            default: null,
        },

        aadhaarNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        panNumber: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            default: null,
        },

        esicNumber: {
            type: String,
            trim: true,
            default: null,
        },

        pfNumber: {
            type: String,
            trim: true,
            default: null,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            required: true,
            trim: true,
        },

        district: {
            type: String,
            required: true,
            trim: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        pincode: {
            type: String,
            required: true,
            trim: true,
        },

        trade: {
            type: String,
            required: true,
            enum: [
                'MASON',
                'HELPER',
                'ELECTRICIAN',
                'PLUMBER',
                'CARPENTER',
                'WELDER',
                'PAINTER',
                'STEEL_FIXER',
                'OPERATOR',
                'OTHER',
            ],
        },

        skillLevel: {
            type: String,
            enum: ['UNSKILLED', 'SEMI_SKILLED', 'SKILLED'],
            default: 'UNSKILLED',
        },

        site: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Site',
            default: null,
        },

        contractor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        joiningDate: {
            type: Date,
            required: true,
        },

        salaryType: {
            type: String,
            enum: ['DAILY', 'MONTHLY'],
            required: true,
        },

        dailyWage: {
            type: Number,
            default: 0,
            min: 0,
        },

        monthlySalary: {
            type: Number,
            default: 0,
            min: 0,
        },

        bankName: {
            type: String,
            trim: true,
            default: null,
        },

        accountNumber: {
            type: String,
            trim: true,
            default: null,
        },

        ifscCode: {
            type: String,
            trim: true,
            uppercase: true,
            default: null,
        },

        upiId: {
            type: String,
            trim: true,
            lowercase: true,
            default: null,
        },

        emergencyContactName: {
            type: String,
            trim: true,
            required: true,
        },

        emergencyContactNumber: {
            type: String,
            required: true,
            match: [/^[6-9]\d{9}$/, 'Invalid mobile number'],
        },

        relationship: {
            type: String,
            trim: true,
            default: null,
        },

        documents: {
            photo: {
                type: String,
                default: null,
            },

            aadhaar: {
                type: String,
                default: null,
            },

            pan: {
                type: String,
                default: null,
            },

            bankPassbook: {
                type: String,
                default: null,
            },
        },

        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE'],
            default: 'ACTIVE',
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

workerSchema.index({ employeeCode: 1 });

workerSchema.index({ mobileNumber: 1 });

workerSchema.index({ aadhaarNumber: 1 });

workerSchema.index({ panNumber: 1 });

workerSchema.index({ site: 1 });

workerSchema.index({ trade: 1 });

workerSchema.index({ status: 1 });

workerSchema.index({ isDeleted: 1 });

workerSchema.index({ fullName: 'text', employeeCode: 'text' });

const Worker = mongoose.model(
    'Worker',
    workerSchema
);

export default Worker;