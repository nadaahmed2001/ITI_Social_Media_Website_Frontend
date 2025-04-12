import React from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function Chatwellcommsg() {
  return (
    <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
      {/* Animated glow background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1.6 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', repeatType: 'mirror' }}
        className="absolute w-80 h-80 rounded-full bg-red-700 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center z-10"
      >
        <Typography
          variant="h3"
          component="h1"
          className="text-white font-bold tracking-wide animate-pulse"
        >
          Welcome in chat,
        </Typography>

        <motion.p
          className="text-gray-300 mt-4 text-lg font-medium"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Please tap to start conversation
        </motion.p>
      </motion.div>
    </div>
  );
}
