
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";
import { CheckCircle, Clock, Star, Calendar, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const statusColors = {
  completed: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  skipped: "bg-red-100 text-red-700",
  incomplete: "bg-slate-100 text-slate-700"
};

export default function WorkoutHistory({ sessions, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Workouts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-600">No workouts recorded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 truncate">
                        {session.workout_name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {format(new Date(session.created_date), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <Badge className={statusColors[session.status]} variant="secondary">
                      {session.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {session.status === 'incomplete' && <XCircle className="w-3 h-3 mr-1" />}
                      {session.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    {session.duration_minutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.duration_minutes} min
                      </div>
                    )}
                    {session.exercises_completed && (
                      <div>
                        {session.exercises_completed.length} exercises
                      </div>
                    )}
                    {session.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-blue-500 text-blue-500" />
                        {session.rating}/5
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
