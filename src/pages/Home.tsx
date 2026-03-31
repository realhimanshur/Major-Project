import React from 'react';
import Hero from '@/sections/Hero';
import Statistics from '@/sections/Statistics';
import HowItWorks from '@/sections/HowItWorks';
import PopularEvents from '@/sections/PopularEvents';
import FeaturedOrganizers from '@/sections/FeaturedOrganizers';
import Categories from '@/sections/Categories';
import Testimonials from '@/sections/Testimonials';
import CTA from '@/sections/CTA';

const Home: React.FC = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Statistics />
      <HowItWorks />
      <PopularEvents />
      <FeaturedOrganizers />
      <Categories />
      <Testimonials />
      <CTA />
    </main>
  );
};

export default Home;
