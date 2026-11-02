import React from 'react';
import '../../styles/admincss/ComplaintsAdmin.css';

function ComplaintsAdmin({ complaints = [] }) {
  return (
    <div className="complaints-admin">
      <h3>Complaints</h3>
      <div className="inbox">
      {complaints.map((c, index) => (
        <p key={index}>📩 {c}</p>
      ))}
      </div>
    </div>
  );
}

export default ComplaintsAdmin;
