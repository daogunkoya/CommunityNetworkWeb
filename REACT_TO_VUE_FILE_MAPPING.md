# React to Vue 3 File Mapping Reference

This document provides a quick reference for mapping React files to their Vue 3 equivalents during migration.

## Core Application Files

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/App.tsx` | `src/App.vue` | Main application component |
| `src/main.tsx` | `src/main.js` | Application entry point |
| `src/index.css` | `src/assets/main.css` | Global styles |

## Routing

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| React Router setup in `App.tsx` | `src/router/index.js` | Route configuration |
| `src/components/ProtectedRoute.tsx` | Router guards in `router/index.js` | Route protection |

## State Management

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/hooks/useAuth.tsx` | `src/stores/auth.js` + `src/composables/useAuth.js` | Authentication state |
| `src/hooks/useGames.ts` | `src/stores/games.js` + `src/composables/useGames.js` | Games state |
| `src/hooks/useDashboardStats.ts` | `src/stores/dashboard.js` + `src/composables/useDashboard.js` | Dashboard stats |

## Pages/Views

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/pages/LandingPage.tsx` | `src/views/LandingPage.vue` | Landing page |
| `src/pages/Home.tsx` | `src/views/Home.vue` | Dashboard/Home |
| `src/pages/Games.tsx` | `src/views/Games.vue` | Games listing |
| `src/pages/GameDetail.tsx` | `src/views/GameDetail.vue` | Game details |
| `src/pages/Tournament.tsx` | `src/views/Tournament.vue` | Tournament listing |
| `src/pages/TournamentDetail.tsx` | `src/views/TournamentDetail.vue` | Tournament details |
| `src/pages/Discussion.tsx` | `src/views/Discussion.vue` | Discussion forum |
| `src/pages/DiscussionDetail.tsx` | `src/views/DiscussionDetail.vue` | Discussion thread |
| `src/pages/Messages.tsx` | `src/views/Messages.vue` | Messages/Chat |
| `src/pages/Profile.tsx` | `src/views/Profile.vue` | User profile |
| `src/pages/NotFound.tsx` | `src/views/NotFound.vue` | 404 page |

## Authentication Components

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/components/auth/SigninFlow.tsx` | `src/views/auth/SigninPage.vue` | Login page |
| `src/components/auth/RegistrationFlow.tsx` | `src/views/auth/RegisterPage.vue` | Registration page |
| `src/components/auth/GoogleAuthButton.tsx` | `src/components/auth/GoogleAuthButton.vue` | Google OAuth button |

## Feature Components

### Games
| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/components/CreateGameEventModal.tsx` | `src/components/games/CreateGameModal.vue` | Create game modal |
| `src/components/GameEventCard.tsx` | `src/components/games/GameCard.vue` | Game card display |
| `src/components/GamesLoader.tsx` | `src/components/games/GamesLoader.vue` | Games loading state |

### Tournaments
| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/components/CreateTournamentModal.tsx` | `src/components/tournaments/CreateTournamentModal.vue` | Create tournament |
| `src/components/EditTournamentModal.tsx` | `src/components/tournaments/EditTournamentModal.vue` | Edit tournament |

### Discussions
| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/components/CreateDiscussionModal.tsx` | `src/components/discussions/CreateDiscussionModal.vue` | Create discussion |
| `src/components/CommentModal.tsx` | `src/components/discussions/CommentModal.vue` | Comment modal |

### Messages
| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/components/TypingIndicator.tsx` | `src/components/messages/TypingIndicator.vue` | Typing indicator |

## Layout Components

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/components/Layout.tsx` | `src/components/layout/MainLayout.vue` | Main layout wrapper |
| `src/components/TopHeader.tsx` | `src/components/layout/Header.vue` | Top navigation header |
| `src/components/MobileNavigation.tsx` | `src/components/layout/MobileNavigation.vue` | Mobile navigation |
| `src/components/MatchGrinderLogo.tsx` | `src/components/layout/Logo.vue` | App logo component |

## UI Components

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/components/ui/button.tsx` | `src/components/ui/Button.vue` | Button component |
| `src/components/ui/card.tsx` | `src/components/ui/Card.vue` | Card component |
| `src/components/ui/input.tsx` | `src/components/ui/Input.vue` | Input component |
| `src/components/ui/avatar.tsx` | `src/components/ui/Avatar.vue` | Avatar component |
| `src/components/ui/badge.tsx` | `src/components/ui/Badge.vue` | Badge component |
| `src/components/ui/dialog.tsx` | `src/components/ui/Dialog.vue` | Modal/Dialog component |
| `src/components/ui/dropdown-menu.tsx` | `src/components/ui/DropdownMenu.vue` | Dropdown menu |
| `src/components/ui/form.tsx` | `src/components/ui/Form.vue` | Form component |
| `src/components/ui/select.tsx` | `src/components/ui/Select.vue` | Select component |
| `src/components/ui/textarea.tsx` | `src/components/ui/Textarea.vue` | Textarea component |
| `src/components/ui/toast.tsx` | `src/components/ui/Toast.vue` | Toast notification |
| `src/components/ui/tooltip.tsx` | `src/components/ui/Tooltip.vue` | Tooltip component |
| `src/components/ui/skeleton.tsx` | `src/components/ui/Skeleton.vue` | Loading skeleton |
| `src/components/ui/switch.tsx` | `src/components/ui/Switch.vue` | Toggle switch |
| `src/components/ui/tabs.tsx` | `src/components/ui/Tabs.vue` | Tab component |
| `src/components/ui/alert-dialog.tsx` | `src/components/ui/AlertDialog.vue` | Alert dialog |
| `src/components/ui/checkbox.tsx` | `src/components/ui/Checkbox.vue` | Checkbox component |
| `src/components/ui/radio-group.tsx` | `src/components/ui/RadioGroup.vue` | Radio group |
| `src/components/ui/slider.tsx` | `src/components/ui/Slider.vue` | Range slider |
| `src/components/ui/progress.tsx` | `src/components/ui/Progress.vue` | Progress bar |
| `src/components/ui/pagination.tsx` | `src/components/ui/Pagination.vue` | Pagination component |
| `src/components/ui/calendar.tsx` | `src/components/ui/Calendar.vue` | Calendar component |
| `src/components/ui/popover.tsx` | `src/components/ui/Popover.vue` | Popover component |
| `src/components/ui/sheet.tsx` | `src/components/ui/Sheet.vue` | Sheet/Drawer component |
| `src/components/ui/accordion.tsx` | `src/components/ui/Accordion.vue` | Accordion component |
| `src/components/ui/carousel.tsx` | `src/components/ui/Carousel.vue` | Carousel component |
| `src/components/ui/command.tsx` | `src/components/ui/Command.vue` | Command palette |
| `src/components/ui/hover-card.tsx` | `src/components/ui/HoverCard.vue` | Hover card |
| `src/components/ui/label.tsx` | `src/components/ui/Label.vue` | Form label |
| `src/components/ui/menubar.tsx` | `src/components/ui/Menubar.vue` | Menu bar |
| `src/components/ui/navigation-menu.tsx` | `src/components/ui/NavigationMenu.vue` | Navigation menu |
| `src/components/ui/scroll-area.tsx` | `src/components/ui/ScrollArea.vue` | Scroll area |
| `src/components/ui/separator.tsx` | `src/components/ui/Separator.vue` | Separator line |
| `src/components/ui/table.tsx` | `src/components/ui/Table.vue` | Table component |
| `src/components/ui/toggle.tsx` | `src/components/ui/Toggle.vue` | Toggle button |
| `src/components/ui/toggle-group.tsx` | `src/components/ui/ToggleGroup.vue` | Toggle group |
| `src/components/ui/aspect-ratio.tsx` | `src/components/ui/AspectRatio.vue` | Aspect ratio container |
| `src/components/ui/breadcrumb.tsx` | `src/components/ui/Breadcrumb.vue` | Breadcrumb navigation |
| `src/components/ui/chart.tsx` | `src/components/ui/Chart.vue` | Chart component |
| `src/components/ui/collapsible.tsx` | `src/components/ui/Collapsible.vue` | Collapsible content |
| `src/components/ui/context-menu.tsx` | `src/components/ui/ContextMenu.vue` | Context menu |
| `src/components/ui/drawer.tsx` | `src/components/ui/Drawer.vue` | Drawer component |
| `src/components/ui/input-otp.tsx` | `src/components/ui/InputOTP.vue` | OTP input |
| `src/components/ui/resizable.tsx` | `src/components/ui/Resizable.vue` | Resizable panels |
| `src/components/ui/sonner.tsx` | `src/components/ui/Sonner.vue` | Toast notifications |
| `src/components/ui/toaster.tsx` | `src/components/ui/Toaster.vue` | Toast container |

## Services

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/services/api.ts` | `src/services/api.js` | **CENTRALIZED API SERVICE** - All API calls in one file |
| `src/services/auth.ts` | `src/services/api.js` | Authentication API (consolidated) |
| `src/services/games.ts` | `src/services/api.js` | Games API (consolidated) |
| `src/services/tournaments.ts` | `src/services/api.js` | Tournaments API (consolidated) |
| `src/services/discussions.ts` | `src/services/api.js` | Discussions API (consolidated) |
| `src/services/messages.ts` | `src/services/api.js` | Messages API (consolidated) |
| `src/services/profile.ts` | `src/services/api.js` | Profile API (consolidated) |
| `src/services/registration.ts` | `src/services/api.js` | Registration API (consolidated) |
| `src/services/gameTypes.ts` | `src/services/api.js` | Game types API (consolidated) |
| `src/services/dashboard.ts` | `src/services/api.js` | Dashboard API (consolidated) |
| `src/services/address.ts` | `src/services/api.js` | Address/Geocoding API (consolidated) |

**IMPORTANT**: All React service files are consolidated into a single `src/services/api.js` file with organized sections:
- `apiService.auth.*` - Authentication endpoints
- `apiService.games.*` - Games endpoints  
- `apiService.tournaments.*` - Tournament endpoints
- `apiService.discussions.*` - Discussion endpoints
- `apiService.messages.*` - Message endpoints
- `apiService.profile.*` - Profile endpoints
- `apiService.dashboard.*` - Dashboard endpoints
- `apiService.utils.*` - Utility endpoints

### Benefits of Centralized API Service:
- **Single Source of Truth**: All API endpoints in one place
- **Easy Maintenance**: Update API calls in one location
- **Consistent Error Handling**: Unified error handling across all endpoints
- **Better Testing**: Easier to mock and test API calls
- **Improved Developer Experience**: Clear organization and easy reference
- **Reduced Code Duplication**: Shared interceptors and configuration
- **Type Safety**: Centralized TypeScript definitions for API responses

## Configuration

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/config/api.ts` | `src/config/api.js` | API configuration |
| `src/config/app.ts` | `src/config/app.js` | App configuration |
| `vite.config.ts` | `vite.config.js` | Build configuration |
| `tailwind.config.ts` | `tailwind.config.js` | Tailwind configuration |

## Utilities

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/lib/utils.ts` | `src/utils/index.js` | Utility functions |
| `src/utils/storage.ts` | `src/utils/storage.js` | Storage utilities |
| `src/utils/networkUtils.ts` | `src/utils/network.js` | Network utilities |
| `src/utils/errorConfig.ts` | `src/utils/error.js` | Error configuration |
| `src/utils/mobileSafari.ts` | `src/utils/mobile.js` | Mobile utilities |
| `src/utils/createGameEvents.ts` | `src/utils/games.js` | Game utilities |

## Types

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/types/auth.ts` | `src/types/auth.js` | Authentication types |
| `src/types/google.d.ts` | `src/types/google.js` | Google API types |

## Special Components

| React File | Vue 3 Equivalent | Purpose |
|------------|------------------|---------|
| `src/components/PostCard.tsx` | `src/components/posts/PostCard.vue` | Post display |
| `src/components/Pagination.tsx` | `src/components/ui/Pagination.vue` | Pagination (already in UI) |
| `src/components/AddressInput.tsx` | `src/components/ui/AddressInput.vue` | Address input |

## Migration Notes

### Key Differences:
1. **File Extensions**: `.tsx` → `.vue`, `.ts` → `.js` (or keep `.ts` for TypeScript)
2. **Component Structure**: React functional components → Vue 3 Composition API with `<script setup>`
3. **State Management**: React Context + hooks → Vuex store + composables
4. **Routing**: React Router → Vue Router
5. **Styling**: Same Tailwind CSS classes can be reused

### Migration Strategy:
1. Start with the main layout and routing
2. Migrate authentication system
3. Build core features (Games, Tournaments, etc.)
4. Convert UI components
5. Add services and utilities
6. Implement testing and optimization

This mapping provides a comprehensive guide for converting the entire React codebase to Vue 3 while maintaining all functionality and improving the development experience.
