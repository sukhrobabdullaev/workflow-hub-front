import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={handleOpen}
            >
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Demo
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                                onClick={handleClose}
                            >
                                <X className="w-5 h-5" />
                            </Button>

                            {/* Demo Animation */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 360]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center"
                                    >
                                        <PlayCircle className="w-10 h-10" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
                                    <p className="text-blue-200">Interactive demo video showcasing WorkflowHub features</p>

                                    {/* Animated Feature Showcase */}
                                    <div className="mt-8 grid grid-cols-3 gap-6 max-w-lg mx-auto">
                                        {[
                                            { title: "Projects", delay: 0 },
                                            { title: "Analytics", delay: 0.5 },
                                            { title: "Team", delay: 1 }
                                        ].map((feature, index) => (
                                            <motion.div
                                                key={feature.title}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: feature.delay, duration: 0.6 }}
                                                className="text-center"
                                            >
                                                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl"></div>
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
