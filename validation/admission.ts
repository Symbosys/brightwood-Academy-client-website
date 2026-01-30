import { z } from "zod";

// Enums matching Prisma schema
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export const CategoryEnum = z.enum(["GENERAL", "OBC", "SC", "ST", "EWS"]);
export const ApplicationStatusEnum = z.enum([
    "PENDING",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "WAITLISTED",
    "ADMITTED",
]);

// Phone number validation (Indian format)
const phoneRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^\d{6}$/;
const aadharRegex = /^\d{12}$/;

// Admission Application Schema
export const admissionApplicationSchema = z.object({
    // Student Information
    studentFirstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "First name should only contain letters"),

    studentMiddleName: z
        .string()
        .max(50, "Middle name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s]*$/, "Middle name should only contain letters")
        .optional()
        .nullable(),

    studentLastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Last name should only contain letters"),

    dateOfBirth: z.coerce
        .date()
        .refine(
            (date) => {
                const age = new Date().getFullYear() - date.getFullYear();
                return age >= 3 && age <= 18;
            },
            { message: "Student must be between 3 and 18 years old" }
        ),

    gender: GenderEnum,

    bloodGroup: z
        .string()
        .regex(/^(A|B|AB|O)[+-]$/, "Invalid blood group format")
        .optional()
        .nullable(),

    nationality: z.string().default("Indian"),

    religion: z.string().max(50).optional().nullable(),

    category: CategoryEnum,

    aadharNumber: z
        .string()
        .regex(aadharRegex, "Aadhar number must be 12 digits")
        .optional()
        .nullable(),

    // Class & Academic Details
    classApplyingFor: z
        .string()
        .min(1, "Please select a class")
        .max(50),

    previousSchool: z.string().max(200).optional().nullable(),

    previousClass: z.string().max(50).optional().nullable(),

    academicYear: z
        .string()
        .regex(/^\d{4}-\d{2}$/, "Academic year must be in format YYYY-YY (e.g., 2025-26)"),

    // Parent/Guardian Information
    fatherName: z
        .string()
        .min(2, "Father's name must be at least 2 characters")
        .max(100)
        .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),

    fatherOccupation: z.string().max(100).optional().nullable(),

    fatherPhone: z
        .string()
        .regex(phoneRegex, "Invalid phone number. Must be 10 digits starting with 6-9"),

    fatherEmail: z
        .string()
        .email("Invalid email address")
        .optional()
        .nullable(),

    motherName: z
        .string()
        .min(2, "Mother's name must be at least 2 characters")
        .max(100)
        .regex(/^[a-zA-Z\s]+$/, "Name should only contain letters"),

    motherOccupation: z.string().max(100).optional().nullable(),

    motherPhone: z
        .string()
        .regex(phoneRegex, "Invalid phone number. Must be 10 digits starting with 6-9")
        .optional()
        .nullable(),

    motherEmail: z
        .string()
        .email("Invalid email address")
        .optional()
        .nullable(),

    guardianName: z.string().max(100).optional().nullable(),

    guardianRelation: z.string().max(50).optional().nullable(),

    guardianPhone: z
        .string()
        .regex(phoneRegex, "Invalid phone number. Must be 10 digits starting with 6-9")
        .optional()
        .nullable(),

    guardianEmail: z
        .string()
        .email("Invalid email address")
        .optional()
        .nullable(),

    // Address Information
    currentAddress: z
        .string()
        .min(10, "Address must be at least 10 characters")
        .max(500),

    currentCity: z
        .string()
        .min(2, "City name must be at least 2 characters")
        .max(100),

    currentState: z
        .string()
        .min(2, "State name must be at least 2 characters")
        .max(100),

    currentPincode: z
        .string()
        .regex(pincodeRegex, "Pincode must be 6 digits"),

    permanentAddress: z
        .string()
        .min(10, "Address must be at least 10 characters")
        .max(500),

    permanentCity: z
        .string()
        .min(2, "City name must be at least 2 characters")
        .max(100),

    permanentState: z
        .string()
        .min(2, "State name must be at least 2 characters")
        .max(100),

    permanentPincode: z
        .string()
        .regex(pincodeRegex, "Pincode must be 6 digits"),

    // Additional Information
    medicalConditions: z.string().max(1000).optional().nullable(),

    specialNeeds: z.string().max(1000).optional().nullable(),

    // Documents (optional for initial submission)
    birthCertificate: z.string().url().optional().nullable(),
    photoUrl: z.string().url().optional().nullable(),
    transferCertificate: z.string().url().optional().nullable(),
    addressProof: z.string().url().optional().nullable(),
});

// Update Application Status Schema
export const updateApplicationStatusSchema = z.object({
    id: z.string().cuid("Invalid application ID"),
    status: ApplicationStatusEnum,
    remarks: z.string().max(1000).optional().nullable(),
    reviewedBy: z.string().min(1, "Reviewer name is required"),
});

// Get Applications Query Schema
export const getApplicationsQuerySchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    status: ApplicationStatusEnum.optional(),
    academicYear: z.string().optional(),
    classApplyingFor: z.string().optional(),
    searchQuery: z.string().optional(), // Search by name or application number
    sortBy: z.enum(["createdAt", "updatedAt", "applicationNumber"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Delete Application Schema
export const deleteApplicationSchema = z.object({
    id: z.string().cuid("Invalid application ID"),
});

// Get Application by ID Schema
export const getApplicationByIdSchema = z.object({
    id: z.string().cuid("Invalid application ID"),
});

// Type exports
export type AdmissionApplicationInput = z.infer<typeof admissionApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
export type GetApplicationsQuery = z.infer<typeof getApplicationsQuerySchema>;
export type DeleteApplicationInput = z.infer<typeof deleteApplicationSchema>;
export type GetApplicationByIdInput = z.infer<typeof getApplicationByIdSchema>;
