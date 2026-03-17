import { FormSchema } from '../FormPreview'

export const amendExistingLoanSchema: FormSchema = {
    formId: 'amend-loan-details',
    formTitle: 'Request to Amend Existing Loan Details',
    formDescription:
        'Please complete the form below to proceed with your application.',
    multiStep: true,
    allowSaveAndContinue: true,
    autoSaveInterval: 15000,
    submitEndpoint: '/api/amend-loan-request',
    steps: [
        {
            stepTitle: 'Applicant Details',
            stepDescription: 'Provide your company and contact information.',
            groups: [
                {
                    groupTitle: 'COMPANY INFORMATION',
                    fields: [
                        {
                            id: 'companyName',
                            label: 'Company name',
                            type: 'text',
                            placeholder: 'Enter registered company name',
                            required: true,
                            validation: { minLength: 2 },
                        },
                        {
                            id: 'confirmCompanyName',
                            label: 'Company number',
                            type: 'text',
                            placeholder: 'Enter company registration number',
                            required: true,
                            validation: { minLength: 2 },
                        },
                    ],
                },
                {
                    groupTitle: 'REQUESTER INFORMATION',
                    fields: [
                        {
                            id: 'requestorName',
                            label: 'Name of person making the submission',
                            type: 'text',
                            placeholder: 'Enter your full name',
                            required: true,
                            validation: { minLength: 2 },
                        },
                        {
                            id: 'requestorPosition',
                            label: 'Position',
                            type: 'text',
                            placeholder: 'Enter your job title or role',
                        },
                        {
                            id: 'requestorEmail',
                            label: 'Email Address',
                            type: 'email',
                            placeholder: 'e.g. name@company.com',
                            required: true,
                        },
                        {
                            id: 'requestorPhone',
                            label: 'Contact telephone number',
                            type: 'tel',
                            placeholder: 'e.g. +254712345678',
                            required: true,
                        },
                    ],
                },
            ],
        },
        {
            stepTitle: 'Amend Existing Loan Details',
            stepDescription: 'Specify the loan details you wish to amend.',
            groups: [
                {
                    groupTitle: 'LOAN DETAILS',
                    fields: [
                        {
                            id: 'fundingRequestNumber',
                            label: 'Funding Request Number',
                            type: 'text',
                            placeholder: 'Enter your original funding request number',
                            required: true,
                        },
                        {
                            id: 'amendmentDescription',
                            label: 'Description',
                            type: 'textarea',
                            placeholder:
                                'Describe the changes you wish to make to your loan details...',
                            required: true,
                            validation: { minLength: 50, maxLength: 2000 },
                        },
                    ],
                },
                {
                    groupTitle: 'UPLOAD DOCUMENTS',
                    fields: [
                        {
                            id: 'supportingDocuments',
                            label: 'Supporting Documents',
                            type: 'file',
                            required: true,
                            // multiple: true,
                            validation: {
                                fileTypes: ['.pdf', '.docx', '.jpg', '.png']
                            }
                        },
                    ],
                },
            ],
        },
        {
            stepTitle: 'Data Sharing',
            stepDescription: 'Review and confirm your data sharing consent.',
            groups: [
                {
                    groupTitle: 'DATA SHARING CONSENT',
                    groupDescription:
                        'I acknowledge that by providing this consent, my information may be shared with third party entities for the purpose of increasing the procurement and business opportunities. I understand that my information will be treated in accordance with applicable data protection laws and regulations.',
                    fields: [
                        {
                            id: 'dataSharingConsent',
                            label:
                                'I acknowledge that by providing this consent, my information may be shared with third party entities for the purpose of increasing the procurement and business opportunities. I understand that my information will be treated in accordance with applicable data protection laws and regulations.',
                            type: 'consent',
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
}