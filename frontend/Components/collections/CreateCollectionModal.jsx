import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { 
  Dumbbell, 
  Heart, 
  Activity, 
  Flame, 
  Zap,
  Play,
  MoreVertical
} from "lucide-react";

const workoutTypes = [
  { value: 'strength_training', label: 'Strength Training', icon: Dumbbell, color: 'red' },
  { value: 'cardio', label: 'Cardio', icon: Heart, color: 'pink' },
  { value: 'running', label: 'Running', icon: Activity, color: 'green' },
  { value: 'yoga', label: 'Yoga & Flexibility', icon: Zap, color: 'purple' },
  { value: 'martial_arts', label: 'Martial Arts', icon: Flame, color: 'orange' },
  { value: 'sports', label: 'Sports', icon: Play, color: 'blue' },
  { value: 'custom', label: 'Custom', icon: MoreVertical, color: 'slate' }
];

export default function CreateCollectionModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'strength_training'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', description: '', type: 'strength_training' });
  };
  
  const handleClose = () => {
    setFormData({ name: '', description: '', type: 'strength_training' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name</Label>
            <Input
              id="name"
              placeholder="e.g., Upper Body Strength"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe what this collection is for..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="h-20"
            />
          </div>

          <div className="space-y-4">
            <Label>Collection Type</Label>
            <RadioGroup 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              className="grid grid-cols-1 gap-3"
            >
              {workoutTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg bg-${type.color}-100`}>
                      <type.icon className={`w-4 h-4 text-${type.color}-600`} />
                    </div>
                    <Label htmlFor={type.value} className="font-medium cursor-pointer flex-1">
                      {type.label}
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gradient-primary text-white"
              disabled={!formData.name.trim()}
            >
              Create Collection
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}