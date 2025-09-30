import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { profileService, type Profile, UpdateProfileData } from '@/services/profile';
import { Loader2, Camera, User, MapPin, Phone, Mail } from 'lucide-react';
import AddressInput from '@/components/ui/AddressInput';
import { Skeleton } from '@/components/ui/skeleton';

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({});
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user, signIn } = useAuth();

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await profileService.getProfile();
      setProfile(profileData);
      setFormData({
        email: profileData.email || '',
        location: profileData.location || '',
        phone: profileData.phone || '',
      });
    } catch (error) {
      console.error('Profile load error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      setFormData(prev => ({
        ...prev,
        profile_picture: file
      }));
    }
  };

  const handleImageClick = () => {
    console.log('Image click handler called');
    console.log('File input ref:', fileInputRef.current);
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      console.log('Saving profile with form data:', formData);
      const updatedProfile = await profileService.updateProfile(formData);
      console.log('Updated profile data:', updatedProfile);
      console.log('Profile picture path:', updatedProfile.profile_picture);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        email: profile.email || '',
        location: profile.location || '',
        phone: profile.phone || '',
      });
    }
    setIsEditing(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Login Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center mb-4">
              You need to be logged in to view your profile.
            </p>
            <Button onClick={() => signIn('john@example.com', 'password')} className="w-full">
              Login with Test Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Unable to load your profile. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleImageClick}>
                  <AvatarImage 
                    src={profile.profile_picture ? 
                      (profile.profile_picture.startsWith('http') ? 
                        profile.profile_picture : 
                        `http://localhost:8001/storage/${profile.profile_picture}`
                      ) : undefined
                    }
                    alt={profile.full_name}
                    style={{ objectFit: 'cover' }}
                  />
                  <AvatarFallback className="text-lg">
                    {getInitials(profile.first_name, profile.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/80" 
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Camera icon clicked');
                    handleImageClick();
                  }}
                >
                  <Camera className="h-3 w-3" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  style={{ display: 'none' }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{profile.full_name}</h3>
                <p className="text-muted-foreground">{profile.email}</p>
                {profile.email_verified_at && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Email Verified
                  </span>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={profile.first_name}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  First name cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={profile.last_name}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Last name cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <AddressInput
                  value={isEditing ? formData.location || '' : profile.location || ''}
                  onChange={(value) => handleInputChange('location', value)}
                  onAddressSelect={(address) => {
                    setSelectedAddress(address);
                    handleInputChange('location', address.formatted_address);
                  }}
                  placeholder="Enter your address or location"
                  label="Address/Location"
                  disabled={!isEditing}
                  showPostcodeSearch={true}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={isEditing ? formData.phone || '' : profile.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={isEditing ? formData.email || '' : profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your email address"
                />
                {!isEditing && (
                  <p className="text-xs text-muted-foreground">
                    Click "Edit Profile" to change your email
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none">
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleImageClick}
                    className="flex-1 sm:flex-none"
                  >
                    Upload Photo
                  </Button>

                </>
              ) : (
                <>
                  <Button 
                    onClick={handleSave} 
                    disabled={isUpdating}
                    className="flex-1 sm:flex-none"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 