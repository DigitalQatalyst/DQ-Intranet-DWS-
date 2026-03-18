import React from 'react';
import { OnboardingStep } from './OnboardingStep';

import { ArrowLeftIcon } from 'lucide-react';
import { onboardingSteps } from '../../../config/onboardingSteps';
import { useAutoSave } from '../../../hooks/useAutoSave';
import { useOnboardingForm } from '../../../hooks/useOnboardingForm';
import { ReviewStep } from '../../../steps/ReviewStep';
import { WelcomeStep } from '../../../steps/WelcomeStep';
import { ProgressIndicator } from '../../../components/ProgressIndicator';
import { StepNavigation } from '../../../components/NavigationButtons';

export function OnboardingForm({ onComplete, isRevisit = false }) {
    // Custom hooks for state management
    const {
        currentStep,
        formData,
        errors,
        touchedFields,
        editedFields,
        isEditingWelcome,
        showStepsDropdown,
        loading,
        setCurrentStep,
        setShowStepsDropdown,
        setIsEditingWelcome: _setIsEditingWelcome,
        handleInputChange,
        validateCurrentStep,
        validateField,
        toggleWelcomeEdit,
        handleSubmit: submitForm,
        handleJumpToStep,
        getStepCompletionStatus,
    } = useOnboardingForm(onboardingSteps, onComplete, isRevisit);

    const {
        autoSaving,
        progressSaved,
        saveProgress,
    } = useAutoSave(formData, currentStep, isEditingWelcome);

    const handleNext = async () => {
        if (validateCurrentStep()) {
            await saveProgress();
            if (currentStep < onboardingSteps.length - 1) {
                setCurrentStep(currentStep + 1);
                window.scrollTo(0, 0);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleSubmit = async () => {
        if (isRevisit) {
            onComplete();
        } else {
            await submitForm();
            localStorage.setItem("onboardingComplete", "true")
        }
    };

    const renderStepContent = () => {
        const step = onboardingSteps[currentStep];

        switch (step.type) {
            case 'welcome':
                return (
                    <WelcomeStep
                        formData={formData}
                        errors={errors}
                        isEditingWelcome={isEditingWelcome}
                        editedFields={editedFields}
                        isRevisit={isRevisit}
                        onInputChange={handleInputChange}
                        onToggleEdit={toggleWelcomeEdit}
                    />
                );

            case 'review':
                return (
                    <ReviewStep
                        formData={formData}
                        isRevisit={isRevisit}
                    />
                );

            default:
                return (
                    <OnboardingStep
                        stepData={step}
                        formData={formData}
                        errors={errors}
                        touchedFields={touchedFields}
                        onChange={handleInputChange}
                        validateField={validateField}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 md:py-20">
            <div className="max-w-3xl mx-auto w-full px-4 sm:px-6">
                {/* Back to Dashboard button (only when revisiting) */}
                {isRevisit && (
                    <div className="mb-6">
                        <button
                            onClick={onComplete}
                            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                            <ArrowLeftIcon size={16} className="mr-1" />
                            Back to Dashboard
                        </button>
                    </div>
                )}

                {/* Progress Indicator */}
                <ProgressIndicator
                    steps={onboardingSteps}
                    currentStep={currentStep}
                    showStepsDropdown={showStepsDropdown}
                    autoSaving={autoSaving}
                    progressSaved={progressSaved}
                    onToggleDropdown={() => setShowStepsDropdown(!showStepsDropdown)}
                    onJumpToStep={handleJumpToStep}
                    getStepCompletionStatus={getStepCompletionStatus}
                />

                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-10 relative">
                    {/* Step Content */}
                    {renderStepContent()}

                    {/* Navigation */}
                    <StepNavigation
                        currentStep={currentStep}
                        totalSteps={onboardingSteps.length}
                        loading={loading}
                        isRevisit={isRevisit}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        onSaveProgress={saveProgress}
                        onSubmit={handleSubmit}
                        savingProgress={false} // This should come from useAutoSave hook
                    />
                </div>
            </div>
        </div>
    );
}