import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Trophy, Clock, Target, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkoutComplete({ sessionData, onFinish }) {
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card className="border-0 shadow-xl max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          {/* Celebration Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 w-24 h-24 bg-blue-200 rounded-full mx-auto"
            />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h2 className="text-3xl font-bold text-slate-900">
              Workout Complete! 🎉
            </h2>
            <p className="text-lg text-slate-600">
              Amazing job completing "{sessionData.workout_name}"
            </p>
          </motion.div>

          {/* Workout Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-6 py-6"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {formatDuration(sessionData.duration_minutes || 0)}
              </div>
              <p className="text-sm text-slate-600">Duration</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {sessionData.exercises_completed?.length || 0}
              </div>
              <p className="text-sm text-slate-600">Exercises</p>
            </div>
          </motion.div>

          {/* Motivational Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100"
          >
            <p className="text-slate-700 font-medium">
              "Success is the sum of small efforts repeated day in and day out."
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Keep up the amazing work! Your consistency will pay off.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex gap-3 pt-4"
          >
            <Button
              onClick={onFinish}
              className="flex-1 gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </motion.div>

          {/* Quick Stats */}
          {sessionData.exercises_completed && sessionData.exercises_completed.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="pt-6 border-t border-slate-100"
            >
              <h4 className="font-semibold text-slate-900 mb-3">Exercise Summary</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {sessionData.exercises_completed.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded">
                    <span className="text-slate-700">{exercise.exercise_name}</span>
                    <Badge variant="outline" className="bg-white">
                      {exercise.sets_completed} sets
                    </Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}