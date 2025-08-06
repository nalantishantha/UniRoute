# Admin Counsellor Management

This module provides comprehensive management of counsellors in the UniRoute platform. Counsellors are invited by administrators and provide student guidance services.

## Features

### 1. Counsellor Invitation System
- **Invite New Counsellors**: Admins can send email invitations to potential counsellors
- **Email Integration**: Automatic invitation emails are sent with account setup instructions
- **Profile Setup**: Invited counsellors can complete their profiles upon accepting invitations

### 2. Counsellor Management
- **List View**: Comprehensive list of all counsellors with filtering and search
- **Detailed View**: Complete counsellor profiles with statistics and recent activity
- **Edit Profiles**: Admins can modify counsellor information and settings
- **Status Management**: Activate/deactivate counsellors and verify their credentials

### 3. Key Features

#### Counsellor Profile Information
- **Personal Details**: Name, email, phone, location
- **Professional Info**: Specialization, experience, qualifications, bio
- **Languages**: Multiple language support
- **Certifications**: Professional certifications and credentials
- **Availability**: Full-time, part-time, weekend, or flexible schedules
- **Hourly Rates**: Counselling session pricing

#### Specialization Areas
- Career Guidance
- Academic Planning
- Mental Health Support
- University Selection
- Scholarship Guidance
- Study Abroad Counselling
- Vocational Training
- Personal Development
- Test Preparation
- Life Skills
- Stress Management
- Time Management

#### Status Management
- **Active/Inactive**: Control counsellor availability
- **Verified/Unverified**: Credential verification status
- **Invitation Status**: Track invitation acceptance

#### Statistics & Analytics
- Total students counselled
- Sessions completed
- Rating and reviews
- Recent session activity

### 4. User Interface

#### Counsellor List
- **Search & Filters**: By name, specialization, experience, location, status
- **Statistics Cards**: Quick overview of counsellor metrics
- **Responsive Grid**: Card-based layout with key information
- **Quick Actions**: View, edit, delete options

#### Counsellor Form (Invitation/Edit)
- **Multi-section Form**: Organized personal and professional information
- **Dynamic Fields**: Add/remove languages and certifications
- **Validation**: Comprehensive form validation
- **Email Integration**: Option to send invitation emails
- **Status Controls**: Manage active and verification status

#### Counsellor View
- **Detailed Profile**: Complete counsellor information display
- **Statistics Panel**: Performance metrics and ratings
- **Recent Activity**: Latest counselling sessions
- **Action Buttons**: Edit profile and management options

### 5. Routes

- `/admin/counsellors` - Counsellor list
- `/admin/counsellors/new` - Invite new counsellor
- `/admin/counsellors/:id` - View counsellor details
- `/admin/counsellors/:id/edit` - Edit counsellor profile

### 6. Components

- **CounsellorsList**: Main listing component with search and filters
- **CounsellorForm**: Form for creating/editing counsellor profiles
- **CounsellorView**: Detailed view of counsellor information

### 7. Design Theme

The counsellor management pages follow the established admin theme:
- **Color Scheme**: Blue gradient theme consistent with other admin pages
- **Layout**: AdminLayout wrapper with sidebar navigation
- **Responsive**: Mobile-friendly design
- **Icons**: Lucide React icons for consistent visual language
- **Forms**: Modern form styling with validation feedback

### 8. Data Management

#### Mock Data Structure
```javascript
{
  id: number,
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  location: string,
  specialization: string,
  experience_years: number,
  qualification: string,
  bio: string,
  availability: 'full-time' | 'part-time' | 'weekend' | 'flexible',
  hourly_rate: number,
  languages: string[],
  certifications: string[],
  is_active: boolean,
  is_verified: boolean,
  total_students: number,
  rating: number,
  sessions_completed: number,
  joined_date: string,
  recent_sessions: Array<{
    date: string,
    student: string,
    topic: string,
    duration: string
  }>
}
```

### 9. Integration Points

- **Navigation**: Integrated in AdminSidebar under "User Management"
- **Routes**: Configured in AdminRoutes.jsx
- **Authentication**: Protected routes requiring admin access
- **Layout**: Uses AdminLayout for consistent admin interface

### 10. Future Enhancements

- **Calendar Integration**: Schedule management for counsellors
- **Video Conferencing**: Integration with meeting platforms
- **Document Management**: File uploads for certifications
- **Payment Integration**: Automated payment processing
- **Notification System**: Real-time notifications for sessions
- **Reporting**: Advanced analytics and reporting features
- **Mobile App**: Dedicated mobile interface for counsellors
