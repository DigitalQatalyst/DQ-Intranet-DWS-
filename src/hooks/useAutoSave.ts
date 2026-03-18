// hooks/useAutoSave.ts
import { useState, useEffect, useRef } from "react";
import { useMsal } from "@azure/msal-react";
// import { saveOnboardingData } from "../services/employeeOnboardingService";

export function useAutoSave(formData, currentStep) {
  const [autoSaving, setAutoSaving] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<Record<string, any>>({});

  const { accounts } = useMsal();

  // Get employee ID from MSAL account
  const getEmployeeId = (): string => {
    const account = accounts[0];
    return account?.localAccountId || account?.username || "";
  };

  const hasFormDataChanged = () => {
    const currentKeys = Object.keys(formData);
    const savedKeys = Object.keys(lastSavedDataRef.current);

    if (currentKeys.length !== savedKeys.length) return true;

    return currentKeys.some(
      (key) => formData[key] !== lastSavedDataRef.current[key]
    );
  };

  const autoSaveFormData = async () => {
    if (!hasFormDataChanged()) return;

    const employeeId = getEmployeeId();
    if (!employeeId) {
      console.log("No employee ID available for auto-save");
      return;
    }

    setAutoSaving(true);
    try {
      const account = accounts[0];
      const employeeInfo = account ? {
        name: account.name || "",
        email: account.username || ""
      } : undefined;

      // Save to Supabase - temporarily disabled
      // const result = await saveOnboardingData(employeeId, formData, currentStep, employeeInfo);

      // if (result.success) {
        lastSavedDataRef.current = { ...formData };
        setProgressSaved(true);
        console.log("✅ Progress auto-saved (local only)");
        setTimeout(() => setProgressSaved(false), 3000);
      // } else {
      //   console.error("Auto-save failed:", result.error);
      // }
    } catch (error) {
      console.error("Error auto-saving progress:", error);
    } finally {
      setAutoSaving(false);
    }
  };

  const saveProgress = async () => {
    if (Object.keys(formData).length === 0) return;

    setSavingProgress(true);
    try {
      await autoSaveFormData();
    } finally {
      setSavingProgress(false);
    }
  };

  // Auto-save effect - triggers 2 seconds after form data changes
  useEffect(() => {
    if (Object.keys(formData).length > 0 && hasFormDataChanged()) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(autoSaveFormData, 2000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, currentStep]);

  return {
    autoSaving,
    progressSaved,
    savingProgress,
    saveProgress,
  };
}
