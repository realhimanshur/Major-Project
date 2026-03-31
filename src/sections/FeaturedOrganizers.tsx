import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrganizerCard from '@/components/OrganizerCard';
import { mockOrganizers } from '@/data/mockData';

const FeaturedOrganizers: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const featuredOrganizers = mockOrganizers.filter(o => o.isFeatured);

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

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#161616]" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#633dc0]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[#c385ff]/5 rounded-full blur-[120px]" />
      </div>

      {/* Hexagon Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <polygon fill="none" stroke="#633dc0" strokeWidth="1" points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" transform="translate(-12.3, -22)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#633dc0]/20 text-[#c385ff] text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Top Rated
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Montserrat'] text-white mb-4">
            Featured <span className="gradient-text">Organizers</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Top-rated event creators in your area. Book the best for your special occasion.
          </p>
        </div>

        {/* Organizers Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
          {featuredOrganizers.map((organizer) => (
            <OrganizerCard 
              key={organizer.id} 
              organizer={organizer} 
              variant="featured" 
            />
          ))}
        </div>

        {/* View All CTA */}
        <div className={`text-center mt-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '400ms' }}>
          <Button
            onClick={() => navigate('/organizers')}
            variant="outline"
            className="btn-secondary inline-flex items-center gap-2"
          >
            View All Organizers
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedOrganizers;
