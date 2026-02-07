import React,{useState} from 'react'
import Complaints from '../Student/Complaints';
import ComplaintsAdmin from '../Admin/ComplaintsAdmin';


export default function Bridge() {
  const [complaints, setComplaints] = useState([]);
  
    const addComplaint = (text) => {
      setComplaints([...complaints, text]);
    };
  
    return (
      <>
        <Complaints onAddComplaint={addComplaint} />
        <ComplaintsAdmin complaints={complaints} />
      </>
    );
}