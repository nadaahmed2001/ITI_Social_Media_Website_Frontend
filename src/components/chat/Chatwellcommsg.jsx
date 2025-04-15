import React from 'react';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function Chatwellcommsg() {
  return (
    <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
      {/* Starburst background effect */}
      <motion.div
        initial={{ opacity: 0, rotate: 0, scale: 0 }}
        animate={{ opacity: 1, rotate: 360, scale: 1 }}
        transition={{ duration: 2, ease: "anticipate" }}
        className="absolute w-[600px] h-[600px] bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-red-700/30 via-transparent to-transparent blur-xl"
      />
  
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -20, x: Math.random() * 40 - 20 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, Math.random() * 80 - 40],
            x: [0, Math.random() * 60 - 30],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
  
      <motion.div
        initial={{ opacity: 0, rotateY: 180, scale: 0.5 }}
        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: "backOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="text-center z-10 space-y-6"
      >
        <motion.div
          initial={{ textShadow: "0 0 0px rgba(255,255,255,0)" }}
          animate={{ textShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 20px rgba(239,68,68,0.5)", "0 0 0px rgba(255,255,255,0)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Typography
            variant="h3"
            component="h1"
            className="text-white font-bold tracking-wide text-6xl bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"
          >
            Your conversation starts here 💬
          </Typography>
        </motion.div>
  
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          <motion.p
            className="text-gray-300 text-lg font-medium cursor-pointer relative"
            whileHover={{ color: "#f87171" }}
            animate={{
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
           Tap to Start 
          </motion.p>
        </motion.div>
      </motion.div>
  
      {/* Floating emojis */}
      <motion.div
        className="absolute text-4xl"
        animate={{
          y: [0, -40, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          left: "20%",
          top: "30%",
        }}
      >
        🚀
      </motion.div>
      <motion.div
        className="absolute text-4xl"
        animate={{
          y: [0, 40, 0],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          right: "20%",
          bottom: "30%",
        }}
      >
        ✨
      </motion.div>
    </div>
  );
}




