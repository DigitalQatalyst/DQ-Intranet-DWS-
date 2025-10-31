import React from 'react';
import { MarketplacePage } from '../components/marketplace/MarketplacePage';
import { getMarketplaceConfig } from '../utils/marketplaceConfig';

const OnboardingMarketplacePage: React.FC = () => {
  const config = getMarketplaceConfig('onboarding');
  return (
    <MarketplacePage
      marketplaceType="onboarding"
      title={config.title}
      description={config.description}
    />
  );
};

export default OnboardingMarketplacePage;
