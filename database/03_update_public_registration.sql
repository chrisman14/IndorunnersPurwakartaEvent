-- Update database schema untuk mendukung pendaftaran public tanpa user account

-- Modifikasi tabel event_registrations untuk menyimpan data peserta lengkap
ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS registration_id VARCHAR(50) UNIQUE,
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
ADD COLUMN IF NOT EXISTS registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'pending';

-- Update status untuk mencakup status verifikasi pembayaran
-- Status options: 'pending_payment', 'confirmed', 'cancelled', 'payment_verified'

-- Buat index untuk pencarian yang lebih cepat
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_registration_id ON event_registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);

-- Contoh data yang akan disimpan:
/*
INSERT INTO event_registrations (
  event_id, 
  registration_id, 
  full_name, 
  email, 
  phone, 
  birth_date, 
  gender,
  emergency_contact_name, 
  emergency_contact_phone, 
  t_shirt_size,
  special_needs,
  payment_proof_url,
  status,
  registered_at
) VALUES (
  1,                                    -- event_id
  'REG1730123456',                     -- registration_id
  'John Doe',                          -- full_name
  'john@example.com',                  -- email
  '08123456789',                       -- phone
  '1990-01-01',                       -- birth_date
  'male',                             -- gender
  'Jane Doe',                         -- emergency_contact_name
  '08987654321',                      -- emergency_contact_phone
  'L',                                -- t_shirt_size
  'No special needs',                 -- special_needs
  '/uploads/payment-proofs/proof123.jpg', -- payment_proof_url
  'pending_payment',                  -- status
  NOW()                              -- registered_at
);
*/