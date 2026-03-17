import { Guide, GuideTaxonomies } from '../types/guide';

const json = async (res: Response) => {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export async function listGuides(search?: string): Promise<{ items: Guide[] }> {
  const q = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`/api/guides${q}`);
  return json(res);
}

export async function getGuide(id: string): Promise<Guide> {
  const res = await fetch(`/api/guides/${encodeURIComponent(id)}`);
  return json(res);
}

export async function saveGuide(guide: Guide): Promise<{ id: string } | { ok: true }> {
  const hasId = !!guide.id;
  const res = await fetch(`/api/guides${hasId ? '/' + encodeURIComponent(guide.id!) : ''}`,
    { method: hasId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(guide) });
  return json(res);
}

export async function deleteGuide(id: string): Promise<{ ok: true }> {
  const res = await fetch(`/api/guides/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return json(res);
}

export async function getGuideTaxonomies(): Promise<GuideTaxonomies> {
  const res = await fetch('/api/guides/taxonomies');
  return json(res);
}

