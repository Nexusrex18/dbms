"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Shield, MessageSquare, Heart, Share2, ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("stories")
  const [showNewPostForm, setShowNewPostForm] = useState(false)

  // Sample community posts
  const posts = [
    {
      id: 1,
      author: "Sarah M.",
      authorInitials: "SM",
      time: "2 hours ago",
      content:
        "I want to share my experience with the SafeNest app. Last month, I was walking home late at night when I felt someone following me. I immediately pressed the SOS button, and within minutes, police arrived. The person following me ran away when they saw the police. I'm so grateful for this app - it truly made me feel safe in a scary situation.",
      likes: 24,
      comments: 5,
      shares: 3,
    },
    {
      id: 2,
      author: "Robert J.",
      authorInitials: "RJ",
      time: "1 day ago",
      content:
        "The self-defense class I took through SafeNest was incredible! The instructor was patient and taught us practical techniques that don't require a lot of strength. I feel much more confident now when I'm out alone. I highly recommend these classes to everyone, regardless of age or fitness level.",
      likes: 42,
      comments: 8,
      shares: 12,
    },
    {
      id: 3,
      author: "Priya K.",
      authorInitials: "PK",
      time: "3 days ago",
      content:
        "I just wanted to thank the SafeNest team for creating such an important app. As someone who often works late shifts, having the ability to quickly alert emergency services and my family if something happens gives me peace of mind. The community support here is also amazing - it's comforting to know we're all looking out for each other.",
      likes: 37,
      comments: 4,
      shares: 7,
    },
  ]

  // Sample resources
  const resources = [
    {
      id: 1,
      title: "Personal Safety Tips for Everyday Situations",
      description:
        "Learn practical safety tips for various everyday scenarios, from walking alone at night to using public transportation.",
      image: "/placeholder.svg?height=200&width=400",
      link: "/resources/personal-safety",
    },
    {
      id: 2,
      title: "Understanding and Responding to Harassment",
      description: "A comprehensive guide on identifying different forms of harassment and how to respond effectively.",
      image: "/placeholder.svg?height=200&width=400",
      link: "/resources/harassment-guide",
    },
    {
      id: 3,
      title: "Emergency Preparedness: What You Need to Know",
      description:
        "Essential information on preparing for various emergencies, including medical crises and natural disasters.",
      image: "/placeholder.svg?height=200&width=400",
      link: "/resources/emergency-prep",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-black"
          animate={{
            backgroundPosition: [`0% 0%`, `100% 100%`],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover opacity-10 mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-orange-500" />
            <span className="font-bold text-2xl tracking-tight">
              Safe<span className="text-orange-500">Nest</span>
            </span>
          </Link>

          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </header>

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

          {/* New Post Form */}
          {showNewPostForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Share Your Experience</h2>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Share your story or experience with the community..."
                    className="min-h-[150px] bg-white/10 border-white/20 text-white placeholder:text-white/40"
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
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    Post
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

          {/* Stories Tab */}
          {activeTab === "stories" && (
            <div className="space-y-6">
              {posts.map((post) => (
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

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-orange-500/20 text-orange-500 text-xs">YOU</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex gap-2">
                        <Input
                          placeholder="Write a comment..."
                          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-8"
                        />
                        <Button size="sm" className="h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600">
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource) => (
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
              ))}
            </div>
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
  )
}
