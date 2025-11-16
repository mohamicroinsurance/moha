# Moha Insurance Backend Documentation

## Overview
Complete backend implementation for Moha Insurance using Next.js 16, Prisma, PostgreSQL (Neon), NextAuth.js, and Cloudinary.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL hosted on Neon
- **ORM**: Prisma
- **Authentication**: NextAuth.js with Google OAuth
- **File Storage**: Cloudinary
- **TypeScript**: Full type safety

## Project Structure

```
moha_insurance/
├── app/
│   └── api/
│       ├── auth/[...nextauth]/     # NextAuth routes
│       ├── quotes/                  # Quote CRUD operations
│       ├── claims/                  # Claim CRUD operations
│       ├── whistleblowing/          # Whistleblowing report CRUD
│       ├── applications/            # Job application CRUD
│       ├── news/                    # News article CRUD
│       ├── documents/               # Document CRUD
│       ├── upload/                  # File upload to Cloudinary
│       ├── contact/                 # Contact form submissions
│       └── callback/                # Callback request submissions
├── lib/
│   ├── prisma.ts                   # Database client
│   ├── auth.ts                     # NextAuth configuration
│   ├── cloudinary.ts               # Cloudinary utilities
│   └── api-utils.ts                # API helper functions
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Database migrations
├── types/
│   └── next-auth.d.ts              # NextAuth type definitions
├── middleware.ts                   # Route protection middleware
└── .env                            # Environment variables

```

## Environment Variables

```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Database
DATABASE_URL="postgresql://..."

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Database Schema

### Main Models:
1. **User** - Admin users with role-based access
2. **Account/Session** - NextAuth authentication tables
3. **Quote** - Insurance quote requests
4. **Claim** - Insurance claims
5. **WhistleblowingReport** - Anonymous/named whistleblowing reports
6. **Application** - Job applications
7. **News** - News articles with publish status
8. **Document** - Downloadable documents
9. **ContactRequest** - Contact form submissions
10. **CallbackRequest** - Callback requests

### User Roles:
- `USER` - Regular authenticated user
- `ADMIN` - Admin with full CRUD access
- `SUPER_ADMIN` - Full system access

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with Google OAuth
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### Quotes
- `GET /api/quotes` - List all quotes (paginated, auth required)
- `POST /api/quotes` - Create new quote
- `GET /api/quotes/[id]` - Get single quote
- `PUT /api/quotes/[id]` - Update quote
- `DELETE /api/quotes/[id]` - Delete quote (admin only)

### Claims
- `GET /api/claims` - List all claims (paginated, auth required)
- `POST /api/claims` - Create new claim
- `GET /api/claims/[id]` - Get single claim
- `PUT /api/claims/[id]` - Update claim
- `DELETE /api/claims/[id]` - Delete claim (admin only)

### Whistleblowing
- `GET /api/whistleblowing` - List all reports (auth required)
- `POST /api/whistleblowing` - Submit report (public or authenticated)
- `GET /api/whistleblowing/[id]` - Get single report
- `PUT /api/whistleblowing/[id]` - Update report status
- `DELETE /api/whistleblowing/[id]` - Delete report (admin only)

### Applications
- `GET /api/applications` - List all applications (auth required)
- `POST /api/applications` - Submit job application
- `GET /api/applications/[id]` - Get single application
- `PUT /api/applications/[id]` - Update application status
- `DELETE /api/applications/[id]` - Delete application (admin only)

### News
- `GET /api/news` - List news (public shows published only)
- `POST /api/news` - Create news article (auth required)
- `GET /api/news/[id]` - Get single article
- `PUT /api/news/[id]` - Update article
- `DELETE /api/news/[id]` - Delete article (admin only)

### Documents
- `GET /api/documents` - List all documents
- `POST /api/documents` - Upload document (auth required)
- `GET /api/documents/[id]` - Get single document
- `PUT /api/documents/[id]` - Update document metadata
- `PATCH /api/documents/[id]` - Increment download count
- `DELETE /api/documents/[id]` - Delete document (admin only)

### Utilities
- `POST /api/upload` - Upload file to Cloudinary (auth required)
- `POST /api/contact` - Submit contact form (public)
- `POST /api/callback` - Request callback (public)

## API Response Format

### Success Response:
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

## Authentication Flow

1. User visits `/dashboard/auth/sign-in`
2. Clicks "Continue with Google"
3. Redirected to Google OAuth
4. On success, redirected to `/dashboard`
5. Session stored in database
6. Middleware protects all `/dashboard/*` routes

## Middleware Protection

The middleware automatically:
- Protects all `/dashboard/*` routes
- Redirects unauthenticated users to sign-in
- Prevents authenticated users from accessing auth pages
- Restricts `/dashboard/admin/*` to ADMIN and SUPER_ADMIN roles

## Database Setup

1. **Initialize Prisma**:
   ```bash
   npx prisma init
   ```

2. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **View database in Prisma Studio**:
   ```bash
   npx prisma studio
   ```

## File Upload

Files are uploaded to Cloudinary with automatic optimization:
- Maximum file size: 10MB
- Supports images and documents
- Returns secure URL and public ID
- Organized by folder structure

Example usage:
```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'news-images');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
```

## Security Features

- **Input Sanitization**: All user input is sanitized
- **Email Validation**: Email format validation
- **Role-Based Access Control**: Admin routes protected
- **Session Management**: Secure session handling
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Protection**: Input sanitization removes scripts

## Development

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Access API**:
   - Local: `http://localhost:3000/api/*`

3. **Test endpoints** with tools like:
   - Postman
   - Thunder Client (VS Code)
   - curl

## Production Deployment

1. Set all environment variables
2. Run database migrations
3. Build the application:
   ```bash
   npm run build
   ```
4. Start production server:
   ```bash
   npm start
   ```

## Common Operations

### Create Admin User
After first Google OAuth sign-in, update user role in database:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

### Reset Database
```bash
npx prisma migrate reset
```

### View Logs
Database queries are logged in development mode (see lib/prisma.ts).

## Error Handling

All API routes include try-catch blocks with appropriate error responses:
- 400: Bad Request (validation errors)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## Future Enhancements

- Email notifications (e.g., Resend, SendGrid)
- Real-time updates (e.g., Pusher, Socket.io)
- Rate limiting
- API documentation (e.g., Swagger)
- Advanced analytics
- Bulk operations
- Export functionality (CSV, PDF)
