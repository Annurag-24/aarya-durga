import { useLoader } from '@/contexts/LoaderContext';
import { AnimatePresence, motion } from 'framer-motion';

const GlobalLoader = () => {
  const { isLoading } = useLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-foreground/50 flex items-center justify-center backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Lotus Spinner */}
            <div className="relative w-16 h-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <div className="w-full h-full border-4 border-transparent border-t-secondary border-r-secondary rounded-full" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2"
              >
                <div className="w-full h-full border-4 border-transparent border-b-secondary rounded-full" />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">
                🪷
              </div>
            </div>

            {/* Loading Text */}
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary-foreground font-medium"
            >
              Loading...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
