# Database Setup Guide# 🗄️ Database Setup Instructions



## 📁 SQL Files in This Folder## Overview



### 1. `init.sql` (DO NOT RUN - Supabase already has tables)This folder contains SQL scripts to initialize and populate the Movie Ticket Reservation System database in Supabase PostgreSQL.

- Contains table creation scripts

- **Only use if starting fresh database from scratch**---

- Supabase already has all tables created

## 📁 Files

### 2. `CLEANUP.sql` ⚠️ (Run FIRST)

- **Purpose:** Deletes ALL existing data### 1. `init.sql` (Required - Run First)

- **When to use:** When you want to start fresh- **Purpose**: Creates the database schema (tables, indexes, constraints, triggers, views)

- **What it does:**- **Contains**: 12 tables, 30+ indexes, 7 triggers, 3 analytics views

  - Deletes all bookings, showtimes, seats, theatres, movies, users- **Run**: ONCE when setting up a new database

  - Resets ID counters back to 1- **Status**: ⚠️ **MUST RUN BEFORE STARTING BACKEND**

  - Verifies all tables are empty

### 2. `sample-data.sql` (Optional - Run Second)

### 3. `FULL_SETUP.sql` ✅ (Run SECOND)- **Purpose**: Populates tables with realistic test data

- **Purpose:** Complete database population- **Contains**: 5 users, 8 movies, 5 theatres, 22 screens, 40+ showtimes, 5000+ seats

- **What it creates:**- **Run**: After `init.sql` for development/testing

  - ✅ 15 movies with real TMDB posters- **Status**: 📝 Optional for production

  - ✅ 3 theatres (all in New York)

  - ✅ 8 screens across theatres---

  - ✅ 195 showtimes (13 per movie - morning, afternoon, evening, night shows)

  - ✅ 19,500 seats (100 seats per showtime, auto-generated)## 🚀 Setup Steps

- **Important:** ALL THEATRES ARE IN THE SAME CITY (New York) to avoid confusion

### Step 1: Access Supabase SQL Editor

---

1. Open your Supabase project: https://app.supabase.com

## 🚀 Step-by-Step Instructions2. Navigate to **SQL Editor** (left sidebar)

3. Click **"New Query"**

### Step 1: Clean Existing Data

1. Open Supabase Dashboard: https://supabase.com/dashboard/project/xmxueskmzxgbozipfspz/sql---

2. Click **New Query**

3. Copy entire content of **`CLEANUP.sql`**### Step 2: Run `init.sql` (REQUIRED)

4. Paste and click **Run** (F5)

5. Wait for success message1. Open `init.sql` in your code editor

6. **Expected output:** All counts should be 02. Copy **all contents** (Ctrl+A, Ctrl+C)

3. Paste into Supabase SQL Editor

### Step 2: Load Fresh Data4. Click **"Run"** or press `Ctrl+Enter`

1. In the same SQL Editor (or new query)5. ✅ Wait for "Success. No rows returned"

2. Copy entire content of **`FULL_SETUP.sql`**

3. Paste and click **Run** (F5)**Expected Result:**

4. Wait ~30 seconds (it's inserting 19,500+ records)```

5. **Expected output:**✅ 12 tables created

   ```✅ 30+ indexes created

   Movies: 15✅ 7 triggers created

   Theatres: 3✅ 3 views created

   Screens: 8```

   Showtimes: 195

   Seats: 19500**Verify:**

   ```- Left sidebar → **Table Editor**

- You should see all 12 tables listed

### Step 3: Verify Data

Scroll down in the results to see a table showing:---

- Movie titles

- Theatre names (PVR Cinemas Downtown, AMC Multiplex, Cineplex IMAX)### Step 3: Run `sample-data.sql` (OPTIONAL)

- City (all "New York")

- Show dates and times1. Click **"New Query"** in SQL Editor

- Prices2. Open `sample-data.sql` in your code editor

- Seat counts (100 per showtime)3. Copy **all contents**

4. Paste into Supabase SQL Editor

---5. Click **"Run"**

6. ✅ Wait for completion (~30 seconds)

## ✅ What Changed from Before

**Expected Result:**

### Problem Fixed:```

- ❌ **Before:** Theatres in different cities (New York, Los Angeles, Chicago)✅ 5 users inserted

- ✅ **Now:** ALL theatres in New York (single city)✅ 8 movies inserted

- **Why:** Frontend was grouping by city causing confusion✅ 5 theatres inserted

✅ 22 screens inserted

### Data Organization:✅ 40+ showtimes inserted

- ❌ **Before:** Multiple SQL files scattered everywhere✅ 5000+ seats generated

- ✅ **Now:** Only 3 files in `resources/db/`:✅ 5 sample bookings created

  1. `init.sql` - Table structure (don't run)```

  2. `CLEANUP.sql` - Delete all data

  3. `FULL_SETUP.sql` - Complete fresh setup**Verify:**

- Table Editor → **users** → Should show 5 rows

---- Table Editor → **movies** → Should show 8 rows

- Table Editor → **showtimes** → Should show 40+ rows

## 🎬 After Running Both Scripts

---

### Test the Application:

1. **Restart Backend** (if needed):### Step 4: Update `application.properties`

   ```powershell

   cd "d:\projects\Movie Ticket Reservation System\movie-booking-backend"1. Open `src/main/resources/application.properties`

   mvn spring-boot:run2. Update these values:

   ```

```properties

2. **Open Frontend:** http://localhost:3000# Replace with your Supabase connection details

spring.datasource.url=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:6543/postgres?sslmode=require

3. **Test Booking Flow:**spring.datasource.username=postgres

   - Click "Movies"spring.datasource.password=YOUR_ACTUAL_PASSWORD

   - Click any movie (e.g., "Dune: Part Two")```

   - Select today's date (2025-10-26)

   - **You should now see THEATRES (not cities!)****How to find these values:**

   - Select a theatre- Supabase → Project Settings → Database

   - **Showtimes should appear!**- Connection string → Transaction mode (port 6543)

   - Click "Select" on any showtime

   - See 10×10 seat grid (100 seats)---

   - Book tickets!

### Step 5: Start the Backend

---

```bash

## 🔄 If You Need to Start Overcd movie-booking-backend

mvn spring-boot:run

Just run both scripts again in order:```

1. `CLEANUP.sql` (clears everything)

2. `FULL_SETUP.sql` (repopulates everything)**Expected Console Output:**

```

---✅ HikariPool-1 - Starting...

✅ HikariPool-1 - Start completed

## 📊 Database Details✅ Started MovieBookingApplication in X.XXX seconds

```

### Theatres (3 total):

- **PVR Cinemas Downtown** - 3 screens (New York)---

- **AMC Multiplex** - 3 screens (New York)

- **Cineplex IMAX** - 2 screens (New York)## 📊 Database Schema



### Showtimes per Movie (13 total):### Tables Created (12)

- **Morning:** 9:00 AM, 9:30 AM, 10:00 AM ($10.99 - $11.99)

- **Afternoon:** 1:00 PM, 2:00 PM, 3:00 PM ($12.99 - $13.99)```

- **Evening:** 6:00 PM, 7:00 PM, 8:00 PM ($15.99 - $16.99)users              - User accounts (authentication, wallet)

- **Night:** 9:30 PM, 10:00 PM ($14.99)movies             - Movie catalog

- **Tomorrow:** 10:00 AM, 6:00 PM (2 shows)theatres           - Cinema locations

screens            - Theatre screens

### Seats per Showtime (100 total):showtimes          - Movie schedules

- **Rows A-C:** Premium seats (price × 1.5)seats              - Individual seats per showtime

- **Rows D-J:** Regular seats (base price)bookings           - Ticket reservations

- **Layout:** 10 rows × 10 columnsbooking_seats      - Seats linked to bookings (junction table)

- **Status:** All AVAILABLE initiallytransactions       - Payment records

reviews            - Movie reviews by users

---notifications      - User notifications

user_settings      - User preferences

**Last Updated:** Just now  ```

**Status:** Ready to use

### Indexes Created (30+)
- Performance optimization for queries
- Email lookups, movie searches, showtime filtering
- Booking history, transaction tracking

### Triggers (7)
- Auto-update `updated_at` timestamp on record modification

### Views (3)
- `daily_revenue` - Revenue analytics by date
- `top_movies` - Most popular movies by bookings
- `theatre_performance` - Theatre revenue analytics

---

## 🔧 Troubleshooting

### Error: "relation already exists"
**Cause**: Tables already created  
**Solution**: 
```sql
-- Run this to reset (WARNING: Deletes all data!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Then run init.sql again
```

### Error: "connection refused"
**Cause**: Wrong port or host  
**Solution**: Use Transaction Pooler (port **6543**, not 5432)

### Error: "password authentication failed"
**Cause**: Incorrect password  
**Solution**: 
- Supabase → Settings → Database → Reset password
- Update `application.properties`

### No data showing after sample-data.sql
**Cause**: init.sql not run first  
**Solution**: Run `init.sql` first, then `sample-data.sql`

---

## 🎯 Login Credentials (After sample-data.sql)

### Admin Account
```
Email: admin@cinemahub.com
Password: admin123
Role: ADMIN
```

### Test User Accounts
```
Email: john.doe@email.com
Password: password123
Wallet: $500

Email: jane.smith@email.com
Password: password123
Wallet: $750

Email: mike.johnson@email.com
Password: password123
Wallet: $1000

Email: sara.williams@email.com
Password: password123
Wallet: $250
```

---

## 📝 Important Notes

### ⚠️ Why Not Use Spring Boot Auto-Creation?

**We're using SQL scripts instead of:**
```properties
spring.jpa.hibernate.ddl-auto=create  ❌ NOT RECOMMENDED
```

**Reasons:**
1. ✅ **Full Control** - Custom PostgreSQL features (triggers, views, indexes)
2. ✅ **Predictable** - Same schema every time
3. ✅ **Version Control** - SQL scripts tracked in git
4. ✅ **Production Safe** - No accidental table drops
5. ✅ **Team Friendly** - Everyone runs same initialization

**Our Configuration:**
```properties
spring.jpa.hibernate.ddl-auto=none  ✅ RECOMMENDED
```

This tells Spring Boot: "Don't create tables, use existing ones"

---

## 🔄 When to Re-run Scripts

### Run `init.sql` again when:
- ❌ Setting up a new environment
- ❌ Resetting the database completely
- ❌ Schema changes (new columns, tables)

### Run `sample-data.sql` again when:
- ❌ Need fresh test data
- ❌ Testing from clean state
- ❌ Demonstrating features

### Never run in production:
- ❌ `sample-data.sql` (use real user data instead)
- ❌ `DROP TABLE` commands

---

## ✅ Success Checklist

Before starting your backend, verify:

- [ ] Supabase project created
- [ ] `init.sql` executed successfully in Supabase
- [ ] 12 tables visible in Table Editor
- [ ] `sample-data.sql` loaded (for development)
- [ ] `application.properties` updated with correct credentials
- [ ] `spring.jpa.hibernate.ddl-auto=none` is set
- [ ] Backend can connect (check console on startup)

---

## 📞 Need Help?

1. **Check Supabase Logs**: Dashboard → Logs
2. **Check Spring Boot Console**: Look for database connection errors
3. **Verify Connection String**: Must use port 6543 with `sslmode=require`
4. **Test Connection**: Use Supabase SQL Editor to run `SELECT version();`

---

## 🎉 You're Ready!

Once both SQL scripts are run and `application.properties` is configured:

1. Start backend: `mvn spring-boot:run`
2. Start frontend: `npm run dev`
3. Login with: `admin@cinemahub.com` / `admin123`
4. Start booking tickets! 🎬

---

**For detailed explanation of why we use two SQL files, see the main project documentation.**
