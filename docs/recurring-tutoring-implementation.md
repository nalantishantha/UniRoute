# Recurring Tutor Booking & Availability Management System

## Overview
This implementation provides a complete recurring tutoring booking system where tutors can set up weekly availability slots and students can book recurring tutoring sessions with upfront payment.

## Features Implemented

### Backend (Django - Tutoring App Only)

#### 1. Models (`tutoring/models.py`)
- **TutorAvailability**: Manages recurring weekly time slots for tutors
  - Fields: tutor (ForeignKey), day_of_week (0-6), start_time, end_time, is_recurring, max_students, subject, is_active
  - Supports multiple students per slot
  - Can be subject-specific or general

- **TutoringBooking**: Manages recurring student bookings
  - Fields: student, tutor, availability_slot, subject, start_date, end_date, status, payment_type, sessions_paid, sessions_completed
  - Status: pending → confirmed → active → completed/cancelled
  - Payment types: single, monthly (4 sessions), term (12 sessions)
  - Tracks payment and session completion

#### 2. API Endpoints (`tutoring/views.py` & `tutoring/urls.py`)

**Tutor Availability Management:**
- `GET/POST/PUT/DELETE /api/tutoring/availability/<tutor_id>/`
  - Create, read, update, delete recurring availability slots
  - Prevents deletion of slots with active bookings

- `GET /api/tutoring/tutors/available/`
  - Get tutors with available slots
  - Filter by subject and day of week

- `GET /api/tutoring/available-slots/<tutor_id>/`
  - Get available slots for a specific tutor
  - Shows remaining capacity per slot
  - Filter by subject

**Booking Management:**
- `POST /api/tutoring/bookings/create/`
  - Create a recurring booking (status: pending)
  - Validates slot availability and capacity
  - Returns payment information

- `POST /api/tutoring/bookings/<booking_id>/confirm-payment/`
  - Confirm payment and activate booking
  - Creates payment record in TutoringPayments
  - Changes status from pending to confirmed

- `POST /api/tutoring/bookings/<booking_id>/cancel/`
  - Cancel a booking
  - Frees up the slot for other students

- `GET /api/tutoring/bookings/student/<student_id>/`
  - Get all bookings for a student
  - Filter by status

- `GET /api/tutoring/bookings/tutor/<tutor_id>/`
  - Get all bookings for a tutor
  - Filter by status

#### 3. Serializers (`tutoring/serializers.py`)
- TutorAvailabilitySerializer: Includes day names, subject names, current bookings count
- TutoringBookingSerializer: Includes student/tutor names, time slot information
- TutorDetailSerializer: Complete tutor information with available slots

#### 4. Admin Interface (`tutoring/admin.py`)
- Full admin panels for TutorAvailability and TutoringBooking
- List displays with filters and search
- Readonly fields for audit trails

### Frontend (React)

#### 1. API Utility (`utils/tutoringAPI.js`)
- Complete API wrapper for all tutoring endpoints
- Error handling
- Async/await pattern

#### 2. Components

**TutoringAvailabilityManager** (`components/TutoringAvailability/TutoringAvailabilityManager.jsx`)
- Used by tutors to manage recurring availability
- Create/edit/delete availability slots
- Set day, time, max students, subject, recurring flag
- Visual display grouped by day of week
- Shows current bookings per slot

**TutoringSlotBooking** (`components/TutoringAvailability/TutoringSlotBooking.jsx`)
- Used by students to book recurring tutoring
- Browse available slots grouped by day
- Select slot and fill booking form
- Choose payment type (single/monthly/term)
- Two-step process: Create booking → Complete payment
- Real-time availability updates

#### 3. Pages

**CalendarPage** (`pages/UniStudents/Calendar/CalendarPage.jsx`)
- Updated to show two sections:
  1. **Mentoring Availability**: Existing one-time session management
  2. **Tutoring Availability (Recurring)**: New recurring slot management
- Clear separation between mentoring and tutoring

**TutorBooking** (`pages/Student/TutorBooking.jsx`)
- Updated to use TutoringSlotBooking component
- Shows tutor information and available recurring slots
- Handles booking flow with payment

## Payment Integration

### Payment Flow
1. Student selects slot and creates booking → Status: **pending**
2. System calculates amount based on payment type:
   - Single: Base rate (Rs. 2000)
   - Monthly (4 sessions): 5% discount
   - Term (12 sessions): 10% discount
3. Student completes payment with transaction ID
4. Backend creates TutoringPayments record
5. Booking status changes to **confirmed**
6. Slot remains reserved for that student every week

### Payment Models
- Uses existing `TutoringPayments` model in payments app
- Links to student and stores amount, method, transaction time
- No session field for recurring bookings (different from one-time sessions)

## Database Schema

### New Tables
1. **tutor_availability**
   - Primary key: availability_id
   - Indexes: tutor_id, day_of_week, subject_id
   - Unique constraint: (tutor, day_of_week, start_time, end_time, subject)

2. **tutoring_bookings**
   - Primary key: booking_id
   - Foreign keys: student, tutor, availability_slot, subject
   - Indexes: student_id, tutor_id, status, start_date

## Key Differences from Mentoring System

| Feature | Mentoring | Tutoring |
|---------|-----------|----------|
| Booking Type | One-time sessions | Recurring weekly |
| Availability | Date-specific slots | Day-of-week slots |
| Capacity | 1 student per slot | Multiple students per slot |
| Payment Timing | After first meeting | Before confirmation |
| Payment Options | Single session | Single/Monthly/Term packages |
| App Location | mentoring app | tutoring app |
| Models | MentorAvailability, MentoringSession | TutorAvailability, TutoringBooking |

## Usage Instructions

### For Tutors (University Students)

1. **Set Up Availability**
   - Go to Calendar & Availability → Availability Management tab
   - Scroll to "Tutoring Availability (Recurring)" section
   - Click "Add Slot"
   - Select day of week, time range, max students, and optionally a subject
   - Check "Recurring Weekly" and "Active"
   - Save

2. **Manage Bookings**
   - View bookings in the system
   - Track sessions completed
   - Cannot delete slots with active bookings

### For Students

1. **Find Tutors**
   - Browse tutors and view their profiles
   - Click "Book Session" on a tutor

2. **Book Recurring Tutoring**
   - View available recurring slots grouped by day
   - Filter by subject if needed
   - Select a time slot that fits your schedule
   - Choose payment type (single/monthly/term)
   - Set start date for first session
   - Enter topic and learning goals
   - Proceed to payment

3. **Complete Payment**
   - Review booking summary
   - Select payment method
   - Enter transaction ID
   - Confirm payment
   - Booking is now active!

## Deployment Steps

1. **Backend**
   ```bash
   cd backend
   python manage.py makemigrations tutoring
   python manage.py migrate
   python manage.py collectstatic
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Test**
   - Create a tutor availability slot
   - Book it as a student
   - Complete payment
   - Verify slot is no longer available to other students

## Future Enhancements

1. **Automatic Session Generation**
   - Cron job to create actual TutoringSessions from TutoringBookings
   - Weekly session reminders

2. **Payment Gateway Integration**
   - Stripe/PayPal integration
   - Automatic payment capture
   - Refund handling

3. **Calendar Integration**
   - Export to Google Calendar / Outlook
   - Sync with external calendars

4. **Advanced Features**
   - Student can pause/resume recurring booking
   - Tutor can mark sessions as attended/absent
   - Rating system after each session
   - Automatic refunds for missed sessions

5. **Analytics**
   - Revenue tracking
   - Popular time slots
   - Student retention metrics

## Testing Recommendations

1. Test slot capacity limits
2. Test payment flow end-to-end
3. Test concurrent bookings (race conditions)
4. Test cancellation and refund logic
5. Test date/time handling across timezones
6. Test subject filtering
7. Test validation errors

## Notes

- All tutoring functionality is isolated in the `tutoring` app
- No modifications to mentoring app or other apps
- Payment records stored in existing payments app tables
- Uses same authentication and user management as rest of platform
- Follows existing UI/UX patterns from mentoring system
