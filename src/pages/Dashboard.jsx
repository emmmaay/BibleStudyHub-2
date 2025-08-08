import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('user')

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(res => {
      if (!mounted) return
      setUser(res.data.user)
      // fetch role from users_roles table
      if (res.data?.user?.id) {
        supabase
          .from('users_roles')
          .select('role')
          .eq('user_id', res.data.user.id)
          .limit(1)
          .then(r => {
            if (r.data?.[0]) setRole(r.data[0].role)
          })
      }
    })
    return () => { mounted = false }
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2">Welcome, {user?.email}</p>

      <div className="mt-4">
        <strong>Role:</strong> <span className="ml-2">{role}</span>
      </div>

      {role === 'admin' && (
        <div className="mt-6 p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Admin Panel</h2>
          <p className="text-sm text-slate-500">You can manage content (Mains, Classes, Notes).</p>
          <div className="mt-3">
            <a className="text-indigo-600" href="/dashboard/admin">Open Admin Area</a>
          </div>
        </div>
      )}
    </div>
  )
}
