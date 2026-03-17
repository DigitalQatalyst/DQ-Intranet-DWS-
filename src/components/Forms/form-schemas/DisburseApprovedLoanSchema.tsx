import { FormSchema } from "../FormPreview";

export const DisburseApprovedLoanSchema: FormSchema = {
  formId: "disburse-approved-loan",
  formTitle: "Disburse an Approved Loan",
  formDescription:
    "Please fill out the details to disburse the approved loan. Ensure that all information is correct before confirming the disbursement.",
  multiStep: true,
  allowSaveAndContinue: true,
  autoSaveInterval: 20000, // Auto-save every 20 seconds
  submitEndpoint: "",

  steps: [
    {
      stepTitle: "Loan Information & Requester Information",
      stepDescription:
        "Enter the loan details and the requestor's information to proceed with the disbursement.",
      groups: [
        {
          groupTitle: "LOAN INFORMATION",
          fields: [
            {
              id: "loanId",
              label: "Loan ID",
              type: "text",
              required: true,
              validation: { minLength: 2 },
            },
            {
              id: "approvedLoanAmount",
              label: "Approved Loan Amount",
              type: "currency",
              currency: "USD",
              required: true,
            },
            {
              id: "loanTerm",
              label: "Loan Term",
              type: "select",
              options: [
                { value: "12", label: "12 Months" },
                { value: "24", label: "24 Months" },
                { value: "36", label: "36 Months" },
              ],
            },
            {
              id: "loanApprovalDate",
              label: "Loan Approval Date",
              type: "date",
              required: true,
            },
            {
              id: "loanStatus",
              label: "Loan Status",
              type: "select",
              options: [
                { value: "approved", label: "Approved" },
                { value: "pending", label: "Pending" },
                { value: "disbursed", label: "Disbursed" },
              ],
            },
          ],
        },
        {
          groupTitle: "REQUESTER INFORMATION",
          fields: [
            {
              id: "requesterFullName",
              label: "Full Name",
              type: "text",
              validation: { minLength: 2 },
              required: true,
            },
            {
              id: "requesterEmail",
              label: "Email Address",
              type: "email",
              required: true,
            },
            {
              id: "requesterPhone",
              label: "Phone Number",
              type: "tel",
              validation: {
                pattern:
                  "^[+]*[0-9]{1,4}[\\s\\-]?[0-9]{1,3}[\\s\\-]?[0-9]{1,4}$",
              },
              required: true,
            },
            {
              id: "requesterDepartment",
              label: "Department",
              type: "select",
              options: [
                { value: "finance", label: "Finance" },
                { value: "loan", label: "Loan Department" },
                { value: "customer-service", label: "Customer Service" },
              ],
            },
            {
              id: "requesterEmployeeId",
              label: "Employee ID (if applicable)",
              type: "text",
            },
            {
              id: "requesterRole",
              label: "Position/Role",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Beneficiary Details",
      stepDescription:
        "Provide details about the beneficiary receiving the loan disbursement.",
      groups: [
        {
          groupTitle: "BENEFICIARY INFORMATION",
          fields: [
            {
              id: "beneficiaryName",
              label: "Beneficiary Name",
              type: "text",
              validation: { minLength: 2 },
              required: true,
            },
            {
              id: "beneficiaryAddress",
              label: "Beneficiary Address",
              type: "textarea",
              required: true,
            },
            {
              id: "beneficiaryPhone",
              label: "Beneficiary Phone",
              type: "tel",
              validation: {
                pattern:
                  "^[+]*[0-9]{1,4}[\\s\\-]?[0-9]{1,3}[\\s\\-]?[0-9]{1,4}$",
              },
            },
            {
              id: "beneficiaryEmail",
              label: "Beneficiary Email",
              type: "email",
            },
            {
              id: "relationshipToBorrower",
              label: "Relationship to Borrower",
              type: "select",
              options: [
                { value: "borrower", label: "Borrower" },
                { value: "spouse", label: "Spouse" },
                { value: "business-partner", label: "Business Partner" },
                { value: "other", label: "Other" },
              ],
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Disbursement Amount & Payment Method",
      stepDescription:
        "Specify the amount and payment method for the disbursement.",
      groups: [
        {
          groupTitle: "DISBURSEMENT DETAILS",
          fields: [
            {
              id: "disbursementAmount",
              label: "Disbursement Amount",
              type: "currency",
              currency: "USD",
              validation: { min: 1000, max: 10000000 },
            },
            {
              id: "paymentMethod",
              label: "Payment Method",
              type: "select",
              options: [
                { value: "bank-transfer", label: "Bank Transfer" },
                { value: "cash", label: "Cash" },
                { value: "check", label: "Check" },
                { value: "other", label: "Other" },
              ],
            },
            {
              id: "bankAccountNumber",
              label: "Bank Account Number",
              type: "text",
              conditionalLogic: {
                dependsOn: "paymentMethod",
                showWhen: "bank-transfer",
              },
            },
            {
              id: "paymentDate",
              label: "Payment Date",
              type: "date",
              required: true,
            },
            {
              id: "paymentReferenceNumber",
              label: "Payment Reference Number",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      stepTitle: "Review & Submit",
      stepDescription:
        "Review the details before submitting the disbursement request.",
      groups: [
        {
          groupTitle: "CONFIRMATION",
          fields: [
            {
              id: "reviewSummary",
              label: "Review Your Information",
              type: "text",
              //   display: "summary",
            },
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
      //   actions: [
      //     {
      //       buttonLabel: "Submit Request",
      //       buttonAction: "submit",
      //     },
      //   ],
    },
  ],
};
