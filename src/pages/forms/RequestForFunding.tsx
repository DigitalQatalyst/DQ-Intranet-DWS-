import { useState } from "react";
// import { RequestForFundingSchema } from "../../components/Forms/form-schemas/RequestForFundingSchema";

function RequestForFunding() {
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
      {/* <ServiceRequestForm
        schema={RequestForFundingSchema}
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={formData}
        data-id="request-for-funding"
      /> */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Request For Funding</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Request For Funding form will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}

// Export the specific form name
export const RequestForFundingForm = RequestForFunding;
export default RequestForFunding;
