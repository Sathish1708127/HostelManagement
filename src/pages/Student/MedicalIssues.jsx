import React from 'react'

export function MedicalIssues(){
    return(
    <div>
        <h1>Medical Issues</h1>
        <form action="">
            <label htmlFor="issue-description">Describe your issue:</label>
            <textarea id="issue-description"></textarea>
            <button type="submit">Submit</button>
        </form>
    </div>
    )
}