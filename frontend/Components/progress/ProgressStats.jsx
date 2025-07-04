
import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { 
  Dumbbell, 
  Clock, 
  Trophy, 
  Star,
  TrendingUp,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

const statCards = [
  {
    key: 'totalWorkouts',
    title: 'Total Workouts',
    icon: Dumbbell,
    gradient: 'from-blue-500 to-blue-600',
    suffix: ''
  },
  {
    key: 'totalMinutes',
    title: 'Total Time',
    icon: Clock,
    gradient: 'from-purple-500 to-purple-600',
    suffix: ' min'
  },
  {
    key: 'currentStreak',
    title: 'Current Streak',
    icon: Trophy,
    gradient: 'from-emerald-500 to-emerald-600',
    suffix: ' days'
  },
  {
    key: 'averageRating',
    title: 'Avg Rating',
    icon: Star,
    gradient: 'from-cyan-500 to-cyan-600',
    suffix: '',
    format: (value) => value > 0 ? value.toFixed(1) : '—'
  }
];

export default function ProgressStats({ stats, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-3xl font-bold text-slate-900">
                      {stat.format 
                        ? stat.format(stats[stat.key]) 
                        : `${stats[stat.key]}${stat.suffix}`
                      }
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
