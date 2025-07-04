
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle,
  Clock,
  Target,
  Timer,
  Square,
  RotateCcw,
  AlertTriangle, // New
  XCircle, // New
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExerciseTimer({ 
  workout, 
  currentExerciseIndex, 
  onExerciseComplete,
  onSkipExercise,
  onPauseWorkout,
  onEndWorkout
}) {
  const [isResting, setIsResting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false); // New state for confirmation modal
  const [exerciseData, setExerciseData] = useState({
    sets: 0,
    reps: [],
    weight: '',
    notes: ''
  });

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;
  const progress = ((currentExerciseIndex + 1) / totalExercises) * 100;

  // Workout timer effect
  useEffect(() => {
    let interval;
    if (!isWorkoutPaused) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutPaused]);

  useEffect(() => {
    if (currentExercise) {
      setExerciseData({
        sets: currentExercise.sets || 0,
        reps: Array(currentExercise.sets || 0).fill(''),
        weight: '',
        notes: ''
      });
      setCurrentSet(1);
      setIsResting(false);
      setIsRunning(false);
    }
  }, [currentExercise]);

  useEffect(() => {
    let interval;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const startRestTimer = () => {
    setTimeRemaining(currentExercise.rest_seconds || 60);
    setIsResting(true);
    setIsRunning(true);
  };

  const handleSetComplete = () => {
    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
      startRestTimer();
    } else {
      // All sets completed, move to next exercise
      onExerciseComplete(exerciseData);
    }
  };

  const handleSkip = () => {
    onSkipExercise();
  };

  const handlePauseWorkout = () => {
    setIsWorkoutPaused(!isWorkoutPaused);
    if (onPauseWorkout) {
      onPauseWorkout(!isWorkoutPaused);
    }
  };

  // Function to show the end workout confirmation modal
  const handleEndWorkoutClick = () => {
    setIsWorkoutPaused(true); // Pause the workout when confirmation is requested
    setShowEndConfirm(true);
  };
  
  // Function called when user confirms ending the workout
  const handleConfirmEnd = () => {
    setShowEndConfirm(false); // Hide the confirmation modal
    if (onEndWorkout) {
      onEndWorkout();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatWorkoutTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentExercise) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Workout Controls Header */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {formatWorkoutTime(workoutTimer)}
                </div>
                <p className="text-xs text-slate-600">Workout Time</p>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="text-center">
                <div className="text-lg font-semibold text-slate-900">
                  {currentExerciseIndex + 1}/{totalExercises}
                </div>
                <p className="text-xs text-slate-600">Exercises</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handlePauseWorkout}
                variant="outline"
                size="sm"
                className={isWorkoutPaused && !showEndConfirm ? "bg-slate-100 border-slate-200" : ""}
              >
                {isWorkoutPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleEndWorkoutClick}
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50 border-red-200"
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-3" />
        </CardContent>
      </Card>

      {/* End Workout Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-8 text-center space-y-4 mx-4 max-w-sm w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">End Workout Early?</h3>
              <p className="text-slate-600">Your progress for this session will be saved as incomplete. Are you sure you want to stop?</p>
              <div className="flex gap-3 pt-2">
                 <Button
                  onClick={() => {
                    setShowEndConfirm(false);
                    setIsWorkoutPaused(false); // Unpause the workout if user cancels
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmEnd}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  End Workout
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Overlay */}
      <AnimatePresence>
        {isWorkoutPaused && !showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-8 text-center space-y-4 mx-4 max-w-sm w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Pause className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Workout Paused</h3>
              <p className="text-slate-600">Take your time. Resume when ready!</p>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handlePauseWorkout}
                  className="flex-1 gradient-primary text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
                <Button
                  onClick={handleEndWorkoutClick}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Workout
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise Details */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl text-slate-900 mb-2">
              {currentExercise.name}
            </CardTitle>
            <div className="flex items-center justify-center gap-4 text-slate-600">
              <span>{currentExercise.sets} sets</span>
              <span>×</span>
              <span>{currentExercise.reps} reps</span>
            </div>
            <Badge variant="outline" className="mt-2">
              Set {currentSet} of {currentExercise.sets}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instructions */}
          {currentExercise.instructions && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Instructions:</h4>
              <p className="text-slate-700 text-sm">{currentExercise.instructions}</p>
            </div>
          )}

          {/* Muscle Groups */}
          {currentExercise.muscle_groups && currentExercise.muscle_groups.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Target Muscles:</h4>
              <div className="flex flex-wrap gap-2">
                {currentExercise.muscle_groups.map((muscle, index) => (
                  <Badge key={index} variant="outline" className="bg-slate-50">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Rest Timer */}
          <AnimatePresence>
            {isResting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Rest Time</h3>
                <div className="text-3xl font-bold text-blue-700 mb-4">
                  {formatTime(timeRemaining)}
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setIsRunning(!isRunning)}
                    variant="outline"
                    className="border-blue-300"
                  >
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => {
                      setTimeRemaining(currentExercise.rest_seconds || 60);
                    }}
                    variant="outline"
                    className="border-blue-300"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setIsResting(false);
                      setIsRunning(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Skip Rest
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exercise Tracking */}
          {!isResting && !isWorkoutPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (optional)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="lbs/kg"
                    value={exerciseData.weight}
                    onChange={(e) => setExerciseData(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="reps">Reps for Set {currentSet}</Label>
                  <Input
                    id="reps"
                    type="number"
                    placeholder={currentExercise.reps}
                    value={exerciseData.reps[currentSet - 1] || ''}
                    onChange={(e) => {
                      const newReps = [...exerciseData.reps];
                      newReps[currentSet - 1] = e.target.value;
                      setExerciseData(prev => ({ ...prev, reps: newReps }));
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="How did this set feel?"
                  value={exerciseData.notes}
                  onChange={(e) => setExerciseData(prev => ({ ...prev, notes: e.target.value }))}
                  className="h-20"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSetComplete}
                  className="flex-1 gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Set {currentSet}
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="px-6 h-12"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
