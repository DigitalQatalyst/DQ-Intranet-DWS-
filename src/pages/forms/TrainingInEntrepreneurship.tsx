import { useState } from "react";
import { TrainingInEntrepreneurshipSchema } from "../../components/Forms/form-schemas/TrainingInEnterprenuershipSchema";
import {ServiceRequestForm} from "../../components/Forms/FormPreview.tsx";

function TrainingInEntrepreneurship() {
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
      {/* Uncomment when schema is ready */}
       <ServiceRequestForm
        schema={TrainingInEntrepreneurshipSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="training-in-entrepreneurship"
      />
      {/*<div className="container mx-auto px-4 py-8">*/}
      {/*  <h1 className="text-2xl font-bold mb-6">*/}
      {/*    Training in Entrepreneurship*/}
      {/*  </h1>*/}
      {/*  <div className="bg-white rounded-lg shadow-md p-6">*/}
      {/*    <p className="text-gray-600 mb-4">*/}
      {/*      Training in Entrepreneurship form will be implemented here.*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}

// Export the specific form name
export const TrainingInEntrepreneurshipForm = TrainingInEntrepreneurship;
export default TrainingInEntrepreneurship;
