import * as yup from 'yup';

// Define the form schema for the "Loan Cancellation" form
export const loanCancellationSchema = {
  formId: 'loan-cancellation-form',
  formTitle: 'Loan Cancellation Request',
  description:
    'Please complete this form to request the cancellation of your existing loan. Provide all required information and documentation to process your request.',
  multiStep: false, // Single step form
  groups: [ // Use groups instead of steps for single-step forms
    {
      id: 'application-details',
      groupTitle: 'Fill in Application',
      groupDescription: 'Provide the necessary details about your loan cancellation request',
      fields: [
        {
          id: 'fundingRequestNumber',
          label: 'Funding Request Number',
          type: 'text',
          required: true,
          placeholder: 'Enter your funding request number',
          validation: {
            required: 'Funding request number is required',
            pattern: '^[A-Za-z0-9-]+$',
            message: 'Funding request number must be alphanumeric',
            minLength: 4,
          },
        },
        {
          id: 'cancellationReason',
          label: 'Cancellation Details',
          type: 'textarea',
          required: true,
          placeholder: 'Please explain in detail why you are requesting to cancel this loan',
          validation: {
            required: 'Cancellation reason is required',
            // minLength: 50,
            message: 'Please provide a detailed explanation (at least 50 characters)',
          },
        },
      ],
    },
    {
      id: 'upload-documents',
      groupTitle: 'Upload Documents',
      groupDescription: 'Please upload the necessary documents to support your loan cancellation request',
      fields: [
        {
          id: 'cancellationLetter',
          label: 'Confirmation on Loan Cancellation (Official Letter/Email)',
          type: 'file',
          required: true,
          accept: '.pdf,.jpg,.png,.docx',
          validation: {
            required: 'Cancellation letter is required',
          },
          helperText: 'Upload the official letter/email confirming your loan cancellation',
        },
      ],
    },
  ],
};

// Validation schema for the "Loan Cancellation" form
export const loanCancellationValidationSchema = yup.object({
  // Loan Cancellation Details
  fundingRequestNumber: yup
    .string()
    .required('Funding request number is required')
    .matches(/^[A-Za-z0-9-]+$/, 'Funding request number must be alphanumeric')
    .min(4, 'Funding request number must be at least 4 characters'),
  cancellationReason: yup
    .string()
    .required('Cancellation reason is required')
    .min(50, 'Please provide a detailed explanation (at least 50 characters)'),
  
  // File Uploads
  cancellationLetter: yup.mixed().required('Cancellation letter is required'),
});