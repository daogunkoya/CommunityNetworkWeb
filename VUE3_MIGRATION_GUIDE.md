# Vue 3 + Composition API + Vuex Migration Guide

## Overview
This guide provides a complete roadmap for migrating the MatchGrinder React application to Vue 3 with Composition API and Vuex for state management.

## Project Structure Analysis

### Current React App Features
- **Authentication**: Google OAuth, Email/Password login, Registration flow
- **Main Features**: Games, Tournaments, Discussions, Messages, Profile
- **UI Components**: Comprehensive component library with Tailwind CSS
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6 with protected routes
- **API Integration**: Axios with comprehensive error handling

## Vue 3 Migration Strategy

### 1. Project Setup

#### Initial Vue 3 Project Creation
```bash
# Create Vue 3 project with Vite
npm create vue@latest matchgrinder-vue
cd matchgrinder-vue

# Install additional dependencies
npm install vuex@next @vue/composition-api vue-router@4
npm install axios @tanstack/vue-query
npm install @headlessui/vue @heroicons/vue
npm install tailwindcss @tailwindcss/forms @tailwindcss/typography
npm install date-fns zod @vueuse/core
npm install lucide-vue-next
```

#### Project Structure
```
src/
├── components/
│   ├── auth/
│   ├── ui/
│   ├── layout/
│   └── features/
├── views/
├── stores/
├── services/
├── composables/
├── types/
├── utils/
└── router/
```

### 2. Authentication System

#### Vuex Store Structure
```javascript
// stores/auth.js
import { createStore } from 'vuex'
import authService from '@/services/auth'

export default createStore({
  state: {
    user: null,
    token: null,
    loading: false,
    isAuthenticated: false
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    }
  },
  actions: {
    async login({ commit }, credentials) {
      commit('SET_LOADING', true)
      try {
        const response = await authService.login(credentials)
        commit('SET_USER', response.data.user)
        commit('SET_TOKEN', response.data.token)
        return { success: true }
      } catch (error) {
        return { success: false, error }
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async logout({ commit }) {
      try {
        await authService.logout()
      } finally {
        commit('CLEAR_AUTH')
      }
    }
  },
  getters: {
    user: state => state.user,
    isAuthenticated: state => state.isAuthenticated,
    loading: state => state.loading
  }
})
```

#### Auth Composable
```javascript
// composables/useAuth.js
import { computed } from 'vue'
import { useStore } from 'vuex'

export function useAuth() {
  const store = useStore()
  
  const user = computed(() => store.getters.user)
  const isAuthenticated = computed(() => store.getters.isAuthenticated)
  const loading = computed(() => store.getters.loading)
  
  const login = async (credentials) => {
    return await store.dispatch('login', credentials)
  }
  
  const logout = async () => {
    return await store.dispatch('logout')
  }
  
  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  }
}
```

### 3. Routing System

#### Vue Router Configuration
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/views/LandingPage.vue')
  },
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('@/views/auth/SigninPage.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterPage.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('@/views/Games.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/games/:id',
    name: 'GameDetail',
    component: () => import('@/views/GameDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tournament',
    name: 'Tournament',
    component: () => import('@/views/Tournament.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tournament/:id',
    name: 'TournamentDetail',
    component: () => import('@/views/TournamentDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/discussion',
    name: 'Discussion',
    component: () => import('@/views/Discussion.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('@/views/Messages.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/signin')
  } else {
    next()
  }
})

export default router
```

### 4. Feature-Specific Implementation

#### A. Games Feature

##### Games Store
```javascript
// stores/games.js
import { createStore } from 'vuex'
import gamesService from '@/services/games'

export default createStore({
  namespaced: true,
  state: {
    games: [],
    gameTypes: [],
    filters: {
      sport: null,
      skillLevel: null,
      location: null
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0
    },
    loading: false
  },
  mutations: {
    SET_GAMES(state, games) {
      state.games = games
    },
    SET_GAME_TYPES(state, types) {
      state.gameTypes = types
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = pagination
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async fetchGames({ commit, state }) {
      commit('SET_LOADING', true)
      try {
        const response = await gamesService.getGames(state.filters)
        commit('SET_GAMES', response.data)
        commit('SET_PAGINATION', response.pagination)
      } catch (error) {
        console.error('Failed to fetch games:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchGameTypes({ commit }) {
      try {
        const response = await gamesService.getGameTypes()
        commit('SET_GAME_TYPES', response.data)
      } catch (error) {
        console.error('Failed to fetch game types:', error)
      }
    }
  },
  getters: {
    games: state => state.games,
    gameTypes: state => state.gameTypes,
    filters: state => state.filters,
    pagination: state => state.pagination,
    loading: state => state.loading
  }
})
```

##### Games Composable
```javascript
// composables/useGames.js
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export function useGames() {
  const store = useStore('games')
  
  const games = computed(() => store.getters.games)
  const gameTypes = computed(() => store.getters.gameTypes)
  const loading = computed(() => store.getters.loading)
  const filters = computed(() => store.getters.filters)
  
  const fetchGames = () => store.dispatch('games/fetchGames')
  const fetchGameTypes = () => store.dispatch('games/fetchGameTypes')
  const updateFilters = (newFilters) => {
    store.commit('games/SET_FILTERS', newFilters)
    fetchGames()
  }
  
  onMounted(() => {
    fetchGames()
    fetchGameTypes()
  })
  
  return {
    games,
    gameTypes,
    loading,
    filters,
    fetchGames,
    fetchGameTypes,
    updateFilters
  }
}
```

##### Games View Component
```vue
<!-- views/Games.vue -->
<template>
  <div class="games-page">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Games</h1>
      <button 
        @click="openCreateModal"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Create New Game
      </button>
    </div>
    
    <!-- Filters -->
    <GameFilters 
      :filters="filters" 
      :game-types="gameTypes"
      @update="updateFilters"
    />
    
    <!-- Games List -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <GameCard 
        v-for="game in games" 
        :key="game.id" 
        :game="game"
        @join="handleJoin"
        @leave="handleLeave"
      />
    </div>
    
    <!-- Pagination -->
    <Pagination 
      :current-page="pagination.currentPage"
      :total-pages="pagination.totalPages"
      @page-change="handlePageChange"
    />
    
    <!-- Create Game Modal -->
    <CreateGameModal 
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleGameCreated"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGames } from '@/composables/useGames'
import GameFilters from '@/components/games/GameFilters.vue'
import GameCard from '@/components/games/GameCard.vue'
import CreateGameModal from '@/components/games/CreateGameModal.vue'
import Pagination from '@/components/ui/Pagination.vue'

const { games, gameTypes, loading, filters, updateFilters } = useGames()
const showCreateModal = ref(false)

const openCreateModal = () => {
  showCreateModal.value = true
}

const handleJoin = (gameId) => {
  // Handle join game logic
}

const handleLeave = (gameId) => {
  // Handle leave game logic
}

const handleGameCreated = () => {
  showCreateModal.value = false
  // Refresh games list
}

const handlePageChange = (page) => {
  // Handle pagination
}
</script>
```

#### B. Tournaments Feature

##### Tournaments Store
```javascript
// stores/tournaments.js
import { createStore } from 'vuex'
import tournamentsService from '@/services/tournaments'

export default createStore({
  namespaced: true,
  state: {
    tournaments: [],
    currentTournament: null,
    loading: false
  },
  mutations: {
    SET_TOURNAMENTS(state, tournaments) {
      state.tournaments = tournaments
    },
    SET_CURRENT_TOURNAMENT(state, tournament) {
      state.currentTournament = tournament
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async fetchTournaments({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await tournamentsService.getTournaments()
        commit('SET_TOURNAMENTS', response.data)
      } catch (error) {
        console.error('Failed to fetch tournaments:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchTournament({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        const response = await tournamentsService.getTournament(id)
        commit('SET_CURRENT_TOURNAMENT', response.data)
      } catch (error) {
        console.error('Failed to fetch tournament:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  getters: {
    tournaments: state => state.tournaments,
    currentTournament: state => state.currentTournament,
    loading: state => state.loading
  }
})
```

#### C. Messages Feature

##### Messages Store
```javascript
// stores/messages.js
import { createStore } from 'vuex'
import messagesService from '@/services/messages'

export default createStore({
  namespaced: true,
  state: {
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false
  },
  mutations: {
    SET_CONVERSATIONS(state, conversations) {
      state.conversations = conversations
    },
    SET_CURRENT_CONVERSATION(state, conversation) {
      state.currentConversation = conversation
    },
    SET_MESSAGES(state, messages) {
      state.messages = messages
    },
    ADD_MESSAGE(state, message) {
      state.messages.push(message)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async fetchConversations({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await messagesService.getConversations()
        commit('SET_CONVERSATIONS', response.data)
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchMessages({ commit }, conversationId) {
      commit('SET_LOADING', true)
      try {
        const response = await messagesService.getMessages(conversationId)
        commit('SET_MESSAGES', response.data)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async sendMessage({ commit }, { conversationId, message }) {
      try {
        const response = await messagesService.sendMessage(conversationId, message)
        commit('ADD_MESSAGE', response.data)
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }
  },
  getters: {
    conversations: state => state.conversations,
    currentConversation: state => state.currentConversation,
    messages: state => state.messages,
    loading: state => state.loading
  }
})
```

### 5. UI Components Migration

#### Base Button Component
```vue
<!-- components/ui/Button.vue -->
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></span>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'].includes(value)
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'sm', 'lg', 'icon'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

const buttonClasses = computed(() => buttonVariants({ variant: props.variant, size: props.size }))
</script>
```

#### Card Component
```vue
<!-- components/ui/Card.vue -->
<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outline'].includes(value)
  }
})

const cardClasses = computed(() => {
  const baseClasses = 'rounded-xl border bg-card text-card-foreground shadow'
  
  if (props.variant === 'outline') {
    return `${baseClasses} border-2`
  }
  
  return baseClasses
})
</script>
```

### 6. Centralized API Service

#### Single API Service File
```javascript
// services/api.js - CENTRALIZED API CALLS
import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://matchgrinder.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  }
)

// ===============================
// CENTRALIZED API CALLS - ALL ENDPOINTS IN ONE PLACE
// ===============================

export const apiService = {
  // ===============================
  // AUTHENTICATION ENDPOINTS
  // ===============================
  auth: {
    async login(credentials) {
      const response = await api.post('/login', credentials)
      return response.data
    },
    
    async register(userData) {
      const response = await api.post('/registration/register', userData)
      return response.data
    },
    
    async logout() {
      const response = await api.post('/logout')
      return response.data
    },
    
    async refreshToken() {
      const response = await api.post('/auth/refresh')
      return response.data
    },
    
    async socialAuth(authData) {
      const response = await api.post('/auth', {
        auth_type: authData.provider === 'google' ? 2 : 1,
        credentials: {
          access_token: authData.token,
          provider_id: authData.userData.id,
          profile: {
            email: authData.userData.email,
            first_name: authData.userData.name.split(' ')[0],
            last_name: authData.userData.name.split(' ').slice(1).join(' '),
          }
        }
      })
      return response.data
    }
  },

  // ===============================
  // GAMES ENDPOINTS
  // ===============================
  games: {
    async getGames(filters = {}) {
      const response = await api.get('/games', { params: filters })
      return response.data
    },
    
    async getGame(id) {
      const response = await api.get(`/games/${id}`)
      return response.data
    },
    
    async createGame(gameData) {
      const response = await api.post('/games', gameData)
      return response.data
    },
    
    async updateGame(id, gameData) {
      const response = await api.put(`/games/${id}`, gameData)
      return response.data
    },
    
    async deleteGame(id) {
      const response = await api.delete(`/games/${id}`)
      return response.data
    },
    
    async joinGame(gameId) {
      const response = await api.post(`/games/${gameId}/join`)
      return response.data
    },
    
    async leaveGame(gameId) {
      const response = await api.post(`/games/${gameId}/leave`)
      return response.data
    },
    
    async getGameTypes() {
      const response = await api.get('/game-types')
      return response.data
    },
    
    async getGameStats() {
      const response = await api.get('/games/stats')
      return response.data
    }
  },

  // ===============================
  // TOURNAMENTS ENDPOINTS
  // ===============================
  tournaments: {
    async getTournaments(filters = {}) {
      const response = await api.get('/tournaments', { params: filters })
      return response.data
    },
    
    async getTournament(id) {
      const response = await api.get(`/tournaments/${id}`)
      return response.data
    },
    
    async createTournament(tournamentData) {
      const response = await api.post('/tournaments', tournamentData)
      return response.data
    },
    
    async updateTournament(id, tournamentData) {
      const response = await api.put(`/tournaments/${id}`, tournamentData)
      return response.data
    },
    
    async deleteTournament(id) {
      const response = await api.delete(`/tournaments/${id}`)
      return response.data
    },
    
    async joinTournament(tournamentId) {
      const response = await api.post(`/tournaments/${tournamentId}/join`)
      return response.data
    },
    
    async leaveTournament(tournamentId) {
      const response = await api.post(`/tournaments/${tournamentId}/leave`)
      return response.data
    },
    
    async updateBracket(tournamentId, bracketData) {
      const response = await api.put(`/tournaments/${tournamentId}/bracket`, bracketData)
      return response.data
    },
    
    async updateMatchResult(tournamentId, matchId, resultData) {
      const response = await api.put(`/tournaments/${tournamentId}/matches/${matchId}`, resultData)
      return response.data
    }
  },

  // ===============================
  // DISCUSSIONS ENDPOINTS
  // ===============================
  discussions: {
    async getDiscussions(filters = {}) {
      const response = await api.get('/discussions', { params: filters })
      return response.data
    },
    
    async getDiscussion(id) {
      const response = await api.get(`/discussions/${id}`)
      return response.data
    },
    
    async createDiscussion(discussionData) {
      const response = await api.post('/discussions', discussionData)
      return response.data
    },
    
    async updateDiscussion(id, discussionData) {
      const response = await api.put(`/discussions/${id}`, discussionData)
      return response.data
    },
    
    async deleteDiscussion(id) {
      const response = await api.delete(`/discussions/${id}`)
      return response.data
    },
    
    async getComments(discussionId) {
      const response = await api.get(`/discussions/${discussionId}/comments`)
      return response.data
    },
    
    async addComment(discussionId, commentData) {
      const response = await api.post(`/discussions/${discussionId}/comments`, commentData)
      return response.data
    },
    
    async updateComment(commentId, commentData) {
      const response = await api.put(`/comments/${commentId}`, commentData)
      return response.data
    },
    
    async deleteComment(commentId) {
      const response = await api.delete(`/comments/${commentId}`)
      return response.data
    },
    
    async likeDiscussion(discussionId) {
      const response = await api.post(`/discussions/${discussionId}/like`)
      return response.data
    },
    
    async unlikeDiscussion(discussionId) {
      const response = await api.delete(`/discussions/${discussionId}/like`)
      return response.data
    }
  },

  // ===============================
  // MESSAGES ENDPOINTS
  // ===============================
  messages: {
    async getConversations() {
      const response = await api.get('/conversations')
      return response.data
    },
    
    async getConversation(id) {
      const response = await api.get(`/conversations/${id}`)
      return response.data
    },
    
    async createConversation(participantIds) {
      const response = await api.post('/conversations', { participant_ids: participantIds })
      return response.data
    },
    
    async getMessages(conversationId, page = 1) {
      const response = await api.get(`/conversations/${conversationId}/messages`, { 
        params: { page } 
      })
      return response.data
    },
    
    async sendMessage(conversationId, messageData) {
      const response = await api.post(`/conversations/${conversationId}/messages`, messageData)
      return response.data
    },
    
    async updateMessage(messageId, messageData) {
      const response = await api.put(`/messages/${messageId}`, messageData)
      return response.data
    },
    
    async deleteMessage(messageId) {
      const response = await api.delete(`/messages/${messageId}`)
      return response.data
    },
    
    async markAsRead(conversationId) {
      const response = await api.post(`/conversations/${conversationId}/mark-read`)
      return response.data
    },
    
    async sendTypingIndicator(conversationId) {
      const response = await api.post(`/conversations/${conversationId}/typing`)
      return response.data
    }
  },

  // ===============================
  // PROFILE ENDPOINTS
  // ===============================
  profile: {
    async getProfile() {
      const response = await api.get('/profile')
      return response.data
    },
    
    async updateProfile(profileData) {
      const response = await api.put('/profile', profileData)
      return response.data
    },
    
    async uploadAvatar(file) {
      const formData = new FormData()
      formData.append('avatar', file)
      const response = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    },
    
    async updatePreferences(preferences) {
      const response = await api.put('/profile/preferences', preferences)
      return response.data
    },
    
    async getAchievements() {
      const response = await api.get('/profile/achievements')
      return response.data
    },
    
    async getActivityStats() {
      const response = await api.get('/profile/activity-stats')
      return response.data
    },
    
    async getUserProfile(userId) {
      const response = await api.get(`/users/${userId}`)
      return response.data
    }
  },

  // ===============================
  // DASHBOARD ENDPOINTS
  // ===============================
  dashboard: {
    async getStats() {
      const response = await api.get('/dashboard/stats')
      return response.data
    },
    
    async getRecentActivity() {
      const response = await api.get('/dashboard/recent-activity')
      return response.data
    },
    
    async getUpcomingGames() {
      const response = await api.get('/dashboard/upcoming-games')
      return response.data
    },
    
    async getRecommendedGames() {
      const response = await api.get('/dashboard/recommended-games')
      return response.data
    }
  },

  // ===============================
  // UTILITY ENDPOINTS
  // ===============================
  utils: {
    async searchUsers(query) {
      const response = await api.get('/users/search', { params: { q: query } })
      return response.data
    },
    
    async getSports() {
      const response = await api.get('/sports')
      return response.data
    },
    
    async getLocations(query) {
      const response = await api.get('/locations/search', { params: { q: query } })
      return response.data
    },
    
    async uploadFile(file, type = 'general') {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    },
    
    async getNotifications() {
      const response = await api.get('/notifications')
      return response.data
    },
    
    async markNotificationRead(notificationId) {
      const response = await api.post(`/notifications/${notificationId}/read`)
      return response.data
    }
  }
}

// Export the axios instance for direct use if needed
export default api
export { apiService }
```

#### Usage in Vuex Stores
```javascript
// stores/games.js - Updated to use centralized API
import { apiService } from '@/services/api'

export default createStore({
  namespaced: true,
  state: {
    games: [],
    gameTypes: [],
    loading: false
  },
  mutations: {
    SET_GAMES(state, games) {
      state.games = games
    },
    SET_GAME_TYPES(state, types) {
      state.gameTypes = types
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async fetchGames({ commit, state }) {
      commit('SET_LOADING', true)
      try {
        const response = await apiService.games.getGames(state.filters)
        commit('SET_GAMES', response.data)
      } catch (error) {
        console.error('Failed to fetch games:', error)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async fetchGameTypes({ commit }) {
      try {
        const response = await apiService.games.getGameTypes()
        commit('SET_GAME_TYPES', response.data)
      } catch (error) {
        console.error('Failed to fetch game types:', error)
        throw error
      }
    },
    
    async createGame({ dispatch }, gameData) {
      try {
        await apiService.games.createGame(gameData)
        await dispatch('fetchGames') // Refresh the list
      } catch (error) {
        console.error('Failed to create game:', error)
        throw error
      }
    },
    
    async joinGame({ dispatch }, gameId) {
      try {
        await apiService.games.joinGame(gameId)
        await dispatch('fetchGames') // Refresh the list
      } catch (error) {
        console.error('Failed to join game:', error)
        throw error
      }
    }
  }
})
```

#### Usage in Composables
```javascript
// composables/useGames.js - Updated to use centralized API
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { apiService } from '@/services/api'

export function useGames() {
  const store = useStore('games')
  
  const games = computed(() => store.getters.games)
  const gameTypes = computed(() => store.getters.gameTypes)
  const loading = computed(() => store.getters.loading)
  
  // Direct API calls for immediate actions
  const createGame = async (gameData) => {
    try {
      const response = await apiService.games.createGame(gameData)
      await store.dispatch('games/fetchGames') // Refresh store
      return response
    } catch (error) {
      console.error('Failed to create game:', error)
      throw error
    }
  }
  
  const joinGame = async (gameId) => {
    try {
      const response = await apiService.games.joinGame(gameId)
      await store.dispatch('games/fetchGames') // Refresh store
      return response
    } catch (error) {
      console.error('Failed to join game:', error)
      throw error
    }
  }
  
  onMounted(() => {
    store.dispatch('games/fetchGames')
    store.dispatch('games/fetchGameTypes')
  })
  
  return {
    games,
    gameTypes,
    loading,
    createGame,
    joinGame,
    fetchGames: () => store.dispatch('games/fetchGames'),
    fetchGameTypes: () => store.dispatch('games/fetchGameTypes')
  }
}
```

### 7. Main App Setup

#### main.js
```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from './stores'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(store)

app.mount('#app')
```

#### App.vue
```vue
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user, loading } = useAuth()

onMounted(() => {
  // Initialize app
})
</script>
```

## Migration Prompts and File References

### Phase 1: Project Setup and Authentication
**Prompt**: "Create a Vue 3 project with Composition API, Vuex, and Vue Router for a sports community app. Set up authentication with Google OAuth and email/password login."

**Reference Files**:
- `src/hooks/useAuth.tsx`
- `src/services/auth.ts`
- `src/types/auth.ts`
- `src/components/auth/`

### Phase 2: Core Features - Games
**Prompt**: "Implement a games feature with Vuex store, composables, and components for creating, joining, and managing sports games."

**Reference Files**:
- `src/pages/Games.tsx`
- `src/pages/GameDetail.tsx`
- `src/components/CreateGameEventModal.tsx`
- `src/components/GameEventCard.tsx`
- `src/services/games.ts`
- `src/hooks/useGames.ts`

### Phase 3: Tournaments Feature
**Prompt**: "Create a tournaments feature with bracket management, participant tracking, and tournament creation."

**Reference Files**:
- `src/pages/Tournament.tsx`
- `src/pages/TournamentDetail.tsx`
- `src/components/CreateTournamentModal.tsx`
- `src/components/EditTournamentModal.tsx`
- `src/services/tournaments.ts`

### Phase 4: Discussion and Messages
**Prompt**: "Implement discussion forums and real-time messaging system with Vuex state management."

**Reference Files**:
- `src/pages/Discussion.tsx`
- `src/pages/DiscussionDetail.tsx`
- `src/pages/Messages.tsx`
- `src/components/CreateDiscussionModal.tsx`
- `src/components/CommentModal.tsx`
- `src/services/discussions.ts`
- `src/services/messages.ts`

### Phase 5: Profile and User Management
**Prompt**: "Create user profile management with image upload, preferences, and settings."

**Reference Files**:
- `src/pages/Profile.tsx`
- `src/services/profile.ts`
- `src/components/auth/RegistrationFlow.tsx`

### Phase 6: UI Components and Layout
**Prompt**: "Migrate the complete UI component library from React to Vue 3 with Tailwind CSS."

**Reference Files**:
- `src/components/ui/`
- `src/components/Layout.tsx`
- `src/components/TopHeader.tsx`
- `src/components/MobileNavigation.tsx`

## Key Differences and Considerations

### State Management
- **React**: Context API + TanStack Query
- **Vue 3**: Vuex + Vue Query (or Pinia for modern approach)

### Component Structure
- **React**: Functional components with hooks
- **Vue 3**: Composition API with `<script setup>`

### Routing
- **React**: React Router v6
- **Vue 3**: Vue Router v4

### Styling
- Both use Tailwind CSS (minimal changes needed)

### API Integration
- Axios configuration remains largely the same
- Error handling patterns can be reused

This migration guide provides a comprehensive roadmap for converting the React MatchGrinder app to Vue 3 while maintaining all functionality and improving the development experience with Vue's Composition API.
