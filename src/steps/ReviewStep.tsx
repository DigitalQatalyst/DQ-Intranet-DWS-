// steps/ReviewStep.js
import React from 'react';
import { CheckIcon } from 'lucide-react';

export function ReviewStep({ formData, isRevisit }) {
    const dataGroups = [
        {
            title: 'Welcome Information',
            fields: [
                { label: 'Name', value: formData.tradeName },
                { label: 'Role', value: formData.role },
                { label: 'Email', value: formData.email },
                { label: 'Phone', value: formData.phone },
            ],
        },
        {
            title: 'Professional Summary',
            fields: [
                { label: 'Bio', value: formData.bio },
                { label: 'Hobbies', value: formData.hobbies },
                { label: 'Technical Skills', value: formData.technicalSkills },
                { label: 'Functional Skills', value: formData.functionalSkills },
                { label: 'Soft Skills', value: formData.softSkills },
                { label: 'Key Competencies', value: formData.keyCompetencies },
                { label: 'Languages', value: formData.languages },
            ],
        },
        {
            title: 'Profile Information',
            fields: [
                { label: 'Date of Birth', value: formData.dob },
                { label: 'Gender', value: formData.gender },
                { label: 'Personal Email', value: formData.personalEmail },
                { label: 'Marital Status', value: formData.maritalStatus },
                { label: 'Address', value: formData.homeAddress },
                { label: 'Home Country', value: formData.homeCountry },
                { label: 'Children', value: formData.numberOfChildren },
                { label: 'Dependants', value: formData.numberOfDependants },
            ],
        },
        {
            title: 'Identity Information',
            fields: [
                { label: 'Residence', value: formData.countryOfResidence },
                { label: 'Citizenship', value: formData.countryOfCitizenship },
                { label: 'National ID', value: formData.nationalIdNumber },
                { label: 'Passport No.', value: formData.passportNumber },
                { label: 'Passport Expiry', value: formData.passportExpiryDate },
                { label: 'KRA Pin', value: formData.kraPin },
                { label: 'Emirates ID', value: formData.emiratesIdNumber },
                { label: 'UAE Visa Type', value: formData.uaeVisaType },
            ],
        },
        {
            title: 'Education',
            fields: [
                { label: 'Highest Level', value: formData.highestEducationLevel },
                { label: 'Degree', value: formData.degreeAttained },
                { label: 'Major', value: formData.majorStudy },
                { label: 'Further Study Aspirations', value: formData.furtherStudyAspirations },
                { label: 'Further Study Status', value: formData.furtherStudyStatus },
            ],
        },
        {
            title: 'Work Experience',
            fields: [
                { label: 'Years of Experience', value: formData.yearsExperience },
                { label: 'Skill 1', value: formData.skill1 },
                { label: 'Skill 2', value: formData.skill2 },
                { label: 'Skill 3', value: formData.skill3 },
            ],
        },
        {
            title: 'Proficiency',
            fields: [
                { label: 'Tools & Systems', value: formData.toolsSystemProficiency },
            ],
        },
        {
            title: 'Payroll Information',
            fields: [
                { label: 'Bank Name', value: formData.bankName },
                { label: 'Account Name', value: formData.bankAccountName },
                { label: 'Account Number', value: formData.bankAccountNumber },
                { label: 'IBAN', value: formData.iban },
                { label: 'Mpesa Name', value: formData.mpesaAccountName },
                { label: 'Mpesa Number', value: formData.mpesaAccountNumber },
            ],
        },
        {
            title: 'Health Information',
            fields: [
                { label: 'Allergies', value: formData.allergies },
                { label: 'Conditions', value: formData.medicalConditions },
                { label: 'Medications', value: formData.currentMedications },
                { label: 'Dietary Restrictions', value: formData.dietaryRestrictions },
            ],
        },
        {
            title: 'Emergency Contact',
            fields: [
                { label: 'Name', value: formData.emergencyName },
                { label: 'Relationship', value: formData.emergencyRelationship },
                { label: 'Phone', value: formData.emergencyPhone },
                { label: 'Email', value: formData.emergencyEmail },
            ],
        },
        {
            title: 'Referee',
            fields: [
                { label: 'Name', value: formData.refereeName },
                { label: 'Organization', value: formData.refereeOrganization },
                { label: 'Position', value: formData.refereePosition },
                { label: 'Phone', value: formData.refereePhone },
                { label: 'Email', value: formData.refereeEmail },
            ],
        },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <div className="flex justify-center mb-5">
                    <div className="bg-green-100 p-5 rounded-full">
                        <CheckIcon size={36} className="text-green-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    {isRevisit ? 'Review Your Information' : 'Almost Done!'}
                </h2>
                <p className="text-gray-600">
                    {isRevisit
                        ? "Here's a summary of all your onboarding information. You can go back to any section to make changes."
                        : 'Please review your information before completing onboarding.'}
                </p>
            </div>

            <div className="space-y-6">
                {dataGroups.map((group, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                        <div className="bg-gray-100 px-5 py-3 border-b border-gray-200">
                            <h3 className="font-medium text-gray-700">{group.title}</h3>
                        </div>
                        <div className="p-5">
                            <dl className="grid grid-cols-1 gap-4">
                                {group.fields.map((field, fieldIndex) =>
                                    field.value ? (
                                        <div key={fieldIndex} className="flex justify-between">
                                            <dt className="text-sm font-medium text-gray-500">{field.label}:</dt>
                                            <dd className="text-sm text-gray-800 text-right flex items-center justify-end max-w-xs">
                                                <span className="break-words">{field.value}</span>
                                            </dd>
                                        </div>
                                    ) : null
                                )}
                            </dl>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mt-6">
                <p className="text-sm text-blue-700 text-center">
                    {isRevisit
                        ? 'You can update your information at any time by navigating to the Onboarding section from the sidebar.'
                        : "After completing onboarding, you'll be able to add more details to your profile."}
                </p>
            </div>
        </div>
    );
}
