# Spark Course Suite

Lovable Prompt: Coaching/Course Platform Template

Main Request

Create a modern, professional, responsive coaching and online course platform template. This is a digital product template that coaches, yoga instructors, mental health practitioners, and educators can purchase and customize for their own business.

Project Overview

Purpose: A complete web application template for coaches/educators to:

Showcase their courses/services

Allow students to enroll and purchase

Track student progress

Deliver course content (lessons, modules)

Manage resources and materials

Build a professional online presence

Target Users: The CUSTOMERS who will buy this template are: coaches, yoga instructors, mental health practitioners, educators, consultants

Technology Stack:

React (Frontend)

Responsive design (mobile, tablet, desktop)

Modern UI with Tailwind CSS

Mock payment integration (show Stripe flow)

Local storage for demo data (no backend required initially)

Pages & Features Required

1. Landing/Home Page

Hero section with compelling headline about courses/coaching

Brief description of what the platform offers

Featured courses carousel (show 3-4 top courses)

Instructor/coach bio section with photo

Testimonials/reviews section (sample data)

Call-to-action buttons for "Browse Courses" and "Get Started"

Footer with links

2. Courses Catalog/Browse Page

Grid layout showing all available courses

Each course card should display:

Course title

Instructor name

Course image/thumbnail

Brief description (2-3 lines)

Price

Student count / enrollment numbers

Rating/stars

"View Course" or "Enroll Now" button

Filter options:

By category (Yoga, Mental Health, Business, etc.)

By price range

By rating

Search bar to find courses

Sort options (newest, most popular, best rated, price low-to-high)

3. Course Detail Page

Full course information:

Large course image/hero

Course title

Instructor profile (name, photo, bio, social links)

Price (display prominently)

Star rating and review count

Course description (detailed, can be long)

Learning outcomes/what you'll learn (bullet points)

Course curriculum with:

Module 1, 2, 3... (expandable)

Each module shows lesson titles and duration

Requirements/prerequisites (if any)

Number of students enrolled

Level (Beginner, Intermediate, Advanced)

Sidebar or section with:

"Enroll Now" button (prominent)

Share buttons (social media)

Questions section (FAQ-style)

"Money-back guarantee" badge

Student reviews section (show sample reviews with ratings)

4. Student Dashboard (After login/enrollment)

Welcome message with student name

"My Courses" section showing:

All enrolled courses as cards

Progress bar for each course (% complete)

"Continue Learning" button

Last accessed date

Quick stats:

Total courses enrolled

Overall completion percentage

Hours spent learning

Recommended courses based on interests

Notifications/updates (new lessons, etc.)

5. Course Player/Learning Page

Split layout:

Left: Video player area (show placeholder video)

Right: Course curriculum/modules sidebar

Current module highlighted

Lessons with checkmarks for completed

Click to switch between lessons

Video section showing:

Video placeholder

Play button

Duration

Lesson title

Below video:

Lesson title and description

Resources to download (PDFs, files)

Timestamps/notes area

"Mark as complete" button

Previous/Next lesson navigation buttons

Progress indicator (showing which lesson in which module)

6. User Profile/Account Page

Profile information section:

Profile picture

Name, email, phone

Bio/about me

"Edit Profile" button

Course history:

Completed courses

In-progress courses

Wishlist

Account settings:

Password change

Email preferences

Notification settings

Download certificates (for completed courses)

7. Checkout/Payment Page (Mock)

Course summary (title, price)

Enrollment details

Payment method selection (show Stripe form fields as mock)

Promo code input

Total price calculation

"Complete Purchase" button (simulate success)

Security badges (SSL, safe checkout, etc.)

8. Login/Signup Page

Two tabs: "Sign In" and "Sign Up"

Sign in form:

Email

Password

"Remember me" checkbox

"Forgot password?" link

Sign up form:

Name

Email

Password

Confirm password

Terms & conditions checkbox

Social login options (show buttons for Google, Facebook as mock)

Redirect after login to dashboard

9. Instructor/Coach Profile Page (Public-facing)

Large profile header with:

Profile photo

Name and title/specialty

Bio (can be long)

Social media links

Verification badge

Stats section:

Total students

Total courses

Average rating

Years of experience

All courses by this instructor

Testimonials from students

"Follow" or "Contact" button

CTA: "View All Courses" or "Book a Session"

Design & UX Requirements

Visual Style

Color scheme: Professional, calming colors suitable for coaching (suggest: blues, teals, whites, soft grays)

Typography: Modern, clean fonts (system fonts or Google Fonts like Inter, Poppins)

Spacing: Good whitespace, not cluttered

Buttons: Rounded corners, hover effects, clear CTAs

Responsive Design

Mobile-first approach

Perfect on phone (375px), tablet (768px), desktop (1440px)

Touch-friendly buttons and inputs

Navigation that adapts to screen size (hamburger menu on mobile)

Navigation

Header navigation bar that sticks to top

Logo/brand name on left

Menu items: Home, Courses, About, Contact

User account icon (top right) when logged in

Search bar on desktop (hidden on mobile with search icon)

Accessibility

Proper heading hierarchy

Alt text for images

Keyboard navigation support

Good color contrast

Sample Data to Include

Courses (create 5-8 sample courses):

"Beginner Yoga for Flexibility" - $29

"Mindfulness & Mental Health Basics" - $39

"Meditation Masterclass" - $49

"Stress Management for Professionals" - $35

"Advanced Yoga: Power Flow" - $45

Instructors (create 2-3 sample instructors):

Sarah Johnson - Yoga & Wellness Coach

Dr. Michael Chen - Mental Health Specialist

Emma Rodriguez - Life Coach

Sample Lessons (per course):

Each course should have 3-5 modules

Each module should have 2-4 lessons

Show realistic lesson titles and durations (5-20 minutes)

Reviews:

Show 3-5 sample student reviews per course

Vary ratings from 4-5 stars

Interactive Features

Must-have interactions:

✅ Click course to see details

✅ "Enroll Now" button (go to checkout mock)

✅ Login/signup (mock authentication, store in localStorage)

✅ Switch between lessons in course player

✅ Mark lesson as complete (visual feedback)

✅ Filter and search courses

✅ Toggle between course sections (expandable modules)

✅ Responsive menu on mobile

✅ Smooth transitions between pages

Technical Specifications

Frontend Stack:

React with functional components and hooks

React Router for navigation

Tailwind CSS for styling

useState/useReducer for state management

localStorage for persistent demo data

Responsive images

No Backend Required:

Use mock data (JavaScript objects/arrays)

localStorage for user sessions and enrollments

Mock payment flow (don't actually process payments)

Simulate API responses with setTimeout

Performance:

Fast page load (lazy load images)

Smooth animations

Optimize for Core Web Vitals

Customization Points (Highlight for user to modify later)

These should be easy to customize in VS Code:

[ ] Brand colors (define as CSS variables or Tailwind config)

[ ] Logo and images (easy to swap)

[ ] Course data (simple JSON-like structure)

[ ] Instructor information

[ ] Pricing

[ ] Text content (hero copy, descriptions)

[ ] Social media links

[ ] Contact information

[ ] Company branding (name, email, etc.)

Deliverables Checklist

Make sure Lovable creates:

✅ All 9 pages/sections listed above

✅ Fully functional navigation between pages

✅ Responsive design (test on all screen sizes)

✅ Sample data populated throughout

✅ Login/signup flow (mock)

✅ Course enrollment flow (mock)

✅ Course player with lesson switching

✅ Progress tracking UI

✅ Modern, professional design

✅ No errors in console

✅ Ready to be exported and modified

Project Goals

This template should be:

Production-ready-looking (professional appearance)

Fully functional (all features work as mocked)

Easily customizable (instructor can change content easily)

Mobile-responsive (looks great everywhere)

Modern (current design trends, no outdated look)

Fast and smooth (good performance, no lag)

Important Notes for Lovable

Use Tailwind CSS for all styling (no inline styles if possible)

Make sure all images have proper alt text

Use React best practices (no unnecessary re-renders)

Keep components modular and organized

Add comments in code where appropriate

Make sure all buttons have clear labels

Test all links and navigation thoroughly

Use semantic HTML where possible

Final Notes

This template will be sold as a digital product to coaches and educators. They will buy it and customize it with their own content. Therefore:

Make it look professional and trustworthy

Ensure it's easy to understand where to customize things

Make the demo content realistic and inspiring

Include realistic pricing examples

Show how powerful the platform can be with sample data

Good luck! 🚀

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/01195b21-99ab-4d68-8493-e7e88522d376).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
