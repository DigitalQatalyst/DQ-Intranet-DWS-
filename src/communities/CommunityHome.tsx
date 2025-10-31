import React, { useState } from 'react';
import { useAuth } from '@/communities/contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { CommunitiesLayout } from './CommunitiesLayout';
import { Button } from '@/communities/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/communities/components/ui/dialog';
import { LoginForm } from '@/communities/components/auth/LoginForm';
import { Sparkles } from 'lucide-react';

export function CommunityHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <CommunitiesLayout>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          {/* Hero Section */}
          <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Modern corporate building" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-accent/50 to-transparent"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <span className="text-white/90 text-sm font-medium tracking-wider">
                    Connect • Collaborate • Innovate
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white max-w-4xl">
                  Welcome to DQ Intranet Communities
                </h1>
                
                <p className="mt-3 text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
                  Join your colleagues in meaningful discussions, share knowledge, and collaborate across teams to drive innovation at Digital Qatalyst.
                </p>
                
                <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
                  <Button onClick={() => setLoginModalOpen(true)} className="bg-white text-primary hover:bg-white/90 font-medium px-6 py-2.5" size="lg">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Join the Community
                  </Button>
                  <Button onClick={() => navigate('/communities')} className="bg-white/10 text-white ring-1 ring-white/40 hover:bg-white/15 font-medium px-6 py-2.5" size="lg" variant="outline">
                    Explore Communities
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-gray-50 py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
                Why Join DQ Communities?
              </h2>
              <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
                Our internal platform empowers you to connect with colleagues, share expertise, and collaborate on projects that matter.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                {/* Feature 1 */}
                <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-content-center">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Connect with Colleagues
                  </h3>
                  <p className="text-gray-600">
                    Build meaningful connections across departments and teams. Network with experts and collaborate on cross-functional initiatives.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-content-center">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Share Knowledge
                  </h3>
                  <p className="text-gray-600">
                    Participate in discussions, share best practices, and learn from your peers. Contribute to our collective knowledge base.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-6 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-content-center">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Drive Innovation
                  </h3>
                  <p className="text-gray-600">
                    Discover opportunities for collaboration, stay updated on company initiatives, and contribute to Digital Qatalyst's success.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl bg-[#030F35] text-white p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-center">
                  Ready to Get Started?
                </h2>
                <p className="mt-2 text-white/90 text-center max-w-2xl mx-auto">
                  Join your Digital Qatalyst colleagues in building a stronger, more connected workplace. Sign in to start collaborating today.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => setLoginModalOpen(true)} className="bg-white text-primary hover:bg-white/90 font-medium px-6 py-2.5" size="lg">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Sign In to Join
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* Login Modal */}
        <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="sr-only">Sign In</DialogTitle>
            </DialogHeader>
            <LoginForm onSuccess={() => setLoginModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </CommunitiesLayout>
  );
}