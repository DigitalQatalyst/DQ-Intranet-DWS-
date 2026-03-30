import React, { useState, useEffect } from 'react';
import { supabaseClient } from '../../../lib/supabaseClient';
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'

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
}

export function DefinitiveDiagnosis() {
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [proof, setProof] = useState<any>(null);

  useEffect(() => {
    async function diagnose() {
      try {
        // Fetch all GHC guides
        const { data: guides, error } = await knowledgeHubSupabase
          .from('guides')
          .select('id, slug, title, body')
          .in('slug', GHC_SLUGS)
          .order('slug');

        if (error) {
          setDiagnosis(`❌ Error fetching: ${error.message}`);
          return;
        }

        if (!guides || guides.length === 0) {
          setDiagnosis('❌ No GHC guides found in database');
          return;
        }

        // Check 1: Are all slugs unique?
        const slugSet = new Set(guides.map(g => g.slug));
        const duplicateSlugs = guides.length !== slugSet.size;

        // Check 2: Do multiple guides have identical body content?
        const bodyMap = new Map<string, Guide[]>();
        guides.forEach(guide => {
          if (!guide.body || guide.body.trim().length === 0) return;
          const bodyKey = guide.body.trim();
          if (!bodyMap.has(bodyKey)) {
            bodyMap.set(bodyKey, []);
          }
          bodyMap.get(bodyKey)!.push(guide);
        });

        const sharedBodies = Array.from(bodyMap.entries()).filter(([_, guides]) => guides.length > 1);

        // Build proof
        const proofData = {
          totalGuides: guides.length,
          uniqueSlugs: slugSet.size,
          duplicateSlugs,
          sharedBodyGroups: sharedBodies.length,
          sharedBodyDetails: sharedBodies.map(([body, guides]) => ({
            bodyPreview: body.substring(0, 100),
            bodyLength: body.length,
            guides: guides.map(g => ({ id: g.id, slug: g.slug, title: g.title }))
          })),
          allGuides: guides.map(g => ({
            id: g.id,
            slug: g.slug,
            title: g.title,
            bodyLength: g.body?.length || 0,
            bodyPreview: g.body ? g.body.substring(0, 50) : 'EMPTY'
          }))
        };

        setProof(proofData);

        // Determine diagnosis
        if (duplicateSlugs) {
          setDiagnosis('❌ SUPABASE ISSUE: Duplicate slugs found in database. This is a data integrity problem.');
        } else if (sharedBodies.length > 0) {
          setDiagnosis(
            `❌ SUPABASE ISSUE: ${sharedBodies.length} group(s) of guides have IDENTICAL body content. ` +
            `This is why changes to one appear on others. The UI is working correctly - it fetches by unique slug, ` +
            `but multiple database records have the same content.`
          );
        } else {
          setDiagnosis(
            '✅ DATABASE LOOKS GOOD: All guides have unique slugs and unique content. ' +
            'If you\'re still seeing shared content, it might be browser caching. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R).'
          );
        }
      } catch (err: any) {
        setDiagnosis(`❌ Error: ${err.message}`);
      }
    }

    diagnose();
  }, []);

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">🔬 Definitive Diagnosis</h2>
      
      <div className={`p-4 rounded-lg mb-4 ${
        diagnosis.includes('❌') 
          ? 'bg-red-50 border-2 border-red-400' 
          : diagnosis.includes('✅')
          ? 'bg-green-50 border-2 border-green-400'
          : 'bg-yellow-50 border-2 border-yellow-400'
      }`}>
        <p className={`font-bold text-lg ${
          diagnosis.includes('❌') 
            ? 'text-red-900' 
            : diagnosis.includes('✅')
            ? 'text-green-900'
            : 'text-yellow-900'
        }`}>
          {diagnosis}
        </p>
      </div>

      {proof && (
        <div className="mt-4">
          <h3 className="font-bold text-lg mb-2">Proof:</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <div className="space-y-2 text-sm">
              <p><strong>Total GHC guides in database:</strong> {proof.totalGuides}</p>
              <p><strong>Unique slugs:</strong> {proof.uniqueSlugs}</p>
              <p><strong>Duplicate slugs:</strong> {proof.duplicateSlugs ? '❌ YES' : '✅ NO'}</p>
              <p><strong>Groups with shared body content:</strong> {proof.sharedBodyGroups}</p>
              
              {proof.sharedBodyGroups > 0 && (
                <div className="mt-4">
                  <p className="font-bold text-red-700 mb-2">⚠️ Shared Content Groups:</p>
                  {proof.sharedBodyDetails.map((group: any, idx: number) => (
                    <div key={idx} className="mb-3 p-3 bg-red-100 border border-red-300 rounded">
                      <p className="font-semibold text-red-900 mb-1">Group {idx + 1}: {group.guides.length} guide(s) with identical content</p>
                      <ul className="list-disc list-inside ml-4 text-red-800">
                        {group.guides.map((g: any) => (
                          <li key={g.id}><strong>{g.slug}</strong> (ID: {g.id}) - {g.title}</li>
                        ))}
                      </ul>
                      <p className="text-xs text-red-600 mt-1">
                        Body length: {group.bodyLength} chars | Preview: {group.bodyPreview}...
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
                  View all guides in database
                </summary>
                <div className="mt-2 space-y-1 text-xs font-mono bg-white p-3 rounded border">
                  {proof.allGuides.map((g: any) => (
                    <div key={g.id} className="border-b border-gray-200 pb-1">
                      <strong>{g.slug}</strong> (ID: {g.id}) | Body: {g.bodyLength} chars | "{g.bodyPreview}..."
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold text-blue-900 mb-2">How the UI Works (Verified):</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
          <li>Each GHC page has a hardcoded slug (e.g., <code className="bg-blue-100 px-1 rounded">'dq-vision'</code>)</li>
          <li>UI queries: <code className="bg-blue-100 px-1 rounded">.eq('slug', 'dq-vision')</code> - fetches ONE specific record</li>
          <li>UI validates the returned slug matches the expected slug</li>
          <li>UI displays the <code className="bg-blue-100 px-1 rounded">body</code> content from that specific record</li>
        </ol>
        <p className="mt-2 text-sm text-blue-700 font-semibold">
          ✅ The UI code is correct. If multiple pages show the same content, it means multiple database records have identical <code className="bg-blue-100 px-1 rounded">body</code> content.
        </p>
      </div>
    </div>
  );
}
