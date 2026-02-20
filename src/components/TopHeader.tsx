import React, { useState } from 'react';
import { Bell, User, LogOut, Settings, UserPlus, LogIn, Home, MessageSquare, Trophy, Calendar, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import { MatchGrinderLogo } from './MatchGrinderLogo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getAppName } from '@/config/app';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Discussion', href: '/discussion', icon: MessageSquare },
  { name: 'Games', href: '/games', icon: Trophy },
  { name: 'Tournament', href: '/tournament', icon: Calendar },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
];

export function TopHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // State for notifications - in a real app, this would come from an API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      title: 'New message from Sarah',
      content: 'Hey! Are you free for tennis this weekend?',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'game',
      title: 'Game invitation',
      content: 'Mike invited you to join the basketball game',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'tournament',
      title: 'Tournament reminder',
      content: 'Your tennis tournament starts in 30 minutes',
      time: '3 hours ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: any) => {
    // Mark notification as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Navigate based on notification type
    switch (notification.type) {
      case 'message':
        navigate('/messages');
        break;
      case 'game':
        navigate('/games');
        break;
      case 'tournament':
        navigate('/tournament');
        break;
      default:
        break;
    }
  };

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );

    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read."
    });
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <MatchGrinderLogo size="md" variant="full" />
          </div>

          {/* Navigation - Centered */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.href)}
                className={cn(
                  "relative flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ease-out group overflow-hidden",
                  location.pathname === item.href
                    ? "text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:scale-105"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 hover:backdrop-blur-sm border border-transparent hover:border-slate-200/50 hover:shadow-sm"
                )}
              >
                {/* Active state background animation */}
                {location.pathname === item.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90 animate-pulse-slow" />
                )}

                {/* Content with relative positioning */}
                <div className="relative flex items-center space-x-2">
                  <item.icon className={cn(
                    "h-4 w-4 transition-all duration-300",
                    location.pathname === item.href
                      ? "text-white drop-shadow-sm"
                      : "text-slate-500 group-hover:text-slate-700"
                  )} />
                  <span className={cn(
                    "font-medium tracking-wide transition-all duration-300",
                    location.pathname === item.href
                      ? "text-white drop-shadow-sm"
                      : "text-slate-600 group-hover:text-slate-900"
                  )}>
                    {item.name}
                  </span>
                </div>
              </Button>
            ))}

            {/* Admin Dynamic Navigation Item */}
            {(user as any)?.role === 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/reports')}
                className={cn(
                  "relative flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ease-out group overflow-hidden ml-2 border border-red-200/50 bg-red-50/50 hover:bg-red-100/50 hover:border-red-300/50",
                  location.pathname === '/admin/reports'
                    ? "text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/25 transform scale-105 border-0"
                    : "text-red-700 hover:text-red-800"
                )}
              >
                <div className="relative flex items-center space-x-2">
                  <span className={cn(
                    "font-bold tracking-wide transition-all duration-300 flex items-center gap-1",
                    location.pathname === '/admin/reports' ? "text-white drop-shadow-sm" : "group-hover:text-red-900"
                  )}>
                    <CheckCircle className="w-4 h-4" /> Reports
                  </span>
                </div>
              </Button>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative w-10 h-10 rounded-xl hover:bg-gray-50"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 border-2 border-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 mt-2 rounded-xl border-gray-100 shadow-lg max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <p className="text-xs text-gray-500">{unreadCount} unread</p>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''
                            }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {notification.type === 'message' && (
                                <MessageCircle className="h-5 w-5 text-blue-600" />
                              )}
                              {notification.type === 'game' && (
                                <Trophy className="h-5 w-5 text-green-600" />
                              )}
                              {notification.type === 'tournament' && (
                                <Calendar className="h-5 w-5 text-purple-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.content}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="flex-shrink-0">
                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="px-4 py-2 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-xl hover:bg-gray-50"
                >
                  <User className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-gray-100 shadow-lg">
                {user ? (
                  <>
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="py-3">
                      <User className="mr-3 h-4 w-4" />
                      <span className="font-medium">Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="py-3">
                      <Settings className="mr-3 h-4 w-4" />
                      <span className="font-medium">Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-100" />
                    <DropdownMenuItem onClick={handleSignOut} className="py-3 text-red-600">
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/auth')} className="py-3">
                      <LogIn className="mr-3 h-4 w-4" />
                      <span className="font-medium">Login</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/auth')} className="py-3">
                      <UserPlus className="mr-3 h-4 w-4" />
                      <span className="font-medium">Sign Up</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-100">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.href)}
              className={cn(
                "relative flex flex-col items-center space-y-1 px-4 py-3 rounded-2xl text-xs font-medium transition-all duration-300 ease-out group overflow-hidden min-w-[70px]",
                location.pathname === item.href
                  ? "text-white bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-lg shadow-emerald-500/25 transform scale-105"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 hover:backdrop-blur-sm border border-transparent hover:border-slate-200/50"
              )}
            >
              {/* Active state background animation */}
              {location.pathname === item.href && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 opacity-90" />
              )}

              {/* Content with relative positioning */}
              <div className="relative flex flex-col items-center space-y-1">
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  location.pathname === item.href
                    ? "text-white drop-shadow-sm"
                    : "text-slate-500 group-hover:text-slate-700"
                )} />
                <span className={cn(
                  "font-medium tracking-wide transition-all duration-300 text-center leading-tight",
                  location.pathname === item.href
                    ? "text-white drop-shadow-sm"
                    : "text-slate-600 group-hover:text-slate-900"
                )}>
                  {item.name}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}