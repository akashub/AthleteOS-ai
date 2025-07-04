import React from 'react';
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, gradient, isLoading }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-white">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
        <CardContent className="p-4 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-slate-600">{title}</p>
              {isLoading ? (
                <Skeleton className="h-6 sm:h-8 w-16 sm:w-20" />
              ) : (
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{value}</p>
              )}
            </div>
            <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}