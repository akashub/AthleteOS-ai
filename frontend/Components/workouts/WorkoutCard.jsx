import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../src/lib/utils";
import { 
  Clock, 
  Play, 
  Eye,
  Star,
  Dumbbell,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";

const difficultyColors = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700"
};

export default function WorkoutCard({ workout, collection, index }) {
  const exerciseCount = workout.exercises?.length || 0;
  const estimatedDuration = workout.estimated_duration_minutes || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                {workout.name}
              </CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={difficultyColors[workout.difficulty_level]} variant="secondary">
                  {workout.difficulty_level}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <Clock className="w-3 h-3" />
                  {estimatedDuration}min
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <Dumbbell className="w-3 h-3" />
                  {exerciseCount} exercises
                </div>
              </div>
            </div>
            {workout.is_favorite && (
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600 text-sm line-clamp-2">
            {workout.description || "No description provided"}
          </p>
          
          {/* Tags */}
          {workout.tags && workout.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {workout.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {workout.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{workout.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Link to={createPageUrl(`WorkoutDetails?id=${workout.id}`)} className="flex-1">
              <Button variant="outline" size="sm" className="w-full h-9">
                <Eye className="w-3 h-3 mr-2" />
                View
              </Button>
            </Link>
            <Link to={createPageUrl(`ActiveWorkout?workoutId=${workout.id}`)} className="flex-1">
              <Button size="sm" className="w-full h-9 gradient-primary text-white shadow-lg hover:shadow-xl">
                <Play className="w-3 h-3 mr-2" />
                Start
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}