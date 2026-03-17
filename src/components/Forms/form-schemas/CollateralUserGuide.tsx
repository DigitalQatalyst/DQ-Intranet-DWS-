import * as yup from 'yup';

// Define the form schema for the "Collateral Release Request" form
export const collateralGuideSchema = {
  formId: 'collateral-release-form',
  formTitle: 'Collateral Release Request',
  description: 'Please complete the form below to request the collateral release of your funded project assets.',
  multiStep: true,
  steps: [
    {
      stepTitle: 'Release Collateral for the Funded Project Assets',
      stepDescription: 'Please provide detailed information regarding your request for collateral release of the funded project assets.',
      groups: [
        {
          groupTitle: 'Fill in Application',
          groupDescription: 'Select how you want to provide asset information.',
          fields: [
            {
              id: 'assetSelection',
              label: 'Select Assets',
              type: 'radio',
              required: true,
              options: [
                { value: 'select', label: 'Select Assets' },
                { value: 'manual', label: 'Enter Manually' }
              ],
              defaultValue: ''
            }
          ]
        },
        {
          groupTitle: 'Enter Asset Details',
          groupDescription: 'Please enter the requested asset details below.',
          fields: [
            {
              id: 'assetName',
              label: 'Asset Name',
              type: 'text',
              required: true,
              placeholder: 'Enter asset name',
              conditionalLogic: { dependsOn: 'assetSelection', showWhen: 'manual' },
              validation: { minLength: 2, maxLength: 30, message: 'Asset name must be at least 2 characters' }
            },
            {
              id: 'assetNumber',
              label: 'Asset Number',
              type: 'text',
              required: true,
              placeholder: 'Enter asset number',
              conditionalLogic: { dependsOn: 'assetSelection', showWhen: 'manual' },
              validation: { pattern: '^[a-zA-Z0-9-]+$', maxLength: 20, message: 'Asset number must be alphanumeric', minLength: 4 }
            },
            {
              id: 'additionalDetails',
              label: 'Additional Details (Optional)',
              type: 'textarea',
              required: false,
              placeholder: 'Enter additional details (optional)',
              conditionalLogic: { dependsOn: 'assetSelection', showWhen: 'manual' },
              validation: { maxLength: 500 }
            }
          ]
        },
        {
          groupTitle: 'Select Assets',
          groupDescription: 'Please select the assets for which you would like to request collateral release.',
          fields: [
            {
              id: 'assetTableSelection',
              label: 'Select Assets from the Table',
              type: 'table',
              required: true,
              conditionalLogic: { dependsOn: 'assetSelection', showWhen: 'select' },
              options: [
                { assetName: 'Toyota Hilux 2020', assetNumber: 'VEH-001-2020' },
                { assetName: 'Excavator CAT 320', assetNumber: 'EQP-045-2019' },
                { assetName: 'Generator Set 500KVA', assetNumber: 'GEN-023-2021' }
              ],
              validation: { required: 'Please select at least one asset from the list' }
            }
          ]
        },
        {
          groupTitle: 'Upload Documents',
          groupDescription: 'Please upload the necessary documents supporting your collateral release request.',
          fields: [
            {
              id: 'cancellationLetter',
              label: 'Confirmation on Collateral Release (Official Letter/Email)',
              type: 'file',
              required: true,
              accept: '.pdf,.jpg,.png,.docx',
              validation: { required: 'Collateral release letter is required' },
              helperText: 'Upload the official letter/email confirming the collateral release.'
            }
          ]
        }
      ]
    }
  ]
};

// Validation schema for the "Collateral Release Request" form
export const collateralReleaseValidationSchema = yup.object({
  assetSelection: yup
    .string()
    .required('Please select how you want to provide the asset details'),

  // Conditional validation based on asset selection
  assetName: yup.string().when('assetSelection', ([assetSelection], schema) =>
    assetSelection === 'manual'
      ? schema
          .required('Asset name is required')
          .min(2, 'Asset name must be at least 2 characters')
      : schema.optional()
  ),

  assetNumber: yup.string().when('assetSelection', ([assetSelection], schema) =>
    assetSelection === 'manual'
      ? schema
          .required('Asset number is required')
          .matches(/^[a-zA-Z0-9-]+$/, 'Asset number must be alphanumeric')
          .min(4, 'Asset number must be at least 4 characters')
      : schema.optional()
  ),

  additionalDetails: yup
    .string()
    .max(500, 'Additional details cannot exceed 500 characters')
    .optional(),

  // Table Validation: Ensure at least one asset is selected
  assetTableSelection: yup
    .array()
    .when('assetSelection', ([assetSelection], schema) =>
      assetSelection === 'select'
        ? schema
            .min(1, 'Please select at least one asset from the table')
            .required('Asset selection from the table is required')
        : schema.optional()
    ),

  // File Upload Validation
  cancellationLetter: yup
    .mixed()
    .required('Collateral release letter is required')
    .test('fileType', 'Unsupported file type', (value) => {
      if (!value) return false;
      const file = value as File;
      return ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        .includes(file.type);
    })
    .test('fileSize', 'File is too large (max 5MB)', (value) => {
      if (!value) return false;
      const file = value as File;
      return file.size <= 5 * 1024 * 1024; // Max size 5MB
    }),
});
