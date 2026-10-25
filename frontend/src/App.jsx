
import './App.css'
import Homepage from './components/Homepage'
import Login from './components/Login'
import Register from './components/Register'
import { Route, Routes } from 'react-router'
import ProtectedRoute from './common/ProtectedRoute'
import PublicRoute from './common/PublicRoute'
import MyProfile from './components/MyProfile'

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#075e54] text-white">

      {/* Full-screen WhatsApp-inspired background */}
      <div className="fixed inset-0 -z-0 bg-gradient-to-br from-[#075e54] via-[#064e47] to-[#031f1c]" />

      {/* Subtle decorative pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, #ffffff 2px, transparent 3px),
            radial-gradient(circle at 80% 30%, #ffffff 2px, transparent 3px),
            radial-gradient(circle at 40% 70%, #ffffff 2px, transparent 3px),
            radial-gradient(circle at 70% 85%, #ffffff 2px, transparent 3px)
          `,
          backgroundSize: '90px 90px'
        }}
      />

      {/* Pages */}
      <div className="relative z-10 min-h-screen">
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Homepage />} />
             <Route path="/my-profile" element={<MyProfile />} />
          </Route>


          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

        </Routes>
      </div>

    </div>
  )
}

export default App
