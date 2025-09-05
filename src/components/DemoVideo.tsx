import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { PlayCircle, X } from 'lucide-react';
import { useState } from 'react';

interface DemoVideoProps {
  onClose?: () => void;
}

export const DemoVideo = ({ onClose }: DemoVideoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      <Button size="lg" variant="outline" className="px-8 py-6 text-lg" onClick={handleOpen}>
        <PlayCircle className="mr-2 h-5 w-5" />
        Watch Demo
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-4 z-10 text-white hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Demo Animation */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                <div className="text-center text-white">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20"
                  >
                    <PlayCircle className="h-10 w-10" />
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-bold">Coming Soon</h3>
                  <p className="text-blue-200">
                    Interactive demo video showcasing WorkflowHub features
                  </p>

                  {/* Animated Feature Showcase */}
                  <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-6">
                    {[
                      { title: 'Projects', delay: 0 },
                      { title: 'Analytics', delay: 0.5 },
                      { title: 'Team', delay: 1 },
                    ].map((feature, _) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: feature.delay, duration: 0.6 }}
                        className="text-center"
                      >
                        <div className="mx-auto mb-2 h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500"></div>
                        <p className="text-sm text-blue-200">{feature.title}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
