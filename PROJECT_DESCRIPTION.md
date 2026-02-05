# Dearborn Coffee Club - Full-Stack Web Application

## Project Overview
A comprehensive full-stack web application for a coffee community platform featuring blog posts, coffee shop reviews, interactive mapping, event management, and user administration. Built with modern web technologies and best practices.

---

## Technical Stack

### Frontend
- **Next.js 15.3.4** - React framework with App Router architecture
- **React 19.0.0** - Latest React with server components support
- **TypeScript 5** - Full type safety across the application
- **Tailwind CSS 4** - Modern utility-first CSS framework
- **Radix UI / shadcn/ui** - Accessible component library
- **Phosphor Icons & Lucide React** - Icon libraries
- **Leaflet & React-Leaflet** - Interactive mapping functionality

### Backend & Database
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM 6.10.0** - Type-safe database access layer
- **SQLite** - Lightweight relational database
- **NextAuth.js 4.24.11** - Authentication and session management
- **bcryptjs** - Password hashing and security

### Third-Party Services
- **Cloudinary** - Image upload and CDN service
- **Nominatim (OpenStreetMap)** - Geocoding and address resolution
- **OpenStreetMap Tiles** - Map tile rendering

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Turbopack** - Fast build tool for development
- **PostCSS** - CSS processing

---

## Core Features

### 1. Authentication & Authorization System
- **User Registration** with email validation and confirmation tokens
- **Secure Login** with bcrypt password hashing
- **Password Reset** functionality with token-based recovery
- **Email Confirmation** workflow for account activation
- **Role-Based Access Control (RBAC)** - Admin and User roles
- **Session Management** with NextAuth.js JWT strategy
- **Protected Routes** via middleware for admin and user dashboards
- **Profanity Filter** for username validation

### 2. Content Management System (CMS)
- **Blog Post Creation & Editing** with rich content support
- **Hero Post Feature** - Featured post display on homepage
- **Post Publishing Workflow** - Draft and published states
- **Post Categories** - Organize content by category
- **Keywords/Tags System** - Content tagging and discovery
- **Image Upload** via Cloudinary integration
- **Post Reviews** - Multiple reviewer testimonials per post
- **Post Scoring System** - Rating mechanism for reviews
- **Final Thoughts Section** - Author conclusions

### 3. Coffee Shop Management
- **Coffee Shop Database** - Comprehensive shop information
- **Location Data** - Address, latitude, longitude coordinates
- **Shop Details** - Website, phone, hours, descriptions
- **Shop Images** - Visual representation
- **Post Association** - Link blog posts to specific coffee shops
- **Active/Inactive Status** - Shop visibility management

### 4. Interactive Map System
- **Leaflet Integration** - Interactive map with OpenStreetMap tiles
- **Coffee Shop Markers** - Visual representation of shops on map
- **Post Location Markers** - Display posts with location data
- **Custom Marker Icons** - Branded marker design
- **Map Controls** - Toggle visibility of shops and posts
- **Search Functionality** - Filter shops by name or address
- **Popup Information** - Detailed shop/post info on marker click
- **Geocoding** - Automatic coordinate resolution from addresses

### 5. Event Management System
- **Event Creation & Management** - Admin-controlled event system
- **Event Details** - Title, description, location, date/time
- **RSVP System** - User event registration
- **Attendee Limits** - Maximum capacity management
- **RSVP Status Tracking** - Confirmed and cancelled states
- **Event Publishing** - Draft and published event states
- **User RSVP Dashboard** - Personal event tracking
- **Event Display** - Public event listing page

### 6. Admin Dashboard
- **Post Management** - Full CRUD operations for blog posts
- **User Management** - View, edit, activate/deactivate users
- **Coffee Shop Management** - Create and manage coffee shop listings
- **Event Management** - Create and manage community events
- **Category Organization** - Group posts by category
- **Bulk Operations** - Efficient content management
- **Admin-Only Access** - Protected admin routes

### 7. User Dashboard
- **Personal RSVP Tracking** - View registered events
- **User Profile** - Account information management
- **Event History** - Past and upcoming event participation

### 8. Public-Facing Features
- **Homepage** - Hero post, pinned posts, latest posts grid
- **Blog Listing** - All published posts with pagination
- **Individual Post Pages** - Full post content with reviews
- **Events Page** - Public event calendar and RSVP interface
- **Map Page** - Interactive coffee shop and post location map
- **Search Functionality** - Post search capabilities
- **Responsive Design** - Mobile-first, fully responsive UI

---

## Technical Implementation Highlights

### Architecture
- **App Router Architecture** - Next.js 15 App Router with server components
- **Server-Side Rendering (SSR)** - Optimized page rendering
- **Static Site Generation (SSG)** - Pre-rendered pages for performance
- **API Route Handlers** - RESTful API endpoints
- **Middleware Protection** - Route-level authentication and authorization

### Database Design
- **Relational Database Schema** - Well-structured Prisma models
- **User Management** - Users, roles, tokens, RSVPs
- **Content Models** - Posts, reviews, coffee shops
- **Event System** - Events and RSVP relationships
- **Migration System** - Version-controlled database changes

### Security Features
- **Password Hashing** - bcrypt with salt rounds
- **Token-Based Authentication** - Secure session management
- **Input Validation** - Server-side validation for all inputs
- **Profanity Filtering** - Content moderation
- **SQL Injection Prevention** - Prisma ORM parameterized queries
- **XSS Protection** - React's built-in escaping

### Performance Optimizations
- **Image Optimization** - Next.js Image component with Cloudinary CDN
- **Dynamic Imports** - Code splitting for map components
- **Lazy Loading** - On-demand component loading
- **Database Indexing** - Optimized queries with Prisma
- **Turbopack** - Fast development builds

### User Experience
- **Modern UI Design** - Coffee-themed color palette and styling
- **Responsive Layout** - Mobile, tablet, and desktop optimization
- **Loading States** - User feedback during async operations
- **Error Handling** - Graceful error messages
- **Form Validation** - Real-time input validation
- **Accessibility** - Semantic HTML and ARIA attributes

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth authentication
- `GET /api/auth/confirm` - Email confirmation
- `POST /api/auth/forgot` - Password reset request
- `POST /api/auth/reset` - Password reset

### Posts
- `GET /api/posts` - List all posts (with filters)
- `POST /api/posts` - Create new post
- `PUT /api/posts` - Update existing post
- `GET /api/posts/search` - Search posts
- `POST /api/posts/publish` - Publish/unpublish post
- `POST /api/posts/hero` - Set hero post
- `GET /api/posts/[id]/reviewers` - Get post reviewers

### Coffee Shops
- `GET /api/coffee-shops` - List all coffee shops
- `POST /api/coffee-shops` - Create coffee shop
- `PUT /api/coffee-shops` - Update coffee shop

### Events
- `GET /api/events` - List all events
- `POST /api/events/rsvp` - RSVP to event
- `GET /api/user/rsvps` - Get user's RSVPs

### Admin
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users` - Update user (activate/deactivate, role)
- `GET /api/admin/events` - Admin event management
- `POST /api/admin/create-admin` - Create admin user

---

## Database Schema

### Models
- **User** - User accounts with roles and authentication
- **Post** - Blog posts with content, images, and metadata
- **PostReview** - Reviewer testimonials for posts
- **CoffeeShop** - Coffee shop information and locations
- **Event** - Community events with details
- **RSVP** - User event registrations
- **Token** - Email confirmation and password reset tokens

### Relationships
- Users → RSVPs → Events (many-to-many)
- Posts → CoffeeShops (many-to-one)
- Posts → PostReviews (one-to-many)
- Users → Tokens (one-to-many)

---

## Development Workflow

### Scripts
- `npm run dev` - Development server with Turbopack
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - ESLint code checking

### Database Management
- Prisma migrations for schema changes
- Seed scripts for initial data
- Admin creation utilities

---

## Deployment Considerations

### Environment Variables
- Database connection strings
- NextAuth secret keys
- Cloudinary API credentials
- Email service configuration

### Production Optimizations
- Image CDN via Cloudinary
- Database connection pooling
- Caching strategies
- Error monitoring
- Performance monitoring

---

## Skills Demonstrated

### Frontend Development
- React 19 with Server Components
- Next.js App Router architecture
- TypeScript type safety
- Responsive CSS with Tailwind
- Component composition and reusability
- State management (React hooks)
- Form handling and validation
- Image optimization
- Interactive maps integration

### Backend Development
- RESTful API design
- Server-side rendering
- Authentication and authorization
- Database design and ORM usage
- Security best practices
- Error handling and validation
- File upload handling
- Geocoding integration

### Full-Stack Integration
- Seamless frontend-backend communication
- Real-time data updates
- Protected route implementation
- Session management
- Role-based access control

### DevOps & Tools
- Version control (Git)
- Database migrations
- Environment configuration
- Build optimization
- Code quality tools (ESLint)

---

## Additional Features & Enhancements

### Content Features
- Reading time calculation
- Time-ago display formatting
- Post categorization
- Keyword/tag system
- Hero post rotation
- Pinned post sections

### User Experience
- Loading states and spinners
- Error message handling
- Form validation feedback
- Responsive navigation
- Search functionality
- Filter and sort options

### Admin Tools
- Bulk content management
- User activation/deactivation
- Role management
- Content publishing workflow
- Coffee shop CRUD operations
- Event management interface

---

## Project Statistics

- **Total API Routes**: 15+ endpoints
- **Database Models**: 7 models with relationships
- **Pages**: 10+ routes
- **Components**: 15+ reusable components
- **Authentication Methods**: Credentials-based with NextAuth
- **Third-Party Integrations**: 3 (Cloudinary, Nominatim, OpenStreetMap)
- **Migration History**: 13+ database migrations

---

## Resume Bullet Points

### For Software Engineer / Full-Stack Developer Roles:

• **Developed a full-stack coffee community platform** using Next.js 15, React 19, TypeScript, and Prisma ORM, featuring blog posts, interactive maps, event management, and user administration

• **Implemented comprehensive authentication system** with NextAuth.js, including user registration, email confirmation, password reset, and role-based access control (Admin/User roles)

• **Built interactive mapping system** using Leaflet and React-Leaflet, integrating OpenStreetMap tiles, geocoding services, and custom markers for coffee shop and post location visualization

• **Designed and developed RESTful API** with 15+ endpoints handling posts, events, coffee shops, user management, and RSVP functionality with proper error handling and validation

• **Created admin dashboard** with full CRUD operations for content management, user administration, coffee shop management, and event coordination with real-time updates

• **Integrated third-party services** including Cloudinary for image uploads/CDN, Nominatim for geocoding, and implemented secure file upload workflows

• **Implemented database schema** with Prisma ORM managing 7 relational models (Users, Posts, Events, Coffee Shops, RSVPs, Reviews, Tokens) with proper migrations and relationships

• **Developed responsive UI** with Tailwind CSS, implementing mobile-first design, accessibility features, and modern component architecture with shadcn/ui

• **Built event management system** with RSVP functionality, attendee tracking, capacity management, and user dashboard for event participation history

• **Applied security best practices** including password hashing with bcrypt, input validation, profanity filtering, SQL injection prevention, and XSS protection

---

## Additional Context for Interviews

### Technical Decisions
- **Why Next.js App Router**: Leveraged server components for better performance and SEO
- **Why Prisma**: Type-safe database access with excellent developer experience
- **Why SQLite**: Lightweight for development, easily migratable to PostgreSQL for production
- **Why Cloudinary**: Reliable image CDN with automatic optimization
- **Why Leaflet**: Open-source mapping solution with extensive customization options

### Challenges Solved
- **Geocoding Integration**: Implemented address-to-coordinates conversion for map markers
- **Image Upload Workflow**: Seamless Cloudinary integration with form handling
- **Role-Based Routing**: Middleware-based protection for admin and user routes
- **Event RSVP System**: Prevented duplicate RSVPs and managed capacity limits
- **Map Performance**: Dynamic imports and lazy loading for map components

### Future Enhancements (Potential Additions)
- Real-time notifications
- Social features (comments, likes, shares)
- Advanced search with filters
- Email newsletter integration
- Analytics dashboard
- Mobile app (React Native)
- Payment integration for events
- Multi-language support

---

## Technologies Summary

**Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Leaflet, Radix UI  
**Backend**: Next.js API Routes, Prisma ORM, NextAuth.js  
**Database**: SQLite (with Prisma)  
**Services**: Cloudinary, Nominatim, OpenStreetMap  
**Tools**: ESLint, Turbopack, PostCSS  
**Deployment**: Vercel-ready (Next.js optimized)

---

*This project demonstrates proficiency in modern full-stack web development, from database design to user interface implementation, with a focus on security, performance, and user experience.*
