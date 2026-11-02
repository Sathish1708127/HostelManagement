import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient, type ApiEnvelope } from '../../lib/apiClient';
import { useAuth } from '../../app/providers';

type BedState = 'occupied' | 'available' | 'reserved' | 'maintenance';
type Bed = { uuid: string; number: string; status: BedState; resident: { name: string } | null };
type Room = { uuid: string; room_number: string; room_type: string; beds: Bed[] };
type Resident = { uuid: string; legal_name: string; university_id: string; room_number: string | null };

export default function RoomsPage() {
  const { user } = useAuth();
  const canAssign = user?.role !== 'student' && user?.role !== 'parent_guardian';
  const [rooms, setRooms] = useState<Room[]>([]); const [residents, setResidents] = useState<Resident[]>([]); const [selectedBed, setSelectedBed] = useState<Bed | null>(null); const [studentUuid, setStudentUuid] = useState(''); const [message, setMessage] = useState('');
  const load = useCallback(async () => {
    try {
      const roomResponse = await apiClient.get<ApiEnvelope<Room[]>>('/rooms');
      setRooms(roomResponse.data);
      if (canAssign) {
        const residentResponse = await apiClient.get<ApiEnvelope<Resident[]>>('/residents');
        setResidents(residentResponse.data);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load bed availability.');
    }
  }, [canAssign]);
  useEffect(() => { void load(); }, [load]);
  const myRooms = useMemo(
    () => rooms.filter((room) => room.beds.some((bed) => bed.resident?.name === user?.name)),
    [rooms, user?.name],
  );
  const displayedRooms = canAssign ? rooms : myRooms;
  const availableBeds = useMemo(() => rooms.flatMap((room) => room.beds).filter((bed) => bed.status === 'available').length, [rooms]);
  async function assignBed() { if (!selectedBed || !studentUuid) return; try { await apiClient.post('/bed-assignments', { student_uuid: studentUuid, bed_uuid: selectedBed.uuid }); setMessage('Bed assigned successfully.'); setSelectedBed(null); setStudentUuid(''); await load(); } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to assign bed.'); } }
  return <main className="page-content"><section className="page-heading"><div><p className="eyebrow">Live occupancy</p><h1>{canAssign ? 'Rooms and beds' : 'My room'}</h1><p>{canAssign ? 'Select an available bed and assign an approved resident.' : 'View your room allocation and contact the warden for a transfer.'}</p></div></section>{message && <p className="muted" role="status">{message}</p>}{canAssign && <section className="metric-grid compact"><Metric label="Rooms" value={String(rooms.length)} detail="Current inventory" /><Metric label="Available beds" value={String(availableBeds)} detail="Ready for allocation" /><Metric label="Occupied beds" value={String(rooms.flatMap((room) => room.beds).filter((bed) => bed.status === 'occupied').length)} detail="Current assignments" /></section>}{!canAssign && myRooms.length === 0 && <section className="panel"><h2>No room assigned yet</h2><p className="muted">Your room allocation will appear here after the warden assigns a bed.</p></section>}{canAssign && selectedBed && <section className="panel" style={{ marginBottom: 18 }}><div className="panel-heading"><h2>Assign bed {selectedBed.number}</h2><button className="quiet-button" onClick={() => setSelectedBed(null)}>Cancel</button></div><div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}><select className="styled-input" aria-label="Resident to assign" value={studentUuid} onChange={(event) => setStudentUuid(event.target.value)}><option value="">Choose an unassigned resident</option>{residents.filter((resident) => !resident.room_number).map((resident) => <option key={resident.uuid} value={resident.uuid}>{resident.legal_name} — {resident.university_id}</option>)}</select><button className="primary-button" disabled={!studentUuid} onClick={() => void assignBed()}>Confirm assignment</button></div></section>}<section className="panel room-panel"><div className="bed-legend">{(['occupied', 'available', 'reserved', 'maintenance'] as BedState[]).map((state) => <span key={state}><i className={state} />{state}</span>)}</div><div className="room-grid">{displayedRooms.map((room) => <article className="room-card" key={room.uuid}><div><strong>{room.room_number}</strong><span>{room.room_type}</span></div><div className="bed-list">{room.beds.filter((bed) => canAssign || bed.resident?.name === user?.name).map((bed) => <button className={`bed ${bed.status}`} key={bed.uuid} title={bed.resident?.name ?? bed.status} disabled={!canAssign || bed.status !== 'available'} onClick={() => setSelectedBed(bed)}><b>{bed.number}</b><span>{bed.resident?.name ?? bed.status}</span></button>)}</div></article>)}</div></section></main>;
}
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <article className="mini-metric"><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>; }
