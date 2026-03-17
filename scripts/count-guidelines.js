import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function countGuidelines() {
  console.log('📊 Counting guidelines in the database...\n');

  // Total count
  const { count: totalCount, error: totalError } = await supabase
    .from('guides')
    .select('*', { count: 'exact', head: true });

  if (totalError) {
    console.error('❌ Error counting total:', totalError);
    return;
  }

  console.log(`📚 Total Guidelines: ${totalCount}\n`);

  // Count by domain
  const { data: byDomain, error: domainError } = await supabase
    .from('guides')
    .select('domain')
    .not('domain', 'is', null);

  if (!domainError && byDomain) {
    const domainCounts = byDomain.reduce((acc, item) => {
      const domain = item.domain || 'Unknown';
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 By Domain:');
    Object.entries(domainCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([domain, count]) => {
        console.log(`   ${domain}: ${count}`);
      });
    console.log('');
  }

  // Count by guide_type
  const { data: byType, error: typeError } = await supabase
    .from('guides')
    .select('guide_type')
    .not('guide_type', 'is', null);

  if (!typeError && byType) {
    const typeCounts = byType.reduce((acc, item) => {
      const type = item.guide_type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 By Guide Type:');
    Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
    console.log('');
  }

  // Count by sub_domain
  const { data: bySubDomain, error: subDomainError } = await supabase
    .from('guides')
    .select('sub_domain')
    .not('sub_domain', 'is', null);

  if (!subDomainError && bySubDomain) {
    const subDomainCounts = bySubDomain.reduce((acc, item) => {
      const subDomain = item.sub_domain || 'Unknown';
      acc[subDomain] = (acc[subDomain] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 By Sub-Domain:');
    Object.entries(subDomainCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([subDomain, count]) => {
        console.log(`   ${subDomain}: ${count}`);
      });
    console.log('');
  }

  // Count by status
  const { data: byStatus, error: statusError } = await supabase
    .from('guides')
    .select('status')
    .not('status', 'is', null);

  if (!statusError && byStatus) {
    const statusCounts = byStatus.reduce((acc, item) => {
      const status = item.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    console.log('📊 By Status:');
    Object.entries(statusCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`);
      });
    console.log('');
  }

  // Strategy domain breakdown
  const { data: strategyGuides, error: strategyError } = await supabase
    .from('guides')
    .select('sub_domain, title, slug')
    .eq('domain', 'Strategy')
    .order('sub_domain', { ascending: true });

  if (!strategyError && strategyGuides) {
    const strategyBySubDomain = strategyGuides.reduce((acc, item) => {
      const subDomain = item.sub_domain || 'Unknown';
      if (!acc[subDomain]) {
        acc[subDomain] = [];
      }
      acc[subDomain].push(item.title);
      return acc;
    }, {});

    console.log('📊 Strategy Domain Breakdown:');
    Object.entries(strategyBySubDomain)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([subDomain, titles]) => {
        console.log(`\n   ${subDomain} (${titles.length}):`);
        titles.forEach(title => {
          console.log(`      - ${title}`);
        });
      });
    console.log('');
  }
}

countGuidelines().catch(console.error);


