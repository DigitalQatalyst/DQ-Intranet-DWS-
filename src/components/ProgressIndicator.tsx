import { useRef } from 'react';
import { CheckIcon, ChevronRightIcon, ChevronDownIcon, XIcon, CheckCircleIcon } from 'lucide-react';

export function ProgressIndicator({
    steps,
    currentStep,
    showStepsDropdown,
    autoSaving,
    progressSaved,
    onToggleDropdown,
    onJumpToStep,
    getStepCompletionStatus,
}) {
    const stepsDropdownRef = useRef(null);

    const MobileStepper = () => (
        <div className="md:hidden">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <div className="text-sm font-medium text-gray-600">
                        Step {currentStep + 1} of {steps.length}
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mt-1">
                        {steps[currentStep].title}
                    </div>
                </div>
                <button
                    type="button"
                    className="flex items-center text-blue-600 text-sm font-medium"
                    onClick={onToggleDropdown}
                >
                    {showStepsDropdown ? (
                        <>
                            <XIcon size={16} className="mr-1" />
                            Close
                        </>
                    ) : (
                        <>
                            All Steps
                            <ChevronDownIcon size={16} className="ml-1" />
                        </>
                    )}
                </button>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-200 rounded-full mb-5">
                <div
                    className="h-1.5 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
            </div>

            {/* Steps dropdown */}
            {showStepsDropdown && (
                <div
                    className="absolute top-[140px] left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg max-h-[50vh] overflow-y-auto"
                    ref={stepsDropdownRef}
                >
                    <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h4 className="font-medium text-gray-700">All Steps</h4>
                        <button onClick={onToggleDropdown} className="text-gray-500">
                            <XIcon size={18} />
                        </button>
                    </div>
                    <div className="py-2">
                        {steps.map((step, index) => {
                            const isComplete = getStepCompletionStatus(index);
                            const isCurrent = currentStep === index;

                            return (
                                <button
                                    key={step.id}
                                    className={`w-full text-left px-4 py-3 flex items-center ${isCurrent ? 'bg-blue-50' : 'hover:bg-gray-50'
                                        } border-b border-gray-100`}
                                    onClick={() => onJumpToStep(index)}
                                >
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${isCurrent
                                            ? 'bg-blue-100 text-blue-600 border-2 border-blue-500'
                                            : isComplete
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {isComplete && !isCurrent ? (
                                            <CheckIcon size={16} />
                                        ) : (
                                            <span>{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-700'}`}>
                                            {step.title}
                                        </div>
                                        {step.sections && (
                                            <div className="text-xs text-gray-500 mt-0.5">
                                                {step.sections.map(section => section.title).join(' • ')}
                                            </div>
                                        )}
                                    </div>
                                    {isCurrent && (
                                        <div className="text-blue-600 ml-2">
                                            <ChevronRightIcon size={16} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    const DesktopStepper = () => {
        return (
            <div className="hidden md:block mb-10">
                {/* Scrollable Step Icons */}
                <div
                    className="overflow-x-auto pb-4 custom-scrollbar"
                >
                    <div className="flex items-start min-w-max px-2 py-2">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center relative px-4 w-36 shrink-0"
                            >
                                <div
                                    className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full z-10 transition-all duration-300 ${index < currentStep
                                        ? 'bg-blue-500 text-white'
                                        : index === currentStep
                                            ? 'bg-white border-2 border-blue-500 text-blue-500 shadow-lg scale-110'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {index < currentStep ? (
                                        <CheckIcon size={18} />
                                    ) : (
                                        step.icon || <span>{index + 1}</span>
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="absolute h-[2px] bg-gray-200 top-5 sm:top-6 w-full left-1/2 -z-0">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-300"
                                            style={{ width: index < currentStep ? '100%' : '0%' }}
                                        />
                                    </div>
                                )}
                                <span className={`text-[10px] sm:text-xs mt-3 font-medium text-center leading-tight h-8 flex items-center justify-center ${index === currentStep ? 'text-blue-600 font-bold' : 'text-gray-600'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fixed Progress Bar and Info */}
                <div className="mt-2 space-y-4">
                    <div className="relative">
                        <div className="h-1.5 bg-gray-200 rounded-full">
                            <div
                                className="h-1.5 bg-blue-500 rounded-full transition-all duration-300 shadow-sm"
                                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                        {(autoSaving || progressSaved) && (
                            <div className={`flex items-center font-medium ${progressSaved ? 'text-green-600' : 'text-gray-500'}`}>
                                {autoSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-gray-400 border-t-transparent mr-2" />
                                        Auto-saving...
                                    </>
                                ) : progressSaved ? (
                                    <>
                                        <CheckCircleIcon size={16} className="mr-1.5" />
                                        Progress synced
                                    </>
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <DesktopStepper />
            <MobileStepper />
        </>
    );
}