import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../src/lib/utils";
import { Play, Calendar, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function ActivePlanCard({ activePlan, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (!activePlan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">No Active Plan</h3>
              <p className="text-sm sm:text-base text-slate-600">
                Ready to start your fitness journey? Let our AI create the perfect workout plan for you.
              </p>
            </div>
            <Link to={createPageUrl("PlanGenerator")}>
              <Button className="gradient-primary text-white shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-auto">
                <Zap className="w-4 h-4 mr-2" />
                Generate AI Plan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const completedWorkouts = 0;
  const totalWorkouts = activePlan.workouts?.length || 0;
  const progressPercentage = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-lg sm:text-xl text-slate-900">{activePlan.name}</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                  {activePlan.goal?.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {activePlan.difficulty_level}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <Calendar className="w-3 h-3" />
                  {activePlan.duration_weeks} weeks
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="font-medium text-slate-900">
                {completedWorkouts}/{totalWorkouts} workouts
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={createPageUrl(`ActiveWorkout?planId=${activePlan.id}`)} className="flex-1">
              <Button className="w-full gradient-primary text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Play className="w-4 h-4 mr-2" />
                Start Workout
              </Button>
            </Link>
            <Link to={createPageUrl(`PlanDetails?id=${activePlan.id}`)}>
              <Button variant="outline" className="w-full sm:w-auto px-4 sm:px-6 hover:bg-slate-50 transition-colors duration-200">
                View Plan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}