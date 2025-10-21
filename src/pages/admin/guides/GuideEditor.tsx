import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGuide, getGuideTaxonomies } from '../../../services/guides';
import { createGuide, updateGuide } from '../../../services/adminGuides';
import { Guide, GuideTaxonomies } from '../../../types/guide';

const empty: Guide = { title: '', status: 'draft', contributors: [], steps: [], attachments: [], templates: [], relatedTools: [] };

const GuideEditor: React.FC = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState<Guide>(empty);
  const [tax, setTax] = useState<GuideTaxonomies | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [t, g] = await Promise.all([
          getGuideTaxonomies(),
          id ? getGuide(id) : Promise.resolve(empty),
        ]);
        setTax(t);
        setGuide(g);
      } finally { setLoading(false); }
    })();
  }, [id]);

  const onChange = (k: keyof Guide, v: any) => setGuide(prev => ({ ...prev, [k]: v }));

  const parseList = (s: string) => s.split(',').map(p => p.trim()).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Guide = { ...guide };
    if (typeof payload.contributors === 'string') payload.contributors = parseList(payload.contributors as any);
    if (id) {
      await updateGuide(id, payload as any)
      navigate('/admin/guides')
    } else {
      const res = await createGuide(payload)
      navigate(`/admin/guides/${(res as any).id}`)
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (!tax) return <div className="p-6">Failed to load taxonomies</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Guide' : 'New Guide'}</h1>
      <form className="space-y-4 max-w-3xl" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input className="border rounded px-3 py-2 w-full" value={guide.title} onChange={e => onChange('title', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Summary</label>
          <textarea className="border rounded px-3 py-2 w-full" value={guide.summary || ''} onChange={e => onChange('summary', e.target.value)} rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Slug</label>
            <input className="border rounded px-3 py-2 w-full" value={guide.slug || ''} onChange={e => onChange('slug', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Hero Image URL</label>
            <input className="border rounded px-3 py-2 w-full" value={guide.heroImage || ''} onChange={e => onChange('heroImage', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Estimated Time</label>
            <input className="border rounded px-3 py-2 w-full" value={guide.estimatedTime || ''} onChange={e => onChange('estimatedTime', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Skill Level</label>
            <input className="border rounded px-3 py-2 w-full" value={guide.skillLevel || ''} onChange={e => onChange('skillLevel', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Updated At</label>
            <input type="date" className="border rounded px-3 py-2 w-full" value={(guide.lastUpdatedAt || '').slice(0,10)} onChange={e => onChange('lastUpdatedAt', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select className="border rounded px-3 py-2 w-full" value={guide.status || 'draft'} onChange={e => onChange('status', e.target.value)}>
              <option>draft</option>
              <option>published</option>
              <option>archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Guide Type</label>
            <select className="border rounded px-3 py-2 w-full" value={guide.guideType || ''} onChange={e => onChange('guideType', e.target.value)}>
              <option value="">—</option>
              {tax.guideType.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Business Stage</label>
            <select className="border rounded px-3 py-2 w-full" value={guide.businessStage || ''} onChange={e => onChange('businessStage', e.target.value)}>
              <option value="">—</option>
              {tax.businessStage.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Domain</label>
            <select className="border rounded px-3 py-2 w-full" value={guide.domain || ''} onChange={e => onChange('domain', e.target.value)}>
              <option value="">—</option>
              {tax.domain.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Format</label>
            <select className="border rounded px-3 py-2 w-full" value={guide.format || ''} onChange={e => onChange('format', e.target.value)}>
              <option value="">—</option>
              {tax.format.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Popularity</label>
            <select className="border rounded px-3 py-2 w-full" value={guide.popularity || ''} onChange={e => onChange('popularity', e.target.value)}>
              <option value="">—</option>
              {tax.popularity.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Contributors (comma separated)</label>
          <input className="border rounded px-3 py-2 w-full" value={(Array.isArray(guide.contributors) ? guide.contributors.join(', ') : (guide.contributors as any) || '')} onChange={e => onChange('contributors', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Steps (JSON array)</label>
          <textarea className="border rounded px-3 py-2 w-full" rows={5}
            value={JSON.stringify(guide.steps || [], null, 2)}
            onChange={e => {
              try { onChange('steps', JSON.parse(e.target.value)); } catch { onChange('steps', guide.steps); }
            }} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Attachments (JSON)</label>
            <textarea className="border rounded px-3 py-2 w-full" rows={6}
              value={JSON.stringify(guide.attachments || [], null, 2)}
              onChange={e => { try { onChange('attachments', JSON.parse(e.target.value)); } catch {} }} />
          </div>
          <div>
            <label className="block text-sm font-medium">Templates (JSON)</label>
            <textarea className="border rounded px-3 py-2 w-full" rows={6}
              value={JSON.stringify(guide.templates || [], null, 2)}
              onChange={e => { try { onChange('templates', JSON.parse(e.target.value)); } catch {} }} />
          </div>
          <div>
            <label className="block text-sm font-medium">Related Tools (JSON)</label>
            <textarea className="border rounded px-3 py-2 w-full" rows={6}
              value={JSON.stringify(guide.relatedTools || [], null, 2)}
              onChange={e => { try { onChange('relatedTools', JSON.parse(e.target.value)); } catch {} }} />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate('/admin/guides')}>Cancel</button>
          {id ? (
            <>
              <button type="button" className="px-4 py-2 bg-green-600 text-white rounded" onClick={async () => { await updateGuide(id!, { status: 'Published', _diff: 'publish' }); navigate('/admin/guides') }}>Publish</button>
              <button type="button" className="px-4 py-2 bg-yellow-600 text-white rounded" onClick={async () => { await updateGuide(id!, { status: 'Draft', _diff: 'unpublish' }); navigate('/admin/guides') }}>Unpublish</button>
            </>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default GuideEditor;
