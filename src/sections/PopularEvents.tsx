import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/EventCard';
import { mockEvents } from '@/data/mockData';

const PopularEvents: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const featuredEvents = mockEvents.filter(e => e.isFeatured);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, featuredEvents.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, featuredEvents.length - 2)) % Math.max(1, featuredEvents.length - 2));
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-[#1a0a2e] to-[#161616]" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#633dc0]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-[#c385ff]/10 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row md:items-end md:justify-between mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-[#633dc0]/20 text-[#c385ff] text-sm font-medium mb-4">
              Trending Now
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Montserrat'] text-white mb-4">
              Popular <span className="gradient-text">Events</span>
            </h2>
            <p className="text-white/60 max-w-xl text-lg">
              Trending experiences you don't want to miss. Book your spot today!
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Events Carousel */}
        <div 
          ref={carouselRef}
          className={`relative overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <div 
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {featuredEvents.map((event) => (
              <div 
                key={event.id} 
                className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0"
              >
                <EventCard event={event} variant="featured" />
              </div>
            ))}
          </div>
        </div>

        {/* View All CTA */}
        <div className={`text-center mt-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '400ms' }}>
          <Button
            onClick={() => navigate('/events')}
            variant="outline"
            className="btn-secondary inline-flex items-center gap-2"
          >
            View All Events
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularEvents;
