"use client";

import { motion } from 'framer-motion'; // Ensure framer-motion is installed: npm install framer-motion

interface AnimatedTextProps {
  text: string;
  el?: keyof JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

const defaultAnimations = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (delayFactor: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * delayFactor, // Add small base delay
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1], // easeInOut
    },
  }),
};

export function AnimatedText({
  text,
  el: Wrapper = 'p',
  className,
  delay = 0,
  staggerChildren = 0.04,
}: AnimatedTextProps) {
  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: staggerChildren,
        delayChildren: delay,
      } 
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      }
    },
  };

  return (
    <Wrapper className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={text}
        style={{ display: 'inline-block', overflow: 'hidden' }} // For y animation
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={childVariants}
            style={{ display: 'inline-block', marginRight: '0.25em' }} // Add space between words
            aria-hidden="true"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
}
