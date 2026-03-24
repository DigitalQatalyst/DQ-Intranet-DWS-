/**
 * Converts an Azure AD object ID to a UUID format
 * Azure AD object IDs are already in UUID format, so this function
 * validates and normalizes the format
 */
export function azureIdToUuid(azureId: string): string {
  // Remove any hyphens and convert to lowercase
  const cleanId = azureId.replace(/-/g, '').toLowerCase();
  
  // Validate that it's a valid hex string of the right length
  if (!/^[0-9a-f]{32}$/i.test(cleanId)) {
    throw new Error(`Invalid Azure ID format: ${azureId}`);
  }
  
  // Format as UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  return [
    cleanId.slice(0, 8),
    cleanId.slice(8, 12),
    cleanId.slice(12, 16),
    cleanId.slice(16, 20),
    cleanId.slice(20, 32)
  ].join('-');
}