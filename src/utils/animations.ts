import type { Variants } from 'framer-motion';

// Page transition variants
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Sidebar variants
export const sidebarVariants: Variants = {
  open: { x: 0 },
  closed: { x: '100%' },
};

// Card hover variants
export const cardVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

// Fade in variants
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Slide up variants
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// Stagger children variants
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Glow pulse animation
export const glowPulseVariants: Variants = {
  initial: { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0)' },
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(249, 115, 22, 0.4)',
      '0 0 20px 10px rgba(249, 115, 22, 0)',
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

// Typewriter animation helper
export const typewriterTransition = {
  duration: 0.05,
  ease: 'linear',
};

// Workflow step variants
export const workflowStepVariants: Variants = {
  pending: { opacity: 0.5, scale: 0.95 },
  active: { opacity: 1, scale: 1 },
  completed: { opacity: 1, scale: 1 },
};

// Spinner variants
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Default transition
export const defaultTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};
