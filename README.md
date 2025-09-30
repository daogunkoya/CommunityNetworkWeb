# CommunityNetworkWeb (MatchGrinder)

A modern web application for connecting sports enthusiasts and organizing community sports events.

## Features

- 🏆 **Tournament Management** - Create and manage sports tournaments
- 🎯 **Game Events** - Find and join local sports games
- 💬 **Community Discussions** - Connect with fellow players
- 📱 **Mobile Responsive** - Optimized for all devices
- 🔐 **User Authentication** - Secure login with Google OAuth
- 💌 **Messaging System** - Direct communication between players

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Authentication**: Google OAuth
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/daogunkoya/CommunityNetworkWeb.git
   cd CommunityNetworkWeb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your actual values:
   ```env
   VITE_API_URL=https://your-api-domain.com/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   VITE_APP_NAME=MatchGrinder
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── ui/             # Base UI components (shadcn/ui)
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── config/             # App configuration
└── lib/                # Utility functions
```

## Deployment

### Production Deployment

1. **Set up your deployment script**
   ```bash
   cp deploy-production.example.sh deploy-production.sh
   ```
   
2. **Edit the deployment script** with your actual server credentials and paths

3. **Run the deployment**
   ```bash
   ./deploy-production.sh
   ```

### Environment Variables

Make sure to set up the following environment variables in production:

- `VITE_API_URL` - Your API endpoint
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This repository has been configured to exclude sensitive information:

- Environment files (`.env*`) are gitignored
- Deployment scripts with credentials are gitignored
- API keys and secrets should never be committed

Always use environment variables for sensitive configuration.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.