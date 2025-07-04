
import React, { useState, useEffect } from "react";
import { WorkoutCollection, Workout } from "../Entities/all";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Plus, Search, ArrowLeft, Play, Eye, Clock } from "lucide-react";
import { Input } from "../Components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "../src/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "../Components/ui/use-toast";

import WorkoutCard from "../Components/workouts/WorkoutCard";
import CreateWorkoutModal from "../Components/workouts/CreateWorkoutModal";

export default function CollectionWorkouts() {
  const [collection, setCollection] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const collectionId = urlParams.get('id');
    
    if (collectionId) {
      loadCollectionData(collectionId);
    }
  }, []);

  const loadCollectionData = async (collectionId) => {
    try {
      const [collectionData, workoutsData] = await Promise.all([
        WorkoutCollection.filter({ id: collectionId }, '', 1),
        Workout.filter({ collection_id: collectionId }, '-created_date')
      ]);

      if (collectionData.length > 0) {
        setCollection(collectionData[0]);
      }
      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Error loading collection data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkout = async (workoutsData) => { // Changed parameter name to workoutsData (plural)
    try {
      // workoutsData is now an array (single workout or multiple workouts)
      await Promise.all(workoutsData.map(workoutData => Workout.create({
        ...workoutData,
        collection_id: collection.id // Ensure collection_id is added to each workout
      })));
      
      setShowCreateModal(false);
      loadCollectionData(collection.id); // Call the existing data loading function
      toast({
        title: "Success",
        description: `${workoutsData.length} workout${workoutsData.length > 1 ? 's' : ''} created successfully!`,
      });
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Error",
        description: "Failed to create workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredWorkouts = workouts.filter(workout =>
    workout.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Collection Not Found</h2>
          <p className="text-slate-600 mb-6">The requested collection could not be found.</p>
          <Link to={createPageUrl("WorkoutCollections")}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collections
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link to={createPageUrl("WorkoutCollections")}>
            <Button variant="outline" size="icon" className="shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{collection.name}</h1>
            <p className="text-slate-600 mt-1">
              {collection.description || `${collection.type.replace('_', ' ')} workouts`}
            </p>
          </div>
        </motion.div>

        {/* Search and Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Workout
          </Button>
        </motion.div>

        {/* Workouts Grid */}
        {filteredWorkouts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchTerm ? "No workouts found" : "No workouts yet"}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Add your first workout to this collection"
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="gradient-primary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Workout
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredWorkouts.map((workout, index) => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout}
                collection={collection}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* Create Workout Modal */}
        <CreateWorkoutModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateWorkout}
          collectionType={collection.type}
        />
      </div>
    </div>
  );
}
