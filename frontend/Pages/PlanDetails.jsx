import React, { useState, useEffect } from "react";
import { WorkoutPlan } from "../Entities/all"; // Corrected import
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../src/lib/utils";
import { Button } from "../Components/ui/button";
import { Card, CardContent } from "../Components/ui/card";
import { Skeleton } from "../Components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import PlanHeader from "../Components/plan/PlanHeader";
import WorkoutDayCard from "../Components/plan/WorkoutDayCard";

export default function PlanDetails() {
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get('id');

    if (planId) {
      loadPlan(planId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadPlan = async (id) => {
    try {
      const results = await WorkoutPlan.filter({ id: id }, '', 1);
      if (results && results.length > 0) {
        setPlan(results[0]);
      }
    } catch (error) {
      console.error("Error loading plan details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </motion.div>
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 space-y-4">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full mx-auto" />
              <Skeleton className="h-4 w-5/6 mx-auto" />
            </CardContent>
          </Card>
          <div className="grid gap-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Plan Not Found</h2>
          <p className="text-slate-600 mt-2">The requested workout plan could not be found.</p>
          <Link to={createPageUrl("Dashboard")} className="mt-6 inline-block">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon" className="shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Plan Details</h1>
            <p className="text-slate-600 mt-1">Your personalized workout plan</p>
          </div>
        </motion.div>

        <PlanHeader plan={plan} />

        <div className="grid gap-6">
          {plan.workouts && plan.workouts.length > 0 ? (
            plan.workouts.map((workout, index) => (
              <WorkoutDayCard 
                key={index} 
                workout={workout} 
                planId={plan.id} 
                index={index} 
              />
            ))
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <p className="text-slate-600">No workouts found in this plan.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}