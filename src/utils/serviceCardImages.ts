// Central mapping for service card images.
// You can add or update entries to point specific cards (by id or title) to a local image.
export const SERVICE_CARD_IMAGES: Record<string, string> = {
  // By ID
  '1': '/images/services/IT-support.jpg',
  '2': '/images/services/support-chatter-template.jpg',
  '3': '/images/services/IT_Support_Walkthrough.jpg',
  '4': '/images/services/bookings.jpg',
  '5': '/images/services/staff-requisition.jpg',
  '6': '/images/services/registration.jpg',
  '7': '/images/services/DTMP.jpg',
  '8': '/images/services/governance.jpg',
  '9': '/images/services/proposal.jpg',

  // GHC Services
  'ghc-tmaas': '/images/guidelines-content.PNG',
  'GHC Transformation Management': '/images/guidelines-content.PNG',
};

// Helper to resolve a mapped image by id or title (case-insensitive for titles)
export function resolveServiceImage(id?: string, title?: string): string | undefined {
  if (id && SERVICE_CARD_IMAGES[id]) return SERVICE_CARD_IMAGES[id];
  if (title) {
    // Prefer exact match
    if (SERVICE_CARD_IMAGES[title]) return SERVICE_CARD_IMAGES[title];
    // Try case-insensitive match
    const lower = title.toLowerCase();
    const matchKey = Object.keys(SERVICE_CARD_IMAGES).find(k => k.toLowerCase() === lower);
    if (matchKey) return SERVICE_CARD_IMAGES[matchKey];
  }
  return undefined;
}


