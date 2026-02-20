# Backend API Implementation Guide

## Issue: Sport Stats Not Filtered by User Interests

The current `/api/sport-stats` endpoint returns counts for ALL sports, but when users filter by their interests, they need sport statistics that only include their interested sports.

## Solution: Create User-Specific Sport Stats Endpoint

### 1. Backend API Endpoint to Add

Add this route to your API routes file (likely `routes/api.php` or a specific routes file):

```php
// Add this route to your API routes
Route::middleware('auth:api')->get('/sport-stats/user-interests', [SportStatsController::class, 'getUserSportStats']);
```

### 2. Backend Controller Method to Add

Add this method to your `SportStatsController` (or create the controller if it doesn't exist):

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SportStatsController extends Controller
{
    /**
     * Get sport statistics filtered by user's interests
     */
    public function getUserSportStats(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Get user's sport interests
            $userInterests = $user->gameInterests()->get();
            
            if ($userInterests->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No sport interests set. Set your interests to see personalized sport statistics.'
                ]);
            }
            
            // Get game type IDs for user's interests
            $gameTypeIds = $userInterests->pluck('id')->toArray();
            
            // Count events for each sport in user's interests
            $sportStats = DB::table('game_events as ge')
                ->join('game_types as gt', 'ge.game_type_id', '=', 'gt.id')
                ->whereIn('ge.game_type_id', $gameTypeIds)
                ->where('ge.starts_at', '>', now()) // Only future events
                ->select([
                    'gt.name as name',
                    'gt.color as color',
                    DB::raw('COUNT(ge.id) as count')
                ])
                ->groupBy('gt.id', 'gt.name', 'gt.color')
                ->orderBy('count', 'desc')
                ->get()
                ->map(function ($stat) {
                    return [
                        'name' => $stat->name,
                        'count' => (int) $stat->count,
                        'color' => $stat->color ?: 'bg-accent'
                    ];
                });
            
            return response()->json([
                'success' => true,
                'data' => $sportStats,
                'message' => 'Sport statistics filtered by your interests'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('User sport stats error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user sport statistics',
            ], 500);
        }
    }
}
```

### 3. Alternative: Extend Existing Controller

If you already have a controller handling sport stats, you can add this method to it instead of creating a new controller.

### 4. Database Query Explanation

The query:
1. **Joins** `game_events` with `game_types` tables
2. **Filters** by user's interest game type IDs
3. **Only counts future events** (events that haven't started yet)
4. **Groups by sport** to get counts per sport
5. **Orders by count** (most popular sports first)
6. **Returns** name, count, and color for each sport

### 5. Frontend Integration

The frontend has been updated to:
1. **Call the new endpoint** when user wants interest-based filtering
2. **Fall back to general endpoint** when showing all sports
3. **Automatically switch** between endpoints based on user's filtering preference

### 6. Expected API Response

```json
{
  "success": true,
  "data": [
    {
      "name": "Tennis",
      "count": 7,
      "color": "bg-sport-green"
    },
    {
      "name": "Running", 
      "count": 7,
      "color": "bg-accent"
    },
    {
      "name": "Basketball",
      "count": 1,
      "color": "bg-sport-blue"
    }
  ],
  "message": "Sport statistics filtered by your interests"
}
```

### 7. Testing the Endpoint

Once implemented, test with:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     "http://localhost:8001/api/sport-stats/user-interests"
```

### 8. Benefits of This Approach

1. **Accurate counts** - Backend calculates correct counts from database
2. **Performance** - No frontend calculation needed
3. **Consistency** - Same logic as other filtered endpoints
4. **Scalability** - Database handles the heavy lifting
5. **Real-time** - Always up-to-date with current events

This solution ensures that sport counts are always accurate and come directly from the API, eliminating the frontend calculation issues.
