import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getGuide, getGuideTaxonomies } from '../../../services/guides';
import { createGuide, updateGuide } from '../../../services/adminGuides';
import { Guide, GuideTaxonomies } from '../../../types/guide';
import { supabaseClient } from '../../../lib/supabaseClient';
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'

const empty: Guide = { title: '', status: 'draft', contributors: [], steps: [], attachments: [], templates: [], relatedTools: [] };

const GHC_SLUGS = ['dq-vision', 'dq-hov', 'dq-persona', 'dq-agile-tms', 'dq-agile-sos', 'dq-agile-flows', 'dq-agile-6xd'] as const;

const isGhcSlug = (slug: string | undefined): boolean => !!slug && (GHC_SLUGS as readonly string[]).includes(slug);

/** Returns true if submit should proceed, false if aborted by user. */
function validateSlugChange(currentSlug: string | undefined, newSlug: string | undefined): boolean {
  if (!newSlug || !currentSlug || newSlug === currentSlug) return true;
  if (isGhcSlug(currentSlug) && isGhcSlug(newSlug)) {
    alert(`❌ ERROR: Cannot change GHC element slug!\n\nYou are trying to change "${currentSlug}" to "${newSlug}".\n\nGHC element slugs are fixed and cannot be changed to other GHC slugs.\nThis prevents content from being shared between GHC elements.\n\nPlease keep the slug as "${currentSlug}".`);
    return false;
  }
  return window.confirm(`⚠️ Warning: You are changing the slug from "${currentSlug}" to "${newSlug}".\n\nThis will affect how the guide is accessed.\n\nAre you sure you want to continue?`);
}

async function updateGuideRecord(id: string, guide: Guide, payload: Guide): Promise<void> {
  if (isGhcSlug(guide.slug)) {
    console.log(`[Admin Editor] Updating GHC guide: ${guide.slug} (ID: ${id})`);
    console.log(`[Admin Editor] Title: ${guide.title}`);
    console.log(`[Admin Editor] Body length: ${payload.body?.length || 0} chars`);
    if (payload.slug !== guide.slug) console.error(`[Admin Editor] ERROR: Slug mismatch! Expected: ${guide.slug}, Got: ${payload.slug}`);
  } else {
    console.log(`[Admin Editor] Updating guide: id=${id}, slug=${guide.slug}, title=${guide.title}`);
  }
  await updateGuide(id, payload as any);
  if (isGhcSlug(guide.slug)) console.log(`[Admin Editor] ✅ Successfully updated GHC guide: ${guide.slug}`);
}

async function checkForSharedContent(
  currentSlug: string,
  currentBody: string,
  onWarning: (msg: string) => void,
): Promise<void> {
  if (!currentBody?.trim()) return;
  try {
    const { data } = await knowledgeHubSupabase
      .from('guides')
      .select('id, slug, title, body')
      .in('slug', GHC_SLUGS);
    if (!data) return;
    const sharedWith = data.filter(g => g.slug !== currentSlug && g.body?.trim() === currentBody.trim());
    if (sharedWith.length > 0) {
      onWarning(
        `⚠️ WARNING: This content is IDENTICAL to ${sharedWith.length} other GHC element(s): ${sharedWith.map(g => g.slug).join(', ')}. ` +
        `This is why changes appear on multiple pages. Please make the content unique for each element.`
      );
    }
  } catch (err) {
    console.error('Error checking shared content:', err);
  }
}

const GuideEditor: React.FC = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState<Guide>(empty);
  const [tax, setTax] = useState<GuideTaxonomies | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharedContentWarning, setSharedContentWarning] = useState<string | null>(null);
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
        
        if (id && isGhcSlug(g.slug)) {
          checkForSharedContent(g.slug!, g.body || '', setSharedContentWarning);
        }
      } finally { setLoading(false); }
    })();
  }, [id]);

  const onChange = (k: keyof Guide, v: any) => setGuide(prev => ({ ...prev, [k]: v }));

  const parseList = (s: string) => s.split(',').map(p => p.trim()).filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Guide = { ...guide };
    if (typeof payload.contributors === 'string') payload.contributors = parseList(payload.contributors as any);
    if (!id) {
      const res = await createGuide(payload);
      navigate(`/admin/guides/${(res as any).id}`);
      return;
    }
    if (!validateSlugChange(guide.slug, payload.slug)) return;
    try {
      await updateGuideRecord(id, guide, payload);
      navigate('/admin/guides');
    } catch (error: any) {
      console.error('[Admin Editor] Update failed:', error);
      alert(`Failed to update guide: ${error.message || 'Unknown error'}`);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (!tax) return <div className="p-6">Failed to load taxonomies</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Guide' : 'New Guide'}</h1>
      {id && guide.slug && (
        <>
          <div className={`mb-4 p-3 border rounded-lg ${
            isGhcSlug(guide.slug)
              ? 'bg-amber-50 border-amber-300' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-sm font-semibold ${
              isGhcSlug(guide.slug)
                ? 'text-amber-900' 
                : 'text-blue-800'
            }`}>
              <strong>Editing:</strong> <code className={`px-2 py-1 rounded ${
                isGhcSlug(guide.slug)
                  ? 'bg-amber-100' 
                  : 'bg-blue-100'
              }`}>{guide.slug}</code> 
              {guide.title && <span className="ml-2">({guide.title})</span>}
            </p>
            {isGhcSlug(guide.slug) && (
              <p className="text-xs text-amber-700 mt-1 font-medium">
                ⚠️ GHC Element: Slug is fixed and cannot be changed to another GHC slug
              </p>
            )}
            <p className={`text-xs mt-1 ${
              isGhcSlug(guide.slug)
                ? 'text-amber-600' 
                : 'text-blue-600'
            }`}>
              Guide ID: {id}
            </p>
          </div>
          
          {sharedContentWarning && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-800 font-semibold mb-1">CRITICAL: Shared Content Detected</p>
                  <p className="text-red-700 text-sm">{sharedContentWarning}</p>
                  <Link 
                    to="/admin/ghc-inspector"
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline font-medium"
                  >
                    View GHC Inspector to see all shared content →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}
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
            {isGhcSlug(guide.slug || '') ? (
              <div>
                <input 
                  className="border rounded px-3 py-2 w-full bg-gray-100 cursor-not-allowed" 
                  value={guide.slug || ''} 
                  readOnly
                  disabled
                />
                <p className="text-xs text-amber-600 mt-1 font-medium">
                  ⚠️ GHC Element: Slug is locked and cannot be changed
                </p>
              </div>
            ) : (
              <>
                <input 
                  className="border rounded px-3 py-2 w-full" 
                  value={guide.slug || ''} 
                  onChange={e => onChange('slug', e.target.value)}
                  placeholder="e.g., dq-vision, dq-hov"
                />
                {guide.slug && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current slug: <code className="bg-gray-100 px-1 rounded">{guide.slug}</code>
                  </p>
                )}
              </>
            )}
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
