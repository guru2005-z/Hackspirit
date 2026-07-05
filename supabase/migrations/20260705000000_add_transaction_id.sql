-- Add transaction_id column to registrations table
ALTER TABLE public.registrations ADD COLUMN transaction_id TEXT;
