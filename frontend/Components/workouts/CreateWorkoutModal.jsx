import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Sparkles, Target, Clock, Dumbbell, Feather, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { InvokeLLM } from "../../src/integrations/Core";
import { User } from "../../Entities/User";

const goals = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'strength', label: 'Strength' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'general_fitness', label: 'General Fitness' }
];

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const workoutLocations = [
  { value: 'full_gym', label: 'Full Gym' },
  { value: 'home_gym', label: 'Home Gym' },
  { value: 'bodyweight_home', label: 'Home (Bodyweight)' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'hotel_travel', label: 'Hotel/Travel' }
];

const equipmentOptions = [
  'Dumbbells', 'Barbell', 'Resistance Bands', 'Pull-up Bar', 
  'Kettlebells', 'Exercise Ball', 'Yoga Mat', 'Treadmill', 'Stationary Bike'
];

const focusAreaOptions = [
  'Upper Body', 'Lower Body', 'Core', 'Cardio', 'Flexibility', 'Full Body'
];

export default function CreateWorkoutModal({ isOpen, onClose, onSubmit, collectionId }) {
  const [step, setStep] = useState('form');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    planType: 'single',
    goal: '',
    fitnessLevel: '',
    workoutLocation: '',
    availableDays: 3,
    sessionDuration: 45,
    planDuration: 4,
    equipment: [],
    focusAreas: [],
    limitations: '',
    customPrompt: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleEquipmentChange = (equipment, checked) => {
    setFormData(prev => ({
      ...prev,
      equipment: checked 
        ? [...prev.equipment, equipment]
        : prev.equipment.filter(e => e !== equipment)
    }));
  };

  const handleFocusAreaChange = (area, checked) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: checked
        ? [...prev.focusAreas, area]
        : prev.focusAreas.filter(a => a !== area)
    }));
  };

  const getLocationContext = (location) => {
    const contexts = {
      full_gym: "The user has access to a fully equipped commercial gym with machines, free weights, cardio equipment, and ample space.",
      home_gym: "The user has a personal home gym setup with selected equipment.",
      bodyweight_home: "The user is working out at home with minimal equipment and limited space.",
      outdoor: "The user prefers outdoor workouts in parks, trails, or open spaces.",
      hotel_travel: "The user needs workouts suitable for small hotel rooms or while traveling."
    };
    return contexts[location] || "Standard workout environment.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep('generating');
    setIsGenerating(true);

    try {
      const user = await User.me();

      const userProfileContext = `
      **User Profile:**
      - Name: ${user.display_name || 'Not provided'}
      - Age: ${user.age || 'Not provided'}
      - Weight: ${user.weight_kg ? `${user.weight_kg} kg` : 'Not provided'}
      - Height: ${user.height_cm ? `${user.height_cm} cm` : 'Not provided'}
      - Gender: ${user.gender || 'Not provided'}
      - Activity Level: ${user.activity_level || 'Not provided'}
      `;

      const locationContext = getLocationContext(formData.workoutLocation);

      if (formData.planType === 'single') {
        const prompt = `Create a personalized workout.

        ${userProfileContext}

        **User Request:**
        ${formData.customPrompt || 'Create a workout based on the details below.'}

        **Details:**
        - Goal: ${formData.goal}
        - Fitness Level: ${formData.fitnessLevel}
        - Location: ${formData.workoutLocation}
        - Duration: ${formData.sessionDuration} minutes
        - Equipment: ${formData.equipment.join(', ') || 'Basic/None'}
        - Focus: ${formData.focusAreas.join(', ') || 'Full body'}
        - Limitations: ${formData.limitations || 'None'}

        ${locationContext}

        Create a detailed workout with 8-15 exercises, including sets, reps, rest periods, and instructions.`;

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

        if (result.exercises && Array.isArray(result.exercises)) {
          result.exercises.forEach(exercise => {
            if (exercise.reps !== undefined && exercise.reps !== null) {
              exercise.reps = String(exercise.reps);
            }
          });
        }

        const workoutData = {
          ...result,
          collection_id: collectionId,
          goal: formData.goal,
          difficulty_level: formData.fitnessLevel,
          workout_location: formData.workoutLocation,
        };

        onSubmit([workoutData]);
      } else {
        const prompt = `Create ${formData.availableDays} different workouts.

        ${userProfileContext}

        **User Request:**
        ${formData.customPrompt || 'Create multiple workouts based on the details below.'}

        **Details:**
        - Goal: ${formData.goal}
        - Fitness Level: ${formData.fitnessLevel}
        - Location: ${formData.workoutLocation}
        - Duration: ${formData.sessionDuration} minutes each
        - Equipment: ${formData.equipment.join(', ') || 'Basic/None'}
        - Focus: ${formData.focusAreas.join(', ') || 'Full body'}
        - Limitations: ${formData.limitations || 'None'}

        ${locationContext}

        Create ${formData.availableDays} different workouts, each with 8-15 exercises, sets, reps, rest periods, and instructions.`;

        const result = await InvokeLLM({
          prompt,
          response_json_schema: {
            type: "object",
            properties: {
              workouts: {
                type: "array",
                items: {
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
              }
            }
          }
        });

        const workoutsData = result.workouts.map(workout => {
          if (workout.exercises && Array.isArray(workout.exercises)) {
            workout.exercises.forEach(exercise => {
              if (exercise.reps !== undefined && exercise.reps !== null) {
                exercise.reps = String(exercise.reps);
              }
            });
          }
          return {
            ...workout,
            collection_id: collectionId,
            goal: formData.goal,
            workout_location: formData.workoutLocation,
          };
        });

        onSubmit(workoutsData);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error generating workout:', error);
    } finally {
      setIsGenerating(false);
      setStep('form');
    }
  };

  const handleClose = () => {
    setFormData({
      planType: 'single',
      goal: '',
      fitnessLevel: '',
      workoutLocation: '',
      availableDays: 3,
      sessionDuration: 45,
      planDuration: 4,
      equipment: [],
      focusAreas: [],
      limitations: '',
      customPrompt: ''
    });
    setStep('form');
    setIsGenerating(false);
    setShowAdvanced(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === 'form' ? 'Create AI Workout' : 'Generating Your Workout...'}
          </DialogTitle>
        </DialogHeader>

        {step === 'generating' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto animate-spin">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Creating your workout...
            </h3>
            <p className="text-slate-600 text-sm">
              This usually takes 10-15 seconds
            </p>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plan Type */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">What would you like to create?</Label>
              <RadioGroup 
                value={formData.planType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, planType: value }))}
                className="space-y-2"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="cursor-pointer text-sm">
                    Single Workout
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                  <RadioGroupItem value="plan" id="plan" />
                  <Label htmlFor="plan" className="cursor-pointer text-sm">
                    Multiple Workouts
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="customPrompt" className="text-base font-semibold">
                What do you need?
              </Label>
              <Textarea
                id="customPrompt"
                placeholder="e.g., 'Upper body strength workout for the gym' or 'Home cardio sessions'"
                value={formData.customPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                className="h-20"
              />
            </div>

            {/* Essential Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Primary Goal</Label>
                <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal..." />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => (
                      <SelectItem key={goal.value} value={goal.value}>
                        {goal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fitness Level</Label>
                <Select value={formData.fitnessLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level..." />
                  </SelectTrigger>
                  <SelectContent>
                    {fitnessLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Workout Location</Label>
                <Select value={formData.workoutLocation} onValueChange={(value) => setFormData(prev => ({ ...prev, workoutLocation: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Where will you workout?" />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutLocations.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duration and Count */}
            <div className="grid grid-cols-2 gap-4">
              {formData.planType === 'plan' && (
                <div className="space-y-2">
                  <Label>Number of Workouts</Label>
                  <Select
                    value={formData.availableDays.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, availableDays: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 4, 5, 6, 7, 8].map(days => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} workouts
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Select
                  value={formData.sessionDuration.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sessionDuration: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[30, 45, 60, 75, 90].map(duration => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </Button>

            {showAdvanced && (
              <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                {/* Equipment */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Available Equipment</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {equipmentOptions.map((equipment) => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment}
                          checked={formData.equipment.includes(equipment)}
                          onCheckedChange={(checked) => handleEquipmentChange(equipment, checked)}
                        />
                        <Label htmlFor={equipment} className="text-xs cursor-pointer">
                          {equipment}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Focus Areas</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {focusAreaOptions.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={formData.focusAreas.includes(area)}
                          onCheckedChange={(checked) => handleFocusAreaChange(area, checked)}
                        />
                        <Label htmlFor={area} className="text-xs cursor-pointer">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Limitations */}
                <div className="space-y-2">
                  <Label htmlFor="limitations" className="text-sm font-semibold">Injuries/Limitations</Label>
                  <Textarea
                    id="limitations"
                    placeholder="e.g., Lower back issues..."
                    value={formData.limitations}
                    onChange={(e) => setFormData(prev => ({ ...prev, limitations: e.target.value }))}
                    className="h-16"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 gradient-primary text-white"
                disabled={!formData.goal || !formData.fitnessLevel || !formData.workoutLocation || isGenerating}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}