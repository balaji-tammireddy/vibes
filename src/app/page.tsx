"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Search, 
  Globe,
  Smartphone,
  Shield,
  Zap,
  Star,
  ArrowRight
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Share Moments",
      description: "Capture and share your life's best moments with stunning photos and videos"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Connect with Friends",
      description: "Follow your friends, discover new people, and build meaningful connections"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Engage & Interact",
      description: "Like, comment, and engage with content that resonates with you"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Discover Content",
      description: "Explore trending posts and discover new creators in your areas of interest"
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Vibes
            </h1>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Where Every Moment Becomes a Memory
          </h2>

          <p className="max-w-2xl mx-auto mb-10 text-lg sm:text-xl leading-relaxed text-gray-300">
            Join the next generation social platform where creativity meets connection. 
            Share your story, discover amazing content, and build lasting relationships 
            with people who share your passions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/register" passHref>
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 transition-all duration-200 transform hover:scale-105">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link href="/login" passHref>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-600 text-white hover:bg-gray-800 font-semibold px-8 py-3 transition-all duration-200">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Vibes?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience social media the way it was meant to be - authentic, engaging, and inspiring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How Vibes Works</h2>
            <p className="text-xl text-gray-400">Simple steps to start your journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Create Your Account</h3>
              <p className="text-gray-400">Sign up in seconds with just your email and create your unique profile</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Share Your Story</h3>
              <p className="text-gray-400">Upload photos, write captions, and share your moments with the world</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Connect & Engage</h3>
              <p className="text-gray-400">Follow friends, discover new content, and engage with the community</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built for the Modern Creator</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to express yourself and connect with others
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Mobile First</h3>
              <p className="text-gray-400">Optimized for mobile devices with a seamless experience across all platforms</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Privacy First</h3>
              <p className="text-gray-400">Your data is secure with end-to-end encryption and privacy controls</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400">Blazing fast performance with instant uploads and real-time interactions</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Global Community</h3>
              <p className="text-gray-400">Connect with people from around the world and discover diverse perspectives</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Quality Content</h3>
              <p className="text-gray-400">Algorithm that promotes meaningful content and authentic interactions</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Rich Interactions</h3>
              <p className="text-gray-400">Express yourself with likes, comments, shares, and rich media support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are already sharing their stories on Vibes. 
            Your community is waiting for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/register" passHref>
              <Button size="lg" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 transition-all duration-200 transform hover:scale-105">
                Join Vibes Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/login" passHref>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 transition-all duration-200">
                I Have an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Vibes</h3>
            <p className="text-gray-400 mb-6">Where Every Moment Becomes a Memory</p>
            
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-500 text-sm">
                © 2025 Vibes. Made with ❤️ for creators worldwide.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}