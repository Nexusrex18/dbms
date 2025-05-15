"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Shield, MessageSquare, Heart, Share2, ArrowLeft, Send, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { communityService } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import ProtectedRoute from "@/components/protected-route"
import Header from "@/components/header"
import BackendStatus from "@/components/backend-status"
import { 
  formatPost, 
  formatResource, 
  getPostsWithFallback, 
  getResourcesWithFallback, 
  addPostWithFallback, 
  addCommentWithFallback,
  extractPostsFromResponse,
  extractResourcesFromResponse
} from "@/lib/community-helpers"
import { samplePosts, sampleResources } from "@/lib/sample-data"

interface Post {
  id: number
  author: string
  authorInitials?: string
  time: string
  content: string
  likes: number
  comments: number
  shares: number
  user_id?: number
}

interface Resource {
  id: number
  title: string
  description: string
  image: string
  link: string
}

export default function CommunityPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("stories")
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch posts and resources on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Check if backend is available
        const apiAvailable = await communityService.checkAPIConnection();
        
        // Fetch posts - if API is available
        let fetchedPosts = [];
        if (apiAvailable) {
          try {
            const postsResponse = await communityService.getPosts()
            console.log("Posts API response:", postsResponse)
            
            // Handle the fact that the API returns posts inside an object
            if (postsResponse?.data?.posts) {
              // If API returns the expected format with posts property
              fetchedPosts = postsResponse.data.posts
            } else if (Array.isArray(postsResponse?.data)) {
              // If API directly returns an array
              fetchedPosts = postsResponse.data
            } else {
              console.error("Unexpected posts format:", postsResponse?.data)
              fetchedPosts = []
            }
          } catch (postError) {
            console.error("Error fetching posts:", postError)
            // Fall back to sample data
            fetchedPosts = samplePosts;
          }
        } else {
          console.log("API unavailable, using sample data")
          fetchedPosts = samplePosts;
        }
        
        // Transform posts to match expected format
        const transformedPosts = fetchedPosts.map((post: any) => {
          // Extract author name from post data
          let authorName = "Unknown"
          if (typeof post.author === 'object' && post.author?.name) {
            authorName = post.author.name
          } else if (typeof post.author === 'string') {
            authorName = post.author
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
        })
        
        setPosts(transformedPosts)
        
        // Fetch resources
        const resourcesResponse = await communityService.getResources()
        console.log("Resources API response:", resourcesResponse)
        
        let fetchedResources = []
        if (Array.isArray(resourcesResponse?.data)) {
          fetchedResources = resourcesResponse.data
        } else {
          console.error("Unexpected resources format:", resourcesResponse?.data)
          fetchedResources = []
        }
        
        // Transform resources data
        const transformedResources = fetchedResources.map((resource: any) => ({
          id: resource.id || Math.random(),
          title: resource.title || "Untitled Resource",
          description: resource.description || "",
          image: resource.image || "/placeholder.svg?height=200&width=400",
          link: resource.url || "#"
        }))
        
        setResources(transformedResources)
      } catch (err) {
        console.error("Failed to fetch community data:", err)
        setError("Failed to load community data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostContent.trim() || !user) {
      if (!user) {
        setError("You must be logged in to create a post.")
      }
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Log request details
      console.log("Creating post with data:", {
        content: newPostContent,
        category: "general",
        token: localStorage.getItem('token') ? "Token exists" : "No token"
      })
      
      // Add title field for API compatibility
      const postResponse = await communityService.createPost({
        title: newPostContent.substring(0, 50) + (newPostContent.length > 50 ? "..." : ""),
        content: newPostContent,
        category: "general"
      })
      
      console.log("Post creation response:", postResponse)
      
      // Refresh posts after creating a new one
      const postsResponse = await communityService.getPosts()
      console.log("Updated posts response:", postsResponse)
      
      // Handle the fact that the API returns posts inside an object
      let fetchedPosts = []
      if (postsResponse?.data?.posts) {
        // If API returns the expected format with posts property
        fetchedPosts = postsResponse.data.posts
      } else if (Array.isArray(postsResponse?.data)) {
        // If API directly returns an array
        fetchedPosts = postsResponse.data
      } else {
        console.error("Unexpected posts format:", postsResponse?.data)
        fetchedPosts = []
      }
      
      // Transform posts to match expected format
      const transformedPosts = fetchedPosts.map((post: any) => {
        // Extract author name from post data
        let authorName = "Unknown"
        if (typeof post.author === 'object' && post.author?.name) {
          authorName = post.author.name
        } else if (typeof post.author === 'string') {
          authorName = post.author
        } else if (post.author_id === user.id) {
          authorName = user.full_name || user.username
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
          id: post.id || Math.random(),
          author: authorName,
          authorInitials: authorInitials,
          time: formattedTime,
          content: post.content || post.title || "No content",
          likes: post.likes || 0,
          comments: post.comments_count || 0,
          shares: post.shares || 0,
          user_id: post.author?.id || post.author_id
        }
      })
      
      setPosts(transformedPosts)
      
      // Reset form
      setNewPostContent("")
      setShowNewPostForm(false)
    } catch (err: any) {
      console.error("Failed to create post:", err)
      
      // More detailed error message
      let errorMessage = "Failed to create post. Please try again."
      if (err.response) {
        console.log("Error response data:", err.response.data)
        console.log("Error response status:", err.response.status)
        
        if (err.response.status === 401) {
          errorMessage = "You need to log in again to create a post."
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error
        }
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection."
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComment = async (postId: number, comment: string) => {
    if (!comment.trim() || !user) {
      if (!user) {
        setError("You must be logged in to add a comment.")
      }
      return
    }
    
    try {
      // Log request details
      console.log("Adding comment with data:", {
        postId,
        content: comment,
        token: localStorage.getItem('token') ? "Token exists" : "No token"
      })
      
      // Add the comment
      const commentResponse = await communityService.addComment(postId, { 
        content: comment 
      })
      console.log("Comment creation response:", commentResponse)
      
      // Update the UI optimistically to avoid delay
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1
          }
        }
        return post
      })
      
      setPosts(updatedPosts)
      
      // Then refresh all posts in the background
      try {
        const postsResponse = await communityService.getPosts()
        console.log("Updated posts after comment:", postsResponse)
        
        // Handle the fact that the API returns posts inside an object
        let fetchedPosts = []
        if (postsResponse?.data?.posts) {
          // If API returns the expected format with posts property
          fetchedPosts = postsResponse.data.posts
        } else if (Array.isArray(postsResponse?.data)) {
          // If API directly returns an array
          fetchedPosts = postsResponse.data
        } else {
          console.error("Unexpected posts format:", postsResponse?.data)
          return // Keep the optimistic update
        }
        
        // Transform posts to match expected format
        const transformedPosts = fetchedPosts.map((post: any) => {
          // Extract author name from post data
          let authorName = "Unknown"
          if (typeof post.author === 'object' && post.author?.name) {
            authorName = post.author.name
          } else if (typeof post.author === 'string') {
            authorName = post.author
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
            id: post.id || Math.random(),
            author: authorName,
            authorInitials: authorInitials,
            time: formattedTime,
            content: post.content || post.title || "No content",
            likes: post.likes || 0,
            comments: post.comments_count || 0,
            shares: post.shares || 0,
            user_id: post.author?.id || post.author_id
          }
        })
        
        setPosts(transformedPosts)
      } catch (refreshErr) {
        console.error("Failed to refresh posts after comment:", refreshErr)
        // Keep the optimistic update and don't show an error to the user
      }
    } catch (err: any) {
      console.error("Failed to add comment:", err)
      
      // More detailed error message
      let errorMessage = "Failed to add comment. Please try again."
      if (err.response) {
        console.log("Error response data:", err.response.data)
        console.log("Error response status:", err.response.status)
        
        if (err.response.status === 401) {
          errorMessage = "You need to log in again to add a comment."
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error
        }
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection."
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        <Header />
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-black pointer-events-none"
            animate={{
              backgroundPosition: [`0% 0%`, `100% 100%`],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover opacity-10 mix-blend-overlay pointer-events-none" />
        </div>

        {/* Back Link */}
        <div className="container mx-auto px-4 py-4 relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white w-fit">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Community</h1>
                <p className="text-white/60">Share experiences, find support, and connect with others</p>
              </div>

              <Button onClick={() => setShowNewPostForm(!showNewPostForm)} className="bg-orange-500 hover:bg-orange-600">
                {showNewPostForm ? "Cancel" : "Share Your Story"}
              </Button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Backend Status Component */}
            <div className="mb-6">
              <BackendStatus />
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 mb-8"
              >
                <h2 className="text-xl font-semibold mb-4">Share Your Experience</h2>
                <form className="space-y-4" onSubmit={handleNewPost}>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Share your story or experience with the community..."
                      className="min-h-[150px] bg-white/10 border-white/20 text-white placeholder:text-white/40"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/20 hover:bg-white/5"
                      onClick={() => setShowNewPostForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-orange-500 hover:bg-orange-600" 
                      disabled={isSubmitting || !newPostContent.trim()}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Posting...</span>
                        </div>
                      ) : "Post"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-6">
              <button
                className={`px-4 py-2 font-medium ${activeTab === "stories" ? "text-orange-500 border-b-2 border-orange-500" : "text-white/60 hover:text-white"}`}
                onClick={() => setActiveTab("stories")}
              >
                Stories & Experiences
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === "resources" ? "text-orange-500 border-b-2 border-orange-500" : "text-white/60 hover:text-white"}`}
                onClick={() => setActiveTab("resources")}
              >
                Safety Resources
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                <span className="ml-3 text-white/70">Loading content...</span>
              </div>
            ) : (
              <>
                {/* Stories Tab */}
                {activeTab === "stories" && (
                  <div className="space-y-6">
                    {posts.length === 0 ? (
                      <div className="text-center py-12 text-white/70">
                        No stories to display yet. Be the first to share your experience.
                      </div>
                    ) : (
                      posts.map((post) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <Avatar>
                              <AvatarFallback className="bg-orange-500/20 text-orange-500">
                                {post.authorInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{post.author}</h3>
                              <p className="text-sm text-white/60">{post.time}</p>
                            </div>
                          </div>

                          <p className="mb-6 text-white/90">{post.content}</p>

                          <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-white/60 hover:text-orange-500">
                              <Heart className="h-5 w-5" />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-white/60 hover:text-orange-500">
                              <MessageSquare className="h-5 w-5" />
                              <span>{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-2 text-white/60 hover:text-orange-500">
                              <Share2 className="h-5 w-5" />
                              <span>{post.shares}</span>
                            </button>
                          </div>

                          {user && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <div className="flex gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-orange-500/20 text-orange-500 text-xs">YOU</AvatarFallback>
                                </Avatar>
                                <form 
                                  className="flex-1 flex gap-2"
                                  onSubmit={(e) => {
                                    e.preventDefault()
                                    const input = e.currentTarget.elements.namedItem('comment') as HTMLInputElement
                                    if (input && input.value) {
                                      handleAddComment(post.id, input.value)
                                      input.value = ''
                                    }
                                  }}
                                >
                                  <Input
                                    name="comment"
                                    placeholder="Write a comment..."
                                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-8"
                                  />
                                  <Button type="submit" size="sm" className="h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600">
                                    <Send className="h-4 w-4" />
                                    <span className="sr-only">Send</span>
                                  </Button>
                                </form>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>
                )}

                {/* Resources Tab */}
                {activeTab === "resources" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {resources.length === 0 ? (
                      <div className="text-center py-12 text-white/70 col-span-2">
                        No resources to display yet. Please check back later.
                      </div>
                    ) : (
                      resources.map((resource) => (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
                        >
                          <Image
                            src={resource.image || "/placeholder.svg"}
                            width={400}
                            height={200}
                            alt={resource.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                            <p className="text-white/70 mb-4">{resource.description}</p>
                            <Link href={resource.link}>
                              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500/10">
                                Read More
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-white/40 text-sm">
              &copy; {new Date().getFullYear()} SafeNest. All rights reserved. Safety for All.
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
