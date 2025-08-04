# Writezilla: Login and Landing Page Design

## Document-Driven Design (DDD) Specification

### 1. Feature Overview

**User Authentication & HomePage** is the entry point of Writezilla where users log in and view their saved stories and graphics. This includes authentication flow, dashboard layout, and navigation structure.

### 2. Core Requirements

#### Authentication Flow:
- **Sign Up**: Email/password OR Google OAuth
- **Sign In**: Email/password OR Google OAuth authentication
- **Sign Out**: Secure logout with session cleanup
- **Password Reset**: Email-based password recovery (for email users only)
- **Session Management**: Persistent login state
- **Social Login**: Google OAuth integration

#### HomePage Dashboard:
- **Header Navigation**: Stories, Graphics, Notes, Playlists + User Profile
- **Welcome Section**: "WHAT WILL YOU CREATE TODAY?" with action buttons
- **Saved Stories Section**: Display user's stories with covers and titles
- **Saved Graphics Section**: Display user's graphics/maps
- **Search Functionality**: AI-enhanced search bar (placeholder for now)
- **Responsive Design**: Desktop-focused with mobile considerations

### 3. Technical Architecture

#### AWS Amplify Configuration:
```typescript
// Authentication Configuration
const authConfig = {
  signUpVerificationMethod: 'code',
  loginWith: {
    email: true,
    username: false
  },
  passwordFormat: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialCharacters: true
  },
  socialProviders: {
    google: {
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET
    }
  }
}
```

#### Component Structure:
```
src/
├── components/
│   ├── auth/
│   │   ├── SignIn.tsx
│   │   ├── SignUp.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── AuthWrapper.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   ├── dashboard/
│   │   ├── HomePage.tsx
│   │   ├── StoryCard.tsx
│   │   ├── GraphicsCard.tsx
│   │   └── SearchBar.tsx
│   └── common/
│       ├── Button.tsx
│       └── Loading.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useStories.ts
├── services/
│   ├── authService.ts
│   └── storyService.ts
└── types/
    └── auth.ts
```

### 4. Data Models

#### User Profile:
```typescript
interface UserProfile {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  lastLoginAt: string;
}
```

#### Story Preview:
```typescript
interface StoryPreview {
  id: string;
  title: string;
  coverImage?: string;
  updatedAt: string;
  wordCount: number;
  chapterCount: number;
}
```

#### Graphics Preview:
```typescript
interface GraphicsPreview {
  id: string;
  title: string;
  imageUrl: string;
  type: 'map' | 'moodboard' | 'character' | 'other';
  createdAt: string;
}
```

### 5. UI/UX Specifications

#### Color Scheme:
- **Dark Orange**: #DA5812
- **Light Orange**: #DA5812 with 74% transparency
- **Light Grey**: #E3E0DD
- **White**: #E8E8E8

#### Typography:
- **Logo & Big Text**: Julius Sans One
- **Header Options**: Antic Didone
- **Body Text**: Antic Didone

#### Layout Structure:
```
┌─────────────────────────────────────┐
│ Header (Orange) - WRITEZILLA + Nav │
├─────────────────────────────────────┤
│ Main Content (Light Grey)          │
│ ┌─────────────────────────────────┐ │
│ │ "WHAT WILL YOU CREATE TODAY?"  │ │
│ │ [Stories] [Maps] [Moodboards] │ │
│ │ [Playlists]                    │ │
│ │ [Search Bar]                   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ WRITING:                       │ │
│ │ [Story Cards - 3 horizontal]   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ MAPS:                          │ │
│ │ [Graphics Cards - 3 horizontal]│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 6. Constraints & Requirements

#### Authentication Constraints:
- **Email verification required** for email/password accounts
- **Google OAuth** for social login (no password required)
- **Password requirements**: 8+ chars, mixed case, numbers, symbols (email users only)
- **Session timeout**: 24 hours
- **Rate limiting**: 5 login attempts per 15 minutes
- **Google OAuth scopes**: email, profile, openid

#### Dashboard Constraints:
- **Show max 6 stories** in preview (3 per row)
- **Show max 6 graphics** in preview (3 per row)
- **Search placeholder** - no functionality in MVP
- **Responsive breakpoints**: Desktop (1024px+), Tablet (768px-1023px)

#### Performance Constraints:
- **Page load time**: < 3 seconds
- **Authentication flow**: < 2 seconds
- **Image loading**: Lazy load with placeholders
- **Navigation**: Instant transitions

### 7. Error Handling

#### Authentication Errors:
- **Invalid credentials**: Clear error message
- **Account locked**: Temporary lockout message
- **Network errors**: Retry mechanism
- **Session expired**: Automatic redirect to login

#### Dashboard Errors:
- **No stories**: Empty state with CTA
- **No graphics**: Empty state with CTA
- **Loading states**: Skeleton loaders
- **Image load failures**: Fallback placeholders

### 8. Testing Strategy

#### Unit Tests:
- **Authentication components**: SignIn, SignUp, ForgotPassword
- **Dashboard components**: HomePage, StoryCard, GraphicsCard
- **Utility functions**: Auth helpers, data formatting

#### Integration Tests:
- **Authentication flow**: Complete signup/signin cycle
- **Dashboard loading**: Data fetching and display
- **Navigation**: Header navigation functionality

#### E2E Tests:
- **User registration and login**
- **Dashboard display with mock data**
- **Navigation between sections**

### 9. Implementation Phases

#### Phase 1: Authentication Foundation
1. **Write tests** for authentication components
2. **Implement** SignIn/SignUp components
3. **Test** authentication flow end-to-end

#### Phase 2: Dashboard Structure
1. **Write tests** for HomePage and card components
2. **Implement** dashboard layout and navigation
3. **Test** responsive design and data display

#### Phase 3: Integration
1. **Write tests** for data fetching and state management
2. **Implement** AWS Amplify integration
3. **Test** complete user flow

### 10. MVP Scope

#### Included in MVP:
- ✅ User authentication (signup/signin)
- ✅ Dashboard with saved stories/graphics
- ✅ Navigation header
- ✅ Story and graphics cards
- ✅ Search bar (UI only)
- ✅ Responsive design

#### Placeholder Features:
- 🔄 AI-enhanced search functionality
- 🔄 Social features (comments, sharing)
- 🔄 Advanced graphics tools
- 🔄 Playlist integration
- 🔄 Notes system

### 11. Success Criteria

#### Functional Requirements:
- [ ] Users can sign up with email verification
- [ ] Users can sign in and maintain session
- [ ] Dashboard displays saved stories and graphics
- [ ] Navigation works between all sections
- [ ] Responsive design works on desktop/tablet

#### Performance Requirements:
- [ ] Page loads in < 3 seconds
- [ ] Authentication completes in < 2 seconds
- [ ] Images load with fallback placeholders
- [ ] Navigation is instant

#### Quality Requirements:
- [ ] 80%+ test coverage
- [ ] No console errors
- [ ] Accessibility compliant
- [ ] Cross-browser compatible

---

## Next Steps

1. **Set up AWS Amplify project**
2. **Create authentication components with TDD**
3. **Implement dashboard layout**
4. **Add AWS integration**
5. **Deploy and test**

---

*Last updated: [Current Date]*
*Version: 1.0*
*Status: Design Complete - Ready for Implementation* 