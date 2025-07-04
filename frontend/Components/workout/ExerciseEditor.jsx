import React, { useState } from 'react';
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Trash2, Edit3, Save, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ExerciseEditor({ exercise, index, isEditing, onUpdate, onDelete }) {
  const [localEditing, setLocalEditing] = useState(false);
  const [editedExercise, setEditedExercise] = useState(exercise);

  const handleSave = () => {
    onUpdate(index, editedExercise);
    setLocalEditing(false);
  };

  const handleCancel = () => {
    setEditedExercise(exercise);
    setLocalEditing(false);
  };

  const isInEditMode = isEditing || localEditing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`${isInEditMode ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'} transition-all duration-200`}>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isInEditMode ? (
                <div className="space-y-3">
                  <Input
                    value={editedExercise.name}
                    onChange={(e) => setEditedExercise({ ...editedExercise, name: e.target.value })}
                    className="font-semibold text-lg"
                    placeholder="Exercise name"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Sets</label>
                      <Input
                        type="number"
                        value={editedExercise.sets}
                        onChange={(e) => setEditedExercise({ ...editedExercise, sets: parseInt(e.target.value) })}
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Reps</label>
                      <Input
                        value={editedExercise.reps}
                        onChange={(e) => setEditedExercise({ ...editedExercise, reps: e.target.value })}
                        placeholder="8-12"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Rest (sec)</label>
                      <Input
                        type="number"
                        value={editedExercise.rest_seconds || 60}
                        onChange={(e) => setEditedExercise({ ...editedExercise, rest_seconds: parseInt(e.target.value) })}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1 block">Type</label>
                      <Select 
                        value={editedExercise.type || 'strength'} 
                        onValueChange={(value) => setEditedExercise({ ...editedExercise, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strength">Strength</SelectItem>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="stretching">Stretching</SelectItem>
                          <SelectItem value="compound">Compound</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Instructions</label>
                    <Textarea
                      value={editedExercise.instructions || ''}
                      onChange={(e) => setEditedExercise({ ...editedExercise, instructions: e.target.value })}
                      placeholder="Exercise instructions..."
                      className="h-20"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold text-slate-900 text-lg mb-2">{exercise.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                    <span className="font-medium">{exercise.sets} sets × {exercise.reps}</span>
                    {exercise.rest_seconds && (
                      <span>{exercise.rest_seconds}s rest</span>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {exercise.type || 'strength'}
                    </Badge>
                  </div>
                  {exercise.instructions && (
                    <p className="text-slate-600 text-sm mb-3">{exercise.instructions}</p>
                  )}
                  {exercise.muscle_groups && exercise.muscle_groups.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {exercise.muscle_groups.map((muscle, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-slate-50">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              {isInEditMode ? (
                <>
                  <Button size="sm" onClick={handleSave} className="h-8 px-2">
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 px-2">
                    <X className="w-3 h-3" />
                  </Button>
                </>
              ) : (
                <>
                  {!isEditing && (
                    <Button size="sm" variant="outline" onClick={() => setLocalEditing(true)} className="h-8 px-2">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onDelete(index)}
                    className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}