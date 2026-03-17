import { useState } from "react";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { facilitateCommunicationSchema } from "../../components/Forms/form-schemas/FacilitateCommunicationSchema";

function BookConsultationForEntrepreneurship() {
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
        schema={facilitateCommunicationSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="book-consultation-for-entrepreneurship"
      />
    </div>
  );
}

// Export the specific form name
export const BookConsultationForEntrepreneurshipForm =
  BookConsultationForEntrepreneurship;
export default BookConsultationForEntrepreneurship;
