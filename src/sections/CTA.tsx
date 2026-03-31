import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Building2, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTA: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#633dc0] via-[#400f96] to-[#1a0a2e]" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Floating Circles */}
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/10 rounded-full animate-pulse" />
          <div className="absolute top-20 right-20 w-24 h-24 border border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c385ff]/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#ff2d53]/10 rounded-full blur-[120px]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-[#ffea00]" />
              <span className="text-white/90 text-sm font-medium">Start Your Journey Today</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Montserrat'] text-white leading-tight">
              Ready to Create Something{' '}
              <span className="text-[#ffea00]">Amazing?</span>
            </h2>

            <p className="text-xl text-white/80 max-w-lg leading-relaxed">
              Join thousands of hosts and attendees on EventHorizon. Whether you're planning an event or looking for your next experience, we've got you covered.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate('/register')}
                className="bg-white text-[#633dc0] hover:bg-white/90 px-8 py-6 rounded-xl font-semibold text-lg flex items-center gap-2 transition-all hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate('/contact')}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-xl font-semibold text-lg"
              >
                Contact Sales
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-white/60" />
                <span className="text-white/60 text-sm">500+ Venues</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-white/60" />
                <span className="text-white/60 text-sm">200+ Organizers</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-white/60" />
                <span className="text-white/60 text-sm">50K+ Events</span>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className={`hidden lg:block relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '200ms' }}>
            <div className="relative">
              {/* Main Card */}
              <div className="glass-card rounded-3xl p-8 backdrop-blur-xl bg-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {/* Stat Cards */}
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-white mb-2">98%</div>
                    <div className="text-white/60 text-sm">Satisfaction</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-[#ffea00] mb-2">4.9</div>
                    <div className="text-white/60 text-sm">Average Rating</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 text-center col-span-2">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#633dc0] to-[#c385ff] border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold"
                          >
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <div className="text-left">
                        <div className="text-white font-semibold">50K+ Happy Users</div>
                        <div className="text-white/60 text-sm">Join the community</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div 
                className="absolute -top-8 -right-8 w-24 h-24 rounded-2xl bg-[#ffea00]/20 backdrop-blur-sm flex items-center justify-center animate-float"
                style={{ animationDelay: '0.5s' }}
              >
                <Sparkles className="w-10 h-10 text-[#ffea00]" />
              </div>
              
              <div 
                className="absolute -bottom-6 -left-6 w-20 h-20 rounded-2xl bg-[#00c853]/20 backdrop-blur-sm flex items-center justify-center animate-float"
                style={{ animationDelay: '1s' }}
              >
                <div className="text-2xl font-bold text-[#00c853]">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
