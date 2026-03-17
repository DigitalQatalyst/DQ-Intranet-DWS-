import { Sidebar, HomeIcon, ChevronRightIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Footer } from '../../../components/Footer';
import { AuthProvider, Header } from '../../../components/Header';
import { PageLayout, PageSection, SectionHeader, SectionContent } from '../../../components/PageLayout';
import IntegrationsBillingTab from '../../../components/settings/IntegrationsBillingTab';
import PreferencesNotificationsTab from '../../../components/settings/PreferencesNotificationsTab';
import SecurityComplianceTab from '../../../components/settings/SecurityComplianceTab';
import UserRolesTab from '../../../components/settings/UserRolesTab';

export default function SettingsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const tabs = [{
        id: 'users-roles',
        title: 'Users & Roles',
        completion: 0,
        mandatoryCompletion: {
            percentage: 0
        }
    }, {
        id: 'security-compliance',
        title: 'Security & Compliance',
        completion: 0,
        mandatoryCompletion: {
            percentage: 0
        }
    }, {
        id: 'preferences-notifications',
        title: 'Preferences & Notifications',
        completion: 0,
        mandatoryCompletion: {
            percentage: 0
        }
    }, {
        id: 'integrations-billing',
        title: 'Integrations & Billing',
        completion: 0,
        mandatoryCompletion: {
            percentage: 0
        },
        comingSoon: true
    }];
    const renderTabContent = () => {
        switch (activeTabIndex) {
            case 0:
                return <UserRolesTab />;
            case 1:
                return <SecurityComplianceTab />;
            case 2:
                return <PreferencesNotificationsTab />;
            case 3:
                return <IntegrationsBillingTab />;
            default:
                return <UserRolesTab />;
        }
    };
    return <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex flex-1">
                <div className="flex-1">

                    <PageLayout title="Settings">
                        <PageSection>
                            <SectionHeader children={<></>} title="Settings" description="Configure your organization's settings, manage users, and control security preferences." />
                            <SectionContent className="p-0">
                                {/* Tabs */}
                                <div className="border-b border-gray-200">
                                    <div className="px-6 pt-4">
                                        <div className="flex space-x-8 overflow-x-auto">
                                            {tabs.map((tab, index) => <button key={tab.id} onClick={() => setActiveTabIndex(index)} className={`relative flex items-center py-4 px-1 border-b-2 whitespace-nowrap ${activeTabIndex === index ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} ${tab.comingSoon ? 'opacity-60 cursor-not-allowed' : ''}`} disabled={tab.comingSoon}>
                                                {tab.title}
                                                {tab.comingSoon && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    Coming Soon
                                                </span>}
                                            </button>)}
                                        </div>
                                    </div>
                                </div>
                                {/* Tab Content */}
                                <div className="p-6">{renderTabContent()}</div>
                            </SectionContent>
                        </PageSection>
                    </PageLayout>
                </div>
            </div>
        </div>
    </AuthProvider>;
}