import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { supabase } from './supabaseClient'
import { useEffect, useState } from 'react'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.getSession().then(r => r.data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow p-4 flex justify-between">
        <div className="font-bold text-xl">Bible Study App</div>
        <div className="space-x-4">
          <Link to="/" className="text-sm">Home</Link>
          {session ? (
            <button onClick={() => supabase.auth.signOut()} className="text-sm">Sign out</button>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div className="max-w-3xl mx-auto"> <h1 className="text-2xl font-semibold">Welcome — Login to continue</h1> </div>} />
        </Routes>
      </main>
    </div>
  )
}
