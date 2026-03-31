import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Music, 
  Briefcase, 
  Heart, 
  UtensilsCrossed, 
  Palette, 
  Trophy,
  GraduationCap,
  Users
} from 'lucide-react';

interface CategoryProps {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
  delay: number;
  isVisible: boolean;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryProps> = ({ 
  name, 
  icon: Icon, 
  description, 
  color, 
  delay, 
  isVisible, 
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer transition-all duration-700 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Blob Shape */}
      <div 
        className="relative p-8 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] transition-all duration-500 group-hover:rounded-[60%_40%_30%_70%/60%_30%_70%_40%]"
        style={{ 
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          border: `1px solid ${color}30`,
        }}
      >
        {/* Icon */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
          style={{ background: `${color}30` }}
        >
          <Icon className="w-8 h-8" style={{ color }} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white text-center mb-2 group-hover:text-[#c385ff] transition-colors">
          {name}
        </h3>
        <p className="text-white/60 text-sm text-center">
          {description}
        </p>

        {/* Hover Glow */}
        <div 
          className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
          style={{ background: `${color}40` }}
        />
      </div>
    </div>
  );
};

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'music', name: 'Music', icon: Music, description: 'Concerts, festivals & more', color: '#ff2d53' },
    { id: 'business', name: 'Business', icon: Briefcase, description: 'Conferences & networking', color: '#1da1f2' },
    { id: 'wellness', name: 'Wellness', icon: Heart, description: 'Yoga, fitness & health', color: '#00c853' },
    { id: 'food', name: 'Food & Drink', icon: UtensilsCrossed, description: 'Tastings & culinary', color: '#ff6f00' },
    { id: 'arts', name: 'Arts', icon: Palette, description: 'Exhibitions & performances', color: '#c385ff' },
    { id: 'sports', name: 'Sports', icon: Trophy, description: 'Games & competitions', color: '#ffea00' },
    { id: 'education', name: 'Education', icon: GraduationCap, description: 'Workshops & learning', color: '#633dc0' },
    { id: 'social', name: 'Social', icon: Users, description: 'Meetups & gatherings', color: '#ff6f00' },
  ];

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
      <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-[#1a0a2e] to-[#161616]" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#633dc0]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#c385ff]/10 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <span className="inline-block px-4 py-1 rounded-full bg-[#633dc0]/20 text-[#c385ff] text-sm font-medium mb-4">
            Browse by Interest
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Montserrat'] text-white mb-4">
            Explore by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Find events that match your passion. From music to wellness, there's something for everyone.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              {...category}
              delay={index * 100}
              isVisible={isVisible}
              onClick={() => navigate(`/events?category=${category.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
