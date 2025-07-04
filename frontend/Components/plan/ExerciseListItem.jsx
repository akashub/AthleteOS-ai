import React from 'react';
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

export default function ExerciseListItem({ exercise }) {
  return (
    <motion.div 
      className="p-3 rounded-lg bg-slate-50 border border-slate-100"
      whileHover={{ backgroundColor: '#f1f5f9', scale: 1.01 }}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-slate-800">{exercise.name}</span>
        <span className="text-sm text-slate-600 font-mono">
          {exercise.sets} × {exercise.reps}
        </span>
      </div>
      {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {exercise.muscle_groups.map((muscle, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-white">
              {muscle}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
}