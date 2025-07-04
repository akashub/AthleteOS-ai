// WorkoutSession entity with stub methods for development
export const WorkoutSession = {
  // Get workout sessions with sorting and limiting
  async list(sortBy = '-created_date', limit = 10) {
    // Mock workout session data
    return [
      {
        id: 1,
        workout_name: "Upper Body Focus",
        status: "completed",
        duration_minutes: 45,
        created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        exercises_completed: [
          { exercise_name: "Push-ups", sets_completed: 3 },
          { exercise_name: "Dumbbell Rows", sets_completed: 3 }
        ]
      },
      {
        id: 2,
        workout_name: "Lower Body Focus",
        status: "completed",
        duration_minutes: 35,
        created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        exercises_completed: [
          { exercise_name: "Squats", sets_completed: 3 }
        ]
      },
      {
        id: 3,
        workout_name: "Upper Body Focus",
        status: "completed",
        duration_minutes: 42,
        created_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        exercises_completed: [
          { exercise_name: "Push-ups", sets_completed: 3 },
          { exercise_name: "Dumbbell Rows", sets_completed: 3 }
        ]
      }
    ];
  },

  // Get a single workout session by ID
  async get(id) {
    const sessions = await this.list();
    return sessions.find(session => session.id === parseInt(id));
  }
}; 