import { useState, useEffect } from 'react'
import { useAuth } from '@aesyros/supabase'
import { supabase } from '@aesyros/supabase'
import { Alert, AlertDescription } from './ui/alert'
import { Shield, User, Database, CheckCircle, AlertTriangle } from 'lucide-react'

export function DevAdminPanel() {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        setMessage(`Error: ${error.message}`)
      } else {
        setUserProfile(data)
        setMessage('User profile loaded successfully')
      }
    } catch (err) {
      console.error('Error:', err)
      setMessage(`Error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const makeUserSuperAdmin = async () => {
    if (!user) return

    try {
      setLoading(true)
      setMessage('Making user super admin...')

      // Method 1: Try upsert first
      let { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          system_role: 'super_admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      // Method 2: If upsert failed, try update
      if (upsertError) {
        console.log('Upsert failed, trying update:', upsertError)
        const { error: updateError } = await supabase
          .from('users')
          .update({
            system_role: 'super_admin',
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (updateError) {
          throw updateError
        }
      }

      // Method 3: If all else fails, try to create manually
      if (upsertError) {
        console.log('Trying manual insert...')
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            system_role: 'super_admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError && !insertError.message.includes('duplicate')) {
          throw insertError
        }
      }

      setMessage('✅ Successfully made user super admin! Please refresh the page.')
      await fetchUserProfile()
    } catch (err) {
      console.error('Error making super admin:', err)
      setMessage(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}. Try running the SQL script in Supabase instead.`)
    } finally {
      setLoading(false)
    }
  }

  const createTestOrganization = async () => {
    if (!user) return

    try {
      setLoading(true)
      setMessage('Creating test organization...')

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: 'Test Organization',
          slug: 'test-org',
          description: 'Test organization for development',
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (orgError) throw orgError

      // Create a trial license for the test org
      const { error: licenseError } = await supabase
        .from('organization_licenses')
        .insert({
          organization_id: orgData.id,
          license_plan_id: (await supabase
            .from('license_plans')
            .select('id')
            .eq('slug', 'startup-trial')
            .single()
          ).data?.id,
          status: 'trial',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          current_user_count: 1,
          max_users: 10
        })

      if (licenseError) {
        console.warn('Could not create license:', licenseError)
      }

      setMessage(`✅ Created test organization: ${orgData.name}`)
    } catch (err) {
      console.error('Error creating test org:', err)
      setMessage(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="glass-card p-6">
        <div className="text-center">
          <Shield className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-400 mb-4">Please sign in to access dev admin panel</p>
          <div className="text-xs text-slate-500">
            Debug: User object is null/undefined
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Dev Admin Panel
        </h3>

        {message && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Current User Info */}
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <h4 className="font-medium text-slate-100 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Current User
            </h4>
            <div className="text-sm text-slate-300 space-y-1">
              <div>ID: {user.id}</div>
              <div>Email: {user.email}</div>
              <div>Auth Role: {user.role || 'None'}</div>
              {userProfile && (
                <>
                  <div>System Role: {userProfile.system_role || 'None'}</div>
                  <div>Full Name: {userProfile.full_name || 'None'}</div>
                  <div>Organization ID: {userProfile.organization_id || 'None'}</div>
                </>
              )}
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
            <h5 className="font-medium text-blue-300 mb-2">Setup Instructions:</h5>
            <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
              <li>Click "Make Super Admin" below, or</li>
              <li>Run the SQL script at <code className="bg-slate-800 px-1 rounded">/setup-super-admin.sql</code> in Supabase SQL Editor</li>
              <li>Refresh this page to see the changes</li>
              <li>The "Super Admin: License Management" panel should appear above</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={makeUserSuperAdmin}
              disabled={loading}
              className="glass-button bg-purple-500/20 text-purple-300 hover:text-purple-200 px-4 py-2 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              Make Super Admin
            </button>

            <button
              onClick={createTestOrganization}
              disabled={loading}
              className="glass-button bg-green-500/20 text-green-300 hover:text-green-200 px-4 py-2 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              Create Test Org
            </button>

            <button
              onClick={fetchUserProfile}
              disabled={loading}
              className="glass-button bg-blue-500/20 text-blue-300 hover:text-blue-200 px-4 py-2 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Refresh Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}