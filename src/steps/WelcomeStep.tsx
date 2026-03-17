import { BuildingIcon } from 'lucide-react';

export function WelcomeStep({
    formData,
    errors,
    onInputChange,
}) {
    const departments = [
        { id: 'solutions', label: 'Solutions', roles: ['Full Stack Developer', 'Feature Developer', 'Product Owner', 'DevOps'] },
        { id: 'hra', label: 'HRA', roles: ['H2O', 'O2P'] },
        { id: 'content', label: 'Content', roles: ['Marketing', 'Stories'] },
        { id: 'deals', label: 'Deals', roles: ['Finance', 'Business Development'] },
        { id: 'support', label: 'Support', roles: ['Desk24'] },
        { id: 'coe', label: 'CoE', roles: ['CTO', 'CEO', 'HR'] },
    ];

    const currentDepartment = departments.find(d => d.id === formData.department);
    const roleOptions = currentDepartment ? currentDepartment.roles : [];

    const handleDepartmentChange = (deptId: string) => {
        onInputChange('department', deptId);
        // Reset role when department changes
        onInputChange('role', '');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-center">
                <div className="bg-blue-100 p-5 rounded-full">
                    <BuildingIcon size={44} className="text-blue-600" />
                </div>
            </div>

            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
                    Welcome to DWS Dashboard
                </h2>
                <p className="text-gray-600 max-w-md mx-auto">
                    Please provide your department, role, and studio to customize your onboarding experience. Your basic information has been pre-filled.
                </p>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
                    Professional Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Read-only Name */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-600">Name</label>
                        <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed flex items-center">
                            {formData.tradeName || formData.name || 'Not provided'}
                        </div>
                    </div>

                    {/* Read-only Email */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-600">Email</label>
                        <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed flex items-center">
                            {formData.email || 'Not provided'}
                        </div>
                    </div>

                    {/* Studio Selection */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">
                            Studio <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.studio || ''}
                            onChange={e => onInputChange('studio', e.target.value)}
                            className={`w-full px-4 py-3 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.studio ? 'border-red-300 ring-2 ring-red-500/10' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select Studio</option>
                            <option value="NBO">NBO (Nairobi)</option>
                            <option value="DXB">DXB (Dubai)</option>
                        </select>
                        {errors.studio && (
                            <p className="text-red-500 text-xs mt-1">{errors.studio}</p>
                        )}
                    </div>

                    {/* Department Selection */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">
                            Department <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.department || ''}
                            onChange={e => handleDepartmentChange(e.target.value)}
                            className={`w-full px-4 py-3 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.department ? 'border-red-300 ring-2 ring-red-500/10' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.label}</option>
                            ))}
                        </select>
                        {errors.department && (
                            <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                        )}
                    </div>

                    {/* Role Selection (Dependent on Department) */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-gray-700">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.role || ''}
                            onChange={e => onInputChange('role', e.target.value)}
                            disabled={!formData.department}
                            className={`w-full px-4 py-3 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${!formData.department ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''
                                } ${errors.role ? 'border-red-300 ring-2 ring-red-500/10' : 'border-gray-300'
                                }`}
                        >
                            <option value="">{formData.department ? 'Select Role' : 'Select Department first'}</option>
                            {roleOptions.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5 text-transparent bg-clip-text">
                        <label className="block text-sm font-semibold text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="e.g. +254 7XX XXX XXX"
                            value={formData.phone || ''}
                            onChange={e => onInputChange('phone', e.target.value)}
                            className={`w-full px-4 py-3 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.phone ? 'border-red-300 ring-2 ring-red-500/10' : 'border-gray-300'
                                }`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
                <p className="text-sm text-blue-800/80 leading-relaxed font-medium">
                    We'll guide you through a few steps to complete your profile. Your progress is saved automatically so you can resume at any time.
                </p>
            </div>
        </div>
    );
}