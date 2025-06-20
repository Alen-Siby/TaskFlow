import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit, Filter, Settings } from 'lucide-react';

interface FloatingActionButtonProps {
  onNewTask: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onNewTask }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Edit, label: 'New Task', action: onNewTask },
    { icon: Filter, label: 'Filter', action: () => console.log('Filter') },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  x: 0,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0, 
                  x: 20,
                  transition: { delay: (menuItems.length - 1 - index) * 0.05 }
                }}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 glass-strong rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </div>
  );
};