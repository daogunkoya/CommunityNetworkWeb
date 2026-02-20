# AI Prompts for Vue 3 Migration

This document contains specific prompts to use with AI assistants (like ChatGPT, Claude, or Cursor) to recreate the MatchGrinder app in Vue 3. Each prompt is designed to be self-contained and includes relevant file references.

## Phase 1: Project Setup and Foundation

### Prompt 1.1: Initial Vue 3 Project Setup
```
Create a Vue 3 project with the following specifications:

1. Use Vite as the build tool
2. Include Vue 3 Composition API with <script setup> syntax
3. Set up Vue Router v4 for client-side routing
4. Configure Vuex for state management
5. Install and configure Tailwind CSS
6. Set up TypeScript support
7. Include the following dependencies:
   - axios for API calls
   - @vueuse/core for Vue utilities
   - date-fns for date manipulation
   - lucide-vue-next for icons
   - zod for validation
   - @tanstack/vue-query for server state management

Create the basic project structure with folders for:
- components/ (auth, ui, layout, features)
- views/ (pages)
- stores/ (Vuex modules)
- services/ (API services)
- composables/ (reusable composition functions)
- types/ (TypeScript definitions)
- utils/ (utility functions)
- router/ (routing configuration)

Set up the main App.vue with router-view and basic layout structure.
```

### Prompt 1.2: Centralized API Service and Authentication System
```
Create a complete centralized API service and authentication system for Vue 3:

1. CENTRALIZED API SERVICE (services/api.js):
   - Single file containing ALL API endpoints organized by feature
   - Axios instance with interceptors for auth tokens and error handling
   - Organized sections: auth, games, tournaments, discussions, messages, profile, dashboard, utils
   - Each section contains all CRUD operations for that feature
   - Consistent error handling and response formatting
   - Support for file uploads, form data, and different content types

2. Vuex store for auth state management:
   - User state (user, token, loading, isAuthenticated)
   - Actions that use the centralized API service
   - Getters for computed auth state
   - Mutations for state updates

3. Auth composable (useAuth) that provides:
   - Reactive user state from Vuex
   - Login/logout functions using centralized API
   - Loading states and error handling
   - Authentication checks

4. Router guards for protected routes:
   - Check authentication before accessing protected pages
   - Redirect to login if not authenticated
   - Handle token expiration and refresh

IMPORTANT: All API calls must come from the single centralized apiService object. 
No individual service files - everything goes through services/api.js.

Reference the React implementation patterns from:
- src/hooks/useAuth.tsx (React auth hook)
- src/services/auth.ts (API service)
- src/types/auth.ts (Type definitions)

Convert these to Vue 3 with centralized API calls and proper TypeScript support.
```

## Phase 2: Core Features - Games

### Prompt 2.1: Games Store and State Management
```
Create a Vuex store module for managing games state with the following structure:

State:
- games: array of game objects
- gameTypes: available sport types
- filters: current filter state (sport, skill level, location)
- pagination: current page, total pages, total count
- loading: loading states for different operations

Actions:
- fetchGames: get games with current filters using apiService.games.getGames()
- fetchGameTypes: get available sport types using apiService.games.getGameTypes()
- createGame: create new game event using apiService.games.createGame()
- joinGame: join existing game using apiService.games.joinGame()
- leaveGame: leave game using apiService.games.leaveGame()
- updateFilters: update filter state and refetch games

Mutations:
- SET_GAMES, SET_GAME_TYPES, SET_FILTERS, SET_PAGINATION, SET_LOADING

Getters:
- Computed properties for games, gameTypes, filters, pagination, loading

CRITICAL REQUIREMENT: All API calls must use the centralized apiService from services/api.js.
Do NOT create separate service files. Import and use apiService.games.* for all games-related API calls.

Reference the React implementation:
- src/hooks/useGames.ts (React hook for games)
- src/services/games.ts (Games API service - but consolidate into centralized API)

Convert to Vue 3 with proper error handling, loading states, and centralized API calls.
```

### Prompt 2.2: Games Components and Views
```
Create Vue 3 components for the games feature:

1. Games View (views/Games.vue):
   - List of games with filtering and pagination
   - Create new game button
   - Game cards display
   - Loading states and error handling

2. Game Card Component (components/games/GameCard.vue):
   - Display game information (title, sport, date, location, participants)
   - Join/Leave buttons with loading states
   - Organizer information
   - Skill level and max participants

3. Create Game Modal (components/games/CreateGameModal.vue):
   - Multi-step form for game creation
   - Sport type selection
   - Date/time picker
   - Location input with address autocomplete
   - Max participants and skill level
   - Form validation with Zod

4. Game Filters (components/games/GameFilters.vue):
   - Sport type filter
   - Skill level filter
   - Location/radius filter
   - Date range filter

Reference React components:
- src/pages/Games.tsx
- src/components/GameEventCard.tsx
- src/components/CreateGameEventModal.tsx

Use Vue 3 Composition API with <script setup> and proper TypeScript typing.
```

### Prompt 2.3: Game Detail Page
```
Create a detailed game view page (views/GameDetail.vue) with:

1. Game information display:
   - Full game details (title, description, date, location)
   - Organizer profile with avatar
   - Participant list with avatars and status
   - Waiting list management

2. Interactive features:
   - Join/Leave game functionality
   - Edit game (if organizer)
   - Delete game (if organizer)
   - Share game link

3. Real-time updates:
   - Participant count updates
   - Join/leave status changes
   - Comments and discussion

4. Mobile-responsive design:
   - Touch-friendly buttons
   - Optimized for mobile viewing
   - Proper spacing and typography

Reference React implementation:
- src/pages/GameDetail.tsx

Include proper error handling, loading states, and Vue 3 Composition API patterns.
```

## Phase 3: Tournaments Feature

### Prompt 3.1: Tournament Store and Management
```
Create a Vuex store module for tournament management:

State:
- tournaments: array of tournament objects
- currentTournament: selected tournament details
- brackets: tournament bracket structure
- participants: tournament participants
- loading: loading states

Actions:
- fetchTournaments: get all tournaments
- fetchTournament: get specific tournament
- createTournament: create new tournament
- joinTournament: join tournament
- updateBracket: update tournament bracket
- updateMatchResult: update match results

Mutations:
- SET_TOURNAMENTS, SET_CURRENT_TOURNAMENT, SET_BRACKETS, SET_PARTICIPANTS

Getters:
- Computed properties for tournaments, current tournament, brackets

Reference React implementation:
- src/services/tournaments.ts
- src/pages/Tournament.tsx
- src/pages/TournamentDetail.tsx

Include proper bracket management and tournament progression logic.
```

### Prompt 3.2: Tournament Components
```
Create Vue 3 components for tournament management:

1. Tournament List (views/Tournament.vue):
   - Grid/list of tournaments
   - Tournament cards with status
   - Create tournament button
   - Filter by sport, status, date

2. Tournament Card (components/tournaments/TournamentCard.vue):
   - Tournament info display
   - Participant count and max
   - Registration status
   - Join/Leave buttons

3. Create Tournament Modal (components/tournaments/CreateTournamentModal.vue):
   - Tournament setup form
   - Bracket configuration
   - Entry requirements
   - Prize information
   - Date and location

4. Tournament Detail (views/TournamentDetail.vue):
   - Full tournament view
   - Bracket visualization
   - Match results
   - Participant management
   - Live updates

5. Bracket Component (components/tournaments/Bracket.vue):
   - Visual bracket display
   - Match progression
   - Result input (for organizers)
   - Winner advancement

Reference React components:
- src/components/CreateTournamentModal.tsx
- src/components/EditTournamentModal.tsx

Use Vue 3 with proper state management and real-time updates.
```

## Phase 4: Discussion and Messages

### Prompt 4.1: Discussion Forum System
```
Create a discussion forum system with Vue 3:

1. Discussion Store (stores/discussions.js):
   - State: discussions, currentDiscussion, comments, loading
   - Actions: fetchDiscussions, fetchDiscussion, createDiscussion, addComment
   - Mutations: SET_DISCUSSIONS, SET_CURRENT_DISCUSSION, ADD_COMMENT

2. Discussion List (views/Discussion.vue):
   - List of discussion threads
   - Filter by sport, popularity, date
   - Search functionality
   - Create new discussion

3. Discussion Card (components/discussions/DiscussionCard.vue):
   - Discussion preview
   - Author info and avatar
   - Comment count and engagement
   - Last activity timestamp

4. Discussion Detail (views/DiscussionDetail.vue):
   - Full discussion thread
   - Comment system with replies
   - Like/unlike functionality
   - Share and bookmark options

5. Create Discussion Modal (components/discussions/CreateDiscussionModal.vue):
   - Discussion creation form
   - Sport category selection
   - Rich text editor
   - Tag system

Reference React implementation:
- src/pages/Discussion.tsx
- src/pages/DiscussionDetail.tsx
- src/components/CreateDiscussionModal.tsx
- src/components/CommentModal.tsx
- src/services/discussions.ts

Include proper comment threading and moderation features.
```

### Prompt 4.2: Real-time Messaging System
```
Create a real-time messaging system with Vue 3:

1. Messages Store (stores/messages.js):
   - State: conversations, currentConversation, messages, typing, loading
   - Actions: fetchConversations, fetchMessages, sendMessage, markAsRead
   - Mutations: SET_CONVERSATIONS, SET_MESSAGES, ADD_MESSAGE, SET_TYPING

2. Messages View (views/Messages.vue):
   - Conversation list sidebar
   - Chat interface
   - Message input with emoji picker
   - Typing indicators

3. Conversation List (components/messages/ConversationList.vue):
   - List of conversations
   - Unread message indicators
   - Last message preview
   - Online status indicators

4. Chat Interface (components/messages/ChatInterface.vue):
   - Message bubbles with timestamps
   - File/image sharing
   - Message status (sent, delivered, read)
   - Scroll to bottom functionality

5. Message Input (components/messages/MessageInput.vue):
   - Text input with auto-resize
   - Emoji picker
   - File upload
   - Send button with loading state

6. Typing Indicator (components/messages/TypingIndicator.vue):
   - Animated typing dots
   - User name display
   - Auto-hide after timeout

Reference React implementation:
- src/pages/Messages.tsx
- src/components/TypingIndicator.tsx
- src/services/messages.ts

Include WebSocket integration for real-time messaging and proper message persistence.
```

## Phase 5: Profile and User Management

### Prompt 5.1: User Profile System
```
Create a comprehensive user profile system:

1. Profile Store (stores/profile.js):
   - State: profile, preferences, achievements, stats, loading
   - Actions: fetchProfile, updateProfile, uploadAvatar, updatePreferences
   - Mutations: SET_PROFILE, SET_PREFERENCES, SET_ACHIEVEMENTS

2. Profile View (views/Profile.vue):
   - User information display
   - Profile picture with upload
   - Achievement badges
   - Activity statistics
   - Edit profile functionality

3. Profile Edit Form (components/profile/ProfileEditForm.vue):
   - Personal information form
   - Location and preferences
   - Sports interests and skill levels
   - Privacy settings

4. Achievement System (components/profile/Achievements.vue):
   - Achievement badges display
   - Progress tracking
   - Unlock conditions
   - Sharing functionality

5. Activity Stats (components/profile/ActivityStats.vue):
   - Games played/joined
   - Tournaments participated
   - Win/loss ratios
   - Activity charts

Reference React implementation:
- src/pages/Profile.tsx
- src/services/profile.ts
- src/components/auth/RegistrationFlow.tsx

Include proper image upload, validation, and social features.
```

### Prompt 5.2: Registration and Onboarding
```
Create a multi-step registration and onboarding system:

1. Registration Store (stores/registration.js):
   - State: currentStep, formData, loading, errors
   - Actions: nextStep, prevStep, submitRegistration, validateStep
   - Mutations: SET_STEP, UPDATE_FORM_DATA, SET_ERRORS

2. Registration Flow (views/auth/RegisterPage.vue):
   - Multi-step form with progress indicator
   - Step navigation and validation
   - Form data persistence
   - Error handling and display

3. Registration Steps:
   - Step 1: Personal Information (name, email, password)
   - Step 2: Profile Setup (avatar, bio, interests)
   - Step 3: Location and Preferences
   - Step 4: Sports and Skill Levels
   - Step 5: Goals and Preferences
   - Step 6: Verification and Completion

4. Onboarding Components:
   - ProgressIndicator component
   - StepNavigation component
   - FormValidation composable
   - ImageUpload component

Reference React implementation:
- src/components/auth/RegistrationFlow.tsx

Include proper form validation, progress tracking, and user experience optimization.
```

## Phase 6: UI Components and Layout

### Prompt 6.1: Complete UI Component Library
```
Create a comprehensive UI component library for Vue 3:

1. Base Components:
   - Button (with variants, sizes, loading states)
   - Input (text, email, password, textarea)
   - Select (dropdown, multi-select)
   - Checkbox, Radio, Switch
   - Card, Modal, Dialog
   - Avatar, Badge, Chip
   - Progress, Skeleton, Spinner

2. Layout Components:
   - Container, Grid, Flex
   - Header, Footer, Sidebar
   - Navigation, Breadcrumb
   - Tabs, Accordion, Collapsible

3. Form Components:
   - Form with validation
   - Field components
   - DatePicker, TimePicker
   - FileUpload, ImageUpload
   - AddressInput with autocomplete

4. Data Display:
   - Table with sorting/filtering
   - List with virtualization
   - Pagination
   - Charts and graphs

Reference React components:
- src/components/ui/ (entire directory)

Convert all Radix UI components to Vue 3 equivalents with proper accessibility and theming.
```

### Prompt 6.2: Layout and Navigation System
```
Create the main layout and navigation system:

1. Main Layout (components/layout/MainLayout.vue):
   - Header with navigation
   - Sidebar for desktop
   - Mobile navigation drawer
   - Footer
   - Content area with routing

2. Header Component (components/layout/Header.vue):
   - Logo and branding
   - Main navigation menu
   - User profile dropdown
   - Search functionality
   - Mobile menu toggle

3. Mobile Navigation (components/layout/MobileNavigation.vue):
   - Bottom navigation bar
   - Slide-out drawer menu
   - Touch-friendly interactions
   - Active state indicators

4. Sidebar (components/layout/Sidebar.vue):
   - Navigation menu
   - User profile section
   - Quick actions
   - Collapsible on mobile

Reference React components:
- src/components/Layout.tsx
- src/components/TopHeader.tsx
- src/components/MobileNavigation.tsx

Include responsive design, accessibility features, and proper Vue 3 patterns.
```

## Phase 7: Integration and Polish

### Prompt 7.1: API Integration and Error Handling
```
Set up comprehensive API integration and error handling:

1. API Service Layer:
   - Axios configuration with interceptors
   - Request/response logging
   - Error handling and user feedback
   - Token management and refresh
   - Retry logic for failed requests

2. Error Handling System:
   - Global error handler
   - User-friendly error messages
   - Network error detection
   - Offline state management
   - Error reporting and logging

3. Loading States:
   - Global loading indicators
   - Component-level loading states
   - Skeleton screens
   - Progress indicators

4. Caching Strategy:
   - API response caching
   - Offline data persistence
   - Cache invalidation
   - Optimistic updates

Reference React implementation:
- src/services/api.ts
- src/utils/errorConfig.ts
- src/utils/networkUtils.ts

Include proper TypeScript typing and comprehensive error recovery.
```

### Prompt 7.2: Performance Optimization and Testing
```
Implement performance optimizations and testing:

1. Performance Optimizations:
   - Component lazy loading
   - Image optimization and lazy loading
   - Bundle splitting and code splitting
   - Virtual scrolling for large lists
   - Memoization of expensive computations

2. Testing Setup:
   - Unit tests for components
   - Integration tests for stores
   - E2E tests for user flows
   - API mocking for tests
   - Test utilities and helpers

3. Accessibility:
   - ARIA labels and roles
   - Keyboard navigation
   - Screen reader support
   - Focus management
   - Color contrast compliance

4. SEO and Meta:
   - Dynamic meta tags
   - Open Graph tags
   - Structured data
   - Sitemap generation
   - Performance monitoring

Reference React implementation:
- src/__tests__/

Include comprehensive testing coverage and performance monitoring.
```

## Usage Instructions

1. **Start with Phase 1** and work through each phase sequentially
2. **Copy the exact prompt** into your AI assistant
3. **Reference the mentioned files** from the React codebase when needed
4. **Test each phase** before moving to the next
5. **Customize prompts** based on your specific needs and preferences

Each prompt is designed to be comprehensive and self-contained, but you can break them down further if needed for more focused development sessions.
