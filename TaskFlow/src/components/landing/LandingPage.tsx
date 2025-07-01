import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { FeatureSection } from './FeatureSection';
import { TestimonialSection } from './TestimonialSection';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-white dark:bg-gray-900">
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
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              onClick={onGetStarted} 
              variant="ghost" 
              className="inline-flex text-white border-white/20 hover:bg-white/10"
              // @ts-ignore
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
                transition: { duration: 0.2 }
              }}
              // @ts-ignore
              whileTap={{ scale: 0.95 }}
            >
              Login / Sign Up
            </Button>
          </div>
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