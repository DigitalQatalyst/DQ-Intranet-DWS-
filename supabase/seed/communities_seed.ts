/**
 * Supabase Seed File for Community Interactions
 * 
 * Seeds dummy data using fixed user UUIDs:
 * - communities (5 communities)
 * - community_posts (15 posts)
 * - community_comments (20 comments)
 * - community_reactions (20 reactions)
 * 
 * NOTE: RLS is disabled in dev mode
 * 
 * Usage:
 * Run: npx ts-node supabase/seed/communities_seed.ts
 * Or: supabase db seed
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Fixed user UUIDs from seeded users
const SEEDED_USERS = [
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // admin_user
  'a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', // lisa_d
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', // john_doe
  'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', // david_m
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', // sarah_smith
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', // mike_j
  'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', // emma_w
  'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', // alex_brown
];

// Helper function to get random user ID
function getRandomUserId(): string {
  return SEEDED_USERS[Math.floor(Math.random() * SEEDED_USERS.length)];
}

// Helper function to get random timestamp within last 30 days
function randomTimestamp(): string {
  const daysAgo = Math.floor(Math.random() * 30);
  return new Date(Date.now() - Math.floor(Math.random() * 86400000 * 30)).toISOString();
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Main seed function
 */
async function seedCommunities() {
  console.log('🌱 Starting community interactions seed...');
  console.log(`👥 Using ${SEEDED_USERS.length} seeded users`);

  try {
    // ============================================
    // A. Create 5 Communities
    // ============================================
    console.log('\n📋 Creating 5 communities...');
    const communitiesData = [
      {
        id: randomUUID(),
        name: 'Tech Innovation Hub',
        description: 'A community for tech enthusiasts to share ideas, discuss innovations, and collaborate on cutting-edge projects. Join us to stay ahead of the curve!',
        category: 'Technology',
        imageurl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
        created_by: getRandomUserId(),
        created_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        name: 'Design & Creativity',
        description: 'Where designers and creatives come together to showcase work, get feedback, and inspire each other. Share your creative journey!',
        category: 'Creative',
        imageurl: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=400&fit=crop',
        created_by: getRandomUserId(),
        created_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        name: 'Business Strategy',
        description: 'Discuss business strategies, market trends, and share insights on growing successful ventures. Learn from industry leaders.',
        category: 'Business',
        imageurl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
        created_by: getRandomUserId(),
        created_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        name: 'Wellness & Mindfulness',
        description: 'A supportive space for discussions about health, wellness, work-life balance, and personal growth. Take care of yourself!',
        category: 'Wellness',
        imageurl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop',
        created_by: getRandomUserId(),
        created_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        name: 'Learning & Development',
        description: 'Share learning resources, discuss courses, and help each other grow professionally. Knowledge is power!',
        category: 'Education',
        imageurl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
        created_by: getRandomUserId(),
        created_at: randomTimestamp(),
      },
    ];

    const { error: communitiesError } = await supabase
      .from('communities')
      .insert(communitiesData);

    if (communitiesError) {
      // If communities already exist, fetch them
      console.log('⚠️  Communities may already exist, fetching existing ones...');
      const { data: existingCommunities } = await supabase
        .from('communities')
        .select('id')
        .limit(5);
      
      if (existingCommunities && existingCommunities.length >= 3) {
        existingCommunities.forEach((c, i) => {
          if (communitiesData[i]) {
            communitiesData[i].id = c.id;
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

    // ============================================
    // B. Create 15 Posts (evenly distributed: 3 per community)
    // ============================================
    console.log('\n📝 Creating 15 posts...');
    const postsData = [
      // Community 0: Tech Innovation Hub (3 posts)
      {
        id: randomUUID(),
        community_id: communityIds[0],
        user_id: getRandomUserId(),
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
        user_id: getRandomUserId(),
        title: 'Latest AI Trends Discussion',
        content: 'What do you think about the latest developments in AI? I\'ve been following GPT-4 and it\'s fascinating how it\'s transforming various industries.',
        content_html: '<p>What do you think about the latest developments in AI? I\'ve been following GPT-4 and it\'s fascinating how it\'s transforming various industries.</p>',
        post_type: 'text',
        status: 'active',
        tags: ['ai', 'discussion', 'trends'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[0],
        user_id: getRandomUserId(),
        title: 'Code Review Best Practices',
        content: 'Sharing some tips I\'ve learned about effective code reviews. Always be constructive, focus on the code not the person, and provide actionable feedback.',
        content_html: '<p>Sharing some tips I\'ve learned about effective code reviews. Always be constructive, focus on the code not the person, and provide actionable feedback.</p>',
        post_type: 'article',
        status: 'active',
        tags: ['coding', 'best-practices', 'code-review'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      // Community 1: Design & Creativity (3 posts)
      {
        id: randomUUID(),
        community_id: communityIds[1],
        user_id: getRandomUserId(),
        title: 'Design Portfolio Showcase',
        content: 'Just finished a new project! Would love to get feedback from the community. Check out the case study and let me know your thoughts.',
        content_html: '<p>Just finished a new project! Would love to get feedback from the community. Check out the case study and let me know your thoughts.</p>',
        post_type: 'media',
        status: 'active',
        tags: ['portfolio', 'feedback', 'showcase'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[1],
        user_id: getRandomUserId(),
        title: 'Color Theory Workshop',
        content: 'Planning a workshop on color theory next week. We\'ll cover color harmony, contrast, and practical applications. Who\'s interested in joining?',
        content_html: '<p>Planning a workshop on color theory next week. We\'ll cover color harmony, contrast, and practical applications. Who\'s interested in joining?</p>',
        post_type: 'event',
        status: 'active',
        tags: ['workshop', 'color-theory', 'event'],
        event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        event_location: 'Virtual',
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[1],
        user_id: getRandomUserId(),
        title: 'Typography Tips for Modern Design',
        content: 'Here are 5 typography tips that changed my design game. Proper font pairing, hierarchy, and spacing can make all the difference.',
        content_html: '<p>Here are 5 typography tips that changed my design game. Proper font pairing, hierarchy, and spacing can make all the difference.</p>',
        post_type: 'text',
        status: 'active',
        tags: ['typography', 'tips', 'design'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      // Community 2: Business Strategy (3 posts)
      {
        id: randomUUID(),
        community_id: communityIds[2],
        user_id: getRandomUserId(),
        title: 'Q1 Strategy Review',
        content: 'Let\'s review our Q1 performance and discuss strategies for Q2. What worked well? What can we improve?',
        content_html: '<p>Let\'s review our Q1 performance and discuss strategies for Q2. What worked well? What can we improve?</p>',
        post_type: 'text',
        status: 'active',
        tags: ['strategy', 'review', 'q1'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[2],
        user_id: getRandomUserId(),
        title: 'Market Analysis: Tech Sector Trends',
        content: 'Recent market trends show interesting patterns in the tech sector. Sharing my analysis here - would love to hear your perspectives.',
        content_html: '<p>Recent market trends show interesting patterns in the tech sector. Sharing my analysis here - would love to hear your perspectives.</p>',
        post_type: 'article',
        status: 'active',
        tags: ['market-analysis', 'tech', 'trends'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[2],
        user_id: getRandomUserId(),
        title: 'Networking Event Next Month',
        content: 'Join us for a networking event! Great opportunity to meet industry professionals, share experiences, and build connections.',
        content_html: '<p>Join us for a networking event! Great opportunity to meet industry professionals, share experiences, and build connections.</p>',
        post_type: 'event',
        status: 'active',
        tags: ['networking', 'event', 'connections'],
        event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        event_location: 'Downtown Conference Center',
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      // Community 3: Wellness & Mindfulness (3 posts)
      {
        id: randomUUID(),
        community_id: communityIds[3],
        user_id: getRandomUserId(),
        title: 'Morning Meditation Session',
        content: 'Starting a daily morning meditation group. All are welcome! We\'ll meet virtually every morning at 7 AM for a 15-minute session.',
        content_html: '<p>Starting a daily morning meditation group. All are welcome! We\'ll meet virtually every morning at 7 AM for a 15-minute session.</p>',
        post_type: 'text',
        status: 'active',
        tags: ['meditation', 'wellness', 'morning'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[3],
        user_id: getRandomUserId(),
        title: 'Work-Life Balance Tips',
        content: 'How do you maintain work-life balance? Sharing some strategies that work for me: time blocking, setting boundaries, and regular breaks.',
        content_html: '<p>How do you maintain work-life balance? Sharing some strategies that work for me: time blocking, setting boundaries, and regular breaks.</p>',
        post_type: 'text',
        status: 'active',
        tags: ['work-life-balance', 'tips', 'wellness'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[3],
        user_id: getRandomUserId(),
        title: 'Healthy Recipe Share',
        content: 'Found this amazing healthy recipe for a quinoa salad! It\'s quick, nutritious, and delicious. Thought I\'d share it with everyone.',
        content_html: '<p>Found this amazing healthy recipe for a quinoa salad! It\'s quick, nutritious, and delicious. Thought I\'d share it with everyone.</p>',
        post_type: 'text',
        status: 'active',
        tags: ['recipes', 'health', 'nutrition'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      // Community 4: Learning & Development (3 posts)
      {
        id: randomUUID(),
        community_id: communityIds[4],
        user_id: getRandomUserId(),
        title: 'Recommended Online Courses',
        content: 'What online courses have you taken recently? Looking for recommendations on data science and machine learning courses.',
        content_html: '<p>What online courses have you taken recently? Looking for recommendations on data science and machine learning courses.</p>',
        post_type: 'text',
        status: 'active',
        tags: ['courses', 'learning', 'recommendations'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[4],
        user_id: getRandomUserId(),
        title: 'Study Group Forming',
        content: 'Forming a study group for the upcoming AWS certification exam. We\'ll meet weekly to review materials and practice. Interested?',
        content_html: '<p>Forming a study group for the upcoming AWS certification exam. We\'ll meet weekly to review materials and practice. Interested?</p>',
        post_type: 'text',
        status: 'active',
        tags: ['study-group', 'certification', 'aws'],
        created_at: randomTimestamp(),
        updated_at: randomTimestamp(),
      },
      {
        id: randomUUID(),
        community_id: communityIds[4],
        user_id: getRandomUserId(),
        title: 'Learning Resources Library',
        content: 'Created a shared library of learning resources including books, articles, and video tutorials. Feel free to add your favorites!',
        content_html: '<p>Created a shared library of learning resources including books, articles, and video tutorials. Feel free to add your favorites!</p>',
        post_type: 'text',
        status: 'active',
        tags: ['resources', 'library', 'learning'],
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

    console.log(`✅ Created ${postsData.length} posts (${communityIds.length} posts per community)`);

    const postIds = postsData.map(p => p.id);

    // ============================================
    // C. Create 20 Comments
    // ============================================
    console.log('\n💬 Creating 20 comments...');
    const commentsData = [
      { post_id: postIds[0], content: 'Great post! Looking forward to more discussions in this community.' },
      { post_id: postIds[0], content: 'Thanks for starting this community! Excited to be here.' },
      { post_id: postIds[1], content: 'AI is definitely changing everything. Exciting times ahead!' },
      { post_id: postIds[1], content: 'I\'ve been experimenting with ChatGPT API. It\'s incredibly powerful!' },
      { post_id: postIds[2], content: 'These are excellent tips. Code reviews are so important for quality.' },
      { post_id: postIds[2], content: 'I\'d add: always be constructive and kind in feedback. Great article!' },
      { post_id: postIds[3], content: 'Love your work! The color choices are perfect. Great job!' },
      { post_id: postIds[3], content: 'Could you share more about your design process? I\'m curious!' },
      { post_id: postIds[4], content: 'I\'m interested! When exactly is the workshop happening?' },
      { post_id: postIds[4], content: 'Count me in! Color theory is fascinating. Looking forward to it.' },
      { post_id: postIds[5], content: 'Typography makes such a difference. These tips are really helpful!' },
      { post_id: postIds[6], content: 'Q1 was strong. Let\'s keep the momentum going into Q2!' },
      { post_id: postIds[6], content: 'Agreed. What are our top priorities for Q2? Let\'s discuss.' },
      { post_id: postIds[7], content: 'Very insightful analysis. Thanks for sharing your perspective!' },
      { post_id: postIds[8], content: 'I\'ll be there! Looking forward to networking with everyone.' },
      { post_id: postIds[9], content: 'Meditation has changed my life. Great initiative! I\'ll join.' },
      { post_id: postIds[9], content: 'What time do you usually meet? I\'m in a different timezone.' },
      { post_id: postIds[10], content: 'Work-life balance is so important. Thanks for sharing these tips!' },
      { post_id: postIds[11], content: 'This recipe looks delicious! Can\'t wait to try it this weekend.' },
      { post_id: postIds[12], content: 'I recommend Coursera\'s Machine Learning course! It\'s excellent.' },
    ].map((comment, index) => ({
      id: randomUUID(),
      post_id: comment.post_id,
      user_id: getRandomUserId(),
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

    // ============================================
    // D. Create 20 Reactions
    // ============================================
    console.log('\n👍 Creating 20 reactions...');
    
    // Track reactions to prevent duplicates (user_id + post_id/comment_id + reaction_type)
    const reactionTracker = new Set<string>();
    
    const reactionsData: any[] = [];
    const reactionTypes = ['like', 'insightful'] as const;
    
    // Helper to create reaction key
    const getReactionKey = (userId: string, postId: string | null, commentId: string | null, reactionType: string): string => {
      return `${userId}-${postId || 'null'}-${commentId || 'null'}-${reactionType}`;
    };

    // Create reactions for posts (12 reactions)
    let postReactionsCreated = 0;
    while (postReactionsCreated < 12 && reactionsData.length < 20) {
      const postId = postIds[Math.floor(Math.random() * postIds.length)];
      const userId = getRandomUserId();
      const reactionType = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
      const key = getReactionKey(userId, postId, null, reactionType);
      
      if (!reactionTracker.has(key)) {
        reactionTracker.add(key);
        reactionsData.push({
          id: randomUUID(),
          user_id: userId,
          post_id: postId,
          comment_id: null,
          reaction_type: reactionType,
          created_at: randomTimestamp(),
        });
        postReactionsCreated++;
      }
    }

    // Create reactions for comments (8 reactions)
    let commentReactionsCreated = 0;
    while (commentReactionsCreated < 8 && reactionsData.length < 20) {
      const commentId = commentIds[Math.floor(Math.random() * commentIds.length)];
      const userId = getRandomUserId();
      const reactionType = reactionTypes[Math.floor(Math.random() * reactionTypes.length)];
      const key = getReactionKey(userId, null, commentId, reactionType);
      
      if (!reactionTracker.has(key)) {
        reactionTracker.add(key);
        reactionsData.push({
          id: randomUUID(),
          user_id: userId,
          post_id: null,
          comment_id: commentId,
          reaction_type: reactionType,
          created_at: randomTimestamp(),
        });
        commentReactionsCreated++;
      }
    }

    const { error: reactionsError } = await supabase
      .from('community_reactions')
      .insert(reactionsData);

    if (reactionsError) {
      throw new Error(`Failed to insert reactions: ${reactionsError.message}`);
    }

    console.log(`✅ Created ${reactionsData.length} reactions (${postReactionsCreated} on posts, ${commentReactionsCreated} on comments)`);

    // ============================================
    // Summary
    // ============================================
    console.log('\n📊 Seed Summary:');
    console.log(`   Communities: ${communitiesData.length}`);
    console.log(`   Posts: ${postsData.length}`);
    console.log(`   Comments: ${commentsData.length}`);
    console.log(`   Reactions: ${reactionsData.length}`);
    console.log(`   Users Used: ${SEEDED_USERS.length}`);
    console.log('\n✅ Seed completed successfully!');

  } catch (error: any) {
    console.error('❌ Error seeding community interactions:', error);
    throw error;
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedCommunities()
    .then(() => {
      console.log('✨ Seed script completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed script failed:', error);
      process.exit(1);
    });
}

export default seedCommunities;



