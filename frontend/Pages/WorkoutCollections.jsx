import React, { useState, useEffect } from "react";
import { WorkoutCollection, Workout } from "../Entities/all";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Plus, Search, Filter, Dumbbell, Heart } from "lucide-react";
import { Input } from "../Components/ui/input";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../src/utils";
import { useToast } from "../Components/ui/use-toast";

import CollectionCard from "../Components/collections/CollectionCard";
import CreateCollectionModal from "../Components/collections/CreateCollectionModal";

export default function WorkoutCollections() {
  const [collections, setCollections] = useState([]);
  const [workoutCounts, setWorkoutCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const [collectionsData, workoutsData] = await Promise.all([
        WorkoutCollection.list('-created_date'),
        Workout.list('-created_date')
      ]);

      // Count workouts per collection
      const counts = {};
      workoutsData.forEach(workout => {
        counts[workout.collection_id] = (counts[workout.collection_id] || 0) + 1;
      });

      setCollections(collectionsData);
      setWorkoutCounts(counts);
    } catch (error) {
      console.error('Error loading collections:', error);
      toast({
        title: "Error",
        description: "Failed to load collections. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCollection = async (collectionData) => {
    try {
      await WorkoutCollection.create(collectionData);
      setShowCreateModal(false);
      loadCollections();
      toast({
        title: "Success",
        description: "Collection created successfully!",
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCollection = async (collectionId, updateData) => {
    try {
      await WorkoutCollection.update(collectionId, updateData);
      loadCollections();
      toast({
        title: "Success",
        description: "Collection updated successfully!",
      });
    } catch (error) {
      console.error('Error updating collection:', error);
      toast({
        title: "Error",
        description: "Failed to update collection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    try {
      // First, delete all workouts in this collection
      const workoutsToDelete = await Workout.filter({ collection_id: collectionId });
      await Promise.all(workoutsToDelete.map(workout => Workout.delete(workout.id)));
      
      // Then delete the collection
      await WorkoutCollection.delete(collectionId);
      loadCollections();
      toast({
        title: "Success",
        description: "Collection and all its workouts deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: "Error",
        description: "Failed to delete collection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-slate-900">Workout Collections</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Organize your workouts into collections. Create separate collections for weight training, running, yoga, and more.
          </p>
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
              placeholder="Search collections..."
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
            Create Collection
          </Button>
        </motion.div>

        {/* Collections Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCollections.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Dumbbell className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchTerm ? "No collections found" : "No collections yet"}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Create your first collection to organize your workouts"
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="gradient-primary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Collection
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
            {filteredCollections.map((collection, index) => (
              <CollectionCard 
                key={collection.id} 
                collection={collection}
                workoutCount={workoutCounts[collection.id] || 0}
                index={index}
                onEdit={handleEditCollection}
                onDelete={handleDeleteCollection}
              />
            ))}
          </motion.div>
        )}

        {/* Create Collection Modal */}
        {showCreateModal && (
          <CreateCollectionModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateCollection}
          />
        )}
      </div>
    </div>
  );
}