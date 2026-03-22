import { useState } from 'react';
import {
  BellIcon,
  UploadIcon,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderIcon,
  UploadCloudIcon,
  AwardIcon,
  ChevronRight
} from 'lucide-react';
import { DocumentNotification } from '../../../components/DocumentWallet/DocumentNotification';
import { DocumentUpload } from '../../../components/DocumentWallet/DocumentUpload';
import { DocumentWallet } from '../../../components/DocumentWallet/DocumentWallet';
import { mockDocumentData } from '../../../components/DocumentWallet/mockDocumentData';
import { BurgerMenuButton } from '../../../components/Sidebar';

export function DocumentsPage({
  setIsOpen,
  isLoggedIn,
  isOpen: _isOpen,
  setIsLoggedIn: _setIsLoggedIn
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<'my-documents' | 'uploads' | 'certificates'>('my-documents');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get expiring documents (within 30 days)
  const getExpiringDocuments = () => {
    if (!mockDocumentData) return [];
    const today = new Date();
    return mockDocumentData.filter((doc) => {
      if (!doc.expiryDate) return false;
      const expiry = new Date(doc.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays >= 0;
    });
  };

  const expiringDocuments = getExpiringDocuments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      {/* Premium Header Section */}
      <div className="bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#2A3F7E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <BurgerMenuButton
                  onClick={() => setIsOpen(true)}
                  isLoggedIn={isLoggedIn}
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Document Wallet
                </h1>
                <p className="mt-1 text-blue-200/80 text-sm md:text-base">
                  Securely manage your corporate documents, licenses, and certificates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all relative group"
                >
                  <BellIcon size={20} className="text-white group-hover:scale-110 transition-transform" />
                  {expiringDocuments.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FB5535] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#1A2E6E]">
                      {expiringDocuments.length}
                    </span>
                  )}
                </button>
                {showNotifications && expiringDocuments.length > 0 && (
                  <div className="absolute right-0 mt-3 z-50">
                    <DocumentNotification
                      documents={expiringDocuments}
                      onClose={() => setShowNotifications(false)}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FB5535] hover:bg-[#e24a2d] 
                         text-white font-semibold rounded-lg shadow-lg shadow-orange-500/25 
                         transition-all duration-200 hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                <UploadIcon size={18} />
                <span className="hidden sm:inline">Upload Document</span>
                <span className="sm:hidden">Upload</span>
              </button>
            </div>
          </div>

          {/* Premium Tabs */}
          <div className="mt-8 flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { id: 'my-documents', label: 'My Documents', icon: FolderIcon },
              { id: 'uploads', label: 'Uploads & Validation', icon: UploadCloudIcon },
              { id: 'certificates', label: 'Certificates', icon: AwardIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-semibold text-sm
                           transition-all duration-200 whitespace-nowrap
                           ${activeTab === tab.id
                      ? "bg-white text-[#030F35] shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.1)]"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "All Documents",
              value: mockDocumentData.length,
              subLabel: "Total stored",
              color: "bg-blue-500",
              icon: FileText
            },
            {
              label: "Approved",
              value: mockDocumentData.filter(d => d.status === 'Approved' || d.status === 'Active').length,
              subLabel: "Verified records",
              color: "bg-green-500",
              icon: CheckCircle2
            },
            {
              label: "Expiring Soon",
              value: expiringDocuments.length,
              subLabel: "Next 30 days",
              color: "bg-orange-500",
              icon: Clock
            },
            {
              label: "Action Required",
              value: mockDocumentData.filter(d => d.status === 'Required' || d.status === 'Expired').length,
              subLabel: "Attention needed",
              color: "bg-red-500",
              icon: AlertCircle
            }
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <div className={`p-2 rounded-xl ${stat.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                    <Icon size={16} className={stat.color.replace('bg-', 'text-')} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-[10px] font-medium text-gray-500">{stat.subLabel}</span>
                  <ChevronRight size={10} className="text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Document Wallet Component */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
          <DocumentWallet
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <DocumentUpload
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={() => {
            setIsUploadModalOpen(false);
          }}
          categories={[
            'Licensing',
            'Legal',
            'Certifications',
            'Compliance',
          ]}
        />
      )}
    </div>
  );
}
