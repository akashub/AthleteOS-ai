import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../src/lib/utils";
import { 
  Dumbbell, 
  Heart, 
  Activity, 
  Flame, 
  Zap,
  Play,
  Eye,
  MoreVertical,
  Edit3,
  Trash2,
  Check,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const typeIcons = {
  strength_training: Dumbbell,
  cardio: Heart,
  running: Activity,
  yoga: Zap,
  martial_arts: Flame,
  sports: Play,
  custom: MoreVertical
};

const typeColors = {
  strength_training: "from-red-500 to-red-600",
  cardio: "from-pink-500 to-pink-600", 
  running: "from-green-500 to-green-600",
  yoga: "from-purple-500 to-purple-600",
  martial_arts: "from-rose-500 to-rose-600",
  sports: "from-blue-500 to-blue-600",
  custom: "from-slate-500 to-slate-600"
};

export default function CollectionCard({ collection, workoutCount, index, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(collection.name);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const IconComponent = typeIcons[collection.type] || Dumbbell;
  const colorGradient = typeColors[collection.type] || typeColors.custom;

  const handleEditSave = () => {
    if (editName.trim() && editName !== collection.name) {
      onEdit(collection.id, { name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditName(collection.name);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(collection.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="group"
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${colorGradient}`} />
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorGradient} shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-lg font-semibold"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave();
                          if (e.key === 'Escape') handleEditCancel();
                        }}
                        autoFocus
                      />
                      <Button size="sm" onClick={handleEditSave} className="p-1 h-8 w-8">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel} className="p-1 h-8 w-8">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                        {collection.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {collection.type ? collection.type.replace('_', ' ') : ''}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
              {!isEditing && (
                <div className="flex items-center gap-2">
                  {collection.is_favorite && (
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Name
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Collection
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 text-sm line-clamp-2">
              {collection.description || "No description provided"}
            </p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">
                {workoutCount} workout{workoutCount !== 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <Link to={createPageUrl(`CollectionWorkouts?id=${collection.id}`)}>
                  <Button variant="outline" size="sm" className="h-8 px-3">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </Link>
                <Link to={createPageUrl(`CollectionWorkouts?id=${collection.id}&action=start`)}>
                  <Button size="sm" className={`h-8 px-3 bg-gradient-to-r ${colorGradient} text-white border-0 hover:shadow-lg`}>
                    <Play className="w-3 h-3 mr-1" />
                    Start
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{collection.name}"? This will also delete all workouts in this collection. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Collection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}