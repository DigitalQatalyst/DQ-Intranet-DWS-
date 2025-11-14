/**
 * Supabase Seed File for Community Interactions (Dev Mode)
 * 
 * Seeds dummy data for:
 * - communities (5 communities)
 * - community_posts (15 posts)
 * - community_comments (20 comments)
 * - community_reactions (20 reactions)
 * 
 * NOTE: RLS is disabled in dev mode for easier seeding
 * 
 * Usage:
 * Run: npx ts-node supabase/seed.ts
 * Or: supabase db seed
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to generate random timestamp
function randomTimestamp(): string {
  const randomOffset = Math.floor(Math.random() * 100000000); // Random offset in milliseconds
  return new Date(Date.now() - randomOffset).toISOString();
}

/**
 * Main seed function
 */
export default async function seedCommunityInteractions() {
  console.log('🌱 Starting community interactions seed (dev mode)...');

  try {
    // Step 1: Get or create a dummy user
    console.log('👤 Setting up dummy user...');
    let dummyUserId: string;
    
    // Try to get an existing user
    const { data: existingUsers } = await supabase
      .from('users_local')
      .select('id')
      .limit(1);
    
    if (existingUsers && existingUsers.length > 0) {
      dummyUserId = existingUsers[0].id;
      console.log(`✅ Using existing user: ${dummyUserId}`);
    } else {
      // Try auth.users as fallback
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      if (authUsers && authUsers.users.length > 0) {
        dummyUserId = authUsers.users[0].id;
        console.log(`✅ Using auth user: ${dummyUserId}`);
      } else {
        // Create a placeholder UUID (will need to be replaced with real user)
        dummyUserId = randomUUID();
        console.log(`⚠️  No users found, using placeholder: ${dummyUserId}`);
        console.log('   Note: Make sure this user exists in auth.users or users_local');
      }
    }

    // Step 2: Create 5 dummy communities
    console.log('🏘️  Creating 5 communities...');
    const communitiesData = [
      {
        id: randomUUID(),
        name: 'Tech Innovation Hub',
        description: 'A community for tech enthusiasts to share ideas, discuss innovations, and collaborate on projects.',
        category: 'Technology',
        imageurl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        created_by: dummyUserId,
        created_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        name: 'Design & Creativity',
        description: 'Where designers and creatives come together to showcase work, get feedback, and inspire each other.',
        category: 'Creative',
        imageurl: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800',
        created_by: dummyUserId,
        created_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        name: 'Business Strategy',
        description: 'Discuss business strategies, market trends, and share insights on growing successful ventures.',
        category: 'Business',
        imageurl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        created_by: dummyUserId,
        created_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        name: 'Wellness & Mindfulness',
        description: 'A supportive space for discussions about health, wellness, work-life balance, and personal growth.',
        category: 'Wellness',
        imageurl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        created_by: dummyUserId,
        created_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        name: 'Learning & Development',
        description: 'Share learning resources, discuss courses, and help each other grow professionally.',
        category: 'Education',
        imageurl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
        created_by: dummyUserId,
        created_at: randomTimestamp(),
      },
    ];

    const { error: communitiesError } = await supabase
      .from('communities')
      .insert(communitiesData);

    if (communitiesError) {
      // If communities already exist, fetch them instead
      console.log('⚠️  Communities may already exist, fetching existing ones...');
      const { data: existingCommunities } = await supabase
        .from('communities')
        .select('id')
        .limit(5);
      
      if (existingCommunities && existingCommunities.length >= 3) {
        communitiesData.forEach((c, i) => {
          if (existingCommunities[i]) {
            c.id = existingCommunities[i].id;
          }
        });
        console.log(`✅ Using ${existingCommunities.length} existing communities`);
      } else {
        throw new Error(`Failed to insert communities: ${communitiesError.message}`);
      }
    } else {
      console.log(`✅ Created ${communitiesData.length} communities`);
    }

    const communityIds = communitiesData.map(c => c.id);

    // Step 3: Create 15 dummy posts across communities
    console.log('📝 Creating 15 posts...');
    const postsData = [
      {
        id: randomUUID(),
        community_id: communityIds[0],
        user_id: dummyUserId,
        title: 'Welcome to Tech Innovation Hub!',
        content: 'Excited to launch this community! Let\'s share ideas and build amazing things together. What projects are you working on?',
        content_html: '<p>Excited to launch this community! Let\'s share ideas and build amazing things together. What projects are you working on?</p>',
        post_type: 'text',
        status: 'active',
        tags: ['welcome', 'announcement'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[0],
        user_id: dummyUserId,
        title: 'Latest AI Trends Discussion',
        content: 'What do you think about the latest developments in AI? I\'ve been following GPT-4 and it\'s fascinating!',
        content_html: '<p>What do you think about the latest developments in AI? I\'ve been following GPT-4 and it\'s fascinating!</p>',
        post_type: 'text',
        status: 'active',
        tags: ['ai', 'discussion'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[0],
        user_id: dummyUserId,
        title: 'Code Review Best Practices',
        content: 'Sharing some tips I\'ve learned about effective code reviews. What are your go-to practices?',
        content_html: '<p>Sharing some tips I\'ve learned about effective code reviews. What are your go-to practices?</p>',
        post_type: 'article',
        status: 'active',
        tags: ['coding', 'best-practices'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[1],
        user_id: dummyUserId,
        title: 'Design Portfolio Showcase',
        content: 'Just finished a new project! Would love to get feedback from the community.',
        content_html: '<p>Just finished a new project! Would love to get feedback from the community.</p>',
        post_type: 'media',
        status: 'active',
        tags: ['portfolio', 'feedback'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[1],
        user_id: dummyUserId,
        title: 'Color Theory Workshop',
        content: 'Planning a workshop on color theory next week. Who\'s interested in joining?',
        content_html: '<p>Planning a workshop on color theory next week. Who\'s interested in joining?</p>',
        post_type: 'event',
        status: 'active',
        tags: ['workshop', 'color-theory'],
        event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        event_location: 'Virtual',
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[1],
        user_id: dummyUserId,
        title: 'Typography Tips',
        content: 'Here are 5 typography tips that changed my design game. Hope they help you too!',
        content_html: '<p>Here are 5 typography tips that changed my design game. Hope they help you too!</p>',
        post_type: 'text',
        status: 'active',
        tags: ['typography', 'tips'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[2],
        user_id: dummyUserId,
        title: 'Q1 Strategy Review',
        content: 'Let\'s review our Q1 performance and discuss strategies for Q2. What worked well?',
        content_html: '<p>Let\'s review our Q1 performance and discuss strategies for Q2. What worked well?</p>',
        post_type: 'text',
        status: 'active',
        tags: ['strategy', 'review'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[2],
        user_id: dummyUserId,
        title: 'Market Analysis: Tech Sector',
        content: 'Recent market trends show interesting patterns. Sharing my analysis here.',
        content_html: '<p>Recent market trends show interesting patterns. Sharing my analysis here.</p>',
        post_type: 'article',
        status: 'active',
        tags: ['market-analysis', 'tech'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[2],
        user_id: dummyUserId,
        title: 'Networking Event Next Month',
        content: 'Join us for a networking event! Great opportunity to meet industry professionals.',
        content_html: '<p>Join us for a networking event! Great opportunity to meet industry professionals.</p>',
        post_type: 'event',
        status: 'active',
        tags: ['networking', 'event'],
        event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        event_location: 'Downtown Conference Center',
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[3],
        user_id: dummyUserId,
        title: 'Morning Meditation Session',
        content: 'Starting a daily morning meditation group. All are welcome!',
        content_html: '<p>Starting a daily morning meditation group. All are welcome!</p>',
        post_type: 'text',
        status: 'active',
        tags: ['meditation', 'wellness'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[3],
        user_id: dummyUserId,
        title: 'Work-Life Balance Tips',
        content: 'How do you maintain work-life balance? Sharing some strategies that work for me.',
        content_html: '<p>How do you maintain work-life balance? Sharing some strategies that work for me.</p>',
        post_type: 'text',
        status: 'active',
        tags: ['work-life-balance', 'tips'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[3],
        user_id: dummyUserId,
        title: 'Healthy Recipe Share',
        content: 'Found this amazing healthy recipe! Thought I\'d share it with everyone.',
        content_html: '<p>Found this amazing healthy recipe! Thought I\'d share it with everyone.</p>',
        post_type: 'text',
        status: 'active',
        tags: ['recipes', 'health'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[4],
        user_id: dummyUserId,
        title: 'Recommended Online Courses',
        content: 'What online courses have you taken recently? Looking for recommendations!',
        content_html: '<p>What online courses have you taken recently? Looking for recommendations!</p>',
        post_type: 'text',
        status: 'active',
        tags: ['courses', 'learning'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[4],
        user_id: dummyUserId,
        title: 'Study Group Forming',
        content: 'Forming a study group for the upcoming certification exam. Interested?',
        content_html: '<p>Forming a study group for the upcoming certification exam. Interested?</p>',
        post_type: 'text',
        status: 'active',
        tags: ['study-group', 'certification'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[4],
        user_id: dummyUserId,
        title: 'Learning Resources Library',
        content: 'Created a shared library of learning resources. Feel free to add your favorites!',
        content_html: '<p>Created a shared library of learning resources. Feel free to add your favorites!</p>',
        post_type: 'text',
        status: 'active',
        tags: ['resources', 'library'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
    ];

    const { error: postsError } = await supabase
      .from('community_posts')
      .insert(postsData);

    if (postsError) {
      throw new Error(`Failed to insert posts: ${postsError.message}`);
    }

    console.log(`✅ Created ${postsData.length} posts`);

    const postIds = postsData.map(p => p.id);

    // Step 4: Create 20 dummy comments
    console.log('💬 Creating 20 comments...');
    const commentsData = [
      { post_id: postIds[0], content: 'Great post! Looking forward to more discussions.' },
      { post_id: postIds[0], content: 'Thanks for starting this community!' },
      { post_id: postIds[1], content: 'AI is definitely changing everything. Exciting times!' },
      { post_id: postIds[1], content: 'I\'ve been experimenting with ChatGPT API. It\'s powerful!' },
      { post_id: postIds[2], content: 'These are excellent tips. Code reviews are so important.' },
      { post_id: postIds[2], content: 'I\'d add: always be constructive and kind in feedback.' },
      { post_id: postIds[3], content: 'Love your work! The color choices are perfect.' },
      { post_id: postIds[3], content: 'Could you share more about your design process?' },
      { post_id: postIds[4], content: 'I\'m interested! When is it happening?' },
      { post_id: postIds[4], content: 'Count me in! Color theory is fascinating.' },
      { post_id: postIds[5], content: 'Typography makes such a difference. Great tips!' },
      { post_id: postIds[6], content: 'Q1 was strong. Let\'s keep the momentum!' },
      { post_id: postIds[6], content: 'Agreed. What are our priorities for Q2?' },
      { post_id: postIds[7], content: 'Very insightful analysis. Thanks for sharing!' },
      { post_id: postIds[8], content: 'I\'ll be there! Looking forward to networking.' },
      { post_id: postIds[9], content: 'Meditation has changed my life. Great initiative!' },
      { post_id: postIds[9], content: 'What time do you usually meet?' },
      { post_id: postIds[10], content: 'Work-life balance is so important. Thanks for the tips!' },
      { post_id: postIds[11], content: 'This recipe looks delicious! Can\'t wait to try it.' },
      { post_id: postIds[12], content: 'I recommend Coursera\'s Machine Learning course!' },
    ].map((comment, index) => ({
      id: randomUUID(),
      post_id: comment.post_id,
      user_id: dummyUserId,
      parent_id: null,
      content: comment.content,
      content_html: `<p>${comment.content}</p>`,
      status: 'active',
      created_at: randomTimestamp(),
      updated_at: randomTimestamp(),
    }));

    const { error: commentsError } = await supabase
      .from('community_comments')
      .insert(commentsData);

    if (commentsError) {
      throw new Error(`Failed to insert comments: ${commentsError.message}`);
    }

    console.log(`✅ Created ${commentsData.length} comments`);

    const commentIds = commentsData.map(c => c.id);

    // Step 5: Create 20 dummy reactions
    console.log('👍 Creating 20 reactions...');
    const reactionsData: any[] = [];

    // Create reactions for posts (12 reactions)
    const postReactionIndices = [0, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    postReactionIndices.forEach((postIndex) => {
      reactionsData.push({
        id: randomUUID(),
        user_id: dummyUserId,
        post_id: postIds[postIndex],
        comment_id: null,
        reaction_type: 'like',
        created_at: randomTimestamp(),
      });
    });

    // Create reactions for comments (8 reactions)
    const commentReactionIndices = [0, 1, 2, 3, 4, 5, 6, 7];
    commentReactionIndices.forEach((commentIndex) => {
      reactionsData.push({
        id: randomUUID(),
        user_id: dummyUserId,
        post_id: null,
        comment_id: commentIds[commentIndex],
        reaction_type: 'like',
        created_at: randomTimestamp(),
      });
    });

    const { error: reactionsError } = await supabase
      .from('community_reactions')
      .insert(reactionsData);

    if (reactionsError) {
      throw new Error(`Failed to insert reactions: ${reactionsError.message}`);
    }

    console.log(`✅ Created ${reactionsData.length} reactions`);

    // Summary
    console.log('\n📊 Seed Summary:');
    console.log(`   Communities: ${communitiesData.length}`);
    console.log(`   Posts: ${postsData.length}`);
    console.log(`   Comments: ${commentsData.length}`);
    console.log(`   Reactions: ${reactionsData.length}`);
    console.log('\n✅ Seed completed successfully!');

  } catch (error: any) {
    console.error('❌ Error seeding community interactions:', error);
    throw error;
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedCommunityInteractions()
    .then(() => {
      console.log('✨ Seed completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed failed:', error);
      process.exit(1);
    });
}
