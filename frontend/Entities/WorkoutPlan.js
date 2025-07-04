// WorkoutPlan entity with stub methods for development
export const WorkoutPlan = {
  // Get workout plans with filtering
  async filter(filters = {}, sortBy = '-created_date', limit = 10) {
    // Mock workout plan data
    return [{
      id: 1,
      name: "Beginner Strength Program",
      description: "A comprehensive 4-week program designed for beginners",
      goal: "strength",
      duration_weeks: 4,
      workouts_per_week: 3,
      difficulty_level: "beginner",
      equipment_needed: ["dumbbells", "resistance bands"],
      status: "active",
      ai_generated: true,
      created_date: new Date().toISOString(),
      workouts: [
        {
          name: "Upper Body Focus",
          day: "Monday",
          exercises: [
            {
              name: "Push-ups",
              sets: 3,
              reps: "8-12",
              duration_seconds: null,
              rest_seconds: 60,
              instructions: "Keep your body in a straight line",
              muscle_groups: ["chest", "triceps", "shoulders"]
            },
            {
              name: "Dumbbell Rows",
              sets: 3,
              reps: "10-12",
              duration_seconds: null,
              rest_seconds: 60,
              instructions: "Keep your back straight",
              muscle_groups: ["back", "biceps"]
            }
          ]
        },
        {
          name: "Lower Body Focus",
          day: "Wednesday",
          exercises: [
            {
              name: "Squats",
              sets: 3,
              reps: "12-15",
              duration_seconds: null,
              rest_seconds: 90,
              instructions: "Keep your knees behind your toes",
              muscle_groups: ["quadriceps", "glutes"]
            }
          ]
        }
      ]
    }];
  },

  // Get a single workout plan by ID
  async get(id) {
    const plans = await this.filter();
    return plans.find(plan => plan.id === parseInt(id));
  }
}; 