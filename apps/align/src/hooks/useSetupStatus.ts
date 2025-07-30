import { useState, useEffect } from 'react'
import { supabase } from '@aesyros/supabase'

export function useSetupStatus() {
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [organization, setOrganization] = useState<any>(null)

  useEffect(() => {
    checkSetupStatus()
  }, [])

  const checkSetupStatus = async () => {
    try {
      setLoading(true)
      
      // Check if any organization exists with setup complete
      const { data: setupData, error } = await supabase
        .from('align_company_setup')
        .select('*, organizations(*)')
        .eq('setup_completed', true)
        .limit(1)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (setupData) {
        setIsSetupComplete(true)
        setOrganization(setupData.organizations)
      } else {
        setIsSetupComplete(false)
        setOrganization(null)
      }
    } catch (error) {
      console.error('Error checking setup status:', error)
      setIsSetupComplete(false)
    } finally {
      setLoading(false)
    }
  }

  return {
    isSetupComplete,
    loading,
    organization,
    refetchSetup: checkSetupStatus
  }
}