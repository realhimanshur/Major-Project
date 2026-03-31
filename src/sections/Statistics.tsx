import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Users, Star, Award } from 'lucide-react';
import { platformStats } from '@/data/mockData';

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  delay: number;
  isVisible: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, value, suffix, label, delay, isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      className={`relative glass-card rounded-2xl p-8 text-center transform transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#633dc0]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Icon */}
      <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-xl gradient-primary mb-4">
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Value */}
      <div className="relative">
        <span className="text-4xl sm:text-5xl font-bold text-white font-['Montserrat']">
          {count}
        </span>
        <span className="text-3xl sm:text-4xl font-bold text-[#c385ff]">{suffix}</span>
      </div>

      {/* Label */}
      <p className="relative text-white/60 mt-2 text-sm uppercase tracking-wider">
        {label}
      </p>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#633dc0]/10 to-transparent transform rotate-45 translate-x-20 -translate-y-20" />
      </div>
    </div>
  );
};

const Statistics: React.FC = () => {
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

  const stats = [
    { icon: Calendar, value: platformStats.totalEvents, suffix: '+', label: 'Events Hosted' },
    { icon: Users, value: platformStats.totalAttendees, suffix: 'K+', label: 'Happy Attendees' },
    { icon: Star, value: platformStats.totalOrganizers, suffix: '+', label: 'Expert Organizers' },
    { icon: Award, value: platformStats.satisfactionRate, suffix: '%', label: 'Satisfaction Rate' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-[#1a0a2e] to-[#161616]" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#633dc0]/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#c385ff]/5 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[#ff2d53]/5 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold font-['Montserrat'] text-white mb-4">
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Join our growing community of event organizers and attendees creating unforgettable experiences together.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 150}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
