# Society Maintenance Managing System

A fully functional web application for managing residential society operations with complete backend integration. The system includes resident management, billing, notices, and complaint handling with real-time data synchronization.

## Current Status: ✅ FULLY FUNCTIONAL
- Backend database fully connected
- All admin functions operational
- Real-time data management
- Complete CRUD operations for all entities

## Features

### Admin/Secretary Portal ✅ COMPLETE
- **Registration & Login**: Secure authentication with Trickle database
- **Dashboard**: Live statistics showing resident counts, pending bills, and complaints
- **Resident Management**: Complete resident registration and management system
- **Flat Registration**: Register flats with automatic status tracking
- **Bill Generation**: Create and manage maintenance, utility, and parking bills
- **Notice Management**: Post and manage society announcements with priority levels
- **Complaint Handling**: View, respond to, and track resident complaints
- **Water Schedule Management**: Set and manage water supply timings
- **Staff Management**: Manage staff members and salary payments
- **Feedback System**: View and manage feedback from external users
- **Developer Portal**: Secure admin management system for system administrators

### Resident Portal ✅ COMPLETE
- **Registration & Login**: Secure authentication with Trickle database
- **Dashboard**: Live statistics showing pending bills, notices, and complaints
- **Bill Payment**: View bills and make UPI payments with QR code
- **UPI Payment System**: Scan QR code with any UPI app (Google Pay, PhonePe, Paytm, BHIM)
- **Transaction Verification**: Enter transaction ID to verify and complete payment
- **Notice Viewing**: View society notices and announcements
- **Complaint Management**: Submit and track complaints with admin responses
- **Water Schedule**: View water supply timings

### Database Integration ✅ COMPLETE
- **Admin Table**: Stores admin/secretary information with unique registration numbers
- **Flat Table**: Manages flat details, occupancy status, and specifications
- **Resident Table**: Complete resident profiles linked to flats
- **Bill Table**: Billing system with payment tracking and due dates
- **Notice Table**: Announcement system with priority and expiry management
- **Complaint Table**: Full complaint workflow with admin responses
- **Feedback Table**: Contact form submissions with society-specific filtering
- **Developer Credentials Table**: Secure developer access management

### Authentication System ✅ OPERATIONAL
- **Admin/Secretary**: Registration number + password authentication against database
- **Session Management**: Secure login sessions with building-specific access control
- **Authorization**: Role-based access with proper data filtering by building

## Pages Structure

1. **index.html** - Landing page with system introduction and navigation
2. **admin-register.html** - Admin/Secretary registration with database storage
3. **admin-login.html** - Admin/Secretary login with database authentication
4. **admin-dashboard.html** - Complete administrative dashboard with live data
5. **resident-login.html** - Resident login portal with database authentication
6. **resident-dashboard.html** - Resident dashboard with bills, notices, and complaints
7. **upi-payment.html** - UPI payment page with QR code generation and verification
8. **contact.html** - Public contact and feedback form for external users
9. **developer-login.html** - Secure developer access portal
10. **developer-dashboard.html** - System administration dashboard for developers

## Technology Stack

- React 18 for component-based UI
- TailwindCSS for responsive styling
- Lucide icons for consistent iconography
- Local Storage for data persistence (Standalone Version)
- QRCode.js for UPI payment QR code generation
- jsPDF for receipt generation

## Database Schema

### Admin Table
- name, building, registrationNo, email, mobile, password

### Flat Table
- flatNumber, building, floor, flatType, area, status (occupied/vacant/maintenance)

### Resident Table
- name, email, mobile, password, flatNumber, building, ownerType, familyMembers

### Bill Table
- flatNumber, building, billType, amount, dueDate, status, month, description

### Notice Table
- title, content, priority, building, adminId, expiryDate

### Complaint Table
- residentName, flatNumber, building, subject, description, category, status, priority, adminResponse

## Sample Data

The system comes pre-loaded with sample data including:
- Demo admin account (ADM001)
- Sample flats and residents
- Example bills and notices
- Test complaints for demonstration

## Deployment

The application is successfully deployed and fully operational with complete backend connectivity.
