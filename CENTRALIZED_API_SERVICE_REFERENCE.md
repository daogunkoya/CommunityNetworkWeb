# Centralized API Service Reference

This document provides a complete reference for the centralized API service used in the Vue 3 migration. All API calls are consolidated into a single file for easy maintenance and reference.

## File Structure

```
src/
└── services/
    └── api.js  ← ALL API CALLS IN THIS SINGLE FILE
```

## Import Usage

```javascript
// Import the centralized API service
import { apiService } from '@/services/api'

// Use specific sections
const games = await apiService.games.getGames()
const user = await apiService.auth.login(credentials)
const tournaments = await apiService.tournaments.getTournaments()
```

## Complete API Reference

### Authentication Endpoints (`apiService.auth.*`)

```javascript
// Login with email/password
await apiService.auth.login({ email, password })

// Register new user
await apiService.auth.register(userData)

// Logout user
await apiService.auth.logout()

// Refresh authentication token
await apiService.auth.refreshToken()

// Social authentication (Google, Facebook, etc.)
await apiService.auth.socialAuth({
  provider: 'google',
  token: accessToken,
  userData: googleUserData
})
```

### Games Endpoints (`apiService.games.*`)

```javascript
// Get games with filters
await apiService.games.getGames({ sport: 'tennis', skill_level: 'intermediate' })

// Get single game
await apiService.games.getGame(gameId)

// Create new game
await apiService.games.createGame({
  title: 'Tennis Match',
  sport_type_id: 1,
  location: 'Central Park',
  starts_at: '2024-01-15T10:00:00Z',
  max_participants: 4
})

// Update game
await apiService.games.updateGame(gameId, updateData)

// Delete game
await apiService.games.deleteGame(gameId)

// Join game
await apiService.games.joinGame(gameId)

// Leave game
await apiService.games.leaveGame(gameId)

// Get available sport types
await apiService.games.getGameTypes()

// Get game statistics
await apiService.games.getGameStats()
```

### Tournaments Endpoints (`apiService.tournaments.*`)

```javascript
// Get tournaments
await apiService.tournaments.getTournaments({ status: 'active' })

// Get single tournament
await apiService.tournaments.getTournament(tournamentId)

// Create tournament
await apiService.tournaments.createTournament({
  name: 'Spring Tennis Championship',
  sport_type_id: 1,
  max_participants: 32,
  entry_fee: 50,
  start_date: '2024-03-01T09:00:00Z'
})

// Update tournament
await apiService.tournaments.updateTournament(tournamentId, updateData)

// Delete tournament
await apiService.tournaments.deleteTournament(tournamentId)

// Join tournament
await apiService.tournaments.joinTournament(tournamentId)

// Leave tournament
await apiService.tournaments.leaveTournament(tournamentId)

// Update tournament bracket
await apiService.tournaments.updateBracket(tournamentId, bracketData)

// Update match result
await apiService.tournaments.updateMatchResult(tournamentId, matchId, {
  winner_id: playerId,
  score: '6-4, 6-2'
})
```

### Discussions Endpoints (`apiService.discussions.*`)

```javascript
// Get discussions
await apiService.discussions.getDiscussions({ sport: 'tennis', sort: 'popular' })

// Get single discussion
await apiService.discussions.getDiscussion(discussionId)

// Create discussion
await apiService.discussions.createDiscussion({
  title: 'Best Tennis Techniques',
  body: 'Share your favorite tennis techniques...',
  sport_type_id: 1
})

// Update discussion
await apiService.discussions.updateDiscussion(discussionId, updateData)

// Delete discussion
await apiService.discussions.deleteDiscussion(discussionId)

// Get comments for discussion
await apiService.discussions.getComments(discussionId)

// Add comment
await apiService.discussions.addComment(discussionId, {
  body: 'Great technique! I also recommend...'
})

// Update comment
await apiService.discussions.updateComment(commentId, updateData)

// Delete comment
await apiService.discussions.deleteComment(commentId)

// Like discussion
await apiService.discussions.likeDiscussion(discussionId)

// Unlike discussion
await apiService.discussions.unlikeDiscussion(discussionId)
```

### Messages Endpoints (`apiService.messages.*`)

```javascript
// Get conversations
await apiService.messages.getConversations()

// Get single conversation
await apiService.messages.getConversation(conversationId)

// Create conversation
await apiService.messages.createConversation([userId1, userId2])

// Get messages in conversation
await apiService.messages.getMessages(conversationId, page)

// Send message
await apiService.messages.sendMessage(conversationId, {
  body: 'Hey, want to play tennis tomorrow?',
  type: 'text'
})

// Update message
await apiService.messages.updateMessage(messageId, updateData)

// Delete message
await apiService.messages.deleteMessage(messageId)

// Mark conversation as read
await apiService.messages.markAsRead(conversationId)

// Send typing indicator
await apiService.messages.sendTypingIndicator(conversationId)
```

### Profile Endpoints (`apiService.profile.*`)

```javascript
// Get current user profile
await apiService.profile.getProfile()

// Update profile
await apiService.profile.updateProfile({
  first_name: 'John',
  last_name: 'Doe',
  bio: 'Tennis enthusiast',
  location: 'New York'
})

// Upload avatar
await apiService.profile.uploadAvatar(file)

// Update preferences
await apiService.profile.updatePreferences({
  notifications: true,
  public_profile: false
})

// Get achievements
await apiService.profile.getAchievements()

// Get activity statistics
await apiService.profile.getActivityStats()

// Get user profile by ID
await apiService.profile.getUserProfile(userId)
```

### Dashboard Endpoints (`apiService.dashboard.*`)

```javascript
// Get dashboard statistics
await apiService.dashboard.getStats()

// Get recent activity
await apiService.dashboard.getRecentActivity()

// Get upcoming games
await apiService.dashboard.getUpcomingGames()

// Get recommended games
await apiService.dashboard.getRecommendedGames()
```

### Utility Endpoints (`apiService.utils.*`)

```javascript
// Search users
await apiService.utils.searchUsers('john')

// Get sports list
await apiService.utils.getSports()

// Search locations
await apiService.utils.getLocations('central park')

// Upload file
await apiService.utils.uploadFile(file, 'profile_picture')

// Get notifications
await apiService.utils.getNotifications()

// Mark notification as read
await apiService.utils.markNotificationRead(notificationId)
```

## Usage in Vuex Stores

```javascript
// stores/games.js
import { apiService } from '@/services/api'

export default createStore({
  namespaced: true,
  actions: {
    async fetchGames({ commit }, filters) {
      try {
        const response = await apiService.games.getGames(filters)
        commit('SET_GAMES', response.data)
      } catch (error) {
        console.error('Failed to fetch games:', error)
        throw error
      }
    },
    
    async createGame({ dispatch }, gameData) {
      try {
        await apiService.games.createGame(gameData)
        await dispatch('fetchGames') // Refresh list
      } catch (error) {
        throw error
      }
    }
  }
})
```

## Usage in Composables

```javascript
// composables/useGames.js
import { apiService } from '@/services/api'

export function useGames() {
  const createGame = async (gameData) => {
    try {
      const response = await apiService.games.createGame(gameData)
      return response
    } catch (error) {
      console.error('Failed to create game:', error)
      throw error
    }
  }
  
  return { createGame }
}
```

## Usage in Components

```javascript
// components/CreateGameModal.vue
<script setup>
import { apiService } from '@/services/api'

const handleSubmit = async (formData) => {
  try {
    await apiService.games.createGame(formData)
    // Handle success
  } catch (error) {
    // Handle error
  }
}
</script>
```

## Error Handling

All API calls include consistent error handling:

```javascript
try {
  const response = await apiService.games.getGames()
  // Handle success
} catch (error) {
  // Error is automatically logged and formatted
  console.error('API Error:', error.message)
  // Handle user-facing error
}
```

## Configuration

The API service includes:

- **Base URL Configuration**: Environment-based API URL
- **Request Interceptors**: Automatic token attachment
- **Response Interceptors**: Error handling and token refresh
- **Timeout Configuration**: 10-second timeout for all requests
- **Content-Type Headers**: Automatic JSON headers

## Benefits

1. **Single Source of Truth**: All API endpoints in one location
2. **Easy Maintenance**: Update API calls in one place
3. **Consistent Error Handling**: Unified error handling across all endpoints
4. **Better Testing**: Easy to mock and test
5. **Improved Developer Experience**: Clear organization and easy reference
6. **Reduced Code Duplication**: Shared configuration and interceptors
7. **Type Safety**: Centralized TypeScript definitions

## Migration Notes

When migrating from React:

1. **Consolidate Services**: Merge all individual service files into `api.js`
2. **Update Imports**: Change from `import gamesService from './games'` to `import { apiService } from './api'`
3. **Update Calls**: Change from `gamesService.getGames()` to `apiService.games.getGames()`
4. **Maintain Functionality**: All existing functionality preserved with better organization

This centralized approach ensures maintainability, consistency, and ease of use across the entire Vue 3 application.

