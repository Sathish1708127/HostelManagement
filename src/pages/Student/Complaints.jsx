import React,{ useState } from 'react'
import '../../styles/width.css'

// import './complaints.css'
// export function Complaints(){
//     return(
//     <div className='complain'>
//         <h1>File a Complaint</h1>
//         <div className='complainbox'>
//         <form action="">
//             <label className='label' htmlFor="complaint-description">Describe your complaint:</label>
//             <textarea className='text' id="complaint-description"></textarea>
//             <button className='complainbtn' type="submit">Submit Complaint</button>
//         </form>
//         </div>
//     </div>
//     )
// }

export default function Complaints({ onAddComplaint }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    onAddComplaint(text);   // send data to parent
    setText("");            // clear input
  };

  return (
    <div className='widthbox'>
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Enter complaint..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
    </div>
  );
}

