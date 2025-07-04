import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Target, Calendar, Dumbbell, Zap } from 'lucide-react';
import { motion } from "framer-motion";

export default function PlanHeader({ plan }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardContent className="p-8 bg-white space-y-4">
          <div className="text-center">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-semibold mb-3">
              {plan.goal?.replace(/_/g, ' ').toUpperCase()}
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900">{plan.name}</h2>
            <p className="text-slate-600 mt-2 max-w-2xl mx-auto">{plan.description}</p>
          </div>
          
          <div className="flex items-center justify-center gap-6 pt-4 flex-wrap">
            <div className="flex items-center gap-2 text-slate-700">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="font-medium capitalize">{plan.difficulty_level}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{plan.duration_weeks} weeks</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{plan.workouts_per_week} workouts/week</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}