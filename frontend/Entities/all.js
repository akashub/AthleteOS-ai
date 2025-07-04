// Export all entities
export { User } from './User.js';
export { WorkoutPlan } from './WorkoutPlan.js';
export { WorkoutSession } from './WorkoutSession.js';

export const WorkoutCollection = {
  list: async () => [
    { id: 1, name: "Strength", description: "Strength training" },
    { id: 2, name: "Cardio", description: "Cardio workouts" }
  ],
  create: async (data) => ({ id: Math.random(), ...data }),
  update: async (id, data) => ({}),
  delete: async (id) => ({})
};

export const Workout = {
  list: async () => [
    { id: 1, name: "Pushups", collection_id: 1 },
    { id: 2, name: "Running", collection_id: 2 }
  ],
  filter: async (filter) => [
    { id: 1, name: "Pushups", collection_id: 1 }
  ],
  delete: async (id) => ({})
}; 