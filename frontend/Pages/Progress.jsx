import React, { useState, useEffect } from "react";
import { WorkoutSession, WorkoutPlan } from "../Entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { ArrowLeft, TrendingUp, Calendar, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../src/utils";
import { motion } from "framer-motion";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

import ProgressStats from "../Components/progress/ProgressStats";
import WorkoutHistory from "../Components/progress/WorkoutHistory";
import WeeklyChart from "../Components/progress/WeeklyChart";

export default function Progress() {
  const [sessions, setSessions] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalMinutes: 0,
    averageRating: 0,
    currentStreak: 0,
    weeklyWorkouts: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const [allSessions, plans] = await Promise.all([
        WorkoutSession.list('-created_date', 50),
        WorkoutPlan.filter({ status: 'active' }, '-created_date', 1)
      ]);

      setSessions(allSessions);
      setActivePlan(plans[0] || null);

      // Calculate comprehensive stats
      const completedSessions = allSessions.filter(s => s.status === 'completed');
      const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
      const ratingsAvailable = completedSessions.filter(s => s.rating);
      const averageRating = ratingsAvailable.length > 0 
        ? ratingsAvailable.reduce((sum, s) => sum + s.rating, 0) / ratingsAvailable.length 
        : 0;

      // Calculate weekly workout data for chart
      const weeklyData = calculateWeeklyWorkouts(completedSessions);

      setStats({
        totalWorkouts: completedSessions.length,
        totalMinutes,
        averageRating,
        currentStreak: calculateStreak(completedSessions),
        weeklyWorkouts: weeklyData
      });
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreak = (sessions) => {
    if (sessions.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Sort sessions by date
    const sortedSessions = sessions.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.created_date);
      const daysDiff = Math.floor((today - sessionDate) / oneDayMs);
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  };

  const calculateWeeklyWorkouts = (sessions) => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 0; i < 8; i++) {
      const weekStart = startOfWeek(subDays(today, i * 7));
      const weekEnd = endOfWeek(weekStart);
      
      const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.created_date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });

      weeks.unshift({
        week: format(weekStart, 'MMM d'),
        workouts: weekSessions.length,
        minutes: weekSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
      });
    }
    
    return weeks;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon" className="shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-blue-500" />
              Your Progress
            </h1>
            <p className="text-slate-600 mt-1">
              Track your fitness journey and celebrate your achievements
            </p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <ProgressStats stats={stats} isLoading={isLoading} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <WeeklyChart data={stats.weeklyWorkouts} isLoading={isLoading} />
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <WorkoutHistory sessions={sessions.slice(0, 10)} isLoading={isLoading} />
            
            {/* Active Plan Card */}
            {activePlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900">Current Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{activePlan.name}</h4>
                      <p className="text-sm text-slate-600">{activePlan.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {activePlan.duration_weeks} weeks
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {activePlan.workouts_per_week}/week
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}