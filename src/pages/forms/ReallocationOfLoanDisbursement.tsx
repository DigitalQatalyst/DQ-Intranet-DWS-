import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { reallocationLoanSchema } from "../../components/Forms/form-schemas/LoanDisbursement";

function ReallocationOfLoanDisbursement() {
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully!");
  };
  const handleSave = async (data: any) => {
    console.log("Form saved:", data);
    setFormData(data);
    alert("Form saved successfully!");
  };

  return (
    <div>
      <ServiceRequestForm
        schema={reallocationLoanSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="reallocation-of-loan-disbursement"
      />
    </div>
  );
}

// Export the specific form name
export const ReallocationOfLoanDisbursementForm =
  ReallocationOfLoanDisbursement;
export default ReallocationOfLoanDisbursement;
