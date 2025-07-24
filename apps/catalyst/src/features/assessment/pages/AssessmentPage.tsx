import React, { useState } from 'react'
import { ReadinessAssessment } from '../components/ReadinessAssessment'
import { AssessmentBuilder } from '../components/AssessmentBuilder'

export default function AssessmentPage() {
  const [showBuilder, setShowBuilder] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState(null)

  const handleCreateAssessment = () => {
    setEditingAssessment(null)
    setShowBuilder(true)
  }

  const handleEditAssessment = (assessment: any) => {
    setEditingAssessment(assessment)
    setShowBuilder(true)
  }

  const handleViewResults = (assessment: any) => {
    console.log('Viewing results for assessment:', assessment.id)
    // TODO: Navigate to results page or open results modal
  }

  const handleSubmitAssessment = (assessment: any) => {
    console.log('Submitting assessment:', assessment)
    // TODO: Implement API call to create/update assessment
    setShowBuilder(false)
    setEditingAssessment(null)
  }

  return (
    <div className="space-y-6">
      <ReadinessAssessment 
        onCreateAssessment={handleCreateAssessment}
        onEditAssessment={handleEditAssessment}
        onViewResults={handleViewResults}
      />
      
      <AssessmentBuilder
        isOpen={showBuilder}
        onClose={() => setShowBuilder(false)}
        onSubmit={handleSubmitAssessment}
        editingAssessment={editingAssessment}
      />
    </div>
  )
}