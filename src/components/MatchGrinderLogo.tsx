import React from 'react';
import { cn } from '@/lib/utils';

interface MatchGrinderLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'full' | 'text-only';
}

export function MatchGrinderLogo({ 
  className, 
  size = 'md', 
  variant = 'full' 
}: MatchGrinderLogoProps) {
  const sizeClasses = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-sm',
      container: 'space-x-2'
    },
    md: {
      icon: 'w-10 h-10',
      text: 'text-xl',
      container: 'space-x-3'
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-2xl',
      container: 'space-x-4'
    }
  };

  const currentSize = sizeClasses[size];

  const LogoIcon = () => (
    <div className={cn(
      "bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg",
      currentSize.icon,
      className
    )}>
      <div className="relative">
        {/* Diagonal line */}
        <div className="absolute top-0 right-0 w-6 h-0.5 bg-teal-300 transform rotate-45 origin-right"></div>
        {/* Glowing tip */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
      </div>
    </div>
  );

  const LogoText = () => (
    <div className="hidden sm:block">
      <h1 className={cn(
        "font-bold text-gray-900 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent",
        currentSize.text
      )}>
        MatchGrinder
      </h1>
      <p className="text-xs text-gray-500 font-medium">Connect & Play</p>
    </div>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text-only') {
    return <LogoText />;
  }

  return (
    <div className={cn("flex items-center", currentSize.container)}>
      <LogoIcon />
      <LogoText />
    </div>
  );
}
