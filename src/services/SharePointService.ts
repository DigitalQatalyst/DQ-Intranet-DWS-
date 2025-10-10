export interface SharePointFile {
  id: string;
  name: string;
  url?: string;
  size?: number;
  lastModified?: string;
}

// Temporary stub implementation until real SharePoint integration is available.
// Returns a handful of mock files so that the Asset Library page can render.
export async function listFiles(path: string): Promise<SharePointFile[]> {
  return Promise.resolve(
    [
      {
        id: `${path}-guide`,
        name: 'Agile Working Guide.pdf',
        url: '#',
        size: 2.4,
        lastModified: '2025-01-12'
      },
      {
        id: `${path}-playbook`,
        name: 'Collaboration Playbook.pptx',
        url: '#',
        size: 5.8,
        lastModified: '2025-02-03'
      },
      {
        id: `${path}-template`,
        name: 'Sprint Retro Template.xlsx',
        url: '#',
        size: 0.9,
        lastModified: '2025-01-28'
      }
    ]
  );
}
