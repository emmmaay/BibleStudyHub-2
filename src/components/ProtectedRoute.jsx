import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(res => {
      setSession(res.data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })
    return () => listener?.subscription?.unsubscribe?.()
  }, [])

  if (loading) return <div>Loading…</div>
  if (!session) return <Navigate to="/login" replace />
  return children
}
