import React from 'react';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';
export function OnboardingStep({
    stepData,
    formData,
    errors,
    touchedFields,
    onChange,
    validateField,
}) {
    const renderTooltip = (tooltipText) => {
        return (
            <div className="group relative inline-block ml-1">
                <InfoIcon size={14} className="text-gray-400 cursor-help" />
                <div className="absolute z-10 w-64 p-2 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-1/2 transform -translate-x-1/2 mb-1 pointer-events-none">
                    {tooltipText}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                </div>
            </div>
        );
    };
    const renderField = (field) => {
        const fieldValue = formData[field.fieldName] || '';
        const hasError = !!errors[field.fieldName];
        const isTouched = !!touchedFields[field.fieldName];
        return (
            <div key={field.id} className="space-y-2 mb-6">
                <label
                    htmlFor={field.fieldName}
                    className="block text-sm font-medium text-gray-700 flex items-center"
                >
                    {field.label}
                    {field.required && <span className="ml-1 text-red-500">*</span>}
                    {field.tooltip && renderTooltip(field.tooltip)}
                </label>
                {field.type === 'textarea' ? (
                    <textarea
                        id={field.fieldName}
                        name={field.fieldName}
                        value={fieldValue}
                        onChange={(e) => onChange(field.fieldName, e.target.value)}
                        onBlur={() => validateField(field.fieldName, fieldValue)}
                        rows={4}
                        placeholder={field.placeholder || ''}
                        className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    />
                ) : field.type === 'select' ? (
                    <select
                        id={field.fieldName}
                        name={field.fieldName}
                        value={fieldValue}
                        onChange={(e) => onChange(field.fieldName, e.target.value)}
                        onBlur={() => validateField(field.fieldName, fieldValue)}
                        className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    >
                        {field.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={field.type || 'text'}
                        id={field.fieldName}
                        name={field.fieldName}
                        value={fieldValue}
                        onChange={(e) => onChange(field.fieldName, e.target.value)}
                        onBlur={() => validateField(field.fieldName, fieldValue)}
                        placeholder={field.placeholder || ''}
                        min={field.min}
                        max={field.max}
                        className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    />
                )}
                {field.formatHint && !hasError && (
                    <p className="text-xs text-gray-500 mt-1">{field.formatHint}</p>
                )}
                {hasError && isTouched && (
                    <div className="text-red-500 text-sm mt-1 flex items-start">
                        <AlertCircleIcon
                            size={14}
                            className="mr-1.5 flex-shrink-0 mt-0.5"
                        />
                        <span>{errors[field.fieldName]}</span>
                    </div>
                )}
                {field.helpText && !hasError && (
                    <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                )}
            </div>
        );
    };
    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    {stepData.title}
                </h2>
                <p className="text-gray-600">
                    Please provide the following essential details
                </p>
            </div>
            {stepData.sections ? (
                <div className="space-y-10">
                    {stepData.sections.map((section, index) => (
                        <div key={index} className="space-y-6">
                            <div className="border-b border-gray-200 pb-2">
                                <h3 className="text-lg font-medium text-gray-800">
                                    {section.title}
                                </h3>
                                {section.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {section.description}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {section.fields.map((field) => renderField(field))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {stepData.fields.map((field) => renderField(field))}
                </div>
            )}
        </div>
    );
}
