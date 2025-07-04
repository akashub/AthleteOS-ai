// Stub for AI integration
export async function InvokeLLM() {
  return {
    name: "Mock Plan",
    description: "This is a mock AI-generated plan.",
    goal: "strength",
    duration_weeks: 4,
    workouts_per_week: 3,
    difficulty_level: "beginner",
    equipment_needed: ["dumbbells", "resistance bands"],
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
  };
} 