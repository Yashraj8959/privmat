"use client";

import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

const ChatMessage = ({ msg, index }) => {
    if (!msg || !msg.sender) return null; // 🔐 safety check
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.15,
          duration: 0.5,
          ease: "easeOut",
        }}
        className={clsx(
          "flex items-end gap-2 max-w-[85%]",
          msg.sender === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
        )}
      >
        {msg.sender === "privmat" && msg.icon && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            {React.cloneElement(msg.icon, { className: "h-5 w-5" })}
          </div>
        )}
  
        <div
          className={clsx(
            "p-3 rounded-xl shadow-sm text-sm leading-relaxed",
            msg.sender === "user"
              ? "bg-indigo-600 text-white rounded-br-none"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
          )}
        >
          {msg.text}
        </div>
      </motion.div>
    );
  };
  
export default ChatMessage;