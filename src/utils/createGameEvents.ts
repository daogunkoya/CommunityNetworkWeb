import { api } from '../services/api';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_picture?: string;
  location?: string;
}

export async function createGameEventsForTesting() {
  try {
    console.log('Creating game events for testing...');
    
    // Get existing users
    const usersResponse = await api.get('/location/community-users?limit=10');
    const users: User[] = usersResponse.data.success ? usersResponse.data.data : [];
    
    if (users.length === 0) {
      console.log('No users found to create events with');
      return;
    }
    
    console.log(`Found ${users.length} users:`, users.map(u => u.full_name));
    
    // Get game types
    const gameTypesResponse = await api.get('/game-types');
    const gameTypes = gameTypesResponse.data || [];
    
    if (gameTypes.length === 0) {
      console.log('No game types found');
      return;
    }
    
    // Create a tennis game event
    const tennisGameType = gameTypes.find((gt: any) => gt.name.toLowerCase().includes('tennis')) || gameTypes[0];
    
    const tennisEventData = {
      game_type_id: tennisGameType.id,
      location: 'Central Tennis Court',
      address: '123 Sports Avenue, London',
      city: 'London',
      state: 'England',
      country: 'UK',
      starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      skill_level: 2,
      max_participants: 8,
      waiting_list_enabled: true,
      notes: 'Looking for intermediate players for a friendly match!',
      venue_booked: true
    };
    
    const tennisEventResponse = await api.post('/events', tennisEventData);
    
    if (tennisEventResponse.data.success) {
      console.log('Created tennis event:', tennisEventResponse.data.data.id);
      
      // Join some users to the tennis event
      const eventId = tennisEventResponse.data.data.id;
      const usersToJoin = users.slice(0, Math.min(3, users.length));
      
      for (const user of usersToJoin) {
        try {
          await api.post(`/events/${eventId}/join`);
          console.log(`Joined ${user.full_name} to tennis event`);
        } catch (error: any) {
          console.log(`Could not join ${user.full_name} to tennis event:`, error.response?.data?.message || error.message);
        }
      }
    }
    
    // Create a basketball game event
    const basketballGameType = gameTypes.find((gt: any) => gt.name.toLowerCase().includes('basketball')) || gameTypes[0];
    
    const basketballEventData = {
      game_type_id: basketballGameType.id,
      location: 'Community Basketball Court',
      address: '456 Sports Street, London',
      city: 'London',
      state: 'England',
      country: 'UK',
      starts_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      skill_level: 1,
      max_participants: 10,
      waiting_list_enabled: true,
      notes: 'Casual basketball game, all skill levels welcome!',
      venue_booked: false
    };
    
    const basketballEventResponse = await api.post('/events', basketballEventData);
    
    if (basketballEventResponse.data.success) {
      console.log('Created basketball event:', basketballEventResponse.data.data.id);
      
      // Join some different users to the basketball event
      const eventId = basketballEventResponse.data.data.id;
      const usersToJoin = users.slice(Math.min(2, users.length), Math.min(5, users.length));
      
      for (const user of usersToJoin) {
        try {
          await api.post(`/events/${eventId}/join`);
          console.log(`Joined ${user.full_name} to basketball event`);
        } catch (error: any) {
          console.log(`Could not join ${user.full_name} to basketball event:`, error.response?.data?.message || error.message);
        }
      }
    }
    
    console.log('Game events created successfully!');
    
  } catch (error: any) {
    console.error('Error creating game events:', error.response?.data || error.message);
  }
}

// Export for use in development
export default createGameEventsForTesting;







