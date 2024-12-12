# P0 Calendly Design

## User Management

### Registration and Login
- **User Registration**: Users can create an account with a username and password.
- **Secure Login**: Users can log in to their account. Upon successful login, an authentication token is generated and used for secure API access.
- **Authentication Enforcement**: All APIs require authentication to ensure secure access.

## Scheduling

### Create a Schedule
A schedule is a meeting template where users can define their availability and preferences for hosting meetings.

- **Date Range Setup**: Users can specify a range of dates when the schedule will be active.
- **Meeting Duration**: Users can define how long each meeting will last (e.g., 15, 30, or 60 minutes).
- **Time Zone Specification**: Users can set their time zone to ensure accurate scheduling across different regions.
- **Stride Configuration**: Users can define the intervals at which slots are available (e.g., every 15 minutes).
- **Buffer Times**: Users can add buffers before and after meetings to ensure sufficient preparation or recovery time.
- **Day-Based Rules**: Users can define specific time ranges for availability on each day (e.g., 9 AM to 5 PM on weekdays).

### Query Schedule
- **Get Schedule by User ID**: Users can fetch all schedules associated with their user ID for easier management and viewing.

### Query Slots
Users can view available slots for a specific schedule on a particular day.

- **Slot Calculation**: Slots are dynamically generated based on the schedule’s defined rules.
- **Stride Integration**: Slot start times respect the stride settings.
- **Conflict Handling**: Slots overlapping with existing meetings are hidden.
- **Buffer Time Consideration**: Conflicts include buffer times to avoid scheduling back-to-back meetings.
- **Overlap Detection**: Slots with potential conflicts (due to other meetings of the querying user) are flagged for easy identification.

## Meetings

### Create a Meeting
Users can book meetings using available slots from a schedule.

- **Conflict Prevention**: Meetings cannot be booked if there are conflicts with existing meetings or buffer times.
- **Slot Validation**: Meetings must align with valid slots as defined in the schedule.

### Delete a Meeting
Users can delete an existing meeting by providing the meeting ID. This ensures better control and flexibility in managing meetings.

## Future Enhancements

### Enhanced Availability Management
- **Default Availability**: Users can set default availability during onboarding to simplify schedule creation.
- **Separate Availability Profiles**: Users can create multiple availability profiles and select them for different schedules.
- **Custom Date-Specific Availability**: Users can define specific date-based availability, which takes precedence over general day-based rules.

### Extended Slot Querying
- **Multi-Day Slot Query**: Users can query available slots across multiple days for easier planning.

### Calendar Integrations
- **Third-Party Calendar Sync**: Integrate with external calendar apps (e.g., Google Calendar, Outlook) to account for events not scheduled via the app.

### Notifications and Reminders
- **Email Notifications**: Notify participants via email when meetings are created or deleted, along with event details and invitations.
- **Meeting Reminders**: Send reminder emails or notifications at appropriate times before a meeting.

### Rescheduling and Additional Meeting Details
- **Reschedule Meetings**: Allow users to reschedule meetings while respecting the original schedule’s rules.
- **Additional Meeting Information**: Provide options for meeting location or platform (e.g., Google Meet, Zoom, phone calls).


## How to run
- Clone the repository
  ```git clone https://github.com/crazy-atom/calendly.git```
- Ensure that mongodb is running
- Install dependencies `npm install`
- Use env template from `.env.example` to create local `.env` file.
- Run the app `npm start`
- API documentation and example are provided here https://documenter.getpostman.com/view/4132297/2sAYHwKjps

## API Sandbox
- Sandbox is running at https://p0-calendly-icd7.onrender.com
---
