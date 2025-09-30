import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import Profile from '../pages/Profile';
import { profileService } from '../services/profile';

// Mock the services
vi.mock('../services/profile');
vi.mock('../hooks/useAuth');
vi.mock('../hooks/use-toast');

const mockProfileService = vi.mocked(profileService);
const mockUseAuth = vi.mocked(require('../hooks/useAuth').useAuth);
const mockUseToast = vi.mocked(require('../hooks/use-toast').useToast);

const mockUser = {
  id: 1,
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
};

const mockProfile = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'test@example.com',
  location: 'Test City',
  phone: '1234567890',
  profile_picture: null,
  full_name: 'John Doe',
  email_verified_at: '2023-01-01T00:00:00Z',
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

describe('Profile Component', () => {
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

    // Mock profile service
    mockProfileService.getProfile.mockResolvedValue(mockProfile);
    mockProfileService.updateProfile.mockResolvedValue(mockProfile);
  });

  it('renders profile information correctly', async () => {
    renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test City')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
    });
  });

  it('shows login required when user is not logged in', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoggedIn: false,
      signIn: vi.fn(),
    });

    renderWithProviders(<Profile />);

    expect(screen.getByText('Login Required')).toBeInTheDocument();
    expect(screen.getByText('You need to be logged in to view your profile.')).toBeInTheDocument();
  });

  it('shows loading state while fetching profile', () => {
    mockProfileService.getProfile.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<Profile />);

    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('shows error state when profile fetch fails', async () => {
    mockProfileService.getProfile.mockRejectedValue(new Error('Failed to fetch'));

    renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load profile. Please try again.')).toBeInTheDocument();
    });
  });

  it('enables editing mode when edit button is clicked', async () => {
    renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Profile'));

    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('updates profile information successfully', async () => {
    const updatedProfile = { ...mockProfile, location: 'Updated City' };
    mockProfileService.updateProfile.mockResolvedValue(updatedProfile);

    renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Profile'));

    const locationInput = screen.getByDisplayValue('Test City');
    fireEvent.change(locationInput, { target: { value: 'Updated City' } });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith({
        location: 'Updated City',
      });
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    });
  });

  it('handles profile update errors', async () => {
    mockProfileService.updateProfile.mockRejectedValue(new Error('Update failed'));

    renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Profile'));
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Update failed',
        variant: 'destructive',
      });
    });
  });

  it('cancels editing mode when cancel button is clicked', async () => {
    renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Profile'));
    expect(screen.getByText('Cancel')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });
  });

  it('displays profile picture when available', async () => {
    const profileWithPicture = {
      ...mockProfile,
      profile_picture: 'profile-pictures/test.jpg',
    };
    mockProfileService.getProfile.mockResolvedValue(profileWithPicture);

    renderWithProviders(<Profile />);

    await waitFor(() => {
      const avatar = screen.getByAltText('John Doe');
      expect(avatar).toHaveAttribute('src', 'http://localhost:8001/storage/profile-pictures/test.jpg');
    });
  });

  it('displays initials when no profile picture is available', async () => {
    renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  it('shows email verified badge when email is verified', async () => {
    renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Email Verified')).toBeInTheDocument();
    });
  });

  it('handles file upload for profile picture', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const updatedProfile = { ...mockProfile, profile_picture: 'profile-pictures/new.jpg' };
    mockProfileService.updateProfile.mockResolvedValue(updatedProfile);

    renderWithProviders(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Profile'));

    const fileInput = screen.getByDisplayValue('');
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          profile_picture: file,
        })
      );
    });
  });
}); 