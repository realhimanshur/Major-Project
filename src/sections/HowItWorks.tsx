import React, { useEffect, useRef, useState } from 'react';
import { Search, Filter, Ticket, PartyPopper } from 'lucide-react';

interface StepProps {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
  isAbove: boolean;
  delay: number;
  isVisible: boolean;
}

const Step: React.FC<StepProps> = ({ 
  number, 
  icon: Icon, 
  title, 
  description, 
  isAbove, 
  delay, 
  isVisible 
}) => {
  return (
    <div
      className={`relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Connection Line */}
      <div 
        className={`absolute hidden lg:block w-full h-0.5 bg-gradient-to-r from-[#633dc0] to-[#c385ff] ${
          isAbove ? 'bottom-0' : 'top-0'
        }`}
        style={{ 
          left: isAbove ? '50%' : '-50%',
          width: isAbove ? '100%' : '100%',
        }}
      />
      
      {/* Step Card */}
      <div 
        className={`relative glass-card rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300 ${
          isAbove ? 'mb-8 lg:mb-12' : 'mt-8 lg:mt-12'
        }`}
      >
        {/* Step Number */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
          {number}
        </div>

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#633dc0]/20 mb-4 group-hover:bg-[#633dc0]/30 transition-colors">
          <Icon className="w-8 h-8 text-[#c385ff]" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-white/60 text-sm">{description}</p>

        {/* Hover Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#633dc0]/0 to-[#c385ff]/0 group-hover:from-[#633dc0]/10 group-hover:to-[#c385ff]/10 transition-all duration-300" />
      </div>

      {/* Dot Connector */}
      <div 
        className={`hidden lg:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#633dc0] border-4 border-[#161616] ${
          isAbove ? 'bottom-[-8px]' : 'top-[-8px]'
        }`}
      />
    </div>
  );
};

const HowItWorks: React.FC = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: Search,
      title: 'Browse Events',
      description: 'Explore thousands of events across categories that match your interests.',
    },
    {
      icon: Filter,
      title: 'Choose Your Experience',
      description: 'Filter by date, location, price, and interests to find the perfect event.',
    },
    {
      icon: Ticket,
      title: 'Book Instantly',
      description: 'Secure your spot with easy payment and get instant confirmation.',
    },
    {
      icon: PartyPopper,
      title: 'Enjoy & Share',
      description: 'Attend, rate, and share your amazing experiences with the community.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#161616]" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#633dc0]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#c385ff]/5 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <span className="inline-block px-4 py-1 rounded-full bg-[#633dc0]/20 text-[#c385ff] text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Montserrat'] text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Getting started is easy. Follow these simple steps to discover and attend amazing events.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <Step
              key={step.title}
              number={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isAbove={index % 2 === 0}
              delay={index * 200}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Mobile Timeline Connector */}
        <div className="lg:hidden absolute left-8 top-40 bottom-20 w-0.5 bg-gradient-to-b from-[#633dc0] to-[#c385ff]" />
      </div>
    </section>
  );
};

export default HowItWorks;
