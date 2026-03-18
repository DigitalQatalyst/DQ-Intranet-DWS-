import React, { useEffect, useState } from 'react';
import { useMsal } from "@azure/msal-react";
import {
    User,
    Mail,
    Briefcase,
    Calendar,
    AlertCircle,
    MapPin,
    Globe,
    CreditCard,
    GraduationCap,
    HeartPulse,
    Edit3,
    Check,
    X,
    Bell,
    Settings,
    UserCircle,
    Info,
    FileText,
    Clock
} from 'lucide-react';
// import { getOnboardingData, saveOnboardingData } from '../../../services/employeeOnboardingService';
import { BurgerMenuButton } from '../../../components/Sidebar';

const ProfilePage: React.FC = () => {
    const { accounts } = useMsal();
    const account = accounts[0];
    const [onboardingData, setOnboardingData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    // UI state
    const [isOpen, setIsOpen] = useState(true);

    const employeeId = account?.localAccountId || account?.username || "";

    useEffect(() => {
        const loadEmployeeData = async () => {
            if (!employeeId) return;
            setLoading(true);
            try {
                // Temporarily disabled - employeeOnboardingService removed
                // const data = await getOnboardingData(employeeId);
                setOnboardingData({});
                setEditData({});
            } catch (error) {
                console.error("Error loading employee profile:", error);
            } finally {
                setLoading(false);
            }
        };

        loadEmployeeData();
    }, [employeeId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Temporarily disabled - employeeOnboardingService removed
            // const result = await saveOnboardingData(employeeId, editData);
            // if (result.success) {
                setOnboardingData(editData);
                setIsEditing(false);
            // }
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditData(onboardingData);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2E6E]"></div>
                    <p className="text-gray-500 font-medium">Synchronizing profile data...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'personal', label: 'Personal Information', icon: UserCircle },
        { id: 'professional', label: 'Professional & Bio', icon: GraduationCap },
        { id: 'financial', label: 'Financial & Banking', icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
            {/* Premium Header Section */}
            <div className="bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#2A3F7E] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="lg:hidden">
                                <BurgerMenuButton
                                    onClick={() => setIsOpen(!isOpen)}
                                />
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 rounded-2xl bg-white/10 p-0.5 backdrop-blur-md border border-white/20">
                                    <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-white font-black text-3xl">
                                        {account?.name?.charAt(0) || <User size={32} />}
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                        {account?.name || "Employee Profile"}
                                    </h1>
                                    <div className="flex items-center gap-4 mt-2">
                                        <p className="text-blue-200/80 text-sm flex items-center gap-1.5 font-medium">
                                            <Briefcase size={14} className="text-blue-300" />
                                            {onboardingData?.role || "Corporate Pioneer"}
                                        </p>
                                        <span className="h-1 w-1 rounded-full bg-blue-300/40"></span>
                                        <p className="text-blue-200/80 text-sm flex items-center gap-1.5 font-medium">
                                            <Mail size={14} className="text-blue-300" />
                                            {account?.username}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all group">
                                <Bell size={20} className="text-white group-hover:scale-110 transition-transform" />
                            </button>
                            <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all group">
                                <Settings size={20} className="text-white group-hover:scale-110 transition-transform" />
                            </button>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FB5535] hover:bg-[#e24a2d] 
                                             text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 
                                             transition-all duration-200 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                                >
                                    <Edit3 size={18} />
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
                                    >
                                        <X size={18} />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 
                                                 text-white font-bold rounded-xl shadow-lg shadow-green-500/25 
                                                 transition-all duration-200"
                                    >
                                        {saving ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Check size={18} />}
                                        <span>Save Changes</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-1 mt-10 -mb-10 overflow-x-auto no-scrollbar pt-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold rounded-t-2xl transition-all relative whitespace-nowrap
                                        ${activeTab === tab.id
                                            ? 'bg-white text-[#030F35] shadow-lg translate-y-[-2px]'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                                >
                                    <Icon size={18} className={activeTab === tab.id ? 'text-[#1A2E6E]' : 'text-blue-300'} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FB5535] rounded-t-full"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Detailed Information */}
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === 'overview' && (
                            <>
                                {/* Professional Bio */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 p-8 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-8 text-blue-50 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                        <FileText size={160} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <div className="w-2 h-6 bg-[#FB5535] rounded-full"></div>
                                        Professional Summary
                                    </h3>
                                    <div className="relative z-10">
                                        {isEditing ? (
                                            <textarea
                                                className="w-full h-40 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700 text-sm leading-relaxed"
                                                value={editData?.bio || ""}
                                                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                                placeholder="Write a brief professional summary about yourself..."
                                            />
                                        ) : (
                                            <p className="text-gray-600 leading-relaxed font-medium">
                                                {onboardingData?.bio || "No professional summary has been added yet. Update your profile to share your journey."}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Core Competencies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(onboardingData?.technicalSkills?.split(',') || ['Digital Leadership', 'Innovation']).map((skill: string) => (
                                                <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100/50">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Interests</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(onboardingData?.hobbies?.split(',') || ['Strategic Mentoring', 'FinTech']).map((hobby: string) => (
                                                <span key={hobby} className="px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100/50">
                                                    {hobby.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'personal' && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 p-8">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                                    Personal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                    {[
                                        { id: 'dob', label: "Date of Birth", value: onboardingData?.dob, icon: Calendar, type: 'date' },
                                        {
                                            id: 'gender',
                                            label: "Gender",
                                            value: onboardingData?.gender,
                                            icon: UserCircle,
                                            type: 'select',
                                            options: ['Male', 'Female', 'Other']
                                        },
                                        {
                                            id: 'maritalStatus',
                                            label: "Marital Status",
                                            value: onboardingData?.maritalStatus,
                                            icon: HeartPulse,
                                            type: 'select',
                                            options: ['Single', 'Married', 'Divorced', 'Widowed']
                                        },
                                        { id: 'countryOfCitizenship', label: "Nationality", value: onboardingData?.countryOfCitizenship, icon: Globe },
                                        { id: 'countryOfResidence', label: "Current Residence", value: onboardingData?.countryOfResidence, icon: MapPin },
                                        { id: 'personalEmail', label: "Personal Email", value: onboardingData?.personalEmail, icon: Mail, type: 'email' }
                                    ].map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <div key={item.label} className="flex items-start gap-4 group">
                                                <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shrink-0">
                                                    <Icon size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                                                    {isEditing ? (
                                                        item.type === 'select' ? (
                                                            <select
                                                                className="w-full mt-1 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                                value={editData?.[item.id] || ""}
                                                                onChange={(e) => setEditData({ ...editData, [item.id]: e.target.value })}
                                                            >
                                                                <option value="">Select...</option>
                                                                {item.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                            </select>
                                                        ) : (
                                                            <input
                                                                type={item.type || 'text'}
                                                                className="w-full mt-1 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                                value={editData?.[item.id] || ""}
                                                                onChange={(e) => setEditData({ ...editData, [item.id]: e.target.value })}
                                                            />
                                                        )
                                                    ) : (
                                                        <p className="text-sm font-bold text-gray-800 mt-0.5">{item.value || "Not provided"}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="md:col-span-2 flex items-start gap-4">
                                        <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl shrink-0">
                                            <MapPin size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Permanent Address</p>
                                            {isEditing ? (
                                                <textarea
                                                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                                                    value={editData?.homeAddress || ""}
                                                    onChange={(e) => setEditData({ ...editData, homeAddress: e.target.value })}
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-gray-800 mt-0.5 leading-relaxed">
                                                    {onboardingData?.homeAddress || "Please update your residential address in the personal information tab."}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'professional' && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 p-8">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                                    Education & Skills
                                </h3>
                                <div className="space-y-10">
                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                                            <GraduationCap size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">Academic Background</h4>
                                            {isEditing ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Degree"
                                                        value={editData?.degreeAttained || ""}
                                                        onChange={(e) => setEditData({ ...editData, degreeAttained: e.target.value })}
                                                    />
                                                    <input
                                                        className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Major/Field"
                                                        value={editData?.majorStudy || ""}
                                                        onChange={(e) => setEditData({ ...editData, majorStudy: e.target.value })}
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-lg font-bold text-[#1A2E6E]">{onboardingData?.degreeAttained || "Degree not specified"}</p>
                                                    <p className="text-sm text-gray-500 font-medium">
                                                        {onboardingData?.majorStudy} • {onboardingData?.highestEducationLevel}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                            <Settings size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">Technical Skills & Tools</h4>
                                            {isEditing ? (
                                                <textarea
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                                                    placeholder="Comma separated skills (e.g. React, Python, Project Management)"
                                                    value={editData?.technicalSkills || ""}
                                                    onChange={(e) => setEditData({ ...editData, technicalSkills: e.target.value })}
                                                />
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {(onboardingData?.technicalSkills?.split(',') || ['Digital Leadership', 'Innovation']).map((skill: string) => (
                                                        <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100/50">
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                                            <Globe size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">Languages</h4>
                                            {isEditing ? (
                                                <input
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={editData?.languages || ""}
                                                    onChange={(e) => setEditData({ ...editData, languages: e.target.value })}
                                                />
                                            ) : (
                                                <p className="text-gray-800 font-bold">{onboardingData?.languages || "English (Native)"}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'financial' && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 p-8">
                                <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                                    <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                                    Banking & Payroll
                                </h3>
                                <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-3xl p-8 border border-gray-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700 text-[#1A2E6E]">
                                        <CreditCard size={180} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Holder</p>
                                            {isEditing ? (
                                                <input
                                                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-800"
                                                    value={editData?.bankAccountName || ""}
                                                    onChange={(e) => setEditData({ ...editData, bankAccountName: e.target.value })}
                                                />
                                            ) : (
                                                <p className="text-lg font-black text-gray-800">{onboardingData?.bankAccountName || account?.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bank Institution</p>
                                            {isEditing ? (
                                                <input
                                                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-800"
                                                    value={editData?.bankName || ""}
                                                    onChange={(e) => setEditData({ ...editData, bankName: e.target.value })}
                                                />
                                            ) : (
                                                <p className="text-lg font-black text-gray-800">{onboardingData?.bankName || "Standard Chartered"}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-2 mb-2 gap-4">
                                                <div className="flex-1 w-full">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">IBAN Number</p>
                                                    {isEditing ? (
                                                        <input
                                                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-[#1A2E6E] tracking-widest"
                                                            value={editData?.iban || ""}
                                                            onChange={(e) => setEditData({ ...editData, iban: e.target.value })}
                                                            placeholder="AE00 0000..."
                                                        />
                                                    ) : (
                                                        <p className="text-xl font-black text-[#1A2E6E] tracking-widest">
                                                            {onboardingData?.iban ? onboardingData.iban.replace(/(.{4})/g, '$1 ') : 'AE00 0000 0000 0000 0000 000'}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="md:text-right w-full md:w-auto">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">SWIFT / BIC</p>
                                                    {isEditing ? (
                                                        <input
                                                            className="w-full md:w-32 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 tracking-wider font-mono uppercase"
                                                            value={editData?.swiftCode || ""}
                                                            onChange={(e) => setEditData({ ...editData, swiftCode: e.target.value })}
                                                        />
                                                    ) : (
                                                        <p className="text-sm font-bold text-gray-700 tracking-wider font-mono uppercase">{onboardingData?.swiftCode || "STCHAEAD"}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold italic">* Information encrypted and securely stored in compliance with PDPL.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - System Integration & Support */}
                    <div className="space-y-8">
                        {/* Profile Health */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-sm font-black text-gray-900 mb-6 flex items-center gap-2">
                                <Clock className="text-blue-600" size={16} />
                                Profile Integrity
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-500 font-bold">Data Accuracy</span>
                                        <span className="font-black text-blue-600">92%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/20" style={{ width: '92%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-500 font-bold">Document Validity</span>
                                        <span className="font-black text-green-600">Active</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg shadow-green-500/20" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Quick Glance */}
                        <div className="bg-[#FB5535] rounded-3xl shadow-xl shadow-orange-500/20 p-6 text-white text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <HeartPulse size={24} className="animate-pulse" />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-widest mb-1">Emergency Contact</h4>
                            <p className="text-lg font-bold">{onboardingData?.emergencyName || "Not Nominated"}</p>
                            <p className="text-white/80 text-sm font-medium mt-1">{onboardingData?.emergencyPhone || "---"}</p>
                            <button className="mt-6 w-full py-2.5 bg-white/15 hover:bg-white/25 text-xs font-bold rounded-xl transition-all border border-white/20">
                                View Details
                            </button>
                        </div>

                        {/* Helpful Information */}
                        <div className="bg-gray-900 rounded-3xl p-6 text-white">
                            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                                <AlertCircle size={16} className="text-orange-400" />
                                Support Letter
                            </h3>
                            <p className="text-gray-400 text-xs leading-relaxed mb-6 font-medium">
                                Need an employment certificate or a bank salary transfer letter? You can request these directly through the Service Hub.
                            </p>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all border border-white/10">
                                Open Service Hub
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
