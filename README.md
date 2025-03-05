# ReliableNet

ReliableNet is a comprehensive platform for comparing and reviewing internet service providers (ISPs) in apartment complexes. The platform helps users make informed decisions about their internet service by providing detailed performance metrics, user reviews, and coverage information.

## Features

- **Speed Testing**
  - Real-time network speed measurements
  - Historical speed test data
  - Peak hour performance tracking
  - Location-based speed test results

- **ISP Comparison**
  - Detailed ISP metrics and statistics
  - Coverage maps
  - Pricing information
  - User reviews and ratings
  - Peak vs. off-peak performance

- **Apartment Complex Management**
  - Complex profiles with amenities
  - ISP availability by complex
  - User reviews and ratings
  - Performance badges and certifications
  - Interactive coverage maps

- **Review System**
  - Verified user reviews
  - Detailed performance metrics
  - Pros and cons
  - Peak hour performance data
  - Photo uploads
  - Helpful/Not helpful voting

- **User Features**
  - User profiles and settings
  - Saved ISP comparisons
  - Favorite complexes
  - Review history
  - Messaging system
  - Notification preferences

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel
- **Maps**: Mapbox
- **File Storage**: Supabase Storage
- **API Documentation**: [API.md](API.md)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Supabase account (for storage)
- Mapbox account (for maps)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database URLs
POSTGRES_PRISMA_URL="your-postgres-url"
POSTGRES_URL_NON_POOLING="your-postgres-non-pooling-url"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/reliablenet.git
   cd reliablenet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Guidelines

### Project Structure

```
src/
├── app/                 # Next.js app router pages and API routes
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── ...            # Feature-specific components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
└── providers/         # React context providers
```

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Follow the existing file structure

### Database Changes

1. Modify the Prisma schema in `prisma/schema.prisma`
2. Generate a migration:
   ```bash
   npx prisma migrate dev --name your-migration-name
   ```
3. Apply the migration:
   ```bash
   npx prisma db push
   ```

### API Routes

- Place API routes in `src/app/api/`
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Implement proper error handling
- Validate input data
- Use TypeScript for type safety

## Deployment

The project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
