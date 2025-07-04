
import React, { useState } from "react";
import { InvokeLLM } from "../src/integrations/Core";
import { WorkoutPlan, WorkoutCollection, Workout, User } from "../Entities/all";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import PlanForm from "../Components/planner/PlanForm";
import PlanPreview from "../Components/planner/PlanPreview";
import LoadingGenerator from "../Components/planner/LoadingGenerator";

export default function PlanGenerator() {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form', 'generating', 'preview'
  const [formData, setFormData] = useState(null);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Helper function to provide context about workout location
  const getLocationContext = (location) => {
    const contexts = {
      full_gym: "The user has access to a fully equipped commercial gym with machines, free weights, cardio equipment, and ample space. Design exercises that take advantage of gym equipment and variety.",
      home_gym: "The user has a personal home gym setup with selected equipment. Focus on exercises that work well in a dedicated home space with the user's available equipment.",
      bodyweight_home: "The user is working out at home with minimal equipment and limited space. Emphasize bodyweight exercises, small equipment, and movements that don't require much room.",
      outdoor: "The user prefers outdoor workouts in parks, trails, or open spaces. Include exercises that use natural environments, bodyweight movements, and portable equipment.",
      hotel_travel: "The user needs workouts suitable for small hotel rooms or while traveling. Focus on quiet, compact exercises that require minimal to no equipment and limited space."
    };
    return contexts[location] || "Standard workout environment.";
  };

  const handleFormSubmit = async (data) => {
    setFormData(data);
    setStep('generating');
    setIsGenerating(true);

    try {
      const user = await User.me();

      const userProfileContext = `
      **User Profile Data (for personalization):**
      - Name: ${user.display_name || 'Not provided'}
      - Age: ${user.age || 'Not provided'}
      - Weight: ${user.weight_kg ? `${user.weight_kg} kg` : 'Not provided'}
      - Height: ${user.height_cm ? `${user.height_cm} cm` : 'Not provided'}
      - Gender: ${user.gender || 'Not provided'}
      - Activity Level: ${user.activity_level || 'Not provided'}
      `;

      const locationContext = getLocationContext(data.workoutLocation);

      if (data.planType === 'single') {
        // Generate single workout
        const prompt = `Create a highly personalized, comprehensive, and engaging single workout.

        ${userProfileContext}

        **User's Detailed Goals & Preferences (Primary Context):**
        ${data.customPrompt || 'No specific description provided. Rely on the structured inputs below.'}

        **Workout Location & Environment:**
        ${locationContext}

        **Structured Inputs (Supporting Details):**
        - Primary Goal: ${data.goal}
        - Fitness Level: ${data.fitnessLevel}
        - Workout Location: ${data.workoutLocation}
        - Session Duration: ${data.sessionDuration} minutes per session
        - Available Equipment: ${data.equipment.join(', ') || 'Basic/None'}
        - Desired Focus Areas: ${data.focusAreas.join(', ') || 'Full body'}
        - Injuries or Limitations: ${data.limitations || 'None specified'}

        Based on ALL the information above, create a detailed single workout. The workout must be high quality, challenging for the user's fitness level, and perfectly suited to their workout environment.
        
        IMPORTANT: The workout should contain 8-15 exercises to properly fill the ${data.sessionDuration}-minute session. This should include:
        1. A catchy, motivating workout name that reflects the user's primary goals and workout location.
        2. A clear, concise description of the workout's purpose and what to expect.
        3. 8-15 specific exercises that are appropriate for their workout location and available equipment.
        4. For each exercise, provide specific sets, reps (or duration for timed exercises), rest periods, detailed instructions, and target muscle groups.
        5. Ensure exercises flow logically (warm-up → main exercises → cool-down) and are practical for the specified location.

        The workout must be engaging, progressive, highly tailored to the user's environment, and contain sufficient exercises to create an effective, comprehensive workout session.`;

        const result = await InvokeLLM({
          prompt,
          response_json_schema: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              estimated_duration_minutes: { type: "number" },
              difficulty_level: { type: "string" },
              exercises: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    type: { type: "string" },
                    sets: { type: "number" },
                    reps: { type: "string" },
                    duration_seconds: { type: "number" },
                    rest_seconds: { type: "number" },
                    instructions: { type: "string" },
                    muscle_groups: { type: "array", items: { type: "string" } },
                    equipment: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          }
        });

        // Sanitize the 'reps' field
        if (result.exercises && Array.isArray(result.exercises)) {
          result.exercises.forEach(exercise => {
            if (exercise.reps !== undefined && exercise.reps !== null) {
              exercise.reps = String(exercise.reps);
            }
          });
        }

        setGeneratedPlan({
          ...result,
          planType: 'single',
          goal: data.goal,
          difficulty_level: data.fitnessLevel,
          workout_location: data.workoutLocation,
        });
      } else {
        // Generate full workout plan
        const prompt = `Create a highly personalized, comprehensive, and engaging workout plan.

        ${userProfileContext}

        **User's Detailed Goals & Preferences (Primary Context):**
        ${data.customPrompt || 'No specific description provided. Rely on the structured inputs below.'}

        **Workout Location & Environment:**
        ${locationContext}

        **Structured Inputs (Supporting Details):**
        - Primary Goal: ${data.goal}
        - Fitness Level: ${data.fitnessLevel}
        - Workout Location: ${data.workoutLocation}
        - Available Days: ${data.availableDays} days per week
        - Session Duration: ${data.sessionDuration} minutes per session
        - Plan Duration: ${data.planDuration} weeks
        - Available Equipment: ${data.equipment.join(', ') || 'Basic/None'}
        - Desired Focus Areas: ${data.focusAreas.join(', ') || 'Full body'}
        - Injuries or Limitations: ${data.limitations || 'None specified'}

        Based on ALL the information above, create a detailed ${data.planDuration}-week workout plan with ${data.availableDays} workouts per week. The plan must be high quality, progressive, challenging for the user's fitness level, and perfectly suited to their workout environment.
        
        IMPORTANT: Each workout should contain 8-15 exercises to properly fill the ${data.sessionDuration}-minute sessions. Create ALL ${data.planDuration * data.availableDays} individual workout sessions with specific exercises for each week. This should include:
        1. A catchy, motivating plan name that reflects the user's primary goals and workout location.
        2. A clear, concise description of the plan's purpose and what to expect.
        3. A complete workout schedule with ALL individual workouts for ALL ${data.planDuration} weeks.
        4. For each workout day, provide 8-15 specific exercises that are appropriate for their workout location and available equipment.
        5. For each exercise, provide specific sets, reps (or duration for timed exercises), rest periods, detailed instructions, and target muscle groups.
        6. Show progression across weeks - gradually increase intensity, weight, or complexity.
        7. Ensure exercises flow logically and are practical for the specified location.

        The plan must be engaging, progressive, highly tailored to the user's environment, and contain sufficient exercises to create effective, comprehensive workouts across all ${data.planDuration} weeks.`;

        const result = await InvokeLLM({
          prompt,
          response_json_schema: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              goal: { type: "string" },
              duration_weeks: { type: "number" },
              workouts_per_week: { type: "number" },
              difficulty_level: { type: "string" },
              equipment_needed: { type: "array", items: { type: "string" } },
              workouts: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    day: { type: "string" },
                    week: { type: "number" },
                    exercises: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          sets: { type: "number" },
                          reps: { type: "string" },
                          duration_seconds: { type: "number" },
                          rest_seconds: { type: "number" },
                          instructions: { type: "string" },
                          muscle_groups: { type: "array", items: { type: "string" } }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        });

        // Sanitize the 'reps' field to ensure it's always a string
        if (result.workouts && Array.isArray(result.workouts)) {
          result.workouts.forEach(workout => {
            if (workout.exercises && Array.isArray(workout.exercises)) {
              workout.exercises.forEach(exercise => {
                if (exercise.reps !== undefined && exercise.reps !== null) {
                  exercise.reps = String(exercise.reps);
                }
              });
            }
          });
        }

        setGeneratedPlan({
          ...result,
          planType: 'plan',
          goal: data.goal,
          difficulty_level: data.fitnessLevel,
          workout_location: data.workoutLocation,
          ai_generated: true
        });
      }
      
      setStep('preview');
    } catch (error) {
      console.error('Error generating plan:', error);
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptPlan = async () => {
    setIsSaving(true);
    try {
      if (formData.planType === 'single') {
        // Create a collection and add the single workout to it
        const collection = await WorkoutCollection.create({
          name: `${generatedPlan.name} Collection`,
          description: `Collection containing: ${generatedPlan.name}`,
          type: 'custom'
        });

        await Workout.create({
          ...generatedPlan,
          collection_id: collection.id
        });

        navigate(createPageUrl(`CollectionWorkouts?id=${collection.id}`));
      } else {
        // Create the workout plan
        await WorkoutPlan.create({
          ...generatedPlan,
          status: 'active'
        });
        navigate(createPageUrl("Dashboard"));
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegeneratePlan = () => {
    setStep('generating');
    handleFormSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon" className="shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-500" />
              AI Workout Planner
            </h1>
            <p className="text-slate-600 mt-1">
              Tell us about your goals and let AI create your perfect workout plan
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'form' && (
            <PlanForm 
              key="form"
              onSubmit={handleFormSubmit}
            />
          )}
          
          {step === 'generating' && (
            <LoadingGenerator 
              key="generating"
              isGenerating={isGenerating}
            />
          )}
          
          {step === 'preview' && generatedPlan && (
            <PlanPreview 
              key="preview"
              plan={generatedPlan}
              onAccept={handleAcceptPlan}
              onRegenerate={handleRegeneratePlan}
              isAccepting={isSaving}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
