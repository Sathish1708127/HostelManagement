import { React, useState } from 'react'
import '../../styles/admincss/studentdetails.css'
import StudentTable from './StudentTable'

export default function Students() {
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    rollNo: "",
    age: "",
    gender: "",
    roomType: "",
    roomNo: "",
    phone: "",
    email: "",
    address: "",
    admissionDate: "",
    status: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setStudents((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...formData
      }
    ]);

    setFormData({
      studentName: "",
      parentName: "",
      USN: "",
      semester: "",
      gender: "",
      roomType: "",
      roomNo: "",
      phone: "",
      email: "",
      address: "",
      admissionDate: "",
      status: ""
    });
  };


  return (
    <div className='students'>
      <form onSubmit={handleSubmit}>
        <label htmlFor="studentName">Student Name : </label>
        <input name="studentName" placeholder="Student Name" value={formData.studentName} onChange={handleChange} required />
        <label htmlFor="parentName">Parent Name : </label>
        <input name="parentName" placeholder="Parent Name" value={formData.parentName} onChange={handleChange} required />
        <label htmlFor="admissionDate">Admission Date : </label>
        <input name="admissionDate" type="date" value={formData.admissionDate} onChange={handleChange} />
        <label htmlFor="rollNo">USN : </label>
        <input name="rollNo" placeholder="USN" value={formData.USN} onChange={handleChange} />
        <label htmlFor="sem">Semester : </label>
        <input name="sem" type='text' placeholder="semester" value={formData.semester} onChange={handleChange} />

        <label htmlFor="gender">Gender : </label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label htmlFor="roomType">Room Type : </label>
        <input name="roomType" placeholder="Room Type" value={formData.roomType} onChange={handleChange} />
        <label htmlFor="roomNo">Room NO : </label>
        <input name="roomNo" placeholder="Room No" value={formData.roomNo} onChange={handleChange} />
        <label htmlFor="phone">Phone NO : </label>
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <label htmlFor="email">Email : </label>
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <label htmlFor="address">Address : </label>
        <input name="address" type="text" placeholder="Address" value={formData.address} onChange={handleChange} />
        <label htmlFor="status">Status : </label>
        <input name="status" placeholder="Status (Active / Left)" value={formData.status} onChange={handleChange} />

        <button type="submit">Add Student</button>
      </form>

      <StudentTable students={students} />

    </div>
  )
}