import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";
import { CheckCircle, Clock, Calendar, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const statusColors = {
  completed: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  incomplete: "bg-slate-100 text-slate-700"
};

const statusIcons = {
  completed: CheckCircle,
  in_progress: Clock,
  incomplete: XCircle
};

export default function RecentWorkouts({ sessions, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 sm:h-4 w-3/4" />
                <Skeleton className="h-2 sm:h-3 w-1/2" />
              </div>
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
          <CardTitle className="text-lg sm:text-xl text-slate-900">Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
              </div>
              <p className="text-sm sm:text-base text-slate-600">No workouts yet. Ready to start?</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {sessions.map((session, index) => {
                const StatusIcon = statusIcons[session.status] || Clock;
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm sm:text-base text-slate-900 truncate">
                        {session.workout_name}
                      </h4>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 mt-1">
                        <span>{format(new Date(session.created_date), "MMM d, yyyy")}</span>
                        {session.duration_minutes && (
                          <span>{session.duration_minutes} min</span>
                        )}
                      </div>
                    </div>
                    <Badge className={`${statusColors[session.status]} text-xs`}>
                      {session.status.replace('_', ' ')}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}