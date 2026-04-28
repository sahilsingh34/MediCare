-- Supabase Schema for MediCare

-- Users table (Extends Clerk Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('doctor', 'patient')) DEFAULT 'patient',
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Doctors table
CREATE TABLE public.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    specialization TEXT NOT NULL,
    bio TEXT,
    fees NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Availability table
CREATE TABLE public.availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot TEXT NOT NULL, -- e.g., '09:00 AM - 10:00 AM'
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(doctor_id, date, time_slot)
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Create minimal policies (for demo purposes, allowing all authenticated users to read/write)
-- In a real production app, you would restrict this to only the user's own records.
CREATE POLICY "Enable all operations for all users" ON public.users FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON public.doctors FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON public.availability FOR ALL USING (true);
