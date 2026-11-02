type DemoResident = {
  uuid: string;
  university_id: string;
  legal_name: string;
  preferred_name: string | null;
  nationality: 'Nepali' | 'Indian';
  course: string;
  semester: string;
  status: string;
  profile_completion: number;
  room_number: string | null;
  bed_number: string | null;
};

type DemoBedState = 'occupied' | 'available' | 'reserved' | 'maintenance';
type DemoBed = { number: string; status: DemoBedState; name: string | null };
type DemoRoom = { number: string; type: string; beds: DemoBed[] };

function readDemoData<T>(key: string, initialValue: T): T {
  const saved = window.localStorage.getItem(`hostel-pulse:${key}`);
  return saved === null ? initialValue : JSON.parse(saved) as T;
}

function saveDemoData<T>(key: string, value: T) {
  window.localStorage.setItem(`hostel-pulse:${key}`, JSON.stringify(value));
}

const residents: DemoResident[] = readDemoData('demo-residents', [
  { uuid: 'resident-maya', university_id: 'ST-2401', legal_name: 'Maya Gurung', preferred_name: 'Maya', nationality: 'Nepali', course: 'BCA', semester: '4', status: 'active', profile_completion: 92, room_number: 'B-204', bed_number: '2' },
  { uuid: 'resident-arjun', university_id: 'ST-2398', legal_name: 'Arjun Rao', preferred_name: null, nationality: 'Indian', course: 'B.Tech', semester: '6', status: 'on_leave', profile_completion: 100, room_number: 'A-112', bed_number: '1' },
  { uuid: 'resident-zoya', university_id: 'ST-2384', legal_name: 'Zoya Khan', preferred_name: null, nationality: 'Indian', course: 'B.Com', semester: '2', status: 'active', profile_completion: 84, room_number: 'C-305', bed_number: '2' },
  { uuid: 'resident-nima', university_id: 'ST-2371', legal_name: 'Nima Sherpa', preferred_name: 'Nima', nationality: 'Nepali', course: 'BBA', semester: '4', status: 'active', profile_completion: 96, room_number: 'B-201', bed_number: '1' },
  { uuid: 'resident-diya', university_id: 'ST-2359', legal_name: 'Diya Menon', preferred_name: null, nationality: 'Indian', course: 'B.Sc', semester: '2', status: 'approved', profile_completion: 55, room_number: null, bed_number: null },
]);

const roomDefinitions: DemoRoom[] = readDemoData('demo-rooms', [
  { number: 'B-201', type: 'triple', beds: [{ number: '1', status: 'occupied', name: 'Nima Sherpa' }, { number: '2', status: 'occupied', name: 'Rohan Singh' }, { number: '3', status: 'available', name: null }] },
  { number: 'B-202', type: 'double', beds: [{ number: '1', status: 'occupied', name: 'Sara Khan' }, { number: '2', status: 'maintenance', name: null }] },
  { number: 'B-203', type: 'double', beds: [{ number: '1', status: 'available', name: null }, { number: '2', status: 'available', name: null }] },
  { number: 'B-204', type: 'triple', beds: [{ number: '1', status: 'occupied', name: 'Pema Rai' }, { number: '2', status: 'occupied', name: 'Maya Gurung' }, { number: '3', status: 'reserved', name: null }] },
  { number: 'B-205', type: 'double', beds: [{ number: '1', status: 'occupied', name: 'Anika Das' }, { number: '2', status: 'occupied', name: 'Karma Lama' }] },
  { number: 'B-206', type: 'triple', beds: [{ number: '1', status: 'occupied', name: 'Tara Shah' }, { number: '2', status: 'available', name: null }, { number: '3', status: 'available', name: null }] },
]);

function getDemoUser() {
  const saved = window.localStorage.getItem('hostel-pulse:demo-session');
  if (!saved) return null;
  const session = JSON.parse(saved) as { user?: { user_metadata?: { full_name?: string; role?: string } } };
  return session.user ?? null;
}

function envelope<T>(data: T, meta: Record<string, unknown> = {}) {
  return { data, meta, error: null };
}

export async function demoApiFetch(path: string, options: RequestInit) {
  await new Promise((resolve) => window.setTimeout(resolve, 180));
  const url = new URL(path, window.location.origin);
  const method = options.method ?? 'GET';

  if (url.pathname.endsWith('/dashboard')) {
    return envelope({
      metrics: {
        residents: 486,
        total_beds: 536,
        occupied_beds: 486,
        available_beds: 42,
        unavailable_beds: 8,
        occupancy_percent: 91,
      },
      blocks: [
        { name: 'Block A', occupied: 144, total: 150 },
        { name: 'Block B', occupied: 132, total: 150 },
        { name: 'Block C', occupied: 137, total: 150 },
        { name: 'Guest wing', occupied: 73, total: 100 },
      ],
      pulse: { score: 84, label: 'Healthy operations' },
      requests: [],
    });
  }

  if (url.pathname.endsWith('/residents') && method === 'GET') {
    const search = (url.searchParams.get('search') ?? '').toLowerCase();
    const nationality = url.searchParams.get('nationality') ?? '';
    const filtered = residents.filter((resident) =>
      (!nationality || resident.nationality === nationality) &&
      `${resident.legal_name} ${resident.university_id} ${resident.room_number ?? ''}`.toLowerCase().includes(search),
    );
    return envelope(filtered, { page: 1, per_page: 20, total: filtered.length, total_pages: 1 });
  }

  if (url.pathname.endsWith('/residents') && method === 'POST') {
    const body = JSON.parse(String(options.body ?? '{}')) as Partial<DemoResident>;
    if (!body.legal_name || !body.university_id || !body.nationality) {
      throw new Error('Name, university ID, and nationality are required.');
    }
    const resident: DemoResident = {
      uuid: `resident-${crypto.randomUUID()}`,
      university_id: body.university_id,
      legal_name: body.legal_name,
      preferred_name: body.preferred_name ?? null,
      nationality: body.nationality,
      course: body.course ?? '',
      semester: body.semester ?? '',
      status: 'approved',
      profile_completion: 55,
      room_number: null,
      bed_number: null,
    };
    residents.unshift(resident);
    saveDemoData('demo-residents', residents);
    return envelope(resident);
  }

  if (url.pathname.endsWith('/rooms') && method === 'GET') {
    const rooms = roomDefinitions.map(({ number, type, beds }) => ({
      uuid: `room-${number}`,
      room_number: number,
      room_type: type,
      capacity: beds.length,
      status: beds.every((bed) => bed.status === 'occupied') ? 'occupied' : 'available',
      building: { code: 'B', name: 'Block B' },
      floor: { number: 2, name: 'Second floor' },
      beds: beds.map((bed) => ({
        uuid: `bed-${number}-${bed.number}`,
        number: bed.number,
        status: bed.status,
        resident: bed.name ? { uuid: `resident-${bed.name}`, name: bed.name } : null,
      })),
    }));
    const demoUser = getDemoUser();
    if (demoUser?.user_metadata?.role === 'student') {
      return envelope(rooms.map((room) => ({
        ...room,
        beds: room.beds.filter((bed) => bed.resident?.name === demoUser.user_metadata?.full_name),
      })).filter((room) => room.beds.length > 0));
    }
    return envelope(rooms);
  }

  if (url.pathname.endsWith('/bed-assignments') && method === 'POST') {
    const body = JSON.parse(String(options.body ?? '{}')) as { student_uuid?: string; bed_uuid?: string };
    const resident = residents.find((item) => item.uuid === body.student_uuid);
    const [, roomNumber, bedNumber] = (body.bed_uuid ?? '').match(/^bed-(.+)-(\d+)$/) ?? [];
    const room = roomDefinitions.find((definition) => definition.number === roomNumber);
    const bed = room?.beds.find((definition) => definition.number === bedNumber);
    if (!resident || resident.room_number || !room || !bed || bed.status !== 'available') {
      throw new Error('Choose an available bed and an unassigned resident.');
    }
    resident.room_number = roomNumber;
    resident.bed_number = bedNumber;
    resident.status = 'checked_in';
    bed.status = 'occupied';
    bed.name = resident.legal_name;
    saveDemoData('demo-residents', residents);
    saveDemoData('demo-rooms', roomDefinitions);
    return envelope({ uuid: `assignment-${crypto.randomUUID()}`, starts_at: new Date().toISOString() });
  }

  throw new Error(`No demo API handler exists for ${method} ${url.pathname}`);
}
