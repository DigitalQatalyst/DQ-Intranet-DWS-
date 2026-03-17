import * as yup from "yup";
import { FormSchema, FormField } from "../FormPreview";

export const bookConsultationSchema: FormSchema = {
  formId: "book-consultation-form",
  formTitle: "Book Consultation for Entrepreneurs",
  formDescription: "Please complete the form below to proceed with your application.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000,
  submitEndpoint: "/api/book-consultation",
  steps: [
    {
      stepTitle: "Enter Applicant Details",
      stepDescription: "Please review the details below and make the necessary amendments if required to register in your desired consultation course",
      groups: [
        {
          groupTitle: "Personal Details",
          groupDescription: "The information displayed below has been obtained from Khalifa Fund System. Please review and update the information below as necessary.",
          fields: [
            {
              id: "email",
              label: "Email Address",
              type: "email",
              required: true,
              placeholder: "jane.smith@example.com",
              validation: {
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                message: "Invalid email address",
              },
            } as FormField,
            {
              id: "mobileNumber",
              label: "Mobile Number",
              type: "text",
              required: true,
              placeholder: "+12025550178",
              validation: {
                pattern: "^\\+?[0-9]{10,13}$",
                message: "Telephone number must be in international format and contain 10-13 digits",
              },
            } as FormField,
          ],
        },
        {
          groupTitle: "Additional Details",
          groupDescription: "The information displayed below has been obtained from Khalifa Fund System. Please review and update the information below as necessary.",
          fields: [
            {
              id: "employmentStatus",
              label: "Employment Status",
              type: "select",
              required: true,
              options: [
                { label: "Employed", value: "Employed" },
                { label: "Self-Employed", value: "Self-Employed" },
                { label: "Unemployed", value: "Unemployed" },
                { label: "Retired", value: "Retired" },
              ],
            } as FormField,
            {
              id: "educationLevel",
              label: "Education Level",
              type: "select",
              required: true,
              options: [
                { label: "Read and write only", value: "Read and write only" },
                { label: "Primary/Elementary", value: "Primary/Elementary" },
                { label: "Secondary", value: "Secondary" },
                { label: "Injaz", value: "Injaz" },
                { label: "Diploma", value: "Diploma" },
                { label: "Higher Diploma", value: "Higher Diploma" },
                { label: "Bachelor's Degree", value: "Bachelor's Degree" },
                { label: "Master's Degree", value: "Master's Degree" },
                { label: "PhD", value: "PhD" },
                { label: "Other", value: "Other" },
              ],
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Select Consultation Type",
      stepDescription: "Please select the consultation type you want to attend. You can select as many as you need in a single application.",
      groups: [
        {
          groupTitle: "Consultation Type",
          groupDescription: "Select the type of consultation you want to attend.",
          fields: [
            {
              id: "consultationType",
              label: "Consultation Type *",
              type: "radio",
              required: true,
              options: [
                { label: "Group session", value: "group" },
                { label: "One to one", value: "individual" },
              ],
            } as FormField,
            
            // Consultation Name - Only shows for "Group session"
            {
              id: "consultationName",
              label: "Consultation Name *",
              type: "select",
              required: true,
              placeholder: "Select an option",
              conditionalLogic: { dependsOn: "consultationType", showWhen: "group" },
              options: [
                { label: "Business Fundamentals Workshop", value: "business-fundamentals" },
                { label: "Marketing Strategy Session", value: "marketing-strategy" },
                { label: "Financial Planning Group", value: "financial-planning" },
                { label: "Startup Bootcamp", value: "startup-bootcamp" },
              ],
            } as FormField,

            // Business questions - Only show for "One to one"
            {
              id: "isExistingBusiness",
              label: "Is this an existing business? *",
              type: "radio",
              required: true,
              conditionalLogic: { dependsOn: "consultationType", showWhen: "individual" },
              options: [
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ],
            } as FormField,

            // Owns Business - Only shows when "Is this an existing business?" is "Yes"
            {
              id: "ownsBusiness",
              label: "Do you own the business? *",
              type: "radio",
              required: true,
              conditionalLogic: { 
                dependsOn: "isExistingBusiness", 
                showWhen: "yes" 
              },
              options: [
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ],
            } as FormField,

            // Work in Business - Only shows when "Do you own the business?" is "No"
            {
              id: "workInBusiness",
              label: "Do you work in this business? *",
              type: "radio",
              required: true,
              conditionalLogic: { 
                dependsOn: "ownsBusiness", 
                showWhen: "no" 
              },
              options: [
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ],
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Select Consultation Advice",
      stepDescription: "Please select 3 advices you would like to receive a consultation for:",
      groups: [
        {
          groupTitle: "Advice Selection",
          groupDescription: "Select the areas you want advice on.",
          fields: [
            {
              id: "consultationAdvices",
              label: "Select 3 Advices",
              type: "checkbox-group",
              required: true,
              options: [
                { label: "Review Business Model", value: "Review Business Model" },
                { label: "Review Market Position", value: "Review Market Position" },
                { label: "Revise Partnership", value: "Revise Partnership" },
                { label: "Review Scale of the Project", value: "Review Scale of the Project" },
                { label: "Review Performance Management", value: "Review Performance Management" },
                { label: "Review Quality Management", value: "Review Quality Management" },
                { label: "Review Financial Controls", value: "Review Financial Controls" },
                { label: "Review Cost Management", value: "Review Cost Management" },
                { label: "Advise on Market Research", value: "Advise on Market Research" },
                { label: "Advise on Corporate Governance", value: "Advise on Corporate Governance" },
                { label: "Advise on Sales", value: "Advise on Sales" },
                { label: "Advise on Human Resources", value: "Advise on Human Resources" },
                { label: "Advise on Customer Service", value: "Advise on Customer Service" },
                { label: "Advise on Logistics", value: "Advise on Logistics" },
                { label: "Advise on IT Support", value: "Advise on IT Support" },
                { label: "Advise on Branding", value: "Advise on Branding" },
                { label: "Advise on Review Financial Performance", value: "Advise on Review Financial Performance" },
              ],
              validation: {
                minLength: 3,
                maxLength: 3,
                message: "Please select exactly 3 advices"
              }
            } as FormField,
            {
              id: "otherAdvice",
              label: "Other Advices (optional)",
              type: "text",
              required: false,
              placeholder: "Enter other advice topics...",
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Data Sharing Consent",
      stepDescription: "Review and provide consent for data sharing",
      groups: [
        {
          groupTitle: "Data Sharing Consent",
          groupDescription: "Please review our data sharing policy and provide your consent",
          fields: [
            {
              id: "termsAgreed",
              label:
                "I acknowledge that by providing this consent, my information may be shared with third-party entities for the purpose of increasing the procurement and business opportunities. I understand that my information will be treated in accordance with applicable data protection laws and regulations.",
              type: "consent",
              required: true,
            } as FormField,
          ],
        },
      ],
    },
  ],
};

// Validation schema
export const bookConsultationValidationSchema = yup.object({
  // Step 1 fields
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email address is required"),
  
  mobileNumber: yup
    .string()
    .matches(/^\+?[0-9]{10,13}$/, "Telephone number must be in international format and contain 10-13 digits")
    .required("Mobile number is required"),
  
  employmentStatus: yup
    .string()
    .required("Employment status is required"),
  
  educationLevel: yup
    .string()
    .required("Education level is required"),

  // Step 2 fields - Conditional validation
  consultationType: yup
    .string()
    .required("Consultation type is required"),

  consultationName: yup
    .string()
    .when('consultationType', {
      is: 'group',
      then: yup.string().required('Consultation name is required for group sessions'),
      otherwise: yup.string().optional()
    }),

  isExistingBusiness: yup
    .string()
    .when('consultationType', {
      is: 'individual',
      then: yup.string().required('Please specify if this is an existing business'),
      otherwise: yup.string().optional()
    }),

  ownsBusiness: yup
    .string()
    .when('isExistingBusiness', {
      is: 'yes',
      then: yup.string().required('Please specify if you own the business'),
      otherwise: yup.string().optional()
    }),

  workInBusiness: yup
    .string()
    .when('ownsBusiness', {
      is: 'no',
      then: yup.string().required('Please specify if you work in the business'),
      otherwise: yup.string().optional()
    }),

  // Step 3 fields
  consultationAdvices: yup
    .array()
    .min(3, 'Please select exactly 3 advices')
    .max(3, 'Please select exactly 3 advices')
    .required('Please select 3 advices'),

  otherAdvice: yup
    .string()
    .optional(),

  // Step 4 fields
  termsAgreed: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('Consent is required'),
});