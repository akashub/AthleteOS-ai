import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { 
  CheckCircle, 
  RefreshCw, 
  Calendar, 
  Clock, 
  Target,
  Dumbbell,
  Play
} from "lucide-react";
import { motion } from "framer-motion";

export default function PlanPreview({ plan, onAccept, onRegenerate, isAccepting }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Plan Header */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl text-slate-900 mb-2">{plan.name}</CardTitle>
            <p className="text-slate-600 text-lg">{plan.description}</p>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-3 py-1">
              {plan.goal?.replace('_', ' ')}
            </Badge>
            <div className="flex items-center gap-1 text-slate-600">
              <Calendar className="w-4 h-4" />
              {plan.duration_weeks} weeks
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <Clock className="w-4 h-4" />
              {plan.workouts_per_week} workouts/week
            </div>
            <Badge variant="outline">
              {plan.difficulty_level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Equipment */}
          {plan.equipment_needed?.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                Equipment Needed
              </h4>
              <div className="flex flex-wrap gap-2">
                {plan.equipment_needed.map((equipment, index) => (
                  <Badge key={index} variant="outline" className="bg-slate-50">
                    {equipment}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onAccept}
              disabled={isAccepting}
              className="flex-1 gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {isAccepting ? 'Activating Plan...' : 'Accept & Start Plan'}
            </Button>
            <Button
              onClick={onRegenerate}
              variant="outline"
              className="px-6 h-12"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workouts Preview */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Workout Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plan.workouts?.map((workout, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{workout.name}</h4>
                    <p className="text-sm text-slate-600">{workout.day}</p>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {workout.exercises?.length || 0} exercises
                  </Badge>
                </div>
                
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="space-y-2">
                    <Separator className="my-3" />
                    <div className="grid gap-2">
                      {workout.exercises.slice(0, 3).map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">{exercise.name}</span>
                          <span className="text-slate-500">
                            {exercise.sets} sets × {exercise.reps}
                          </span>
                        </div>
                      ))}
                      {workout.exercises.length > 3 && (
                        <div className="text-xs text-slate-500 text-center pt-1">
                          +{workout.exercises.length - 3} more exercises
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}