export function createPageUrl(pageName) {
  const pageUrls = {
    Dashboard: "/dashboard",
    WorkoutCollections: "/collections",
    PlanGenerator: "/plan-generator",
    PlanDetails: "/plan",
    ActiveWorkout: "/active-workout",
    Progress: "/progress",
    Profile: "/profile",
    CollectionWorkouts: "/collections", // For list, not for details
    WorkoutDetails: "/workout-details",
  };
  return pageUrls[pageName] || "/";
} 