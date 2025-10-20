# Tutoring Booking and Payment System Implementation

## Overview
This document outlines the complete implementation of the tutoring booking and payment system, which allows students to book recurring tutoring sessions with university student tutors and complete payment through a realistic payment modal.

## Changes Made

### 1. Database Schema Update

#### Modified: `backend/apps/payments/models.py`
- **Changed**: Replaced `session` ForeignKey with `booking` ForeignKey
- **Added fields**:
  - `card_type`: Type of credit/debit card
  - `card_holder_name`: Name on the card
  - `card_last_four`: Last 4 digits of card number (for security)
  - `transaction_id`: Unique transaction identifier

```python
class TutoringPayments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey('students.Students', models.DO_NOTHING)
    booking = models.ForeignKey('tutoring.TutoringBooking', models.DO_NOTHING, db_column='booking_id')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    card_type = models.CharField(max_length=20, blank=True, null=True)
    card_holder_name = models.CharField(max_length=100, blank=True, null=True)
    card_last_four = models.CharField(max_length=4, blank=True, null=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
```

#### Migration
- Generated migration: `payments/migrations/0003_remove_tutoringpayments_session_and_more.py`
- Successfully applied to database

### 2. Backend API Updates

#### Modified: `backend/apps/tutoring/views.py`

**`confirm_tutoring_booking_payment` function:**
- Updated to use `booking` instead of `session` 
- Added support for card payment details (card_type, card_holder_name, card_last_four, transaction_id)
- Removed requirement for transaction_id in initial validation (made optional)
- Payment details are stored in database for record-keeping

**Existing functionality preserved:**
- `get_tutor_available_slots`: Already filters out slots at max capacity
- `create_tutoring_booking`: Creates pending bookings correctly
- Capacity checking prevents overbooking

### 3. Frontend Components

#### Created: `PaymentModal.jsx`
A comprehensive payment modal component with:

**Features:**
- Card type selection (Visa, Mastercard, American Express)
- Cardholder name input
- Card number input with auto-formatting (groups of 4 digits)
- Expiry date selection (month/year dropdowns)
- CVV input with validation
- Real-time form validation
- Payment summary display
- Security notice
- Processing animation during payment
- Error handling and display

**Validation:**
- Required field validation
- Card number format validation (13-19 digits)
- CVV validation (3-4 digits)
- Expiry date validation (prevents expired cards)
- Real-time error messages

**Security Features:**
- Only stores last 4 digits of card
- Transaction ID auto-generation
- Encrypted data notice for users
- No full card number storage

#### Modified: `TutoringSlotBooking.jsx`

**Key Changes:**
1. Removed old payment form (transaction ID input)
2. Integrated PaymentModal component
3. Updated booking flow:
   - Select slot → Fill booking form → Opens payment modal
   - Payment modal captures card details
   - On payment success, booking is confirmed and data inserted into database

**State Management:**
- Removed `showPaymentForm` and `paymentData` states
- Added `showPaymentModal` state
- Enhanced `pendingBooking` to include payment amount and session count

**Functions:**
- `handleBookingSubmit`: Creates booking and opens payment modal
- `handlePaymentSuccess`: Processes payment confirmation and updates booking status
- `resetBookingForm`: Cleans up all form states

### 4. Business Logic

#### Booking Flow
1. **Student selects available time slot** from recurring weekly schedule
2. **Fills booking form** with:
   - Payment type (single/monthly/term with discounts)
   - Start date
   - Topic/subject
   - Learning goals
3. **Booking created** with status = 'pending'
4. **Payment modal opens** automatically
5. **Student enters card details**:
   - Card type
   - Cardholder name
   - Card number
   - Expiry date
   - CVV
6. **Payment processed**:
   - Transaction ID generated
   - Payment record created in `tutoring_payments`
   - Booking status updated to 'confirmed'
7. **Slot capacity updated**: Booked slots with max capacity are hidden from other students

#### No Request/Approval Flow
- Bookings go **directly to "confirmed"** status after payment
- No tutor approval needed
- Sessions appear immediately in "upcoming sessions"
- This streamlines the booking process

#### Capacity Management
- Each tutor availability slot has `max_students` setting
- System tracks active bookings (confirmed/active status)
- When `active_bookings >= max_students`, slot is hidden
- Prevents overbooking automatically

### 5. Payment Packages

| Package Type | Sessions | Discount | Calculation |
|-------------|----------|----------|-------------|
| Single      | 1        | 0%       | Rs. 2000 × 1 = Rs. 2000 |
| Monthly     | 4        | 5%       | Rs. 2000 × 4 × 0.95 = Rs. 7600 |
| Term        | 12       | 10%      | Rs. 2000 × 12 × 0.90 = Rs. 21,600 |

## API Endpoints

### Get Available Slots
```
GET /tutoring/tutors/{tutor_id}/available-slots/
Query params: ?subject_id=<id> (optional)
```

**Response:**
```json
{
  "status": "success",
  "available_slots": [
    {
      "availability_id": 1,
      "day_of_week": 1,
      "start_time": "14:00:00",
      "end_time": "16:00:00",
      "subject_name": "Mathematics",
      "available_spots": 2,
      "total_spots": 5
    }
  ]
}
```

### Create Booking
```
POST /tutoring/bookings/create/
```

**Request:**
```json
{
  "student_id": 1,
  "tutor_id": 2,
  "availability_slot_id": 3,
  "subject_id": 4,
  "topic": "Calculus",
  "description": "Help with derivatives and integrals",
  "payment_type": "monthly",
  "start_date": "2025-11-01",
  "is_recurring": true
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Booking created successfully. Please complete payment to confirm.",
  "booking": {
    "booking_id": 5,
    "status": "pending",
    ...
  },
  "payment_required": {
    "amount": 7600.0,
    "currency": "LKR",
    "sessions": 4,
    "payment_type": "monthly"
  }
}
```

### Confirm Payment
```
POST /tutoring/bookings/{booking_id}/confirm-payment/
```

**Request:**
```json
{
  "amount": 7600.0,
  "payment_method": "visa",
  "card_type": "visa",
  "card_holder_name": "JOHN DOE",
  "card_last_four": "1234",
  "transaction_id": "TXN-1729444800-ABC123XYZ"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Payment confirmed! Your recurring tutoring session is now active.",
  "booking": {
    "booking_id": 5,
    "status": "confirmed",
    ...
  },
  "payment_id": 10
}
```

## Testing Checklist

- [x] Database migration applied successfully
- [x] Backend views updated to use booking_id
- [x] Payment modal component created with validation
- [x] Booking form integrates with payment modal
- [x] Payment details stored in database
- [ ] Test complete flow: select slot → fill form → pay → verify DB insertion
- [ ] Verify slot disappears when max capacity reached
- [ ] Test different payment packages (single, monthly, term)
- [ ] Test form validation (required fields, card number format, etc.)
- [ ] Test error handling (network errors, validation errors)
- [ ] Verify booking appears in student's upcoming sessions

## Future Enhancements

1. **Payment Gateway Integration**: Replace mock payment with real gateway (Stripe, PayPal)
2. **Payment History**: Add view for students to see their payment history
3. **Refund System**: Implement cancellation and refund logic
4. **Email Notifications**: Send confirmation emails after successful booking
5. **Calendar Integration**: Allow students to add sessions to their calendar
6. **Tutor Pricing**: Make session rate dynamic based on tutor's pricing
7. **Multi-currency Support**: Support multiple currencies
8. **Recurring Payments**: Implement automatic recurring payments for monthly/term packages

## Security Considerations

1. **Card Data**: Only last 4 digits stored, never full card number
2. **Transaction IDs**: Unique auto-generated IDs for each transaction
3. **Payment Validation**: Server-side validation of all payment data
4. **HTTPS Required**: All payment endpoints should use HTTPS in production
5. **PCI Compliance**: For real payment processing, ensure PCI DSS compliance
6. **Input Sanitization**: All user inputs are sanitized before database insertion

## Notes for Tutor Registration

Currently, tutors are created manually in the database. Future enhancement will include:
- Tutor self-registration form for university students
- Application review and approval process
- Profile setup with expertise, subjects, and pricing
- Availability schedule configuration

---

**Implementation Date**: October 20, 2025
**Status**: ✅ Complete and Ready for Testing
