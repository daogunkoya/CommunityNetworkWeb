# Game Discussions Backend Implementation Guide

## Overview
This document outlines the backend API changes needed to support game-specific discussions in the CommunityNetworkApi.

## Required Backend Changes

### 1. Database Schema Updates

Add a `game_event_id` column to the discussions table to associate discussions with specific game events:

```sql
-- Add game_event_id column to discussions table
ALTER TABLE discussions ADD COLUMN game_event_id BIGINT UNSIGNED NULL;
ALTER TABLE discussions ADD FOREIGN KEY (game_event_id) REFERENCES game_events(id) ON DELETE CASCADE;
```

### 2. API Endpoint Updates

#### Update Discussion Creation Endpoint
Modify the existing `POST /api/discussions` endpoint to accept `game_event_id`:

```php
// In your DiscussionController or similar
public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'body' => 'required|string',
        'game_type_id' => 'nullable|exists:game_types,id',
        'game_event_id' => 'nullable|exists:game_events,id', // Add this validation
    ]);

    $discussion = Discussion::create([
        'title' => $request->title,
        'body' => $request->body,
        'user_id' => auth()->id(),
        'game_type_id' => $request->game_type_id,
        'game_event_id' => $request->game_event_id, // Add this field
    ]);

    return response()->json([
        'success' => true,
        'data' => $discussion->load(['author', 'gameType', 'gameEvent']),
        'message' => 'Discussion created successfully'
    ]);
}
```

#### Update Discussion Listing Endpoint
Modify the existing `GET /api/discussions` endpoint to support filtering by `game_event_id`:

```php
public function index(Request $request)
{
    $query = Discussion::with(['author', 'gameType', 'gameEvent'])
        ->withCount(['likes', 'comments']);

    // Add game_event_id filter
    if ($request->has('game_event_id')) {
        $query->where('game_event_id', $request->game_event_id);
    }

    // Existing filters...
    if ($request->has('game_type')) {
        $query->whereHas('gameType', function($q) use ($request) {
            $q->where('name', $request->game_type);
        });
    }

    if ($request->has('search')) {
        $query->where(function($q) use ($request) {
            $q->where('title', 'like', '%' . $request->search . '%')
              ->orWhere('body', 'like', '%' . $request->search . '%');
        });
    }

    // Sorting
    $sort = $request->get('sort', 'latest');
    switch ($sort) {
        case 'popular':
            $query->orderBy('likes_count', 'desc');
            break;
        case 'trending':
            $query->orderBy('comments_count', 'desc');
            break;
        default:
            $query->orderBy('created_at', 'desc');
    }

    $discussions = $query->paginate($request->get('per_page', 15));

    return response()->json([
        'success' => true,
        'data' => $discussions->items(),
        'pagination' => [
            'current_page' => $discussions->currentPage(),
            'last_page' => $discussions->lastPage(),
            'per_page' => $discussions->perPage(),
            'total' => $discussions->total(),
        ]
    ]);
}
```

### 3. Model Updates

#### Update Discussion Model
Add the relationship to GameEvent:

```php
// In your Discussion model
class Discussion extends Model
{
    protected $fillable = [
        'title',
        'body',
        'user_id',
        'game_type_id',
        'game_event_id', // Add this
    ];

    // Existing relationships...
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function gameType()
    {
        return $this->belongsTo(GameType::class, 'game_type_id');
    }

    // Add this new relationship
    public function gameEvent()
    {
        return $this->belongsTo(GameEvent::class, 'game_event_id');
    }

    public function likes()
    {
        return $this->hasMany(DiscussionLike::class);
    }

    public function comments()
    {
        return $this->hasMany(DiscussionComment::class);
    }
}
```

#### Update GameEvent Model
Add the reverse relationship:

```php
// In your GameEvent model
class GameEvent extends Model
{
    // Existing relationships...

    // Add this new relationship
    public function discussions()
    {
        return $this->hasMany(Discussion::class, 'game_event_id');
    }
}
```

### 4. API Response Updates

Update the discussion response to include game event information:

```php
// In your DiscussionResource or similar
class DiscussionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'excerpt' => Str::limit($this->body, 150),
            'author' => [
                'id' => $this->author->id,
                'name' => $this->author->name,
                'avatar' => $this->author->avatar,
            ],
            'game_type' => $this->gameType ? [
                'id' => $this->gameType->id,
                'name' => $this->gameType->name,
                'color' => $this->gameType->color,
            ] : null,
            'game_event' => $this->gameEvent ? [
                'id' => $this->gameEvent->id,
                'title' => $this->gameEvent->title,
                'sport' => $this->gameEvent->sport,
                'location' => $this->gameEvent->location,
                'starts_at' => $this->gameEvent->starts_at,
            ] : null,
            'stats' => [
                'likes_count' => $this->likes_count,
                'comments_count' => $this->comments_count,
            ],
            'user_interaction' => [
                'is_liked' => $this->likes()->where('user_id', auth()->id())->exists(),
                'can_edit' => $this->user_id === auth()->id(),
                'can_delete' => $this->user_id === auth()->id(),
            ],
            'created_at' => $this->created_at,
            'created_at_relative' => $this->created_at->diffForHumans(),
            'updated_at' => $this->updated_at,
        ];
    }
}
```

### 5. Testing the Implementation

#### Test Discussion Creation with Game Event
```bash
curl -X POST http://localhost:8001/api/discussions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Great game yesterday!",
    "body": "Had an amazing time playing basketball. Thanks everyone!",
    "game_event_id": 123
  }'
```

#### Test Game-Specific Discussion Listing
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8001/api/discussions?game_event_id=123"
```

### 6. Frontend Integration

The frontend has been updated to:
1. Navigate to `/games/:id/discuss` when clicking "Discuss" on game cards
2. Pass `game_event_id` when creating discussions from game pages
3. Filter discussions by `game_event_id` when viewing game-specific discussions

### 7. Benefits of This Implementation

1. **Contextual Discussions**: Players can discuss specific games
2. **Better Organization**: Discussions are tied to relevant game events
3. **Enhanced UX**: Users can easily find discussions about games they're interested in
4. **Scalable**: Can easily extend to support other entity-specific discussions
5. **Backward Compatible**: Existing general discussions continue to work

### 8. Migration Strategy

1. **Phase 1**: Add database column and update models
2. **Phase 2**: Update API endpoints to support game_event_id
3. **Phase 3**: Deploy frontend changes
4. **Phase 4**: Test end-to-end functionality

This implementation provides a solid foundation for game-specific discussions while maintaining compatibility with the existing discussion system.
