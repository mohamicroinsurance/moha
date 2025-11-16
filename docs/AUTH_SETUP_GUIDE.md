# Authentication Setup Guide - Moha Insurance

## ✅ What's Working Now

The authentication system is **fully functional** with the following features:

### 🔐 Google OAuth Integration
- ✅ Sign-in with Google button on `/dashboard/auth/sign-in`
- ✅ Sign-up with Google button on `/dashboard/auth/sign-up`
- ✅ Automatic user creation on first sign-in
- ✅ Session management with database
- ✅ Redirect to dashboard after successful authentication
- ✅ Protected dashboard routes via middleware

### 🛡️ Security Features
- ✅ Middleware protects all `/dashboard/*` routes
- ✅ Authenticated users can't access auth pages
- ✅ Role-based access control (USER, ADMIN, SUPER_ADMIN)
- ✅ Session stored in PostgreSQL database
- ✅ Secure session tokens

## 🚀 How to Use

### 1. Start Development Server
```bash
npm run dev
```

### 2. Access the Dashboard
Navigate to: `http://localhost:3000/dashboard`

You'll automatically be redirected to: `http://localhost:3000/dashboard/auth/sign-in`

### 3. Sign In with Google
1. Click the **"Continue with Google"** button
2. Select your Google account
3. Grant permissions
4. You'll be redirected to `/dashboard`
5. A new user account is created automatically in the database

### 4. Make Yourself Admin
After first sign-in, you need admin permissions:

```bash
npx prisma studio
```

In Prisma Studio:
1. Go to the **User** table
2. Find your user record (by email)
3. Change the `role` field from `USER` to `ADMIN` or `SUPER_ADMIN`
4. Save changes
5. Sign out and sign back in

## 🔧 Configuration Details

### NextAuth Configuration
Located in: `lib/auth.ts`

```typescript
- Provider: Google OAuth
- Adapter: Prisma (database sessions)
- Session Strategy: Database-backed
- Session Duration: 30 days
- Sign-in Page: /dashboard/auth/sign-in
```

### Middleware Protection
Located in: `middleware.ts`

```typescript
- Protected Routes: /dashboard/*
- Excluded: /dashboard/auth/*
- Admin Routes: /dashboard/admin/* (requires ADMIN role)
- Redirects unauthenticated users to sign-in
```

### Environment Variables
Located in: `.env`

```env
✅ NEXTAUTH_URL="http://localhost:3000"
✅ NEXTAUTH_SECRET="[generated-secret]"
✅ AUTH_GOOGLE_ID="[your-google-client-id]"
✅ AUTH_GOOGLE_SECRET="[your-google-client-secret]"
```

## 🎯 Google OAuth Setup

If you need to configure Google OAuth from scratch:

### 1. Go to Google Cloud Console
https://console.cloud.google.com/

### 2. Create or Select Project
- Create new project or select existing one
- Enable "Google+ API"

### 3. Configure OAuth Consent Screen
- User Type: External
- App name: Moha Insurance Dashboard
- Support email: your email
- Authorized domains: Add your domain

### 4. Create OAuth 2.0 Credentials
- Application type: Web application
- Name: Moha Insurance

**Authorized JavaScript origins:**
- `http://localhost:3000` (development)
- `https://yourdomain.com` (production)

**Authorized redirect URIs:**
- `http://localhost:3000/api/auth/callback/google` (development)
- `https://yourdomain.com/api/auth/callback/google` (production)

### 5. Copy Credentials
- Copy Client ID → Add to `.env` as `AUTH_GOOGLE_ID`
- Copy Client Secret → Add to `.env` as `AUTH_GOOGLE_SECRET`

## 🧪 Testing Authentication

### Test Sign-In Flow
1. Visit `http://localhost:3000/dashboard/auth/sign-in`
2. Click "Continue with Google"
3. Complete Google sign-in
4. Should redirect to `/dashboard`
5. Check session at: `http://localhost:3000/api/auth/session`

### Test Protected Routes
1. Sign out (clear cookies or use sign-out button)
2. Try accessing `http://localhost:3000/dashboard`
3. Should redirect to `/dashboard/auth/sign-in`
4. Sign in again - should redirect back to dashboard

### Check Database
```bash
npx prisma studio
```

Look for:
- Your user in the **User** table
- Session in the **Session** table
- Account linking in the **Account** table

## 📝 Current Authentication State

### What Works:
✅ Google OAuth sign-in
✅ Google OAuth sign-up (creates new account)
✅ Session management
✅ Protected dashboard routes
✅ Role-based authorization
✅ Automatic redirects
✅ Error handling
✅ Loading states

### What's Disabled (By Design):
❌ Email/Password sign-in - Not configured
❌ Email/Password registration - Not configured

**Note**: The email/password forms are visible but show an error message directing users to use Google OAuth. If you want to enable email/password authentication, you need to:
1. Add bcrypt password hashing
2. Add CredentialsProvider to NextAuth config
3. Create registration API endpoint
4. Implement password reset flow

## 🔒 User Roles

### USER (Default)
- Access to dashboard
- Can view own data
- Cannot manage other users' data
- Cannot access admin routes

### ADMIN
- Full access to dashboard
- Can manage all data (CRUD operations)
- Can access admin routes
- Cannot manage other admins

### SUPER_ADMIN
- Complete system access
- Can manage all users including admins
- Full CRUD on all resources
- Access to all routes

## 🎨 Sign-In Page Features

Located at: `/dashboard/auth/sign-in`

- ✅ Google OAuth button (functional)
- ✅ Email/password form (shows error message)
- ✅ Error handling and display
- ✅ Loading states
- ✅ Responsive design
- ✅ Link to sign-up page
- ✅ Terms and privacy policy links

## 📱 Sign-Up Page Features

Located at: `/dashboard/auth/sign-up`

- ✅ Google OAuth button (functional)
- ✅ Registration form (shows error message)
- ✅ Error handling and display
- ✅ Loading states
- ✅ Password confirmation
- ✅ Responsive design
- ✅ Link to sign-in page

## 🐛 Troubleshooting

### "Google sign-in not working"
**Check:**
1. Is `npm run dev` running?
2. Are Google OAuth credentials correct in `.env`?
3. Are redirect URIs configured in Google Console?
4. Check browser console for errors

### "Redirected back to sign-in immediately"
**Solution:**
- Your session might have expired
- Clear cookies and try again
- Check database for active session

### "Cannot access dashboard"
**Solution:**
- Make sure you're signed in
- Check session exists: `http://localhost:3000/api/auth/session`
- Look for errors in terminal

### "Not redirecting after sign-in"
**Check:**
1. Database connection is working
2. Session table exists in database
3. No errors in terminal
4. Browser allows cookies

## 📊 Authentication Flow Diagram

```
User Visits /dashboard
       ↓
Middleware Checks Session
       ↓
   Not Authenticated?
       ↓
Redirect to /dashboard/auth/sign-in
       ↓
User Clicks "Continue with Google"
       ↓
Redirect to Google OAuth
       ↓
User Grants Permission
       ↓
Callback to /api/auth/callback/google
       ↓
Create/Update User in Database
       ↓
Create Session in Database
       ↓
Set Session Cookie
       ↓
Redirect to /dashboard
       ↓
Middleware Allows Access
       ↓
Dashboard Loads Successfully
```

## 🎯 Next Steps

### For Development:
1. ✅ Authentication is working
2. ✅ Test by signing in
3. ✅ Promote yourself to admin in database
4. ✅ Start using dashboard CRUD features

### For Production:
1. Update `NEXTAUTH_URL` to production domain
2. Add production redirect URI to Google Console
3. Generate new `NEXTAUTH_SECRET` for production
4. Deploy to hosting platform (Vercel, Railway, etc.)

## 💡 Tips

### Sign Out Programmatically
```typescript
import { signOut } from "next-auth/react";

<Button onClick={() => signOut({ callbackUrl: "/dashboard/auth/sign-in" })}>
  Sign Out
</Button>
```

### Check Authentication in Component
```typescript
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;
  
  return <div>Welcome {session.user.name}!</div>;
}
```

### Check Authentication in API Route
```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Your logic here
}
```

## ✨ Summary

**Status**: ✅ **FULLY FUNCTIONAL**

- Google OAuth: **Working**
- Sign-In Page: **Working**
- Sign-Up Page: **Working**
- Session Management: **Working**
- Route Protection: **Working**
- Role-Based Access: **Working**
- Database Storage: **Working**

**You can now sign in to the dashboard using your Google account!**

---

**Need Help?** Check the browser console and terminal for any error messages.
