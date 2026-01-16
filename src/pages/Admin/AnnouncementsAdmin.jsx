import React from 'react'
import './Announcements.css'

export function AnnouncementsAdmin(){
    return(
        <div className='ann1'>
            <div className="ann">
            <label htmlFor="announcement">What do you want to announce?</label>
            <textarea name="announcement" id="announcement" placeholder='Enter the announcement....'></textarea>
            </div>
            <div className='announcebtn'>
                <button className='bttn btn11'>Save</button>
                <button className='bttn btn22'>Add Another announcement</button>
            </div>
        </div>
    );
}