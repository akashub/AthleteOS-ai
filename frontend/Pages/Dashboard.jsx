import React, { useState, useEffect } from "react";
import { WorkoutPlan, WorkoutSession, User } from "../Entities/all";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "../src/lib/utils";
import { 
  Zap, 
  Play, 
  Calendar,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Dumbbell
} from "lucide-react";
import { motion } from "framer-motion";

import StatsCard from "../Components/dashboard/StatsCard";
import ActivePlanCard from "../Components/dashboard/ActivePlanCard";
import RecentWorkouts from "../Components/dashboard/RecentWorkouts";
import QuickActions from "../Components/dashboard/QuickActions";

export default function Dashboard() {
  const [activePlan, setActivePlan] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    currentStreak: 0,
    totalMinutes: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const loadDashboardData = async () => {
    try {
      const [plans, sessions, user] = await Promise.all([
        WorkoutPlan.filter({ status: 'active' }, '-created_date', 1),
        WorkoutSession.list('-created_date', 5),
        User.me()
      ]);

      setActivePlan(plans[0] || null);
      setRecentSessions(sessions);
      setUserName(user.display_name || user.full_name?.split(' ')[0] || '');
      
      // Calculate stats
      const totalWorkouts = sessions.filter(s => s.status === 'completed').length;
      const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
      
      setStats({
        totalWorkouts,
        currentStreak: calculateStreak(sessions),
        totalMinutes
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreak = (sessions) => {
    if (sessions.length === 0) return 0;
    
    const completedSessions = sessions.filter(s => s.status === 'completed');
    if (completedSessions.length === 0) return 0;
    
    let currentStreakValue = 0;
    const today = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    const uniqueCompletedDates = new Set();
    completedSessions.forEach(s => {
        const date = new Date(s.created_date);
        uniqueCompletedDates.add(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    });

    let checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    for (let i = 0; i < 365; i++) {
        const dateString = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
        
        if (uniqueCompletedDates.has(dateString)) {
            currentStreakValue++;
        } else {
            if (i === 0) {
                // No workout today, check yesterday
            } else {
                break; 
            }
        }
        
        checkDate.setDate(checkDate.getDate() - 1);
    }
    
    const mostRecentWorkoutDateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const yesterdayDate = new Date(today.getTime() - oneDayMs);
    const yesterdayWorkoutDateStr = `${yesterdayDate.getFullYear()}-${yesterdayDate.getMonth() + 1}-${yesterdayDate.getDate()}`;

    if (!uniqueCompletedDates.has(mostRecentWorkoutDateStr) && !uniqueCompletedDates.has(yesterdayWorkoutDateStr)) {
        return 0;
    }
    
    return currentStreakValue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 sm:space-y-3"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
            {getGreeting()}, {userName || "there"}!
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Your personalized AI fitness journey continues here. Ready to crush your goals?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          <StatsCard 
            title="Total Workouts"
            value={stats.totalWorkouts}
            icon={Dumbbell}
            gradient="from-blue-500 to-blue-600"
            isLoading={isLoading}
          />
          <StatsCard 
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            icon={Trophy}
            gradient="from-emerald-500 to-emerald-600"
            isLoading={isLoading}
          />
          <StatsCard 
            title="Total Time"
            value={`${stats.totalMinutes} min`}
            icon={Clock}
            gradient="from-purple-500 to-purple-600"
            isLoading={isLoading}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2 space-y-6">
            <ActivePlanCard 
              activePlan={activePlan}
              isLoading={isLoading}
            />
            <RecentWorkouts 
              sessions={recentSessions}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Full width on mobile, 1/3 on desktop */}
          <div className="space-y-6">
            <QuickActions />
            
            {/* Motivation Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="gradient-primary text-white border-0 shadow-xl overflow-hidden">
                <CardContent className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg">Stay Consistent</h3>
                    <p className="text-blue-100 text-xs sm:text-sm">
                      Small daily actions lead to big transformations. You've got this!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}