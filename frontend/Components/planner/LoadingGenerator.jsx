import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Sparkles, Brain, Dumbbell, Target } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: Brain, text: "Analyzing your fitness profile..." },
  { icon: Target, text: "Optimizing for your goals..." },
  { icon: Dumbbell, text: "Selecting perfect exercises..." },
  { icon: Sparkles, text: "Finalizing your custom plan..." }
];

export default function LoadingGenerator({ isGenerating }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="border-0 shadow-xl">
        <CardContent className="p-12 text-center space-y-8">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-lg"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 w-20 h-20 bg-blue-200 rounded-full mx-auto opacity-30"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              AI is crafting your perfect workout plan
            </h2>
            <p className="text-slate-600">
              This usually takes 10-15 seconds. Get ready to transform your fitness journey!
            </p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  delay: index * 0.3,
                  scale: { duration: 1.5, repeat: Infinity, delay: index * 0.3 }
                }}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
              >
                <step.icon className="w-5 h-5 text-blue-500" />
                <span className="text-slate-700">{step.text}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}