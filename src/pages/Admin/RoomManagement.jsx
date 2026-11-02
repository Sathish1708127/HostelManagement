import { React, useState } from 'react'
import '../../styles/admincss/room.css'

export default function RoomManagement() {
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({
        type: "",
        totalRooms: "",
        occupiedRooms: ""
    });

    const ROOM_TYPES = ["Double", "Triple"];

    <select
        value={formData.type}
        onChange={(e) =>
            setFormData({ ...formData, type: e.target.value })
        }
        required
    >
        <option value="">Select Room Type</option>
        {ROOM_TYPES.map((type) => (
            <option key={type} value={type}>
                {type}
            </option>
        ))}
    </select>


    const handleSubmit = (e) => {
        e.preventDefault();

        const total = Number(formData.totalRooms);
        const occupied = Number(formData.occupiedRooms);

        if (occupied > total) {
            alert("Occupied rooms cannot exceed total rooms");
            return;
        }

        setRooms((prevRooms) => {
            const index = prevRooms.findIndex(
                (room) => room.type === formData.type
            );

            // 🟡 CASE 1: Room type already exists → UPDATE
            if (index !== -1) {
                const updatedRooms = [...prevRooms];
                updatedRooms[index] = {
                    ...updatedRooms[index],
                    totalRooms: total,
                    occupiedRooms: occupied
                };
                return updatedRooms;
            }

            // 🟢 CASE 2: New room type → ADD
            return [
                ...prevRooms,
                {
                    id: Date.now(),
                    type: formData.type,
                    totalRooms: total,
                    occupiedRooms: occupied
                }
            ];
        });

        setFormData({
            type: "",
            totalRooms: "",
            occupiedRooms: ""
        });
    };

    // availableRooms = totalRooms - occupiedRooms


    return (
        <div className='rooms'>
            <h2>Room Management</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Room Type (Single / Double)"
                    value={formData.type}
                    onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                    }
                    required
                />

                <input
                    type="number"
                    placeholder="Total Rooms"
                    value={formData.totalRooms}
                    onChange={(e) =>
                        setFormData({ ...formData, totalRooms: e.target.value })
                    }
                    required
                />

                <input
                    type="number"
                    placeholder="Occupied Rooms"
                    value={formData.occupiedRooms}
                    onChange={(e) =>
                        setFormData({ ...formData, occupiedRooms: e.target.value })
                    }
                    required
                />

                <button type="submit">Add</button>
            </form>

            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>Room Type</th>
                        <th>Total Rooms</th>
                        <th>Occupied Rooms</th>
                        <th>Available Rooms</th>
                    </tr>
                </thead>

                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.type}>
                            <td>{room.type}</td>
                            <td>{room.totalRooms}</td>
                            <td>{room.occupiedRooms}</td>
                            <td>{room.totalRooms - room.occupiedRooms}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            

        </div>
    )
}


