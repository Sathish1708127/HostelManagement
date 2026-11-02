import React, { useState } from 'react'
import '../../styles/studentcss/studentdashboard.css'
import StudentTable from '../Admin/StudentTable'
import '../../styles/width.css'


export default function StudentEntry1() {
    const [students] = useState([]);

    return (
        <div className='student-dashboard widthbox'>
            <StudentTable students={students} />
        </div>
    )
}