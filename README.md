# Trivia Game - Next.js 15 Fullstack Application

A real-time trivia game built with Next.js 15 where students answer 21 questions within a time limit. Features a live leaderboard powered by Convex database and local storage to prevent replaying the game.

![Application Screenshot](Screenshot%202025-08-22%20040101.png)

## Overview

This is a full-stack trivia game application that challenges students to answer 21 questions within a specified time limit. The game features a real-time leaderboard and prevents users from retaking the quiz using browser localStorage.

## Features

- ⏰ Timed trivia with 21 questions
- 🏆 Real-time leaderboard powered by Convex
- 💾 localStorage integration to prevent replay
- 📊 Score tracking and analysis
- 🎮 Interactive user interface
- 🔄 Real-time updates using Convex database

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Convex for real-time database
- **Styling**: Tailwind CSS (based on components.json)
- **Package Manager**: pnpm
- **Build Tool**: Next.js built-in bundler

## Project Structure

```
trivia-game/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── convex/             # Convex database functions and configuration
├── lib/                # Utility libraries and helpers
├── public/             # Static assets
├── .gitignore          # Git ignore rules
├── README.md           # Project documentation
├── components.json     # UI components configuration
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies
├── pnpm-lock.yaml      # pnpm lockfile
├── postcss.config.mjs  # PostCSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Convex account for database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trivia-game
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up Convex:
```bash
pnpm convex dev
```

4. Configure environment variables:
Create a `.env.local` file and add your Convex deployment URL:
```
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

1. Start the trivia game from the home page
2. Answer 21 questions within the time limit
3. View your score and compare it with others on the leaderboard
4. Once completed, you cannot retake the quiz (enforced by localStorage)

## Game Rules

- The game consists of 21 questions
- Each question must be answered within the time limit
- If time expires, the game ends automatically
- Scores are calculated based on correct answers and speed
- Players cannot retake the quiz once completed

## Leaderboard Features

The real-time leaderboard provides:
- Live updates of player scores
- Ranking based on correct answers and completion time
- Historical performance data
- Filtering options for different time periods

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed on any platform that supports Next.js applications. Ensure you:

1. Set up Convex production deployment
2. Configure environment variables
3. Build the application with `pnpm build`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For questions or issues regarding this application, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This application requires a Convex account for database functionality. Ensure you have proper setup before deployment.
