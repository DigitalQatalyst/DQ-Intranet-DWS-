/**
 * Complete podcast migration - checks tables and migrates data
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('   Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Podcast episodes data
const podcastEpisodes = [
  {
    id: 'why-execution-beats-intelligence',
    episodeNumber: 1,
    title: 'Why Execution Beats Intelligence: The Real Driver of Growth in DQ',
    excerpt: 'Explore how execution and consistent action drive real growth at DQ, and why intelligence alone isn\'t enough to achieve organizational success.',
    content: `# Why Execution Beats Intelligence: The Real Driver of Growth in DQ

## Focus of the Episode

Promoting execution over intelligence, stressing why getting things done is more powerful than just knowing the best approach. Advocates for consistent, purposeful action and momentum over waiting for the perfect strategy or plan, emphasizing the importance of learning and refining by doing.

## Intended Impact

The episode aims to inspire listeners to take action, encouraging them to "take that next step, start that project, or refine that idea in action", which means prioritizing progress over staying stuck in analysis paralysis.

The intended impact is to compel listeners to shift their focus from developing the "perfect strategy" to creating momentum through consistent, purposeful action.

The ultimate goal is to reinforce the core belief that Execution beats intelligence every single time, making execution the core element of DQ's identity and the driver of real, sustainable growth and impact within the company.`,
    audioUrl: '/Podcasts/Execution_Beats_Intelligence__Why_Action_Wins.m4a',
    date: '2025-12-20',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    readingTime: '20+',
    tags: ['podcast', 'execution', 'growth', 'leadership', 'strategy']
  },
  {
    id: 'why-we-misdiagnose-problems',
    episodeNumber: 2,
    title: 'Why We Misdiagnose Problems — And How to Stop It',
    excerpt: 'Learn why teams often misdiagnose problems and discover practical frameworks to identify root causes and implement effective solutions.',
    content: `# Why We Misdiagnose Problems — And How to Stop It

## Goal of This Episode

Help us recognise when we're reacting to symptoms instead of diagnosing the real issue. Improve the quality of action, not reduce action. Encourage clearer problem framing before fixes are introduced. Reinforce simple, practical questions (e.g. "What does 'done' actually mean here?") that can be used immediately in day-to-day work.

## Intended Impact

Shift teams from activity-driven responses to problem-driven action. Reinforce solver behaviour as diagnose → act → learn, rather than act → adjust → repeat. Shorten feedback loops by catching misdiagnosis earlier, before effort compounds in the wrong direction. Strengthen individual and collective solver behaviour—spotting, naming, and addressing the real blocker rather than defaulting to familiar fixes.`,
    audioUrl: '/Podcasts/Why We Misdiagnose Problems — And How to Stop It.m4a',
    date: '2025-12-18',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    readingTime: '20+',
    tags: ['podcast', 'problem-solving', 'diagnosis', 'root-cause', 'analysis']
  },
  {
    id: 'turning-conversations-into-action',
    episodeNumber: 3,
    title: 'Turning Every Conversation Into Action',
    excerpt: 'Discover how to transform meetings and discussions into concrete actions that drive progress and deliver results.',
    content: `# Turning Every Conversation Into Action

## Focus of the Episode

Why conversations feel satisfying even when nothing moves (the psychological reward of clarity and alignment). The role of active listening in turning updates and narratives into signals that shape direction. Shifting from "what we should do" to "what has already started" as the trigger for momentum.

## Intended Impact

Shift mindset from "good conversations" to "conversations that move work". Encourage sharper listening and questioning that surfaces what actually matters for progress. Make momentum and visible movement the default expectation after discussions. Reinforce the idea that conversations are most valuable when they set direction and immediately enable the next move.`,
    audioUrl: '/Podcasts/Turning_Every_Conversation _Into _Action.m4a',
    date: '2025-12-16',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    readingTime: '10–20',
    tags: ['podcast', 'conversation', 'action', 'meetings', 'productivity']
  },
  {
    id: 'why-tasks-dont-close-at-dq',
    episodeNumber: 4,
    title: 'Why Tasks Don\'t Close at DQ — And How to Fix It',
    excerpt: 'An in-depth analysis of why tasks remain open and practical solutions to improve task completion rates across DQ teams.',
    content: `# Why Tasks Don't Close at DQ — And How to Fix It

## Focus of the Episode

This episode examines the systemic reasons why tasks remain open and provides actionable strategies to improve closure rates. It explores root causes of task stagnation, the impact of open tasks on team performance, strategies for improving task completion, tools and processes that work, and building a culture of task completion.

## Intended Impact

Listeners will understand the challenges and learn proven methods to ensure tasks get completed on time. The episode aims to help teams identify why tasks remain open and implement practical solutions to improve closure rates and overall productivity.`,
    audioUrl: '/Podcasts/Why_Smart_Teams_Fail_To_Finish.m4a',
    date: '2025-12-14',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    readingTime: '20+',
    tags: ['podcast', 'tasks', 'productivity', 'project-management', 'execution']
  },
  {
    id: 'happy-talkers-why-talking-feels-productive',
    episodeNumber: 5,
    title: 'Happy Talkers: Why Talking Feels Productive but Isn\'t',
    excerpt: 'Explore the phenomenon of "happy talking" and why excessive discussion can create an illusion of productivity without delivering real results.',
    content: `# Happy Talkers: Why Talking Feels Productive but Isn't

## Focus of the Episode

Identifying and examining "happy talk," which feels energizing but is low consequence because they give the feeling of progress without requiring commitment, decisions, or accountability. Exploring the negative consequences of this behavior (such as the erosion of trust and stalled innovation) and offering practical strategies for moving from discussion to action.

## Intended Impact

To encourage listeners to assess whether their conversations and meetings produce clarity—or just comfort, helping them identify and unpack "happy talk," which consists of high-energy, low-consequence discussions that feel productive but ultimately fail to move work forward. To equip listeners with practical strategies for breaking the habit of avoiding commitment, such as ending conversations with decisions and naming an owner and a timeline, thereby ensuring that conversations lead somewhere and mitigate the negative costs associated with stalled execution and the erosion of trust.`,
    audioUrl: '/Podcasts/Stop_Happy_Talk_and_Start_Executing.m4a',
    date: '2025-12-12',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    readingTime: '10–20',
    tags: ['podcast', 'communication', 'productivity', 'meetings', 'culture']
  },
  {
    id: 'execution-styles-why-teams-work-differently',
    episodeNumber: 6,
    title: 'Execution Styles: Why Teams Work Differently and How to Align Them',
    excerpt: 'Understand different execution styles across teams and learn how to align diverse approaches for maximum effectiveness.',
    content: `# Execution Styles: Why Teams Work Differently and How to Align Them

## Focus of the Episode

Establishing tasks as the fundamental "heartbeat" and smallest unit of value. Defining the practical requirements for successful task management.

## Intended Impact

Shift the organizational mindset from performing Agile "rituals" to achieving actual work "flow". Increase team momentum and psychological safety through transparency and trust. Drive daily operational discipline and clarity by encouraging staff to break work into small, actionable pieces and maintain honest communication.`,
    audioUrl: '/Podcasts/Stop_Judging_Intent_Coordinate_Work_Styles.m4a',
    date: '2025-12-10',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    readingTime: '20+',
    tags: ['podcast', 'execution', 'teams', 'collaboration', 'alignment']
  },
  {
    id: 'agile-the-dq-way-tasks-core-work-system',
    episodeNumber: 7,
    title: 'Agile the DQ Way: Why Tasks Are the Core of Our Work System',
    excerpt: 'Learn how DQ implements Agile principles with tasks as the fundamental unit of work, driving clarity and accountability.',
    content: `# Agile the DQ Way: Why Tasks Are the Core of Our Work System

## Focus of the Episode

Establishing tasks as the fundamental "heartbeat" and smallest unit of value. Defining the practical requirements for successful task management.

## Intended Impact

Shift the organizational mindset from performing Agile "rituals" to achieving actual work "flow". Increase team momentum and psychological safety through transparency and trust. Drive daily operational discipline and clarity by encouraging staff to break work into small, actionable pieces and maintain honest communication.`,
    audioUrl: '/Podcasts/Agile_is_Task_Movement_Not_Ceremony.m4a',
    date: '2025-12-08',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    readingTime: '20+',
    tags: ['podcast', 'agile', 'tasks', 'work-system', 'methodology']
  },
  {
    id: 'leaders-as-multipliers-accelerate-execution',
    episodeNumber: 8,
    title: 'Leaders as Multipliers: How to Accelerate Team Execution',
    excerpt: 'Discover how leaders can act as multipliers, accelerating team execution and amplifying results through effective leadership practices.',
    content: `# Leaders as Multipliers: How to Accelerate Team Execution

## Focus of the Episode

The podcast highlights that workplace conflict is often stylistic rather than personal, arising when teams misinterpret different ways of working, such as speed being seen as reckless or caution as slow. The discussion emphasizes that alignment does not mean forcing everyone to work the same way, but rather agreeing on how to move together by making individual styles explicit.

## Intended Impact

By making execution styles explicit, the episode aims to stop team members from judging one another and misinterpreting different approaches—such as viewing speed as reckless or caution as slow. The episode seeks to move teams away from the assumption that everyone works the same way and toward a model of agreeing on "how we move together". Rather than forcing uniformity, the episode intends to show how different styles—like Sprinters and Architects—can coexist and support one another. When goals, timelines, and the definition of "done" are clear, these different execution methods can work in harmony to move a project forward without unnecessary friction.`,
    audioUrl: '/Podcasts/Execution_Beats_Intelligence__Why_Action_Wins (1).m4a',
    date: '2025-12-06',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    readingTime: '20+',
    tags: ['podcast', 'leadership', 'multipliers', 'execution', 'team-performance']
  },
  {
    id: 'energy-management-for-high-action-days',
    episodeNumber: 9,
    title: 'How to Manage Your Energy for High-Action Days',
    excerpt: 'Learn how managing usable mental, emotional, and physical energy—not just time blocks—creates sustainable high-action days and reduces invisible stress.',
    content: `# Energy Beats Time: Designing High-Action Days

## Focus of the Episode

Prioritizing energy management over time management by recognizing that execution fails not because of a lack of time, but due to a lack of usable mental, emotional, and physical energy.

Designing high-action days through intentional practices such as limiting execution priorities, protecting peak energy windows from administrative tasks, and closing mental loops to prevent invisible stress and preserve future energy.

## Intended Impact

Transform intention into execution by shifting the mindset from managing time blocks to strategically managing and protecting usable energy, which is the true constraint of high-action days.

Reduce "invisible stress" and mental fatigue by training listeners to identify and eliminate hidden drains, such as unclear tasks, constant re-prioritization, and the lack of recovery between meetings.

Empower sustainable high performance through actionable rules, such as building momentum with early wins and closing mental loops to ensure energy is not just spent, but sustained for the following day.`,
    audioUrl: '/Podcasts/Stop_Clock_Watching_Start_Managing_Energy.m4a',
    date: '2025-12-04',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    readingTime: '20+',
    tags: ['podcast', 'energy', 'performance', 'productivity', 'stress']
  },
  {
    id: 'execution-metrics-that-drive-movement',
    episodeNumber: 10,
    title: 'Execution Metrics: How to Measure the Only Things That Matter',
    excerpt: 'Explore how to replace vanity metrics with execution metrics like Task Closure Rate, Time to First Action, and Blocker Age to drive real movement, unblock teams, and build a culture of improvement.',
    content: `# Execution Metrics That Actually Move Work

## Focus of the Episode

Distinguishing execution metrics from mere activity or vanity metrics by focusing on tangible movement.

Utilizing specific metrics such as Task Closure Rate, Time to First Action, and Blocker Age to identify bottlenecks and foster a culture of continuous improvement rather than fear.

## Intended Impact

Shift the organizational focus from mere "activity" to "tangible progress" by encouraging the use of metrics that drive actual movement.

Foster a culture of improvement and transparency over fear and defense, by making metrics visible to the people doing the work.

Refine the role of leadership to prioritize "unblocking" over "micromanagement". The impact is to empower leaders to use execution data—like "Blocker Age"—to know exactly when to step in to simplify decisions or reduce scope, ensuring that the metrics used align with and signal a core value for execution.`,
    audioUrl: '/Podcasts/The_Four_Metrics_That_Drive_Execution_Speed.m4a',
    date: '2025-12-02',
    author: 'DQ Leadership',
    byline: 'DQ Leadership',
    views: 0,
    readingTime: '20+',
    tags: ['podcast', 'metrics', 'execution', 'performance', 'blockers']
  }
];

async function checkTablesExist() {
  console.log('🔍 Checking if podcast tables exist...\n');
  
  const { data, error } = await supabase
    .from('podcast_series')
    .select('id')
    .limit(1);
  
  if (error) {
    if (error.code === '42P01') { // Table doesn't exist
      return false;
    }
    throw error;
  }
  
  return true;
}

async function migratePodcastData() {
  console.log('🚀 Starting podcast migration...\n');

  try {
    // Check if tables exist
    const tablesExist = await checkTablesExist();
    
    if (!tablesExist) {
      console.log('⚠️  Podcast tables do not exist yet!\n');
      console.log('📋 Please run the SQL migration first:');
      console.log('   1. Go to your Supabase dashboard: https://supabase.com/dashboard');
      console.log('   2. Select your project');
      console.log('   3. Go to SQL Editor');
      console.log('   4. Copy and paste the contents of:');
      console.log('      supabase/migrations/20250224000000_create_podcast_tables.sql');
      console.log('   5. Click "Run" to execute the SQL');
      console.log('   6. Then run this script again\n');
      process.exit(1);
    }

    console.log('✅ Tables exist! Proceeding with data migration...\n');

    // Insert podcast episodes
    console.log('📝 Inserting podcast episodes...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const episode of podcastEpisodes) {
      const { error } = await supabase
        .from('podcast_episodes')
        .insert({
          id: episode.id,
          series_id: 'action-solver-podcast',
          episode_number: episode.episodeNumber,
          title: episode.title,
          excerpt: episode.excerpt,
          content: episode.content,
          audio_url: episode.audioUrl,
          date: episode.date,
          author: episode.author,
          byline: episode.byline,
          views: episode.views,
          reading_time: episode.readingTime,
          tags: episode.tags
        });

      if (error) {
        console.error(`❌ Error inserting EP${episode.episodeNumber}: ${error.message}`);
        errorCount++;
      } else {
        console.log(`✅ Inserted EP${episode.episodeNumber}: ${episode.title}`);
        successCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Migration completed!');
    console.log(`📊 Successfully migrated: ${successCount}/${podcastEpisodes.length} episodes`);
    if (errorCount > 0) {
      console.log(`⚠️  Errors: ${errorCount}`);
    }
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
migratePodcastData();
