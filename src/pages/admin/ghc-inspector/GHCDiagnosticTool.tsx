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

export function GHCDiagnosticTool() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparison, setComparison] = useState<string>('');

  useEffect(() => {
    async function fetchAndCompare() {
      try {
        setLoading(true);
        const { data, error } = await knowledgeHubSupabase
          .from('guides')
          .select('id, slug, title, body')
          .in('slug', GHC_SLUGS)
          .order('slug');

        if (error) {
          setComparison(`❌ Error: ${error.message}`);
          return;
        }

        setGuides(data || []);

        // Compare body content
        const bodyMap = new Map<string, Guide[]>();
        data?.forEach(guide => {
          if (!guide.body || guide.body.trim().length === 0) return;
          const bodyKey = guide.body.trim();
          if (!bodyMap.has(bodyKey)) {
            bodyMap.set(bodyKey, []);
          }
          bodyMap.get(bodyKey)!.push(guide);
        });

        const sharedBodies = Array.from(bodyMap.entries()).filter(([_, guides]) => guides.length > 1);

        if (sharedBodies.length > 0) {
          let report = '❌ DATABASE ISSUE DETECTED:\n\n';
          sharedBodies.forEach(([bodyHash, guidesWithSameBody], idx) => {
            report += `Group ${idx + 1}: ${guidesWithSameBody.length} guide(s) with IDENTICAL content:\n`;
            guidesWithSameBody.forEach(g => {
              report += `  • ${g.slug} (ID: ${g.id})\n`;
            });
            report += `  Content preview: ${bodyHash.substring(0, 80)}...\n\n`;
          });
          report += 'This is why changes to one appear on others!\n';
          report += 'Each guide must have UNIQUE body content in Supabase.';
          setComparison(report);
        } else {
          setComparison('✅ All GHC guides have unique content in the database.');
        }
      } catch (err: any) {
        setComparison(`❌ Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchAndCompare();
  }, []);

  if (loading) {
    return <div className="p-4">Loading diagnostic...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="font-bold text-lg mb-4">Database Diagnostic</h3>
      <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap font-mono">
        {comparison}
      </pre>
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Guides in Database:</h4>
        <ul className="space-y-2">
          {guides.map(guide => (
            <li key={guide.id} className="text-sm">
              <strong>{guide.slug}</strong> (ID: {guide.id}) - Body: {guide.body ? `${guide.body.length} chars` : 'EMPTY'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
