import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { FeatureSection } from './FeatureSection';
import { TestimonialSection } from './TestimonialSection';
import { ThemeToggle } from '../ui/ThemeToggle';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="custom-cursor">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          
          <ThemeToggle />
        </nav>
      </motion.header>

      {/* Main Content */}
      <main>
        <HeroSection onGetStarted={onGetStarted} />
        <FeatureSection />
        <TestimonialSection />
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2025 TaskFlow. Crafted with care for productivity enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  );
};