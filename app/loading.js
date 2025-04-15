"use client";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative">
        <Lock className="w-16 h-16 text-fuchsia-400 animate-pulse" />
        <div className="absolute inset-0 shimmer rounded-full" />
      </div>
      <p className="mt-4 text-lg font-semibold text-fuchsia-300">
        Taking Control of your privacy...
      </p>

      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </motion.div>
  );
}
