-- ============================================
-- CLEANUP SCRIPT - Run this FIRST in Supabase
-- Deletes ALL data from all tables
-- ============================================

-- Step 1: Delete all data (safe - only deletes from tables that exist)
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Disable foreign key checks temporarily
    EXECUTE 'SET session_replication_role = replica';
    
    -- Delete from all user tables (skip system tables)
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DELETE FROM ' || quote_ident(r.tablename);
        RAISE NOTICE 'Cleared table: %', r.tablename;
    END LOOP;
    
    -- Re-enable foreign key checks
    EXECUTE 'SET session_replication_role = DEFAULT';
END $$;

-- Step 2: Reset all sequences (resets IDs back to 1)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = 'public') LOOP
        EXECUTE 'ALTER SEQUENCE ' || quote_ident(r.sequencename) || ' RESTART WITH 1';
        RAISE NOTICE 'Reset sequence: %', r.sequencename;
    END LOOP;
END $$;

-- Step 3: Verify cleanup
DO $$
DECLARE
    r RECORD;
    v_count INTEGER;
BEGIN
    RAISE NOTICE '=== TABLE COUNTS ===';
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename) LOOP
        EXECUTE 'SELECT COUNT(*) FROM ' || quote_ident(r.tablename) INTO v_count;
        RAISE NOTICE '%: %', rpad(r.tablename, 30), v_count;
    END LOOP;
END $$;

-- Expected output: All counts should be 0
