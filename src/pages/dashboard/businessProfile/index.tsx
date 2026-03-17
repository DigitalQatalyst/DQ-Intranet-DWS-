import React, { useState } from 'react';
import { BusinessProfile } from '../../../components/BusinessProfile/BusinessProfile';

const BusinessProfilePage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <BusinessProfile activeSection={'profile'} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

    );
};

export default BusinessProfilePage;