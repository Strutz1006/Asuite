import React, { useState } from 'react'
import { DataSourceManager } from '../components/DataSourceManager'
import { DataSourceWizard } from '../components/DataSourceWizard'

export default function DataSourcesPage() {
  const [showWizard, setShowWizard] = useState(false)
  const [editingSource, setEditingSource] = useState(null)

  const handleCreateSource = () => {
    setEditingSource(null)
    setShowWizard(true)
  }

  const handleEditSource = (source: any) => {
    setEditingSource(source)
    setShowWizard(true)
  }

  const handleSubmitSource = (source: any) => {
    console.log('Submitting data source:', source)
    // TODO: Implement API call to create/update data source
    setShowWizard(false)
    setEditingSource(null)
  }

  return (
    <div className="space-y-6">
      <DataSourceManager 
        onCreateSource={handleCreateSource}
        onEditSource={handleEditSource}
      />
      
      <DataSourceWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onSubmit={handleSubmitSource}
        editingSource={editingSource}
      />
    </div>
  )
}