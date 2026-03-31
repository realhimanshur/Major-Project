import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockEvents } from '@/data/mockData';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const featuredEvents = mockEvents.filter(e => e.isFeatured).slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4a148c] via-[#161616] to-[#1a0033]" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#633dc0]/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#c385ff]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#ff2d53]/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99, 61, 192, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 61, 192, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
              style={{ transitionDelay: '200ms' }}
            >
              <Sparkles className="w-4 h-4 text-[#c385ff]" />
              <span className="text-sm text-white/80">#1 Event Management Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-['Montserrat'] leading-tight">
              <span className="text-white">Discover</span>
              <br />
              <span className="gradient-text">Events Around</span>
              <br />
              <span className="text-white">You</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-white/70 max-w-lg leading-relaxed">
              Find, book, and attend amazing events. Or become a host and create unforgettable experiences for others.
            </p>

            {/* Search Bar */}
            <form 
              onSubmit={handleSearch}
              className={`relative max-w-xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-white/50" />
                <Input
                  type="text"
                  placeholder="Search events, organizers, or venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-32 py-6 bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-xl focus:ring-2 focus:ring-[#633dc0] focus:border-transparent"
                />
                <Button
                  type="submit"
                  className="absolute right-2 btn-primary"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* CTAs */}
            <div 
              className={`flex flex-wrap gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: '600ms' }}
            >
              <Button
                onClick={() => navigate('/events')}
                className="btn-primary flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Explore Events
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate('/register')}
                variant="outline"
                className="btn-secondary"
              >
                Host an Event
              </Button>
            </div>

            {/* Stats */}
            <div 
              className={`flex gap-8 pt-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ transitionDelay: '800ms' }}
            >
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-sm text-white/50">Events</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">50K+</p>
                <p className="text-sm text-white/50">Attendees</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">200+</p>
                <p className="text-sm text-white/50">Organizers</p>
              </div>
            </div>
          </div>

          {/* Right Content - Featured Events Cards */}
          <div 
            className={`hidden lg:block relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="relative h-[500px] perspective-1000">
              {featuredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="absolute w-80 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-500 hover:scale-105 hover:z-50"
                  style={{
                    top: `${index * 60}px`,
                    left: `${index * 40}px`,
                    zIndex: 3 - index,
                    transform: `rotateY(${-5 + index * 2}deg) rotateX(${3 - index}deg)`,
                    animation: `float ${6 + index}s ease-in-out infinite`,
                    animationDelay: `${index * 0.5}s`,
                  }}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent" />
                    
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.type === 'free' 
                          ? 'bg-[#00c853] text-white' 
                          : 'bg-[#633dc0] text-white'
                      }`}>
                        {event.type === 'free' ? 'Free' : `₹${event.price}`}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-xs text-[#c385ff] uppercase tracking-wider">
                        {event.category}
                      </span>
                      <h3 className="text-white font-semibold mt-1 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-white/60 text-sm mt-1">
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#633dc0]/20 rounded-full blur-[60px]" />
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#c385ff]/20 rounded-full blur-[50px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#161616] to-transparent" />
    </section>
  );
};

export default Hero;
