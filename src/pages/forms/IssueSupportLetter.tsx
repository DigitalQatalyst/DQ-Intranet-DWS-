import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { IssueSupportLetterSchema } from "../../components/Forms/form-schemas/IssueSupportLetterSchema";

function IssueSupportLetter() {
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
        schema={IssueSupportLetterSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="issue-support-letter"
      />
    </div>
  );
}

// Export the specific form name
export const IssueSupportLetterForm = IssueSupportLetter;
export default IssueSupportLetter;
