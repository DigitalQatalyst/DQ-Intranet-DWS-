import { Guide } from '../types/guide'

const j = async (res: Response) => { if (!res.ok) throw new Error(await res.text()); return res.json() }

export async function createGuide(g: Guide) { return j(await fetch('/api/admin/guides', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(g) })) }
export async function updateGuide(id: string, g: Partial<Guide> & { _diff?: string }) { return j(await fetch(`/api/admin/guides/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(g) })) }
export async function deleteGuideAdmin(id: string) { return j(await fetch(`/api/admin/guides/${encodeURIComponent(id)}`, { method: 'DELETE' })) }
export async function getSignedUpload(bucket: string, object: string, expiresSec = 300) { return j(await fetch(`/api/admin/storage/sign-upload?bucket=${encodeURIComponent(bucket)}&object=${encodeURIComponent(object)}&expires=${expiresSec}`)) }

