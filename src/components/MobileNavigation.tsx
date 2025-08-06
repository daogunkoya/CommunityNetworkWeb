import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Trophy, Calendar, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Discussion', href: '/discussion', icon: MessageSquare },
  { name: 'Games', href: '/games', icon: Trophy },
  { name: 'Tournament', href: '/tournament', icon: Calendar },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Profile', href: '/profile', icon: User },
];

export function MobileNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 backdrop-blur-sm z-50">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px]",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )
            }
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}