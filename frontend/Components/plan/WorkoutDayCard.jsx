import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../src/lib/utils';
import ExerciseListItem from './ExerciseListItem';
import { motion } from "framer-motion";

export default function WorkoutDayCard({ workout, planId, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <p className="text-sm font-medium text-blue-600">{workout.day}</p>
            <CardTitle className="text-xl text-slate-900">{workout.name}</CardTitle>
          </div>
          <Link to={createPageUrl(`ActiveWorkout?planId=${planId}&workoutName=${encodeURIComponent(workout.name)}`)}>
            <Button className="gradient-primary text-white shadow-lg hover:shadow-xl transition-transform hover:scale-105">
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workout.exercises && workout.exercises.length > 0 ? (
              workout.exercises.map((exercise, exerciseIndex) => (
                <ExerciseListItem key={exerciseIndex} exercise={exercise} />
              ))
            ) : (
              <p className="text-slate-500 text-sm">No exercises defined for this workout.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}