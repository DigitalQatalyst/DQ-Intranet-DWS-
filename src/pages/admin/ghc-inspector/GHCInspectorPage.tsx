import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabaseClient } from '../../../lib/supabaseClient';
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { useAuth } from '../../../components/Header/context/AuthContext';
import { DefinitiveDiagnosis } from './DefinitiveDiagnosis';

const GHC_SLUGS = [
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd'
];

interface Guide {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  summary: string | null;
  hero_image_url: string | null;
  last_updated_at: string | null;
  status: string | null;
  domain: string | null;
  guide_type: string | null;
}

export default function GHCInspectorPage() {
  const { user } = useAuth();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string>('');

  useEffect(() => {
    async function fetchGuides() {
      try {
        setLoading(true);
        setDiagnosis('🔍 Fetching guides from Supabase...');
        
        const { data, error: fetchError } = await knowledgeHubSupabase
          .from('guides')
          .select('id, slug, title, body, summary, hero_image_url, last_updated_at, status, domain, guide_type')
          .in('slug', GHC_SLUGS)
          .order('slug');

        if (fetchError) {
          setError(fetchError.message);
          setDiagnosis(`❌ Error: ${fetchError.message}`);
          return;
        }

        setGuides(data || []);
        
        // Diagnose the issue
        if (data && data.length > 0) {
          diagnoseIssue(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch guides');
        setDiagnosis(`❌ Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchGuides();
  }, []);

  function diagnoseIssue(guidesData: Guide[]) {
    // Check for shared body content - EXACT matches
    const bodyMap = new Map<string, Guide[]>();
    guidesData.forEach(guide => {
      if (!guide.body || guide.body.trim().length === 0) return;
      const bodyKey = guide.body.trim();
      if (!bodyMap.has(bodyKey)) {
        bodyMap.set(bodyKey, []);
      }
      bodyMap.get(bodyKey)!.push(guide);
    });

    const sharedBodies = Array.from(bodyMap.entries()).filter(([hash, guides]) => guides.length > 1);
    
    if (sharedBodies.length > 0) {
      const affectedGuides = sharedBodies.reduce((acc, [_, guides]) => acc + guides.length, 0);
      setDiagnosis(
        `❌ DATABASE ISSUE DETECTED: ${sharedBodies.length} group(s) of guides share identical body content. ` +
        `This affects ${affectedGuides} guide(s). ` +
        `This is why changes to one GHC element appear on others. ` +
        `Each GHC element must have UNIQUE content in the "body" field in Supabase.`
      );
    } else {
      // Check if UI is fetching correctly
      const slugsFound = new Set(guidesData.map(g => g.slug));
      const missingSlugs = GHC_SLUGS.filter(s => !slugsFound.has(s));
      
      if (missingSlugs.length > 0) {
        setDiagnosis(
          `⚠️  MISSING GUIDES: ${missingSlugs.length} GHC element(s) not found in database: ${missingSlugs.join(', ')}`
        );
      } else {
        setDiagnosis(
          `✅ Database looks good! Each GHC element has unique content. ` +
          `If you're still seeing shared content, it might be a caching issue. Try refreshing the page.`
        );
      }
    }
  }

  // Check for duplicates
  const slugCounts: Record<string, number> = {};
  guides.forEach(guide => {
    slugCounts[guide.slug] = (slugCounts[guide.slug] || 0) + 1;
  });
  const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1);

  // Check for missing slugs
  const foundSlugs = new Set(guides.map(g => g.slug));
  const missingSlugs = GHC_SLUGS.filter(slug => !foundSlugs.has(slug));

  // Check for shared body content - EXACT matches
  const bodyMap = new Map<string, Guide[]>();
  guides.forEach(guide => {
    if (!guide.body || guide.body.trim().length === 0) return;
    const bodyKey = guide.body.trim();
    if (!bodyMap.has(bodyKey)) {
      bodyMap.set(bodyKey, []);
    }
    bodyMap.get(bodyKey)!.push(guide);
  });
  const sharedBodies = Array.from(bodyMap.entries()).filter(([hash, guides]) => guides.length > 1);

  // Get guides with shared content for highlighting
  const guidesWithSharedContent = new Set<string>();
  sharedBodies.forEach(([hash, guidesWithSameBody]) => {
    guidesWithSameBody.forEach(g => guidesWithSharedContent.add(g.id));
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">GHC Database Inspector</h1>
              <p className="text-gray-600">Diagnose and fix content sharing issues</p>
            </div>
            <Link 
              to="/admin/guides" 
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Back to Guides
            </Link>
          </div>
        </div>

        {/* Diagnosis Banner */}
        {diagnosis && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            diagnosis.includes('❌') 
              ? 'bg-red-50 border-red-300' 
              : diagnosis.includes('⚠️')
              ? 'bg-yellow-50 border-yellow-300'
              : 'bg-green-50 border-green-300'
          }`}>
            <p className={`font-semibold ${
              diagnosis.includes('❌') 
                ? 'text-red-800' 
                : diagnosis.includes('⚠️')
                ? 'text-yellow-800'
                : 'text-green-800'
            }`}>
              {diagnosis}
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Definitive Diagnosis */}
            <DefinitiveDiagnosis />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Total Found</div>
                <div className="text-2xl font-bold text-gray-900">{guides.length}</div>
                <div className="text-xs text-gray-500 mt-1">of {GHC_SLUGS.length} expected</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Missing</div>
                <div className={`text-2xl font-bold ${missingSlugs.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {missingSlugs.length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Duplicates</div>
                <div className={`text-2xl font-bold ${duplicates.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {duplicates.length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Shared Content</div>
                <div className={`text-2xl font-bold ${sharedBodies.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {sharedBodies.length}
                </div>
              </div>
            </div>

            {/* Critical Issue Alert */}
            {sharedBodies.length > 0 && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-bold text-red-800 mb-2">
                      ⚠️ CRITICAL: Shared Content Detected in Supabase Database
                    </h3>
                    <p className="text-red-700 mb-4">
                      This is a <strong>DATABASE issue</strong>, not a UI issue. Multiple GHC elements have <strong>identical body content</strong> stored in Supabase.
                    </p>
                    <div className="bg-white rounded p-4 border border-red-200 mb-4">
                      <p className="text-sm text-red-800 font-semibold mb-2">How the UI works:</p>
                      <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
                        <li>Each GHC page (dq-vision, dq-hov, etc.) fetches data by slug from Supabase</li>
                        <li>The UI correctly fetches: <code className="bg-red-100 px-1 rounded">.eq('slug', 'dq-vision')</code></li>
                        <li>If multiple records have the same body content, they will show the same text</li>
                        <li>This is why changes to one appear on others - they share the same content in the database</li>
                      </ol>
                    </div>
                    <div className="space-y-3">
                      {sharedBodies.map(([bodyHash, guidesWithSameBody], idx) => (
                        <div key={idx} className="bg-white rounded p-4 border border-red-200">
                          <p className="font-semibold text-red-800 mb-2">
                            Group {idx + 1}: {guidesWithSameBody.length} guide(s) with IDENTICAL content
                          </p>
                          <ul className="list-disc list-inside text-red-700 space-y-1">
                            {guidesWithSameBody.map(g => (
                              <li key={g.id}>
                                <strong>{g.slug}</strong> (ID: {g.id}) - {g.title}
                                <Link 
                                  to={`/admin/guides/${g.id}`}
                                  className="ml-2 text-blue-600 hover:underline"
                                >
                                  Edit to make unique
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-red-600 mt-2 italic">
                            Content preview: {bodyHash.substring(0, 150)}...
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-red-100 rounded border border-red-300">
                      <p className="text-red-800 font-semibold mb-1">🔧 How to Fix:</p>
                      <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
                        <li>Click "Edit to make unique" for each guide above</li>
                        <li>Change the "body" content to be unique for each GHC element</li>
                        <li>Save each guide individually</li>
                        <li>Refresh this page to verify the fix</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Issues */}
            {missingSlugs.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 font-semibold mb-2">⚠️ Missing Slugs:</p>
                <ul className="list-disc list-inside text-yellow-700">
                  {missingSlugs.map(slug => (
                    <li key={slug}>{slug}</li>
                  ))}
                </ul>
              </div>
            )}

            {duplicates.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-semibold mb-2">❌ Duplicate Slugs Found:</p>
                {duplicates.map(([slug, count]) => {
                  const dupGuides = guides.filter(g => g.slug === slug);
                  return (
                    <div key={slug} className="mb-2">
                      <p className="text-red-700 font-medium">"{slug}": {count} records</p>
                      <ul className="list-disc list-inside text-red-600 ml-4">
                        {dupGuides.map(g => (
                          <li key={g.id}>ID: {g.id}, Title: {g.title}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Guide Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Guide Details (from Supabase)</h2>
              <div className="space-y-6">
                {guides.map((guide) => {
                  const bodyLength = guide.body ? guide.body.length : 0;
                  const bodyPreview = guide.body 
                    ? guide.body.substring(0, 200).replace(/\n/g, ' ').trim()
                    : 'EMPTY';
                  
                  const sameBodyGuides = guides.filter(g => 
                    g.id !== guide.id && 
                    g.body && 
                    guide.body && 
                    g.body.trim() === guide.body.trim()
                  );

                  const hasSharedContent = guidesWithSharedContent.has(guide.id);

                  return (
                    <div 
                      key={guide.id} 
                      className={`border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 ${
                        hasSharedContent ? 'bg-red-50 p-4 rounded-lg border-2 border-red-300' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{guide.slug}</h3>
                          <p className="text-sm text-gray-600">{guide.title || '(no title)'}</p>
                        </div>
                        <div className="flex gap-2">
                          {hasSharedContent && (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                              ⚠️ Shared Content
                            </span>
                          )}
                          <Link 
                            to={`/admin/guides/${guide.id}`}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">ID:</span>
                          <p className="font-mono text-xs text-gray-700 break-all">{guide.id}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="text-gray-700">{guide.status || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Domain:</span>
                          <p className="text-gray-700">{guide.domain || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Updated:</span>
                          <p className="text-gray-700 text-xs">
                            {guide.last_updated_at 
                              ? new Date(guide.last_updated_at).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-gray-500 text-sm">Body Content (from Supabase):</span>
                        <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">
                            Length: {bodyLength} characters
                          </p>
                          <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap break-words">
                            {bodyPreview}{bodyLength > 200 ? '...' : ''}
                          </p>
                        </div>
                      </div>

                      {sameBodyGuides.length > 0 && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-700 font-semibold mb-2">
                            ⚠️ This content is IDENTICAL to:
                          </p>
                          <ul className="text-xs text-red-600 space-y-1">
                            {sameBodyGuides.map(g => (
                              <li key={g.id}>
                                • <strong>{g.slug}</strong> (ID: {g.id}) - 
                                <Link to={`/admin/guides/${g.id}`} className="ml-1 text-blue-600 hover:underline">
                                  Edit
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-red-600 mt-2 italic">
                            This is why changes to one appear on the other! They have the same content in Supabase.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* UI vs Database Explanation */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">🔍 Is this a UI issue or Database issue?</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div>
                  <p className="font-semibold mb-1">✅ UI is working correctly:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Each GHC page fetches by unique slug: <code className="bg-blue-100 px-1 rounded">.eq('slug', 'dq-vision')</code></li>
                    <li>Validation ensures the fetched guide matches the expected slug</li>
                    <li>Each page displays the content from its own database record</li>
                    <li>Check browser console (F12) to see detailed logs for each page</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">❌ Database has the issue:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Multiple GHC guides have identical "body" content in Supabase</li>
                    <li>When you edit one, you're updating that specific record</li>
                    <li>But other records still have the same content, so they show the same text</li>
                    <li>This is why changes appear on multiple pages</li>
                  </ul>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-blue-300">
                  <p className="font-semibold text-blue-900 mb-2">💡 How to Verify:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-700">
                    <li>Open browser console (F12 or right-click → Inspect → Console)</li>
                    <li>Visit each GHC element page (dq-vision, dq-hov, dq-persona, etc.)</li>
                    <li>Look for logs like: <code className="bg-blue-100 px-1 rounded">✅ [DQ-VISION] Guide loaded:</code></li>
                    <li>Check if the IDs and body content are different for each page</li>
                    <li>If body content is the same, that confirms it's a database issue</li>
                  </ol>
                </div>
                <div className="mt-4 p-3 bg-white rounded border border-blue-300">
                  <p className="font-semibold text-blue-900">🔧 Solution:</p>
                  <p className="text-blue-700">
                    Edit each GHC guide individually in the admin interface and make sure each has <strong>unique content</strong> in the "body" field. 
                    The inspector above shows exactly which guides share content. Click "Edit" links to fix them.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  );
}
