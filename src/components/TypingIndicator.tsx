import React from 'react';

interface TypingIndicatorProps {
  users: Array<{ user_name: string }>;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users }) => {
  if (!users || users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].user_name} is typing`;
    } else if (users.length === 2) {
      return `${users[0].user_name} and ${users[1].user_name} are typing`;
    } else {
      return `${users[0].user_name} and ${users.length - 1} others are typing`;
    }
  };

  return (
    <div className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-500">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-xs">{getTypingText()}</span>
    </div>
  );
};

export default TypingIndicator;



