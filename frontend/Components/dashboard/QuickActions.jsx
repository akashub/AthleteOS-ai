import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../src/lib/utils";
import { Zap, Play, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    title: "Generate New Plan",
    description: "Let AI create your perfect workout",
    icon: Zap,
    href: createPageUrl("PlanGenerator"),
    className: "gradient-primary text-white"
  },
  {
    title: "Quick Workout",
    description: "Jump into any available workout",
    icon: Play,
    href: createPageUrl("ActiveWorkout"),
    className: "bg-slate-900 text-white hover:bg-slate-800"
  },
  {
    title: "View Progress",
    description: "Check your fitness journey",
    icon: TrendingUp,
    href: createPageUrl("Progress"),
    className: "bg-white border-2 border-slate-200 text-slate-900 hover:bg-slate-50"
  }
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-slate-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link to={action.href}>
                <Button 
                  className={`w-full h-auto p-3 sm:p-4 ${action.className} shadow-lg hover:shadow-xl transition-all duration-300 justify-start`}
                  variant="ghost"
                >
                  <div className="flex items-center gap-3">
                    <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="text-left">
                      <div className="font-medium text-sm sm:text-base">{action.title}</div>
                      <div className="text-xs opacity-80">{action.description}</div>
                    </div>
                  </div>
                </Button>
              </Link>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}