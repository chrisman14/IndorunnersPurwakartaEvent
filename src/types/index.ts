export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  phone?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female';
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  event_date: Date;
  registration_deadline: Date;
  location: string;
  max_participants?: number;
  registration_fee: number;
  category?: string;
  distance?: string;
  image_url?: string;
  status: 'active' | 'cancelled' | 'completed';
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  user_id: number;
  registration_date: Date;
  status: 'registered' | 'cancelled' | 'waitlist';
  payment_status: 'pending' | 'paid' | 'failed';
  bib_number?: string;
  shirt_size?: string;
  special_needs?: string;
}

export interface Activity {
  id: number;
  title: string;
  description?: string;
  activity_date: Date;
  location: string;
  activity_type: 'routine' | 'special';
  max_participants?: number;
  status: 'active' | 'cancelled' | 'completed';
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface Attendance {
  id: number;
  activity_id?: number;
  event_id?: number;
  user_id: number;
  attendance_date: Date;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

export interface EventWithRegistrations extends Event {
  registrations?: EventRegistration[];
  registered_count?: number;
}

export interface ActivityWithAttendance extends Activity {
  attendance?: Attendance[];
  attendance_count?: number;
}