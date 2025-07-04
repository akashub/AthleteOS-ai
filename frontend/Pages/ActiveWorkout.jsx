
import React, { useState, useEffect } from "react";
import { WorkoutPlan, WorkoutSession } from "../Entities/all";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { ArrowLeft, Play, Pause, SkipForward, CheckCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import WorkoutSelector from "../Components/workout/WorkoutSelector";
import ExerciseTimer from "../Components/workout/ExerciseTimer";
import WorkoutComplete from "../Components/workout/WorkoutComplete";

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutStatus, setWorkoutStatus] = useState('loading'); // 'loading', 'selecting', 'in_progress', 'completed'
  const [sessionData, setSessionData] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get('planId');
    const workoutName = decodeURIComponent(urlParams.get('workoutName') || '');

    if (planId && workoutName) {
      loadAndStartSpecificWorkout(planId, workoutName);
    } else if (planId) {
      loadPlanForSelection(planId);
    }
    else {
      loadActivePlan();
    }
  }, []);

  const loadPlanForSelection = async (planId) => {
    try {
      const results = await WorkoutPlan.filter({ id: planId }, '', 1);
      if (results.length > 0) {
        setActivePlan(results[0]);
        setWorkoutStatus('selecting');
      } else {
        setActivePlan(null);
        setWorkoutStatus('selecting');
      }
    } catch (error) {
      console.error('Error loading plan for selection:', error);
      setWorkoutStatus('selecting');
    }
  };

  const loadActivePlan = async () => {
    try {
      const plans = await WorkoutPlan.filter({ status: 'active' }, '-created_date', 1);
      if (plans.length > 0) {
        setActivePlan(plans[0]);
        setWorkoutStatus('selecting');
      } else {
        setActivePlan(null);
        setWorkoutStatus('selecting'); // No active plan, will show message
      }
    } catch (error) {
      console.error('Error loading active plan:', error);
      setWorkoutStatus('selecting');
    }
  };

  const loadAndStartSpecificWorkout = async (planId, workoutName) => {
    try {
      const results = await WorkoutPlan.filter({ id: planId }, '', 1);
      if (results && results.length > 0) {
        const plan = results[0];
        const workoutToStart = plan.workouts?.find(w => w.name === workoutName);
        if (workoutToStart) {
          setActivePlan(plan);
          handleStartWorkout(workoutToStart, plan);
        } else {
          setActivePlan(plan);
          setWorkoutStatus('selecting');
        }
      } else {
        loadActivePlan();
      }
    } catch (error) {
      console.error('Error loading specific plan:', error);
      loadActivePlan();
    }
  };

  const handleStartWorkout = (workout, plan) => {
    setSelectedWorkout(workout);
    setCurrentExerciseIndex(0);
    setWorkoutStatus('in_progress');
    setStartTime(new Date());
    
    setSessionData({
      workout_plan_id: plan.id,
      workout_name: workout.name,
      start_time: new Date().toISOString(),
      exercises_completed: []
    });
  };

  const handleExerciseComplete = (exerciseData) => {
    setSessionData(prev => ({
      ...prev,
      exercises_completed: [
        ...prev.exercises_completed,
        {
          exercise_name: selectedWorkout.exercises[currentExerciseIndex].name,
          sets_completed: exerciseData.sets || selectedWorkout.exercises[currentExerciseIndex].sets,
          reps_completed: exerciseData.reps || [],
          weight_used: exerciseData.weight || 0,
          notes: exerciseData.notes || ''
        }
      ]
    }));

    if (currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = async () => {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000 / 60); // minutes

    const finalSessionData = {
      ...sessionData,
      end_time: endTime.toISOString(),
      duration_minutes: duration,
      status: 'completed'
    };

    try {
      await WorkoutSession.create(finalSessionData);
      setWorkoutStatus('completed');
    } catch (error) {
      console.error('Error saving workout session:', error);
    }
  };
  
  const handleEndWorkout = async () => {
    // If no session has even started, just navigate away.
    if (!sessionData) {
        navigate(createPageUrl("Dashboard"));
        return;
    }
    
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000 / 60);

    const finalSessionData = {
      ...sessionData,
      end_time: endTime.toISOString(),
      duration_minutes: duration,
      status: 'incomplete'
    };

    try {
      await WorkoutSession.create(finalSessionData);
    } catch (error) {
      console.error('Error saving incomplete workout session:', error);
    } finally {
        navigate(createPageUrl("Dashboard"));
    }
  };

  const handleWorkoutComplete = () => {
    navigate(createPageUrl("Dashboard"));
  };

  if (workoutStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!activePlan && workoutStatus === 'selecting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto border-0 shadow-xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Play className="w-8 h-8 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-900">No Active Plan</h3>
              <p className="text-slate-600">
                You need an active workout plan to start a workout session.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to={createPageUrl("Dashboard")} className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link to={createPageUrl("PlanGenerator")} className="flex-1">
                <Button className="w-full gradient-primary text-white">
                  Create Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon" className="shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Active Workout</h1>
            <p className="text-slate-600 mt-1">
              {activePlan?.name}
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {workoutStatus === 'selecting' && activePlan && (
            <WorkoutSelector
              key="selector"
              workouts={activePlan.workouts || []}
              onSelectWorkout={(workout) => handleStartWorkout(workout, activePlan)}
            />
          )}

          {workoutStatus === 'in_progress' && selectedWorkout && (
            <ExerciseTimer
              key="timer"
              workout={selectedWorkout}
              currentExerciseIndex={currentExerciseIndex}
              onExerciseComplete={handleExerciseComplete}
              onEndWorkout={handleEndWorkout}
              onSkipExercise={() => {
                if (currentExerciseIndex < selectedWorkout.exercises.length - 1) {
                  setCurrentExerciseIndex(prev => prev + 1);
                } else {
                  completeWorkout();
                }
              }}
            />
          )}

          {workoutStatus === 'completed' && (
            <WorkoutComplete
              key="complete"
              sessionData={sessionData}
              onFinish={handleWorkoutComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
