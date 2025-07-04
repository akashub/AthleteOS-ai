import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Play, Clock, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkoutSelector({ workouts, onSelectWorkout }) {
  if (!workouts || workouts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Workouts Available</h3>
            <p className="text-slate-600">This plan doesn't have any workouts defined yet.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-slate-900">Choose Your Workout</CardTitle>
          <p className="text-slate-600">Select a workout to begin your session</p>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {workouts.map((workout, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {workout.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{workout.day}</span>
                      </div>
                      <Badge variant="outline" className="bg-slate-50">
                        {workout.exercises?.length || 0} exercises
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => onSelectWorkout(workout)}
                    className="gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                </div>

                {/* Exercise Preview */}
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <h4 className="font-medium text-slate-900 text-sm">Exercises:</h4>
                    <div className="grid gap-1">
                      {workout.exercises.slice(0, 4).map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{exercise.name}</span>
                          <span className="text-slate-500">
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>
                      ))}
                      {workout.exercises.length > 4 && (
                        <div className="text-xs text-slate-500 text-center pt-1">
                          +{workout.exercises.length - 4} more exercises
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}