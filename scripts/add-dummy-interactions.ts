/**
 * Add Dummy Interactions Script
 * 
 * Adds dummy comments and reactions to the new interaction tables for testing.
 * 
 * Usage:
 *   npx tsx scripts/add-dummy-interactions.ts
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const commentTexts = [
  'Great post! Thanks for sharing this.',
  'This is really helpful. I\'ll try this out!',
  'Interesting perspective. I have a similar experience.',
  'Could you provide more details on this?',
  'Thanks for the insights!',
  'Very informative. Bookmarking this for later.',
  'I agree with your points. Well said!',
  'This helped me understand the topic better.',
  'Excellent work! Keep it up.',
  'Looking forward to more content like this.'
];

async function addDummyInteractions() {
  console.log('Adding dummy interactions...\n');

  try {
    // Step 1: Get existing posts
    console.log('Step 1: Fetching posts...');
    const { data: posts, error: postsError } = await supabase
      .from('posts_v2')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(10);

    if (postsError) {
      throw new Error(`Failed to fetch posts: ${postsError.message}`);
    }

    if (!posts || posts.length === 0) {
      console.log('No posts found. Please create some posts first.');
      return;
    }

    console.log(`Found ${posts.length} posts\n`);

    // Step 2: Get existing users
    console.log('Step 2: Fetching users...');
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    if (!users || users.length === 0) {
      console.log('No users found. Please create users first.');
      return;
    }

    console.log(`Found ${users.length} users\n`);

    // Step 3: Add dummy comments
    console.log('Step 3: Adding dummy comments...');
    let commentCount = 0;
    const maxComments = 20;

    for (const post of posts.slice(0, 10)) {
      for (const user of users.slice(0, 3)) {
        if (commentCount >= maxComments) break;

        const commentText = commentTexts[commentCount % commentTexts.length];
        
        const { error: commentError } = await supabase
          .from('community_post_comments_new')
          .insert({
            post_id: post.id,
            user_id: user.id,
            content: commentText,
            status: 'active'
          } as any);

        if (commentError) {
          // Ignore duplicate key errors
          if (commentError.code !== '23505') {
            console.error(`Error adding comment: ${commentError.message}`);
          }
        } else {
          commentCount++;
        }
      }
      if (commentCount >= maxComments) break;
    }

    console.log(`Added ${commentCount} comments\n`);

    // Step 4: Add dummy reactions
    console.log('Step 4: Adding dummy reactions...');
    const reactionTypes = ['helpful', 'insightful', 'like'];
    let reactionCount = 0;
    const maxReactions = 30;

    for (const post of posts.slice(0, 10)) {
      for (const user of users.slice(0, 3)) {
        for (const reactionType of reactionTypes) {
          if (reactionCount >= maxReactions) break;

          const { error: reactionError } = await supabase
            .from('community_post_reactions_new')
            .insert({
              post_id: post.id,
              user_id: user.id,
              reaction_type: reactionType
            } as any);

          if (reactionError) {
            // Ignore duplicate key errors
            if (reactionError.code !== '23505') {
              console.error(`Error adding reaction: ${reactionError.message}`);
            }
          } else {
            reactionCount++;
          }
        }
        if (reactionCount >= maxReactions) break;
      }
      if (reactionCount >= maxReactions) break;
    }

    console.log(`Added ${reactionCount} reactions\n`);

    // Step 5: Ensure Test User has interactions
    console.log('Step 5: Adding Test User interactions...');
    const testUser = users.find(u => u.email === 'testuser@example.com');

    if (testUser) {
      console.log(`Found Test User: ${testUser.email}`);

      // Add comments from Test User
      let testCommentCount = 0;
      for (const post of posts.slice(0, 5)) {
        if (testCommentCount >= 5) break;

        const { error: commentError } = await supabase
          .from('community_post_comments_new')
          .insert({
            post_id: post.id,
            user_id: testUser.id,
            content: 'Test User comment: This is a test comment to verify the interaction system is working correctly.',
            status: 'active'
          } as any);

        if (!commentError || commentError.code === '23505') {
          testCommentCount++;
        }
      }
      console.log(`Added ${testCommentCount} comments from Test User`);

      // Add reactions from Test User
      let testReactionCount = 0;
      for (const post of posts.slice(0, 5)) {
        for (const reactionType of reactionTypes) {
          if (testReactionCount >= 9) break;

          const { error: reactionError } = await supabase
            .from('community_post_reactions_new')
            .insert({
              post_id: post.id,
              user_id: testUser.id,
              reaction_type: reactionType
            } as any);

          if (!reactionError || reactionError.code === '23505') {
            testReactionCount++;
          }
        }
        if (testReactionCount >= 9) break;
      }
      console.log(`Added ${testReactionCount} reactions from Test User\n`);
    } else {
      console.log('Test User not found. Skipping Test User interactions.\n');
    }

    console.log('✅ Successfully added dummy interactions!');
    console.log(`\nSummary:`);
    console.log(`- Comments added: ${commentCount}`);
    console.log(`- Reactions added: ${reactionCount}`);
    if (testUser) {
      console.log(`- Test User comments: ${testCommentCount}`);
      console.log(`- Test User reactions: ${testReactionCount}`);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
addDummyInteractions();


