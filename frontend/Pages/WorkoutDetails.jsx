import React, { useState, useEffect } from "react";
import { Workout, WorkoutCollection } from "../Entities/all";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Badge } from "../Components/ui/badge";
import { Input } from "../Components/ui/input";
import { Textarea } from "../Components/ui/textarea";
import { ArrowLeft, Play, Edit3, Trash2, Plus, Save, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../src/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../Components/ui/use-toast";

import ExerciseEditor from "../Components/workout/ExerciseEditor";

export default function WorkoutDetails() {
  const [workout, setWorkout] = useState(null);
  const [collection, setCollection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorkout, setEditedWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const workoutId = urlParams.get('id');
    if (workoutId) {
      loadWorkout(workoutId);
    }
  }, []);

  const loadWorkout = async (workoutId) => {
    try {
      const workoutData = await Workout.filter({ id: workoutId }, '', 1);
      if (workoutData.length > 0) {
        const workoutItem = workoutData[0];
        setWorkout(workoutItem);
        setEditedWorkout({ ...workoutItem });

        // Load collection details
        if (workoutItem.collection_id) {
          const collectionData = await WorkoutCollection.filter({ id: workoutItem.collection_id }, '', 1);
          if (collectionData.length > 0) {
            setCollection(collectionData[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading workout:', error);
      toast({
        title: "Error",
        description: "Failed to load workout details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await Workout.update(workout.id, editedWorkout);
      setWorkout(editedWorkout);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Workout updated successfully!",
      });
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedWorkout({ ...workout });
    setIsEditing(false);
  };

  const handleDeleteWorkout = async () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await Workout.delete(workout.id);
        toast({
          title: "Success",
          description: "Workout deleted successfully.",
        });
        navigate(createPageUrl(`CollectionWorkouts?id=${workout.collection_id}`));
      } catch (error) {
        console.error('Error deleting workout:', error);
        toast({
          title: "Error",
          description: "Failed to delete workout.",
          variant: "destructive",
        });
      }
    }
  };

  const updateExercise = (index, updatedExercise) => {
    const newExercises = [...editedWorkout.exercises];
    newExercises[index] = updatedExercise;
    setEditedWorkout({ ...editedWorkout, exercises: newExercises });
  };

  const deleteExercise = (index) => {
    const newExercises = editedWorkout.exercises.filter((_, i) => i !== index);
    setEditedWorkout({ ...editedWorkout, exercises: newExercises });
  };

  const addExercise = () => {
    const newExercise = {
      name: "New Exercise",
      type: "strength",
      sets: 3,
      reps: "10",
      rest_seconds: 60,
      instructions: "",
      muscle_groups: [],
      equipment: []
    };
    setEditedWorkout({
      ...editedWorkout,
      exercises: [...editedWorkout.exercises, newExercise]
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Workout Not Found</h3>
            <p className="text-slate-600 mb-6">The workout you're looking for doesn't exist.</p>
            <Link to={createPageUrl("WorkoutCollections")}>
              <Button className="gradient-primary text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Collections
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link to={createPageUrl(`CollectionWorkouts?id=${workout.collection_id}`)}>
            <Button variant="outline" size="icon" className="shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{workout.name}</h1>
            {collection && (
              <p className="text-slate-600 mt-1">
                From {collection.name} collection
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button 
                  onClick={handleDeleteWorkout}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Link to={createPageUrl(`ActiveWorkout?planId=${workout.collection_id}&workoutName=${encodeURIComponent(workout.name)}`)}>
                  <Button className="gradient-primary text-white">
                    <Play className="w-4 h-4 mr-2" />
                    Start Workout
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button onClick={handleCancelEdit} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} className="gradient-primary text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Workout Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Workout Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Name</label>
                    <Input
                      value={editedWorkout.name}
                      onChange={(e) => setEditedWorkout({ ...editedWorkout, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Description</label>
                    <Textarea
                      value={editedWorkout.description || ''}
                      onChange={(e) => setEditedWorkout({ ...editedWorkout, description: e.target.value })}
                      placeholder="Describe this workout..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Estimated Duration (minutes)</label>
                    <Input
                      type="number"
                      value={editedWorkout.estimated_duration_minutes || ''}
                      onChange={(e) => setEditedWorkout({ ...editedWorkout, estimated_duration_minutes: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-600">{workout.description || "No description provided"}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    {workout.estimated_duration_minutes && (
                      <Badge variant="outline">{workout.estimated_duration_minutes} min</Badge>
                    )}
                    <Badge variant="outline">{workout.difficulty_level}</Badge>
                    <Badge variant="outline">{workout.exercises?.length || 0} exercises</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Exercises */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Exercises</CardTitle>
              {isEditing && (
                <Button onClick={addExercise} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(isEditing ? editedWorkout.exercises : workout.exercises)?.map((exercise, index) => (
                  <ExerciseEditor
                    key={index}
                    exercise={exercise}
                    index={index}
                    isEditing={isEditing}
                    onUpdate={updateExercise}
                    onDelete={deleteExercise}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}