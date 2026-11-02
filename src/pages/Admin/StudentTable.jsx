import React from 'react'

export default function StudentTable({ students }) {
  return (
    <div>
      <h3>Total Students: {students.length}</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Parent Name</th>
            <th>Admission Date</th>
            <th>Gender</th>
            <th>USN</th>
            <th>Semester</th>
            <th>Room Type</th>
            <th>Room No</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.studentName}</td>
              <td>{student.parentName}</td>
              <td>{student.admissionDate}</td>
              <td>{student.gender}</td>
              <td>{student.USN}</td>
              <td>{student.semester}</td>
              <td>{student.roomType}</td>
              <td>{student.roomNo}</td>
              <td>{student.phone}</td>
              <td>{student.email}</td>
              <td>{student.address}</td>
              <td>{student.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
