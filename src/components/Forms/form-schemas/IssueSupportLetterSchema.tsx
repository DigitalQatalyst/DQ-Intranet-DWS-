import { FormSchema } from "../FormPreview";

export const IssueSupportLetterSchema: FormSchema = {
  formId: "issue-support-letter",
  formTitle: "Issue Support Letter",
  formDescription:
    "Please complete the form below to request a support letter from our organization.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000, // Auto-save every 20 seconds
  submitEndpoint: "",

  steps: [
    {
      stepTitle: "Requester Information",
      stepDescription: "Tell us about yourself and your role in the business.",
      groups: [
        {
          groupTitle: "PERSONAL DETAILS",
          fields: [
            {
              id: "applicantFullName",
              label: "Full Name",
              type: "text",
              placeholder: "John Smith",
              required: true,
              validation: { minLength: 2 },
            },
            {
              id: "applicantEmail",
              label: "Email Address",
              type: "email",
              placeholder: "john.smith@email.com",
              required: true,
            },
            {
              id: "applicantPhone",
              label: "Phone Number",
              type: "tel",
              required: true,
              placeholder: "+1 234 567 8900",
            },
            {
              id: "dateOfBirth",
              label: "Date of Birth",
              type: "date",
            },
            {
              id: "nationality",
              label: "Nationality",
              type: "select",
              globalOptionSet: "countries",
            },
          ],
        },
        {
          groupTitle: "ROLE & EXPERIENCE",
          fields: [
            {
              id: "roleInBusiness",
              label: "Role in Business",
              type: "select",
              required: true,
              options: [
                { value: "owner", label: "Owner/Founder" },
                { value: "ceo", label: "CEO" },
                { value: "partner", label: "Partner" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "yearsOfExperience",
              label: "Years of Business Experience",
              type: "number",
              placeholder: "5",
              validation: { min: 0, max: 50 },
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Support Letter Details",
      stepDescription:
        "Provide details about the support letter and its purpose.",
      groups: [
        {
          groupTitle: "LETTER REQUEST",
          fields: [
            {
              id: "supportLetterType",
              label: "Type of Support Letter",
              required: true,
              type: "select",
              options: [
                { value: "employment", label: "Employment Verification" },
                { value: "financial", label: "Financial Support" },
                { value: "travel", label: "Travel Support" },
                { value: "education", label: "Education Support" },
                { value: "visa", label: "Visa Support" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "supportLetterPurpose",
              label: "Purpose of the Support Letter",
              type: "textarea",
              placeholder:
                "Please briefly describe the purpose of the letter...",
            },
            {
              id: "letterRecipient",
              label: "Recipient of the Support Letter",
              type: "text",
              placeholder: "John Doe",
              required: true,
              validation: { minLength: 2 },
            },
            {
              id: "letterDateNeededBy",
              label: "Date Needed By",
              type: "date",
              required: true,
            },
            {
              id: "letterContentSpecifics",
              label: "Letter Content Specifics",
              type: "textarea",
              placeholder:
                "Please provide specific wording or details (optional).",
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Attachments & Documentation",
      stepDescription:
        "Upload any required documents to complete your request.",
      groups: [
        {
          groupTitle: "REQUIRED DOCUMENTS",
          fields: [
            {
              id: "supportingDocuments",
              label: "Supporting Documents",
              type: "multi-file",
              required: false,
              validation: {
                max: 5, // Maximum 5 files
                maxFileSize: 5242880, // 5MB in bytes
                fileTypes: [
                  ".pdf",
                  ".doc",
                  ".docx",
                  ".jpg",
                  ".jpeg",
                  ".png",
                  ".txt",
                ],
              },
            },
            {
              id: "additionalNotes",
              label: "Additional Notes or Requests",
              type: "textarea",
              placeholder: "Any additional information or instructions.",
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Review & Submit",
      stepDescription: "Review your information and submit the request.",
      groups: [
        {
          groupTitle: "CONFIRMATION",
          fields: [
            // {
            //   id: "reviewSummary",
            //   label: "Review Your Information",
            //   type: "text",
            // },
            {
              id: "confirmationCheckbox",
              label:
                "I confirm that the information provided is accurate and complete.",
              type: "consent",
              required: true,
            },
            {
              id: "termsAndConditions",
              label: "I agree to the Terms and Conditions",
              type: "consent",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
