import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AccountLocked = () => {
const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds

useEffect(() => {
const timer = setInterval(() => {
    setRemainingTime(prev => (prev > 0 ? prev - 1 : 0));
}, 1000);
return () => clearInterval(timer);
}, []);

const minutes = Math.floor(remainingTime / 60);
const seconds = remainingTime % 60;

return (
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
>
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
    <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="p-8 text-center"
    >
        <div className="flex justify-center mb-6">
        <motion.div
            animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1.1, 1]
            }}
            transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror"
            }}
        >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
            </svg>
        </motion.div>
        </div>

        <motion.h1 
        className="!text-3xl font-bold !text-[#191919] my-4 tracking-tight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        >
        Account Temporarily Locked
        </motion.h1>

        <motion.p 
        className="text-gray-600 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        >
        Too many failed login attempts detected. For security reasons, your account has been temporarily locked.
        </motion.p>

        <motion.div 
        className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left rounded"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        >
        <div className="flex items-center">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            >
            <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
            />
            </svg>
            <span className="font-medium text-red-700">
            Time remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
        </div>
        </motion.div>

        <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        >
        <p className="text-gray-700">
            What you can do:
        </p>
        <ul className="text-left space-y-2 text-gray-600">
            <li className="flex items-start">
            <svg
                className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
            </svg>
            <span>Wait for the lockout period to expire</span>
            </li>
            <li className="flex items-start">
            <svg
                className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
            </svg>
            <span>Reset your password if forgotten</span>
            </li>
            {/* <li className="flex items-start">
            <svg
                className="h-5 w-5 text-blue-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
            </svg>
            <span>Enable two-factor authentication for added security</span>
            </li> */}
        </ul>
        </motion.div>
    </motion.div>
    </div>
</motion.div>
);
};

export default AccountLocked;