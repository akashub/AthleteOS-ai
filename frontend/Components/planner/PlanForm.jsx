
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Sparkles, Target, Clock, Dumbbell, Feather, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const goals = [
  { value: 'weight_loss', label: 'Weight Loss', description: 'Burn calories and lose weight' },
  { value: 'muscle_gain', label: 'Muscle Gain', description: 'Build lean muscle mass' },
  { value: 'strength', label: 'Strength', description: 'Increase overall strength' },
  { value: 'endurance', label: 'Endurance', description: 'Improve cardiovascular fitness' },
  { value: 'general_fitness', label: 'General Fitness', description: 'Overall health and wellness' }
];

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner', description: 'New to exercise' },
  { value: 'intermediate', label: 'Intermediate', description: '6+ months experience' },
  { value: 'advanced', label: 'Advanced', description: '2+ years experience' }
];

const workoutLocations = [
  { 
    value: 'full_gym', 
    label: 'Full Gym Access', 
    description: 'Commercial gym with complete equipment' 
  },
  { 
    value: 'home_gym', 
    label: 'Home Gym', 
    description: 'Personal equipment at home' 
  },
  { 
    value: 'bodyweight_home', 
    label: 'Home (Bodyweight)', 
    description: 'Limited space, minimal equipment' 
  },
  { 
    value: 'outdoor', 
    label: 'Outdoor Space', 
    description: 'Parks, trails, outdoor areas' 
  },
  { 
    value: 'hotel_travel', 
    label: 'Hotel/Travel', 
    description: 'Small spaces, portable equipment' 
  }
];

const equipmentOptions = [
  'Dumbbells', 'Barbell', 'Resistance Bands', 'Pull-up Bar', 
  'Kettlebells', 'Exercise Ball', 'Yoga Mat', 'Treadmill', 'Stationary Bike'
];

const focusAreaOptions = [
  'Upper Body', 'Lower Body', 'Core', 'Cardio', 'Flexibility', 'Full Body'
];

export default function PlanForm({ onSubmit }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    planType: 'plan', // 'plan' or 'single'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl text-slate-900">Create Your Plan</CardTitle>
          <p className="text-slate-600">
            Choose between a single workout or a complete training plan
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plan Type Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">What would you like to create?</Label>
              <RadioGroup 
                value={formData.planType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, planType: value }))}
                className="grid gap-3"
              >
                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value="single" id="single" />
                  <div className="flex-1">
                    <Label htmlFor="single" className="font-medium cursor-pointer">
                      Single Workout
                    </Label>
                    <p className="text-sm text-slate-600">Create one customized workout session</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value="plan" id="plan" />
                  <div className="flex-1">
                    <Label htmlFor="plan" className="font-medium cursor-pointer">
                      Complete Workout Plan
                    </Label>
                    <p className="text-sm text-slate-600">Create a structured multi-week training program</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Custom Goal Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Feather className="w-5 h-5 text-blue-500" />
                <Label htmlFor="customPrompt" className="text-lg font-semibold">
                  {formData.planType === 'single' ? 'What workout do you need?' : 'What are you training for?'}
                </Label>
              </div>
              <Textarea
                id="customPrompt"
                placeholder={formData.planType === 'single' 
                  ? "e.g., 'I need a 45-minute upper body strength workout for the gym focusing on chest and shoulders.'"
                  : "e.g., 'I'm training for a half-marathon and want hybrid workouts with 2 days of running and 3 days of weight training to build leg strength. I have access to a full gym and have a tricky right knee.'"
                }
                value={formData.customPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                className="h-28"
              />
              <p className="text-xs text-slate-500">The more details you provide, the better your AI-generated {formData.planType === 'single' ? 'workout' : 'plan'} will be!</p>
            </div>

            {/* Essential Fields in Mobile-Friendly Layout */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                <Label className="text-lg font-semibold">Primary Goal</Label>
              </div>
              <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="What's your main goal?" />
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

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Fitness Level</Label>
              <Select value={formData.fitnessLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your level..." />
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

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <Label className="text-lg font-semibold">Workout Location</Label>
              </div>
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

            {/* Schedule & Duration - Mobile Friendly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.planType === 'plan' && (
                <div className="space-y-2">
                  <Label htmlFor="availableDays">Days per week</Label>
                  <Select
                    value={formData.availableDays.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, availableDays: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 4, 5, 6, 7].map(days => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} days
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="sessionDuration">Session duration</Label>
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
              {formData.planType === 'plan' && (
                <div className="space-y-2">
                  <Label htmlFor="planDuration">Plan duration</Label>
                  <Select
                    value={formData.planDuration.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, planDuration: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[4, 6, 8, 12, 16].map(weeks => (
                        <SelectItem key={weeks} value={weeks.toString()}>
                          {weeks} weeks
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Advanced Options Toggle */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </Button>

            {showAdvanced && (
              <div className="space-y-6 p-4 bg-slate-50 rounded-lg">
                {/* Equipment - Simplified */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-blue-500" />
                    <Label className="text-lg font-semibold">Available Equipment</Label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {equipmentOptions.map((equipment) => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment}
                          checked={formData.equipment.includes(equipment)}
                          onCheckedChange={(checked) => handleEquipmentChange(equipment, checked)}
                        />
                        <Label htmlFor={equipment} className="text-sm cursor-pointer">
                          {equipment}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Focus Areas - Simplified */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Focus Areas</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {focusAreaOptions.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={formData.focusAreas.includes(area)}
                          onCheckedChange={(checked) => handleFocusAreaChange(area, checked)}
                        />
                        <Label htmlFor={area} className="text-sm cursor-pointer">
                          {area}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Limitations */}
                <div className="space-y-2">
                  <Label htmlFor="limitations">Any injuries or limitations?</Label>
                  <Textarea
                    id="limitations"
                    placeholder="e.g., Lower back issues, knee problems..."
                    value={formData.limitations}
                    onChange={(e) => setFormData(prev => ({ ...prev, limitations: e.target.value }))}
                    className="h-20"
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-lg"
              disabled={!formData.goal || !formData.fitnessLevel || !formData.workoutLocation}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate My AI {formData.planType === 'single' ? 'Workout' : 'Workout Plan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
