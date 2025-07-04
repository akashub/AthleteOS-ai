import React, { useState, useEffect } from 'react';
import { User } from '../Entities/User';
import { Button } from '../Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Components/ui/select';
import { Loader2, User as UserIcon, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../src/lib/utils';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    display_name: '',
    age: '',
    weight_kg: '',
    height_cm: '',
    gender: '',
    activity_level: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setFormData({
          display_name: currentUser.display_name || '',
          age: currentUser.age || '',
          weight_kg: currentUser.weight_kg || '',
          height_cm: currentUser.height_cm || '',
          gender: currentUser.gender || '',
          activity_level: currentUser.activity_level || ''
        });
      } catch (error) {
        // Not logged in, handle appropriately, maybe redirect
        console.error("User not logged in");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = {
        display_name: formData.display_name,
        age: parseInt(formData.age, 10),
        weight_kg: parseFloat(formData.weight_kg),
        height_cm: parseInt(formData.height_cm, 10),
        gender: formData.gender,
        activity_level: formData.activity_level,
        profile_complete: true
      };
      await User.updateMyUserData(dataToSave);
      // Optional: show a success message
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-lg mb-4">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-900">
                {!user?.profile_complete ? "Complete Your Profile" : "Your Profile"}
              </CardTitle>
              <p className="text-slate-600">
                {!user?.profile_complete 
                  ? "This information helps us create better, more personalized workouts for you."
                  : "Keep your details up to date for the best experience."}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="display_name">What should we call you?</Label>
                  <Input 
                    id="display_name" 
                    name="display_name" 
                    type="text" 
                    placeholder="Enter your first name or preferred name"
                    value={formData.display_name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select name="gender" value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)} required>
                      <SelectTrigger><SelectValue placeholder="Select gender..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                    <Input id="weight_kg" name="weight_kg" type="number" step="0.1" value={formData.weight_kg} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height_cm">Height (cm)</Label>
                    <Input id="height_cm" name="height_cm" type="number" value={formData.height_cm} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity_level">Activity Level</Label>
                  <Select name="activity_level" value={formData.activity_level} onValueChange={(v) => handleSelectChange('activity_level', v)} required>
                    <SelectTrigger><SelectValue placeholder="Select your activity level..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                      <SelectItem value="lightly_active">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                      <SelectItem value="moderately_active">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (hard exercise/sports 6-7 days a week)</SelectItem>
                      <SelectItem value="extra_active">Extra Active (very hard exercise & physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={isSaving} className="w-full gradient-primary text-white h-12 text-lg">
                  {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}