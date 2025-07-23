# Token-Based Navigation and Permission System

This implementation provides a comprehensive token-based navigation system with role and permission-based access control, similar to your example application.

## Features

### 🔐 Token-Based Authentication

- **JWT Token Validation**: Automatic token validation and expiry checking
- **URL Token Handling**: Support for token passed via URL parameters (`?token=xxx&email=xxx`)
- **Subscription Management**: Check subscription status for different user roles
- **Automatic Redirects**: Smart redirects based on authentication state

### 🛡️ Role & Permission-Based Access Control

- **Fine-grained Permissions**: Control access at the component level using specific permissions
- **Role-based Routes**: Restrict entire sections to specific user roles
- **Dynamic Permission Loading**: Fetch permissions from backend API based on user role
- **Fallback Support**: Use token permissions if API is unavailable

### 🔄 Real-time Permission Management

- **Permission Hook**: `usePermissions()` hook for managing user permissions
- **Permission Checking**: Helper functions to check single/multiple permissions
- **Role Validation**: Check user roles throughout the application
- **Permission Refresh**: Ability to refresh permissions without page reload

## Implementation Overview

### 1. App.tsx Structure

```typescript
// Enhanced Protected Route with permission validation
<ProtectedRoute requiredPermissions={[Permission.TICKET_VIEW]}>
  <LayoutWrapper>
    <TicketsPage />
  </LayoutWrapper>
</ProtectedRoute>

// Admin-only routes
<AdminOnlyRoute>
  <LayoutWrapper>
    <SettingsPage />
  </LayoutWrapper>
</AdminOnlyRoute>
```

### 2. Key Components

#### **useTokenAuth Hook**

- Validates JWT tokens from localStorage or URL parameters
- Checks token expiry and subscription status
- Handles automatic redirects for expired/invalid tokens

#### **usePermissions Hook**

- Fetches role-based permissions from backend API
- Provides helper functions for permission checking
- Caches permissions for performance

#### **ProtectedRoute Component**

- Combines authentication and permission validation
- Supports both role-based and permission-based access control
- Shows loading states during validation

### 3. Token Flow

```typescript
// 1. Token from URL parameters (SSO integration)
if (!token && queryToken) {
  localStorage.setItem(AUTH_TOKEN_KEY, queryToken);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

// 2. Token validation and decoding
const decodedToken: DecodedToken = jwtDecode(currentToken);

// 3. Subscription status check
if (!decodedToken.isPaid && decodedToken.role === UserRole.ADMIN) {
  navigate("/subscription-required");
}

// 4. Permission fetching based on role
const rolePermissions = body?.items.find((item) => item?.roleName === role);
setPermissions(rolePermissions.permissionsList || []);
```

### 4. Permission System

#### **Permission Types**

```typescript
export const Permission = {
  // Ticket permissions
  TICKET_CREATE: "ticket_create",
  TICKET_VIEW: "ticket_view",
  TICKET_UPDATE: "ticket_update",

  // Department permissions
  DEPARTMENT_CREATE: "department_create",
  DEPARTMENT_VIEW: "department_view",
  DEPARTMENT_UPDATE: "department_update",

  // Admin permissions
  ADMIN_SETTINGS: "admin_settings",
  ADMIN_USERS: "admin_users",
  ADMIN_SYSTEM: "admin_system",
} as const;
```

#### **Permission Checking**

```typescript
const { hasPermission, hasRole, hasAllPermissions } = usePermissions();

// Check single permission
if (hasPermission(Permission.TICKET_CREATE)) {
  // Show create ticket button
}

// Check role
if (hasRole(UserRole.ADMIN)) {
  // Show admin features
}

// Check multiple permissions
if (hasAllPermissions([Permission.TICKET_VIEW, Permission.TICKET_UPDATE])) {
  // Show edit functionality
}
```

## Usage Examples

### 1. Basic Protected Route

```typescript
<Route
  path="/tickets"
  element={
    <ProtectedRoute requiredPermissions={[Permission.TICKET_VIEW]}>
      <LayoutWrapper>
        <TicketsPage />
      </LayoutWrapper>
    </ProtectedRoute>
  }
/>
```

### 2. Admin-Only Route

```typescript
<Route
  path="/users"
  element={
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <LayoutWrapper>
        <UsersPage />
      </LayoutWrapper>
    </ProtectedRoute>
  }
/>
```

### 3. Component-Level Permission Check

```typescript
import { usePermissions } from "../hooks/usePermissions";

const TicketActions: React.FC = () => {
  const { hasPermission, hasRole } = usePermissions();

  return (
    <div>
      {hasPermission(Permission.TICKET_UPDATE) && <Button>Edit Ticket</Button>}

      {hasRole(UserRole.ADMIN) && <Button>Delete Ticket</Button>}

      {hasPermission(Permission.TICKET_ASSIGN) && (
        <Button>Assign Ticket</Button>
      )}
    </div>
  );
};
```

### 4. API Integration

```typescript
// rolePermissionService.ts handles API calls
export const getRoleAndPermissions =
  async (): Promise<RolePermissionsResponse> => {
    try {
      const response = await apiClient.get("/api/roles-permissions");
      return {
        status: response.status,
        body: response.data,
        message: response.data.message || "Success",
      };
    } catch (error) {
      // Handle errors appropriately
    }
  };
```

## Configuration

### Environment Variables

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_JWT_SECRET=your-jwt-secret
```

### Constants

```typescript
// constants/index.ts
export const AUTH_TOKEN_KEY = "it-ticket-auth-token";
export const USER_DATA_KEY = "it-ticket-user-data";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## Error Handling

### 1. Token Expiry

- Automatic redirect to login page
- Clear localStorage data
- Show appropriate error message

### 2. Permission Denied

- Redirect to unauthorized page
- Maintain navigation history
- Provide clear error messaging

### 3. API Failures

- Fallback to token-based permissions
- Graceful degradation
- User-friendly error messages

## Security Considerations

1. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
2. **Token Validation**: Server-side validation required for all API calls
3. **Permission Caching**: Permissions cached locally but regularly refreshed
4. **Subscription Checks**: Real-time subscription validation for premium features

## Benefits

✅ **Scalable**: Easy to add new permissions and roles
✅ **Secure**: Multiple layers of authentication and authorization
✅ **User-Friendly**: Smooth UX with proper loading states
✅ **Maintainable**: Clean separation of concerns
✅ **Flexible**: Supports both SSO and traditional login flows

This implementation provides a robust foundation for any enterprise application requiring sophisticated access control and user management.
