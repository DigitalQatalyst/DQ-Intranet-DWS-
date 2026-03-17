import { saveProfileData } from "./DataverseService";
// Check if user has completed onboarding
export const checkOnboardingStatus = async () => {
  // In a real implementation, this would check against a Dataverse API
  // For now, we'll check localStorage to simulate persistence
  const onboardingStatus = localStorage.getItem("onboardingComplete");
  if (onboardingStatus === "true") {
    return true;
  }
  try {
    // Simulate API call to check if profile data exists
    // In a real implementation, this would check if mandatory fields are filled
    const response = await fetch("/api/onboarding/status");
    const data = await response.json();
    return data.isComplete;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // Default to false if there's an error
    return false;
  }
};
// Save onboarding progress (intermediate state)
export const saveOnboardingProgress = async (formData) => {
  try {
    // In a real implementation, this would save to Dataverse or another backend
    // For now, we'll use localStorage to simulate persistence
    localStorage.setItem("onboardingProgress", JSON.stringify(formData));
    // Also save the partial data to Dataverse for incremental saving
    // Only send the fields that have values
    const partialData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] && formData[key].toString().trim() !== "") {
        partialData[key] = formData[key];
      }
    });
    if (Object.keys(partialData).length > 0) {
      // Transform the partial data into the structured format expected by Dataverse
      const structuredData =
        transformPartialFormDataToDataverseFormat(partialData);
      // Save the partial data using the existing dataverseService
      // In a real implementation, this would use a different endpoint or flag
      // to indicate this is a partial save
      await saveProfileData(structuredData); // true indicates partial save
    }
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error("Error saving onboarding progress:", error);
    throw error;
  }
};
// Save onboarding data to Dataverse (final submission)
export const saveOnboardingData = async (formData) => {
  try {
    // Clean the form data - trim string values
    const cleanedData = {};
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "string") {
        cleanedData[key] = formData[key].trim();
      } else {
        cleanedData[key] = formData[key];
      }
    });
    // Transform the form data into the structured format expected by Dataverse
    const structuredData = transformFormDataToDataverseFormat(cleanedData);
    // Save the data using the existing dataverseService
    await saveProfileData(structuredData);
    // Mark onboarding as complete in localStorage
    localStorage.setItem("onboardingComplete", "true");
    return true;
  } catch (error) {
    console.error("Error saving onboarding data:", error);
    throw error;
  }
};
// Helper function to transform partial form data into structured Dataverse format
function transformPartialFormDataToDataverseFormat(partialData) {
  // Create sections structure with the provided fields
  // This is similar to the full transform but handles partial data
  const sections = {};
  // Basic section fields
  const basicFields = [
    "tradeName",
    "industry",
    "businessSize",
    "registrationNumber",
    "establishmentDate",
    "businessPitch",
    "problemStatement",
    "employeeCount",
    "founders",
    "foundingYear",
    "initialCapital",
    "fundingNeeds",
    "needsList",
  ];
  // Contact section fields
  const contactFields = [
    "contactName",
    "email",
    "phone",
    "address",
    "city",
    "country",
    "website",
  ];
  // Check if we have any basic section fields
  const hasBasicFields = basicFields.some((field) => field in partialData);
  if (hasBasicFields) {
    sections.basic = {
      fields: {},
      status: {},
    };
    basicFields.forEach((field) => {
      if (field in partialData) {
        sections.basic.fields[field] = partialData[field];
        sections.basic.status[field] = "completed";
      }
    });
  }
  // Check if we have any contact section fields
  const hasContactFields = contactFields.some((field) => field in partialData);
  if (hasContactFields) {
    sections.contact = {
      fields: {},
      status: {},
    };
    contactFields.forEach((field) => {
      if (field in partialData) {
        sections.contact.fields[field] = partialData[field];
        sections.contact.status[field] = "completed";
      }
    });
  }
  // Construct the partial profile data object
  return {
    id: partialData.id || generateTemporaryId(),
    name: partialData.tradeName || "Company Name",
    companyType: partialData.industry || "Industry",
    companySize: partialData.businessSize || "Company Size",
    companyStage: partialData.companyStage || "startup",
    sections,
  };
}
// Helper function to transform form data into structured Dataverse format
function transformFormDataToDataverseFormat(formData) {
  // Create sections structure with the provided fields
  const sections = {
    basic: {
      fields: {
        tradeName: formData.tradeName || "",
        industry: formData.industry || "",
        businessSize: formData.businessSize || "",
        registrationNumber: formData.registrationNumber || "",
        establishmentDate: formData.establishmentDate || "",
        businessPitch: formData.businessPitch || "",
        problemStatement: formData.problemStatement || "",
        employeeCount: formData.employeeCount || "",
        founders: formData.founders || "",
        foundingYear: formData.foundingYear || "",
        initialCapital: formData.initialCapital || "",
        fundingNeeds: formData.fundingNeeds || "",
        needsList: formData.needsList || "",
      },
      status: {
        tradeName: "completed",
        industry: "completed",
        businessSize: "completed",
        registrationNumber: "completed",
        establishmentDate: "completed",
        businessPitch: "completed",
        problemStatement: "completed",
        employeeCount: "completed",
        founders: "completed",
        foundingYear: "completed",
        initialCapital: "completed",
        fundingNeeds: formData.fundingNeeds ? "completed" : "editable",
        needsList: "completed",
      },
    },
    contact: {
      fields: {
        contactName: formData.contactName || "",
        email: formData.email || "",
        phone: formData.phone || "",
        address: formData.address || "",
        city: formData.city || "",
        country: formData.country || "",
        website: formData.website || "",
      },
      status: {
        contactName: "completed",
        email: "completed",
        phone: "completed",
        address: "completed",
        city: "completed",
        country: "completed",
        website: formData.website ? "completed" : "editable",
      },
    },
  };
  // Construct the complete profile data object
  return {
    id: formData.id || generateTemporaryId(),
    name: formData.tradeName || "Company Name",
    companyType: formData.industry || "Industry",
    companySize: formData.businessSize || "Company Size",
    companyStage: formData.companyStage || "startup",
    sections,
  };
}
// Generate a temporary ID for the profile
function generateTemporaryId() {
  return Date.now().toString();
}
