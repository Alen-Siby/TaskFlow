import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms for different layers
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const middleY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "70%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Detect mobile devices for video fallback
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasLowBandwidth = navigator.connection && navigator.connection.effectiveType === 'slow-2g';
    
    if (isMobile || hasLowBandwidth) {
      setShowFallback(true);
    }
  }, []);

  // Video controls
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  // Respect user's motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Background Layer - Slowest parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: prefersReducedMotion ? 0 : backgroundY }}
      >
        {/* Video Background */}
        {!showFallback ? (
          <video
            ref={videoRef}
            autoPlay
            muted={isVideoMuted}
            loop
            playsInline
            className="w-full h-full object-cover scale-110"
            onLoadStart={() => setShowFallback(false)}
            onError={() => setShowFallback(true)}
            preload="metadata"
          >
            <source
              src="https://videos.pexels.com/video-files/6962025/6962025-hd_1920_1080_24fps.mp4"
              type="video/mp4"
            />
            <source
              src="https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          </video>
        ) : (
          /* Fallback Image */
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat scale-110"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
            }}
          />
        )}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40" />
      </motion.div>

      {/* Middle Layer - Animated Elements */}
      <motion.div 
        className="absolute inset-0 z-10"
        style={{ y: prefersReducedMotion ? 0 : middleY }}
      >
        {/* Floating Geometric Elements */}
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 glass rounded-2xl"
          animate={{ 
            y: prefersReducedMotion ? 0 : [0, -20, 0],
            rotate: prefersReducedMotion ? 0 : [0, 10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-12 h-12 glass rounded-xl"
          animate={{ 
            y: prefersReducedMotion ? 0 : [0, -15, 0],
            rotate: prefersReducedMotion ? 0 : [0, -15, 0]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-8 h-8 glass rounded-lg"
          animate={{ 
            y: prefersReducedMotion ? 0 : [0, -10, 0],
            rotate: prefersReducedMotion ? 0 : [0, 20, 0]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-6 h-6 glass rounded-md"
          animate={{ 
            y: prefersReducedMotion ? 0 : [0, -8, 0],
            rotate: prefersReducedMotion ? 0 : [0, -10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Particle Effects */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: prefersReducedMotion ? 0 : [0, -30, 0],
              opacity: prefersReducedMotion ? 0.3 : [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

      {/* Foreground Layer - Main Content */}
      <motion.div 
        className="relative z-20 min-h-screen flex items-center justify-center"
        style={{ 
          y: prefersReducedMotion ? 0 : foregroundY,
          opacity: prefersReducedMotion ? 1 : opacity
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-strong rounded-3xl p-12 backdrop-blur-xl"
            style={{ opacity: 0.9 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
            >
              TaskFlow
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed"
            >
              Revolutionize your productivity with our beautifully designed task management platform
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                className="group px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                className="px-8 py-4 text-lg text-white border border-white/20 hover:bg-white/10"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Video Controls */}
      {!showFallback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-6 right-6 z-30 flex space-x-2"
        >
          <button
            onClick={toggleVideoPlayback}
            className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
            aria-label={isVideoPlaying ? "Pause video" : "Play video"}
          >
            {isVideoPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
          </button>
          
          <button
            onClick={toggleVideoMute}
            className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
            aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
          >
            {isVideoMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        </motion.div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        animate={{ y: prefersReducedMotion ? 0 : [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ y: prefersReducedMotion ? 0 : [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};