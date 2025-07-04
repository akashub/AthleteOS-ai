// User entity with stub methods for development
export const User = {
  // Get current user
  async me() {
    // Mock user data
    return {
      id: 1,
      display_name: "John Doe",
      full_name: "John Doe",
      email: "john@example.com",
      profile_complete: true,
      age: 28,
      weight_kg: 75,
      height_cm: 180,
      gender: "male",
      activity_level: "moderately_active"
    };
  },

  // Update user data
  async updateMyUserData(data) {
    console.log("Updating user data:", data);
    // In a real app, this would make an API call
    return { success: true };
  }
}; 