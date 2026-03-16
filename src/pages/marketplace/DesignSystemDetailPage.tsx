import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CIDSServiceDetailPage from './CIDSServiceDetailPage';
import VDSServiceDetailPage from './VDSServiceDetailPage';
import CDSServiceDetailPage from './CDSServiceDetailPage';

export default function DesignSystemDetailPage() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  if (tab === 'vds') {
    return <VDSServiceDetailPage />;
  }
  if (tab === 'cds') {
    return <CDSServiceDetailPage />;
  }

  // Default to CIDS
  return <CIDSServiceDetailPage />;
}
