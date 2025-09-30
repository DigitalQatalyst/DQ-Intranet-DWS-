import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ServiceRequestForm } from "../../components/Forms/FormPreview";
import { financialApplicationSchema } from "../../components/Forms/form-schemas/FinancialApplicationSchema";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ArrowLeft } from "lucide-react";

const FinancialApplicationForm: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      // Here you would typically send the data to your API
      console.log("Financial application submitted:", data);

      // For now, just show success message
      alert(
        "Application submitted successfully! We will contact you within 24 hours."
      );

      // Navigate back to the marketplace item
      navigate(`/marketplace/financial/${itemId}`);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(
        "There was an error submitting your application. Please try again."
      );
    }
  };

  const handleSave = async (data: Record<string, unknown>) => {
    try {
      // Here you would typically save the draft to your API
      console.log("Financial application saved as draft:", data);
      alert("Application saved as draft successfully!");
    } catch (error) {
      console.error("Error saving application:", error);
      alert("There was an error saving your application. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(`/marketplace/financial/${itemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Service Details
            </button>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Financial Service Application
            </h1>
            <p className="text-gray-600 mt-2">
              Complete the form below to apply for this financial service. You
              can save your progress and return later if needed.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1">
        <ServiceRequestForm
          schema={financialApplicationSchema}
          onSubmit={handleSubmit}
          onSave={handleSave}
          initialData={{}}
          enablePersistence={true}
          enableAutoSave={true}
        />
      </div>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default FinancialApplicationForm;
