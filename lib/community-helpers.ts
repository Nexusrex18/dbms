// Community component helpers - utilities to work with community data
import { samplePosts, sampleResources } from './sample-data';
import { communityService } from './api';

/**
 * Check if the Flask API is running and accessible
 */
export async function isAPIAvailable(): Promise<boolean> {
  try {
    // Try to fetch resources which doesn't require authentication
    const response = await fetch('http://localhost:5000/api/community/resources', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Short timeout to not hang the UI
      signal: AbortSignal.timeout(3000)
    });
    
    return response.ok;
  } catch (error) {
    console.error("API availability check failed:", error);
    return false;
  }
}

/**
 * Get posts with fallback to sample data
 */
export async function getPostsWithFallback() {
  try {
    const apiAvailable = await isAPIAvailable();
    
    if (!apiAvailable) {
      console.log("API unavailable, using sample posts data");
      return { data: samplePosts };
    }
    
    return await communityService.getPosts();
  } catch (error) {
    console.error("Error fetching posts, using fallback:", error);
    return { data: samplePosts };
  }
}

/**
 * Get resources with fallback to sample data
 */
export async function getResourcesWithFallback() {
  try {
    const apiAvailable = await isAPIAvailable();
    
    if (!apiAvailable) {
      console.log("API unavailable, using sample resources data");
      return { data: sampleResources };
    }
    
    return await communityService.getResources();
  } catch (error) {
    console.error("Error fetching resources, using fallback:", error);
    return { data: sampleResources };
  }
}

/**
 * Format a post object into a standardized format
 */
export function formatPost(post: any, currentUser: any = null) {
  // Extract author name from post data
  let authorName = "Unknown"
  if (typeof post.author === 'object' && post.author?.name) {
    authorName = post.author.name
  } else if (typeof post.author === 'string') {
    authorName = post.author
  } else if (currentUser && post.author_id === currentUser.id) {
    authorName = currentUser.full_name || currentUser.username
  }
  
  // Calculate initials
  const authorInitials = authorName.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
  
  // Format time
  let formattedTime = "Recently"
  if (post.created_at) {
    try {
      const date = new Date(post.created_at)
      formattedTime = date.toLocaleDateString()
    } catch (e) {
      console.error("Error formatting date:", e)
    }
  }
  
  return {
    id: post.id || Math.random(), // Fallback to random ID if none provided
    author: authorName,
    authorInitials: authorInitials,
    time: formattedTime,
    content: post.content || post.title || "No content",
    likes: post.likes || 0,
    comments: post.comments_count || 0,
    shares: post.shares || 0,
    user_id: post.author?.id || post.author_id
  }
}

/**
 * Format a resource object into a standardized format
 */
export function formatResource(resource: any) {
  return {
    id: resource.id || Math.random(),
    title: resource.title || "Untitled Resource",
    description: resource.description || "",
    image: resource.image || "/placeholder.svg?height=200&width=400",
    link: resource.url || "#"
  }
}

/**
 * Extract posts from an API response, handling different response formats
 */
export function extractPostsFromResponse(response: any) {
  if (!response || !response.data) return [];
  
  // Handle the fact that the API returns posts inside an object
  if (response.data.posts && Array.isArray(response.data.posts)) {
    return response.data.posts;
  } else if (Array.isArray(response.data)) {
    return response.data;
  } else {
    console.error("Unexpected posts format:", response.data);
    return [];
  }
}

/**
 * Extract resources from an API response
 */
export function extractResourcesFromResponse(response: any) {
  if (!response || !response.data) return [];
  
  if (Array.isArray(response.data)) {
    return response.data;
  } else {
    console.error("Unexpected resources format:", response.data);
    return [];
  }
}

/**
 * Add a post with fallback for offline mode
 */
export async function addPostWithFallback(postData: any, user: any, posts: any[]) {
  try {
    const apiAvailable = await isAPIAvailable();
    
    if (!apiAvailable) {
      console.log("API unavailable, using offline post creation");
      // Create a simulated post
      const newPost = {
        id: Date.now(),
        author: user?.full_name || user?.username || "You",
        authorInitials: (user?.full_name || user?.username || "You")
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase(),
        time: "Just now",
        content: postData.content,
        likes: 0,
        comments: 0,
        shares: 0,
        user_id: user?.id || 999
      };
      
      // Return simulated response with updated posts
      return { 
        success: true,
        data: newPost,
        updatedPosts: [newPost, ...posts]
      };
    }
    
    // Real API call
    await communityService.createPost(postData);
    const postsResponse = await communityService.getPosts();
    
    return {
      success: true,
      data: postsResponse.data,
      updatedPosts: extractPostsFromResponse(postsResponse).map((post: any) => formatPost(post, user))
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post"
    };
  }
}

/**
 * Add a comment with fallback for offline mode
 */
export async function addCommentWithFallback(postId: number, commentData: any, user: any, posts: any[]) {
  try {
    const apiAvailable = await isAPIAvailable();
    
    if (!apiAvailable) {
      console.log("API unavailable, using offline comment creation");
      
      // Update the post with the new comment count (optimistic update)
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: (post.comments || 0) + 1
          };
        }
        return post;
      });
      
      return {
        success: true,
        updatedPosts
      };
    }
    
    // Real API call
    await communityService.addComment(postId, commentData);
    const postsResponse = await communityService.getPosts();
    
    return {
      success: true,
      updatedPosts: extractPostsFromResponse(postsResponse).map((post: any) => formatPost(post, user))
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add comment",
      updatedPosts: posts // Return original posts on error
    };
  }
}
