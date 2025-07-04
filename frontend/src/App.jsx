import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '../Layout.jsx'
import Dashboard from '../Pages/Dashboard.jsx'
import PlanGenerator from '../Pages/PlanGenerator.jsx'
import PlanDetails from '../Pages/PlanDetails.jsx'
import ActiveWorkout from '../Pages/ActiveWorkout.jsx'
import Progress from '../Pages/Progress.jsx'
import Profile from '../Pages/Profile.jsx'
import WorkoutCollections from '../Pages/WorkoutCollections.jsx'
import CollectionWorkouts from '../Pages/CollectionWorkouts.jsx'
import WorkoutDetails from '../Pages/WorkoutDetails.jsx'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/collections" element={<WorkoutCollections />} />
          <Route path="/plan-generator" element={<PlanGenerator />} />
          <Route path="/active-workout" element={<ActiveWorkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/plan/:id" element={<PlanDetails />} />
          <Route path="/workout/:id" element={<ActiveWorkout />} />
          <Route path="/collections/:id" element={<CollectionWorkouts />} />
          <Route path="/workout-details/:id" element={<WorkoutDetails />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 