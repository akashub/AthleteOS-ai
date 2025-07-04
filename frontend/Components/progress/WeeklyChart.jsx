import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function WeeklyChart({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="week" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [
                    `${value} ${name === 'workouts' ? 'workouts' : 'minutes'}`,
                    name === 'workouts' ? 'Workouts' : 'Minutes'
                  ]}
                />
                <Bar 
                  dataKey="workouts" 
                  fill="url(#workoutGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {data.reduce((sum, week) => sum + week.workouts, 0)}
              </p>
              <p className="text-sm text-slate-600">Total Workouts (8 weeks)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {Math.round(data.reduce((sum, week) => sum + week.minutes, 0) / 60)}h
              </p>
              <p className="text-sm text-slate-600">Total Hours (8 weeks)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}