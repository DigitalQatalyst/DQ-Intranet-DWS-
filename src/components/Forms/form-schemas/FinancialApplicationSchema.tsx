import { FormSchema, FormField } from "../FormPreview";

// Define the form schema for financial service applications
export const financialApplicationSchema: FormSchema = {
  formId: "financial-application-form",
  formTitle: "Financial Service Application",
  formDescription:
    "Please complete the form below to apply for this financial service.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000,
  submitEndpoint: "/api/financial-application",
  steps: [
    {
      stepTitle: "Business Information",
      stepDescription: "Tell us about your business",
      groups: [
        {
          groupTitle: "BUSINESS DETAILS",
          groupDescription: "Provide details about your business entity",
          fields: [
            {
              id: "companyName",
              label: "Company Name",
              type: "text",
              required: true,
              placeholder: "Innovate Solutions LLC",
              validation: {
                pattern: "^[a-zA-Z0-9&\\-.\\s]+$",
                message:
                  "Company name can only contain letters, numbers, &, -, and . characters",
                minLength: 2,
              },
            } as FormField,
            {
              id: "companyNumber",
              label: "Company Registration Number",
              type: "text",
              required: true,
              placeholder: "BUS12345678",
              validation: {
                pattern: "^[a-zA-Z0-9-]+$",
                message: "Company number must be alphanumeric",
                minLength: 6,
                maxLength: 12,
              },
            } as FormField,
            {
              id: "businessType",
              label: "Business Type",
              type: "select",
              required: true,
              options: [
                { value: "llc", label: "Limited Liability Company (LLC)" },
                { value: "sole-proprietorship", label: "Sole Proprietorship" },
                { value: "partnership", label: "Partnership" },
                { value: "corporation", label: "Corporation" },
                { value: "other", label: "Other" },
              ],
            } as FormField,
            {
              id: "industry",
              label: "Industry",
              type: "select",
              required: true,
              options: [
                { value: "technology", label: "Technology" },
                { value: "retail", label: "Retail" },
                { value: "manufacturing", label: "Manufacturing" },
                { value: "services", label: "Services" },
                { value: "healthcare", label: "Healthcare" },
                { value: "education", label: "Education" },
                { value: "construction", label: "Construction" },
                { value: "other", label: "Other" },
              ],
            } as FormField,
            {
              id: "businessStage",
              label: "Business Stage",
              type: "select",
              required: true,
              options: [
                { value: "startup", label: "Startup (0-2 years)" },
                { value: "early-stage", label: "Early Stage (2-5 years)" },
                { value: "growth", label: "Growth Stage (5-10 years)" },
                { value: "mature", label: "Mature (10+ years)" },
              ],
            } as FormField,
          ],
        },
        {
          groupTitle: "CONTACT INFORMATION",
          groupDescription: "Primary contact details for this application",
          fields: [
            {
              id: "contactName",
              label: "Contact Person Name",
              type: "text",
              required: true,
              placeholder: "John Smith",
              validation: {
                minLength: 2,
              },
            } as FormField,
            {
              id: "contactEmail",
              label: "Email Address",
              type: "email",
              required: true,
              placeholder: "john.smith@company.com",
            } as FormField,
            {
              id: "contactPhone",
              label: "Phone Number",
              type: "tel",
              required: true,
              placeholder: "+971 50 123 4567",
            } as FormField,
            {
              id: "contactPosition",
              label: "Position/Title",
              type: "text",
              required: true,
              placeholder: "CEO, Managing Director, etc.",
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Financial Information",
      stepDescription: "Provide your financial details",
      groups: [
        {
          groupTitle: "FINANCIAL DETAILS",
          groupDescription: "Current financial status of your business",
          fields: [
            {
              id: "annualRevenue",
              label: "Annual Revenue (AED)",
              type: "currency",
              required: true,
              currency: "AED",
              placeholder: "500000",
              validation: {
                min: 0,
              },
            } as FormField,
            {
              id: "requestedAmount",
              label: "Requested Amount (AED)",
              type: "currency",
              required: true,
              currency: "AED",
              placeholder: "100000",
              validation: {
                min: 1000,
              },
            } as FormField,
            {
              id: "loanPurpose",
              label: "Purpose of Loan",
              type: "select",
              required: true,
              options: [
                { value: "working-capital", label: "Working Capital" },
                { value: "equipment-purchase", label: "Equipment Purchase" },
                { value: "expansion", label: "Business Expansion" },
                { value: "inventory", label: "Inventory Purchase" },
                { value: "refinancing", label: "Debt Refinancing" },
                { value: "other", label: "Other" },
              ],
            } as FormField,
            {
              id: "repaymentPeriod",
              label: "Preferred Repayment Period",
              type: "select",
              required: true,
              options: [
                { value: "12", label: "12 months" },
                { value: "24", label: "24 months" },
                { value: "36", label: "36 months" },
                { value: "48", label: "48 months" },
                { value: "60", label: "60 months" },
                { value: "other", label: "Other" },
              ],
            } as FormField,
          ],
        },
        {
          groupTitle: "BUSINESS ADDRESS",
          groupDescription: "Primary business location",
          fields: [
            {
              id: "address",
              label: "Business Address",
              type: "textarea",
              required: true,
              placeholder: "Enter your complete business address",
              validation: {
                minLength: 10,
              },
            } as FormField,
            {
              id: "city",
              label: "City",
              type: "text",
              required: true,
              placeholder: "Abu Dhabi",
            } as FormField,
            {
              id: "emirate",
              label: "Emirate",
              type: "select",
              required: true,
              options: [
                { value: "abu-dhabi", label: "Abu Dhabi" },
                { value: "dubai", label: "Dubai" },
                { value: "sharjah", label: "Sharjah" },
                { value: "ajman", label: "Ajman" },
                { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
                { value: "fujairah", label: "Fujairah" },
                { value: "umm-al-quwain", label: "Umm Al Quwain" },
              ],
            } as FormField,
          ],
        },
      ],
    },
    {
      stepTitle: "Documents & Additional Information",
      stepDescription:
        "Upload required documents and provide additional details",
      groups: [
        {
          groupTitle: "REQUIRED DOCUMENTS",
          groupDescription: "Upload the following documents",
          fields: [
            {
              id: "businessLicense",
              label: "Business License",
              type: "file",
              required: true,
              validation: {
                fileTypes: [".pdf", ".jpg", ".jpeg", ".png"],
                maxFileSize: 5 * 1024 * 1024, // 5MB
              },
            } as FormField,
            {
              id: "financialStatements",
              label: "Financial Statements (Last 2 Years)",
              type: "multi-file",
              required: true,
              validation: {
                fileTypes: [".pdf", ".xlsx", ".xls"],
                maxFileSize: 10 * 1024 * 1024, // 10MB
              },
            } as FormField,
            {
              id: "businessPlan",
              label: "Business Plan",
              type: "file",
              required: false,
              validation: {
                fileTypes: [".pdf", ".doc", ".docx"],
                maxFileSize: 10 * 1024 * 1024, // 10MB
              },
            } as FormField,
          ],
        },
        {
          groupTitle: "ADDITIONAL INFORMATION",
          groupDescription: "Any additional information you'd like to provide",
          fields: [
            {
              id: "additionalInfo",
              label: "Additional Information",
              type: "textarea",
              required: false,
              placeholder:
                "Please provide any additional information that might be relevant to your application...",
              validation: {
                maxLength: 1000,
              },
            } as FormField,
            {
              id: "hearAboutUs",
              label: "How did you hear about us?",
              type: "select",
              required: false,
              options: [
                { value: "website", label: "Website" },
                { value: "social-media", label: "Social Media" },
                { value: "referral", label: "Referral" },
                { value: "advertisement", label: "Advertisement" },
                { value: "event", label: "Event/Conference" },
                { value: "other", label: "Other" },
              ],
            } as FormField,
            {
              id: "consent",
              label:
                "I agree to the terms and conditions and consent to the processing of my personal data for this application",
              type: "consent",
              required: true,
            } as FormField,
          ],
        },
      ],
    },
  ],
};
