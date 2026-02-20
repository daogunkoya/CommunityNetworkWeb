# Dashboard API Implementation Guide
## Senior PHP Developer Analysis & Recommendations

Based on the analysis of the existing Laravel API (`CommunityNetworkApi`), here's a comprehensive implementation plan for a dynamic, user-interest-based dashboard.

---

## 📊 Current Implementation Analysis

### **Existing Database Structure** ✅

#### **User Model** (`app/Models/User.php`)
- Has `gameInterests()` relationship (line 339-342)
- Relationship: `belongsToMany(GameType::class, 'game_user_interest')->withPivot('skill_level')`
- Has `joinedEvents()` relationship
- Has `skillLevels()` relationship via `UserSkillLevel` model
- Has location fields: `latitude`, `longitude`, `radius`
- Has `main_goal` field for user preferences

#### **Pivot Table**
- `game_user_interest` - Stores user's sport interests with skill levels
- Structure: `user_id`, `game_type_id`, `skill_level`

### **Current Dashboard Controller** (`app/Http/Controllers/Dashboard/DashboardController.php`)
- ✅ Has `stats()` method - Returns global statistics
- ❌ Missing `activity()` method - No personalized activity feed
- ❌ Missing `recommendedGames()` - No game recommendations
- ❌ Missing `relevantTournaments()` - No tournament recommendations

---

## 🚀 Implementation Plan

### **Phase 1: Enhance Dashboard Controller**

Create the following methods in `DashboardController.php`:

```php
<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\GameEvent;
use App\Models\Tournament;
use App\Models\Discussion;
use App\Models\GameType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics (EXISTING - KEEP AS IS)
     */
    public function stats(Request $request)
    {
        // ... existing implementation ...
    }

    /**
     * Get personalized activity feed based on user's sport interests
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function activity(Request $request)
    {
        try {
            $user = $request->user();
            
            // Validate request
            $validated = $request->validate([
                'limit' => 'integer|min:1|max:50',
                'page' => 'integer|min:1',
                'following' => 'boolean',
            ]);

            $limit = $validated['limit'] ?? 10;
            $page = $validated['page'] ?? 1;
            $followingOnly = $validated['following'] ?? false;

            // Get user's sport interests
            $userInterests = $user->gameInterests()->pluck('game_type_id')->toArray();

            if (empty($userInterests)) {
                // If no interests, return recent general activity
                return $this->getGeneralActivity($limit, $page);
            }

            // Build activity feed query
            $activities = collect();

            // 1. Get relevant game events
            $gameEvents = GameEvent::with(['organiser', 'gameType', 'participants'])
                ->whereIn('game_type_id', $userInterests)
                ->when($user->latitude && $user->longitude && $user->radius, function ($query) use ($user) {
                    // Filter by user's location radius
                    $earthRadius = 6371; // km
                    return $query->selectRaw("
                        *,
                        ({$earthRadius} * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
                    ", [$user->latitude, $user->longitude, $user->latitude])
                    ->having('distance', '<=', $user->radius ?? 50);
                })
                ->where('starts_at', '>=', now())
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(function ($event) {
                    return [
                        'id' => $event->id,
                        'type' => 'game',
                        'author' => [
                            'id' => $event->organiser->id,
                            'name' => $event->organiser->full_name,
                            'avatar' => $event->organiser->profile_picture,
                        ],
                        'content' => $event->notes ?? "New {$event->gameType->name} game at {$event->location}",
                        'sport' => $event->gameType->name,
                        'location' => $event->location,
                        'date' => $event->starts_at->format('l, M j, g:i A'),
                        'created_at' => $event->created_at,
                        'participants' => $event->participants->count(),
                        'max_participants' => $event->max_participants,
                        'skill_level' => $event->skill_level,
                        'likes' => 0, // Can be implemented with a likes table
                        'comments' => 0, // Can be implemented with comments
                        'is_liked' => false,
                    ];
                });

            $activities = $activities->merge($gameEvents);

            // 2. Get relevant discussions
            $discussions = Discussion::with(['user', 'gameType'])
                ->whereIn('game_type_id', $userInterests)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(function ($discussion) {
                    return [
                        'id' => $discussion->id,
                        'type' => 'discussion',
                        'author' => [
                            'id' => $discussion->user->id,
                            'name' => $discussion->user->full_name,
                            'avatar' => $discussion->user->profile_picture,
                        ],
                        'content' => $discussion->body,
                        'sport' => $discussion->gameType->name ?? null,
                        'created_at' => $discussion->created_at,
                        'likes' => $discussion->likes()->count(),
                        'comments' => $discussion->comments()->count(),
                        'is_liked' => $discussion->likes()->where('user_id', auth()->id())->exists(),
                    ];
                });

            $activities = $activities->merge($discussions);

            // 3. Sort by created_at and paginate
            $activities = $activities->sortByDesc('created_at')->values();
            $total = $activities->count();
            $activities = $activities->slice(($page - 1) * $limit, $limit)->values();

            return response()->json([
                'success' => true,
                'data' => $activities,
                'pagination' => [
                    'current_page' => $page,
                    'per_page' => $limit,
                    'total' => $total,
                    'last_page' => ceil($total / $limit),
                ],
                'user_interests' => $user->gameInterests()->pluck('name', 'id')->toArray(),
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard activity error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch activity feed',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get recommended games based on user's interests and location
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function recommendedGames(Request $request)
    {
        try {
            $user = $request->user();
            
            $validated = $request->validate([
                'limit' => 'integer|min:1|max:50',
            ]);

            $limit = $validated['limit'] ?? 3;

            // Get user's sport interests
            $userInterests = $user->gameInterests()->pluck('game_type_id')->toArray();

            if (empty($userInterests)) {
                // Return empty or recent games
                $games = GameEvent::with(['organiser', 'gameType', 'participants'])
                    ->where('starts_at', '>=', now())
                    ->orderBy('starts_at', 'asc')
                    ->limit($limit)
                    ->get();
            } else {
                // Get user's skill levels for their interests
                $userSkillLevels = $user->gameInterests()
                    ->pluck('game_user_interest.skill_level', 'game_type_id')
                    ->toArray();

                // Build recommendation query with scoring
                $games = GameEvent::with(['organiser', 'gameType', 'participants'])
                    ->whereIn('game_type_id', $userInterests)
                    ->where('starts_at', '>=', now())
                    ->where('organiser_id', '!=', $user->id) // Exclude own games
                    ->whereDoesntHave('participants', function ($query) use ($user) {
                        $query->where('user_id', $user->id); // Exclude already joined
                    })
                    // Location filtering
                    ->when($user->latitude && $user->longitude && $user->radius, function ($query) use ($user) {
                        $earthRadius = 6371; // km
                        return $query->selectRaw("
                            *,
                            ({$earthRadius} * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
                        ", [$user->latitude, $user->longitude, $user->latitude])
                        ->having('distance', '<=', $user->radius ?? 50);
                    })
                    // Skill level matching (within 1 level)
                    ->where(function ($query) use ($userSkillLevels) {
                        foreach ($userSkillLevels as $gameTypeId => $skillLevel) {
                            $query->orWhere(function ($q) use ($gameTypeId, $skillLevel) {
                                $q->where('game_type_id', $gameTypeId)
                                  ->whereBetween('skill_level', [
                                      max(1, $skillLevel - 1),
                                      min(4, $skillLevel + 1)
                                  ]);
                            });
                        }
                    })
                    ->orderBy('starts_at', 'asc')
                    ->limit($limit)
                    ->get();
            }

            // Format response
            $formattedGames = $games->map(function ($game) {
                return [
                    'id' => $game->id,
                    'title' => $game->title ?? "{$game->gameType->name} Game",
                    'sport' => $game->gameType->name,
                    'location' => $game->location,
                    'date' => $game->starts_at->format('l, M j, g:i A'),
                    'starts_at' => $game->starts_at->toISOString(),
                    'participants' => $game->participants->count(),
                    'maxParticipants' => $game->max_participants,
                    'skillLevel' => $this->formatSkillLevel($game->skill_level),
                    'organizer' => $game->organiser->full_name,
                    'organizer_id' => $game->organiser->id,
                    'status' => $this->getGameStatus($game),
                    'distance' => isset($game->distance) ? round($game->distance, 1) : null,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedGames,
                'user_interests' => $user->gameInterests()->pluck('name')->toArray(),
            ]);

        } catch (\Exception $e) {
            Log::error('Recommended games error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recommended games',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get relevant tournaments based on user's interests
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function relevantTournaments(Request $request)
    {
        try {
            $user = $request->user();
            
            $validated = $request->validate([
                'limit' => 'integer|min:1|max:50',
            ]);

            $limit = $validated['limit'] ?? 2;

            // Get user's sport interests
            $userInterests = $user->gameInterests()->pluck('game_type_id')->toArray();

            // Build query
            $tournaments = Tournament::with(['gameType', 'participants'])
                ->when(!empty($userInterests), function ($query) use ($userInterests) {
                    return $query->whereIn('game_type_id', $userInterests);
                })
                ->whereIn('status', ['open', 'filling-fast', 'registration-open'])
                ->where('start_date', '>=', now())
                ->whereDoesntHave('participants', function ($query) use ($user) {
                    $query->where('user_id', $user->id); // Exclude already joined
                })
                // Location filtering
                ->when($user->latitude && $user->longitude && $user->radius, function ($query) use ($user) {
                    $earthRadius = 6371; // km
                    return $query->selectRaw("
                        *,
                        ({$earthRadius} * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
                    ", [$user->latitude, $user->longitude, $user->latitude])
                    ->having('distance', '<=', $user->radius ?? 50);
                })
                ->orderBy('start_date', 'asc')
                ->limit($limit)
                ->get();

            // Format response
            $formattedTournaments = $tournaments->map(function ($tournament) {
                return [
                    'id' => $tournament->id,
                    'title' => $tournament->name,
                    'sport' => $tournament->gameType->name,
                    'location' => $tournament->location,
                    'date' => $tournament->start_date->format('M j, Y'),
                    'start_date' => $tournament->start_date->toISOString(),
                    'participants' => $tournament->participants->count(),
                    'maxParticipants' => $tournament->max_participants,
                    'prize' => $tournament->prize_pool ?? '£0',
                    'status' => ucfirst($tournament->status),
                    'entry_fee' => $tournament->entry_fee ?? 0,
                    'distance' => isset($tournament->distance) ? round($tournament->distance, 1) : null,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedTournaments,
            ]);

        } catch (\Exception $e) {
            Log::error('Relevant tournaments error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch tournaments',
            ], 500);
        }
    }

    /**
     * Get upcoming games for the user (joined games)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upcomingGames(Request $request)
    {
        try {
            $user = $request->user();
            
            $validated = $request->validate([
                'limit' => 'integer|min:1|max:50',
            ]);

            $limit = $validated['limit'] ?? 5;

            $games = $user->joinedEvents()
                ->with(['organiser', 'gameType', 'participants'])
                ->where('starts_at', '>=', now())
                ->orderBy('starts_at', 'asc')
                ->limit($limit)
                ->get()
                ->map(function ($game) {
                    return [
                        'id' => $game->id,
                        'title' => $game->title ?? "{$game->gameType->name} Game",
                        'sport' => $game->gameType->name,
                        'location' => $game->location,
                        'starts_at' => $game->starts_at->toISOString(),
                        'formatted_date' => $game->starts_at->format('l, M j, g:i A'),
                        'time_until' => $game->starts_at->diffForHumans(),
                        'organizer' => $game->organiser->full_name,
                        'participants' => $game->participants->count(),
                        'max_participants' => $game->max_participants,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $games,
            ]);

        } catch (\Exception $e) {
            Log::error('Upcoming games error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch upcoming games',
            ], 500);
        }
    }

    /**
     * Get user's sport interests/preferences
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function userInterests(Request $request)
    {
        try {
            $user = $request->user();

            $interests = $user->gameInterests()
                ->with('gameType')
                ->get()
                ->map(function ($interest) {
                    return [
                        'game_type_id' => $interest->id,
                        'name' => $interest->name,
                        'skill_level' => $interest->pivot->skill_level,
                        'color' => $interest->color,
                        'icon_path' => $interest->icon_path,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'interests' => $interests,
                    'sport_names' => $interests->pluck('name')->toArray(),
                    'count' => $interests->count(),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('User interests error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user interests',
            ], 500);
        }
    }

    /**
     * Get general activity (fallback when user has no interests)
     * 
     * @param int $limit
     * @param int $page
     * @return \Illuminate\Http\JsonResponse
     */
    private function getGeneralActivity(int $limit = 10, int $page = 1)
    {
        $activities = collect();

        // Recent game events
        $games = GameEvent::with(['organiser', 'gameType', 'participants'])
            ->where('starts_at', '>=', now())
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'type' => 'game',
                    'author' => [
                        'id' => $event->organiser->id,
                        'name' => $event->organiser->full_name,
                        'avatar' => $event->organiser->profile_picture,
                    ],
                    'content' => $event->notes ?? "New {$event->gameType->name} game",
                    'sport' => $event->gameType->name,
                    'location' => $event->location,
                    'date' => $event->starts_at->format('l, M j, g:i A'),
                    'created_at' => $event->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $games,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $games->count(),
            ],
        ]);
    }

    /**
     * Helper: Format skill level
     */
    private function formatSkillLevel(int $level): string
    {
        return match($level) {
            1 => 'Beginner',
            2 => 'Intermediate',
            3 => 'Advanced',
            4 => 'Expert',
            default => 'All Levels',
        };
    }

    /**
     * Helper: Get game status
     */
    private function getGameStatus($game): string
    {
        $participantCount = $game->participants->count();
        $maxParticipants = $game->max_participants;

        if ($participantCount >= $maxParticipants) {
            return 'Full';
        } elseif ($participantCount >= ($maxParticipants * 0.8)) {
            return 'Almost Full';
        } else {
            return 'Open';
        }
    }
}
```

---

## 🛣️ **Phase 2: Update Routes**

Add these routes to `routes/api/dashboard.php`:

```php
<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

// Dashboard routes (protected)
Route::middleware('auth:api')->group(function () {
    Route::get('/home', HomeController::class);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    
    // NEW ENDPOINTS - Add these
    Route::get('/dashboard/activity', [DashboardController::class, 'activity']);
    Route::get('/dashboard/recommended-games', [DashboardController::class, 'recommendedGames']);
    Route::get('/dashboard/tournaments', [DashboardController::class, 'relevantTournaments']);
    Route::get('/dashboard/upcoming-games', [DashboardController::class, 'upcomingGames']);
    Route::get('/dashboard/interests', [DashboardController::class, 'userInterests']);
});
```

---

## 📝 **Phase 3: Database Optimization**

### **Add Indexes for Performance**

Create a new migration: `database/migrations/2025_10_14_create_dashboard_indexes.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Indexes for game_user_interest (user's sport interests)
        Schema::table('game_user_interest', function (Blueprint $table) {
            $table->index('user_id', 'idx_game_user_interest_user');
            $table->index('game_type_id', 'idx_game_user_interest_game_type');
            $table->index(['user_id', 'game_type_id'], 'idx_game_user_interest_user_game');
        });

        // Indexes for game_events (for faster filtering)
        Schema::table('game_events', function (Blueprint $table) {
            $table->index('game_type_id', 'idx_game_events_type');
            $table->index('starts_at', 'idx_game_events_starts_at');
            $table->index('organiser_id', 'idx_game_events_organiser');
            $table->index(['game_type_id', 'starts_at'], 'idx_game_events_type_date');
            $table->index(['latitude', 'longitude'], 'idx_game_events_location');
        });

        // Indexes for discussions
        Schema::table('discussions', function (Blueprint $table) {
            $table->index('game_type_id', 'idx_discussions_game_type');
            $table->index('created_at', 'idx_discussions_created_at');
            $table->index(['game_type_id', 'created_at'], 'idx_discussions_type_date');
        });

        // Indexes for tournaments
        Schema::table('tournaments', function (Blueprint $table) {
            $table->index('game_type_id', 'idx_tournaments_game_type');
            $table->index('status', 'idx_tournaments_status');
            $table->index('start_date', 'idx_tournaments_start_date');
            $table->index(['game_type_id', 'status'], 'idx_tournaments_type_status');
        });
    }

    public function down(): void
    {
        Schema::table('game_user_interest', function (Blueprint $table) {
            $table->dropIndex('idx_game_user_interest_user');
            $table->dropIndex('idx_game_user_interest_game_type');
            $table->dropIndex('idx_game_user_interest_user_game');
        });

        Schema::table('game_events', function (Blueprint $table) {
            $table->dropIndex('idx_game_events_type');
            $table->dropIndex('idx_game_events_starts_at');
            $table->dropIndex('idx_game_events_organiser');
            $table->dropIndex('idx_game_events_type_date');
            $table->dropIndex('idx_game_events_location');
        });

        Schema::table('discussions', function (Blueprint $table) {
            $table->dropIndex('idx_discussions_game_type');
            $table->dropIndex('idx_discussions_created_at');
            $table->dropIndex('idx_discussions_type_date');
        });

        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropIndex('idx_tournaments_game_type');
            $table->dropIndex('idx_tournaments_status');
            $table->dropIndex('idx_tournaments_start_date');
            $table->dropIndex('idx_tournaments_type_status');
        });
    }
};
```

---

## 🎯 **Phase 4: Enhanced User Profile Management**

### **Add Profile Controller Method for Managing Interests**

Add to `app/Http/Controllers/ProfileController.php`:

```php
/**
 * Update user's sport interests
 * 
 * @param Request $request
 * @return \Illuminate\Http\JsonResponse
 */
public function updateInterests(Request $request)
{
    try {
        $user = $request->user();
        
        $validated = $request->validate([
            'interests' => 'required|array',
            'interests.*.game_type_id' => 'required|exists:game_types,id',
            'interests.*.skill_level' => 'required|integer|min:1|max:4',
        ]);

        // Sync user interests
        $syncData = [];
        foreach ($validated['interests'] as $interest) {
            $syncData[$interest['game_type_id']] = [
                'skill_level' => $interest['skill_level']
            ];
        }

        $user->gameInterests()->sync($syncData);

        return response()->json([
            'success' => true,
            'message' => 'Interests updated successfully',
            'data' => $user->gameInterests()->get(),
        ]);

    } catch (\Exception $e) {
        Log::error('Update interests error: ' . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to update interests',
        ], 500);
    }
}

/**
 * Get user's sport interests
 * 
 * @param Request $request
 * @return \Illuminate\Http\JsonResponse
 */
public function getInterests(Request $request)
{
    try {
        $user = $request->user();

        $interests = $user->gameInterests()
            ->get()
            ->map(function ($gameType) {
                return [
                    'game_type_id' => $gameType->id,
                    'name' => $gameType->name,
                    'skill_level' => $gameType->pivot->skill_level,
                    'color' => $gameType->color,
                    'icon_path' => $gameType->icon_path,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $interests,
        ]);

    } catch (\Exception $e) {
        Log::error('Get interests error: ' . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch interests',
        ], 500);
    }
}
```

---

## 🛣️ **Phase 5: Update Routes for Profile**

Add to `routes/api/user.php`:

```php
<?php

use App\Http\Controllers\User\UserController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// User management routes (protected)
Route::middleware('auth:api')->group(function () {
    // User operations
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/user/online', [UserController::class, 'markOnline']);
    Route::post('/user/offline', [UserController::class, 'markOffline']);
    Route::post('/user/ping', [UserController::class, 'ping']);

    // Profile management
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']);
    
    // NEW ENDPOINTS - Add these
    Route::get('/profile/interests', [ProfileController::class, 'getInterests']);
    Route::post('/profile/interests', [ProfileController::class, 'updateInterests']);
});
```

---

## 🔧 **Phase 6: Testing & Verification**

### **API Endpoints to Test:**

```bash
# 1. Get user interests
GET /api/profile/interests
Authorization: Bearer {token}

# 2. Update user interests
POST /api/profile/interests
Authorization: Bearer {token}
Content-Type: application/json

{
  "interests": [
    { "game_type_id": 1, "skill_level": 2 },
    { "game_type_id": 3, "skill_level": 3 }
  ]
}

# 3. Get personalized activity feed
GET /api/dashboard/activity?limit=10&page=1
Authorization: Bearer {token}

# 4. Get recommended games
GET /api/dashboard/recommended-games?limit=3
Authorization: Bearer {token}

# 5. Get relevant tournaments
GET /api/dashboard/tournaments?limit=2
Authorization: Bearer {token}

# 6. Get upcoming games (joined games)
GET /api/dashboard/upcoming-games?limit=5
Authorization: Bearer {token}
```

---

## 📈 **Benefits of This Implementation**

### **1. Personalization**
- Activity feed shows only user's interested sports
- Games filtered by sport preference and skill level
- Location-based recommendations within user's radius

### **2. Performance**
- Database indexes for fast queries
- Efficient use of Eloquent relationships
- Proper eager loading to prevent N+1 queries

### **3. Scalability**
- Handles users with no interests (fallback to general content)
- Pagination support for large datasets
- Distance calculations using MySQL functions

### **4. User Experience**
- Relevant content based on preferences
- Location-aware recommendations
- Skill-appropriate suggestions

---

## 🎯 **Summary of Changes**

### **New API Endpoints:**
1. `GET /api/dashboard/activity` - Personalized activity feed
2. `GET /api/dashboard/recommended-games` - Game recommendations
3. `GET /api/dashboard/tournaments` - Relevant tournaments
4. `GET /api/dashboard/upcoming-games` - User's joined games
5. `GET /api/profile/interests` - Get user interests
6. `POST /api/profile/interests` - Update user interests

### **Database Enhancements:**
- Indexes on `game_user_interest` table
- Indexes on `game_events` for faster filtering
- Indexes on `discussions` and `tournaments`

### **Controller Methods:**
- `DashboardController::activity()` - Main activity feed
- `DashboardController::recommendedGames()` - Smart recommendations
- `DashboardController::relevantTournaments()` - Tournament suggestions
- `DashboardController::upcomingGames()` - User's schedule
- `DashboardController::userInterests()` - Get interests
- `ProfileController::getInterests()` - Get user interests
- `ProfileController::updateInterests()` - Update interests

This implementation follows Laravel best practices, uses proper error handling, and provides a scalable foundation for a personalized dashboard experience!
