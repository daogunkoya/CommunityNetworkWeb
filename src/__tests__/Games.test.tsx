import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import Games from '../pages/Games';
import { useGames } from '../hooks/useGames';

// Mock the hooks
vi.mock('../hooks/useGames');
vi.mock('../hooks/useAuth');
vi.mock('../hooks/use-toast');

const mockUseGames = vi.mocked(useGames);
const mockUseAuth = vi.mocked(require('../hooks/useAuth').useAuth);
const mockUseToast = vi.mocked(require('../hooks/use-toast').useToast);

const mockUser = {
  id: 1,
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
};

const mockEvents = [
  {
    id: 1,
    title: 'Football Match',
    location: 'Central Park',
    starts_at: '2023-12-25T14:00:00Z',
    starts_at_relative: 'Tomorrow',
    sport: 'Football',
    skill_level: 1,
    skill_level_label: 'Beginner',
    current_participants: 5,
    max_participants: 10,
    notes: 'Fun game for everyone',
    venue_booked: true,
    organiser: {
      id: 1,
      name: 'John Doe',
      avatar: null,
    },
    participants: [],
    user_participation: {
      can_join: true,
      is_participating: false,
    },
  },
  {
    id: 2,
    title: 'Basketball Game',
    location: 'Sports Center',
    starts_at: '2023-12-26T16:00:00Z',
    starts_at_relative: 'In 2 days',
    sport: 'Basketball',
    skill_level: 2,
    skill_level_label: 'Intermediate',
    current_participants: 8,
    max_participants: 12,
    notes: 'Competitive game',
    venue_booked: false,
    organiser: {
      id: 2,
      name: 'Jane Smith',
      avatar: 'profile-pictures/jane.jpg',
    },
    participants: [
      { id: 1, name: 'John Doe', avatar: null },
      { id: 2, name: 'Jane Smith', avatar: 'profile-pictures/jane.jpg' },
    ],
    user_participation: {
      can_join: true,
      is_participating: false,
    },
  },
];

const mockSportStats = [
  { name: 'Football', count: 5, color: 'bg-blue-500' },
  { name: 'Basketball', count: 3, color: 'bg-orange-500' },
  { name: 'Tennis', count: 2, color: 'bg-green-500' },
];

const mockPagination = {
  current_page: 1,
  last_page: 3,
  per_page: 12,
  total: 25,
};

const mockUseGamesReturn = {
  events: mockEvents,
  pagination: mockPagination,
  sportStats: mockSportStats,
  isLoading: false,
  joinEvent: vi.fn(),
  leaveEvent: vi.fn(),
  isJoining: false,
  isLeaving: false,
};

const mockToast = {
  toast: vi.fn(),
};

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Games Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock auth hook
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoggedIn: true,
      signIn: vi.fn(),
    });

    // Mock toast hook
    mockUseToast.mockReturnValue(mockToast);

    // Mock games hook
    mockUseGames.mockReturnValue(mockUseGamesReturn);
  });

  it('renders games list correctly', async () => {
    renderWithProviders(<Games />);

    await waitFor(() => {
      expect(screen.getByText('Football Match')).toBeInTheDocument();
      expect(screen.getByText('Basketball Game')).toBeInTheDocument();
      expect(screen.getByText('Central Park')).toBeInTheDocument();
      expect(screen.getByText('Sports Center')).toBeInTheDocument();
    });
  });

  it('shows login required when user is not logged in', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoggedIn: false,
      signIn: vi.fn(),
    });

    renderWithProviders(<Games />);

    expect(screen.getByText('Login Required')).toBeInTheDocument();
    expect(screen.getByText('You need to be logged in to view games.')).toBeInTheDocument();
  });

  it('shows loading state while fetching games', () => {
    mockUseGames.mockReturnValue({
      ...mockUseGamesReturn,
      isLoading: true,
    });

    renderWithProviders(<Games />);

    expect(screen.getByText('Loading games...')).toBeInTheDocument();
  });

  it('displays sport categories correctly', async () => {
    renderWithProviders(<Games />);

    await waitFor(() => {
      expect(screen.getByText('Football')).toBeInTheDocument();
      expect(screen.getByText('Basketball')).toBeInTheDocument();
      expect(screen.getByText('Tennis')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument(); // Football count
      expect(screen.getByText('3')).toBeInTheDocument(); // Basketball count
    });
  });

  it('filters games by sport when sport category is clicked', async () => {
    renderWithProviders(<Games />);

    await waitFor(() => {
      expect(screen.getByText('Football')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Football'));

    // The useGames hook should be called with the sport filter
    expect(mockUseGames).toHaveBeenCalledWith(
      expect.objectContaining({
        sport: 'Football',
      })
    );
  });

  it('filters games by search term', async () => {
    renderWithProviders(<Games />);

    const searchInput = screen.getByPlaceholderText('Search by location...');
    fireEvent.change(searchInput, { target: { value: 'Central Park' } });

    // The useGames hook should be called with the location filter
    expect(mockUseGames).toHaveBeenCalledWith(
      expect.objectContaining({
        location: 'Central Park',
      })
    );
  });

  it('filters games by skill level', async () => {
    renderWithProviders(<Games />);

    const skillSelect = screen.getByDisplayValue('All Skill Levels');
    fireEvent.click(skillSelect);

    const beginnerOption = screen.getByText('Beginner');
    fireEvent.click(beginnerOption);

    expect(mockUseGames).toHaveBeenCalledWith(
      expect.objectContaining({
        skill_level: 1,
      })
    );
  });

  it('filters games by date range', async () => {
    renderWithProviders(<Games />);

    const dateSelect = screen.getByDisplayValue('All Dates');
    fireEvent.click(dateSelect);

    const todayOption = screen.getByText('Today');
    fireEvent.click(todayOption);

    expect(mockUseGames).toHaveBeenCalledWith(
      expect.objectContaining({
        date_from: expect.any(String),
        date_to: expect.any(String),
      })
    );
  });

  it('toggles my games only filter', async () => {
    renderWithProviders(<Games />);

    const myGamesToggle = screen.getByRole('checkbox');
    fireEvent.click(myGamesToggle);

    expect(mockUseGames).toHaveBeenCalledWith(
      expect.objectContaining({
        my_games_only: true,
      })
    );
  });

  it('joins a game when join button is clicked', async () => {
    const mockJoinEvent = vi.fn();
    mockUseGames.mockReturnValue({
      ...mockUseGamesReturn,
      joinEvent: mockJoinEvent,
    });

    renderWithProviders(<Games />);

    await waitFor(() => {
      expect(screen.getByText('Join')).toBeInTheDocument();
    });

    const joinButtons = screen.getAllByText('Join');
    fireEvent.click(joinButtons[0]);

    expect(mockJoinEvent).toHaveBeenCalledWith(1);
  });

  it('leaves a game when leave button is clicked', async () => {
    const mockLeaveEvent = vi.fn();
    const eventsWithParticipation = mockEvents.map(event => ({
      ...event,
      user_participation: {
        can_join: false,
        is_participating: true,
      },
    }));

    mockUseGames.mockReturnValue({
      ...mockUseGamesReturn,
      events: eventsWithParticipation,
      leaveEvent: mockLeaveEvent,
    });

    renderWithProviders(<Games />);

    await waitFor(() => {
      expect(screen.getByText('Leave')).toBeInTheDocument();
    });

    const leaveButtons = screen.getAllByText('Leave');
    fireEvent.click(leaveButtons[0]);

    expect(mockLeaveEvent).toHaveBeenCalledWith(1);
  });

  it('shows loading state when joining a game', async () => {
    mockUseGames.mockReturnValue({
      ...mockUseGamesReturn,
      isJoining: true,
    });

    renderWithProviders(<Games />);

    await waitFor(() => {
      expect(screen.getByText('Joining...')).toBeInTheDocument();
    });
  });

  it('shows loading state when leaving a game', async () => {
    const eventsWithParticipation = mockEvents.map(event => ({
      ...event,
      user_participation: {
        can_join: false,
        is_participating: true,
      },
    }));

    mockUseGames.mockReturnValue({
      ...mockUseGamesReturn,
      events: eventsWithParticipation,
      isLeaving: true,
    });

    renderWithProviders(<Games />);

    await waitFor(() => {
      expect(screen.getByText('Leaving...')).toBeInTheDocument();
    });
  });

  it('displays game details correctly', async () => {
    renderWithProviders(<Games />);

    await waitFor(() => {
      expect(screen.getByText('Football Match')).toBeInTheDocument();
      expect(screen.getByText('Central Park')).toBeInTheDocument();
      expect(screen.getByText('Tomorrow')).toBeInTheDocument();
      expect(screen.getByText('5/10')).toBeInTheDocument();
      expect(screen.getByText('Beginner')).toBeInTheDocument();
      expect(screen.getByText('Venue Booked')).toBeInTheDocument();
    });
  });

  it('displays participants correctly', async () => {
    renderWithProviders(<Games />);

    await waitFor(() => {
      expect(screen.getByText('Participants:')).toBeInTheDocument();
      expect(screen.getByText('+1 more')).toBeInTheDocument();
    });
  });

  it('opens create game modal when create button is clicked', async () => {
    renderWithProviders(<Games />);

    await waitFor(() => {
      expect(screen.getByText('Create Game')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Create Game'));

    // The modal should be opened (this would be tested in the modal component)
    expect(screen.getByText('Create New Game')).toBeInTheDocument();
  });

  it('handles pagination correctly', async () => {
    renderWithProviders(<Games />);

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    const nextPageButton = screen.getByText('Next');
    fireEvent.click(nextPageButton);

    expect(mockUseGames).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
      })
    );
  });
}); 