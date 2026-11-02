import React, { useState } from 'react'
import '../../styles/studentcss/medical.css'
import '../../styles/width.css'

export default function MedicalIssues() {
  const [name, setName] = useState('')
  const [issue, setIssue] = useState('')
  const [medication, setMedication] = useState('No')
  const [medicationDetails, setMedicationDetails] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !issue) return

    const newIssue = {
      name,
      issue,
      medication,
      medicationDetails: medication === 'Yes' ? medicationDetails : '—',
      date: new Date().toLocaleDateString()
    }

    console.log('Submitted Medical Issue:', newIssue)
    // TODO: send this data to backend / Firebase

    // Reset form
    setName('')
    setIssue('')
    setMedication('No')
    setMedicationDetails('')
  }

  return (
    <div className="medical-issues widthbox">
      <h1>Medical Issues</h1>

      <form onSubmit={handleSubmit}>
        <label>Student Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Describe Medical Issue</label>
        <textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
        />

        <label>Are you taking any medications?</label>
        <select
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>

        {medication === 'Yes' && (
          <>
            <label>Medication Details</label>
            <input
              type="text"
              placeholder="Medicine name / dosage"
              value={medicationDetails}
              onChange={(e) => setMedicationDetails(e.target.value)}
              required
            />
          </>
        )}

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}