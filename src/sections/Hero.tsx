import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

interface HeroProps {
  onJoinWaitlist: () => void;
}

export function Hero({ onJoinWaitlist }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs - Purple to Lime */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-[#8B5CF6] rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#CCFF00] rounded-full blur-[150px]"
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#CCFF00]" />
              <span className="text-sm text-gray-300">AI-Powered JAMB Preparation</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Stop Reading Randomly.{' '}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#CCFF00] bg-clip-text text-transparent">
                Start Preparing Intelligently
              </span>{' '}
              for JAMB.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              AI detects your weaknesses, builds your personalized roadmap, and forces 
              repetition until you master every topic. Your intelligent JAMB tutor is coming.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={onJoinWaitlist}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2"
              >
                Sign Up Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                See How It Works
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10"
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Zap className="w-4 h-4 text-[#CCFF00]" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Target className="w-4 h-4 text-[#8B5CF6]" />
                <span>Personalized</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                <span>Proven Results</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#8B5CF6]/20 to-[#CCFF00]/20 rounded-3xl blur-2xl" />
              
              {/* Dashboard Mockup */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative bg-[#1A1625] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
              >
                {/* Mock Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#0F0C15] border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-gray-500">PROPELLA Dashboard</span>
                  </div>
                </div>

                {/* Mock Content */}
                <div className="p-6 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#0F0C15] rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Streak</div>
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-bold text-[#CCFF00]">12</span>
                        <span className="text-lg">🔥</span>
                      </div>
                    </div>
                    <div className="bg-[#0F0C15] rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Rank</div>
                      <div className="text-xl font-bold text-[#8B5CF6]">Expert</div>
                    </div>
                    <div className="bg-[#0F0C15] rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Points</div>
                      <div className="text-xl font-bold text-[#A78BFA]">2,450</div>
                    </div>
                  </div>

                  {/* Progress Card */}
                  <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#CCFF00]/10 rounded-lg p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Today&apos;s Mission</span>
                      <span className="text-xs text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-1 rounded">Day 15</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-400 line-through">Study: Algebra</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-400 line-through">Practice Quiz</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full border-2 border-[#8B5CF6]" />
                        <span>Revision: Geometry</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 bg-[#0F0C15] rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-[#8B5CF6] to-[#CCFF00] rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* AI Tutor Card */}
                  <div className="bg-[#0F0C15] rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6] to-[#CCFF00] rounded-full flex items-center justify-center text-lg">
                      🎓
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Professor Wisdom</div>
                      <div className="text-xs text-gray-500">&quot;Ready to unlock your potential?&quot;</div>
                    </div>
                    <div className="w-8 h-8 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-[#1A1625] rounded-xl p-3 border border-white/10 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Quiz Score</div>
                    <div className="font-bold text-[#10B981]">85%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-[#1A1625] rounded-xl p-3 border border-white/10 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#CCFF00]/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#CCFF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Level Up!</div>
                    <div className="font-bold text-[#CCFF00]">+150 XP</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
