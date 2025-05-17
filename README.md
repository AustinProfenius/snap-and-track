# Snap and Track

A mobile application that allows users to track both nutrition and workouts. The app uses AI to identify food items from photos, calculates nutritional information, and tracks workout exercises with sets, reps and calories burned.

## Features

### Nutrition Tracking
- Camera-based food recognition using OpenAI Vision
- Manual food search with fuzzy matching
- Custom food creation and management
- Meal categorization (Breakfast, Lunch, Dinner, Snacks)
- Water intake tracking
- Daily nutrition summary with progress indicators
- Macro and micronutrient tracking
- Custom nutrition goals

### Workout Tracking
- Exercise tracking with sets, reps, and RPE (Rate of Perceived Exertion)
- Workout templates and history
- Calorie burn estimation
- Workout duration tracking
- Exercise categorization and notes

### Analytics & Progress
- Combined caloric balance (consumed vs. burned)
- Macro distribution visualizations
- Nutrient target progress tracking
- Workout performance trends
- Weight and body measurement logging

### Core App Features
- Offline capability with synchronization
- User profile management
- Dark mode and accessibility options
- Data export and backup

## Tech Stack

- React Native with Expo
- TypeScript
- React Navigation for screen navigation (bottom tabs and stack navigation)
- Supabase for backend services and authentication
- OpenAI Vision API for food recognition
- Fuse.js for fuzzy searching
- D3.js/Victory for data visualization

## Project Structure

```
SnapAndTrackAppV2/
├── app/
│   ├── assets/              # Images, fonts, and other static assets
│   ├── components/          # Reusable UI components
│   ├── config/              # Configuration files and constants
│   ├── db/                  # Database models and queries
│   ├── hooks/               # Custom React hooks
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # App screens
│   ├── services/            # API services and external integrations
│   └── utils/               # Utility functions
├── scripts/                 # Project scripts
└── tasks/                   # TaskMaster task management
```

## App Navigation

The application uses a bottom tab navigation with five main tabs:
1. **Home/Dashboard** - Overview of nutritional data, workout data, daily summary, and quick actions
2. **Workouts** - List of workouts with creation, tracking, and history features
3. **Snap Meal** - Camera-based food recognition with barcode scanning and gallery import options
4. **Diary** - Food intake records organized by date and meal with swipe actions for editing
5. **Graphs** - Visual analytics with segmented controls for nutrition and workout data

Navigation follows these rules:
- The Snap Meal tab is an action tab that pushes the Camera Screen modally
- On saving a photo, the user is routed to Diary → Image Review → Diary
- Hardware back/system gestures only pop in the current stack
- Deep-links (notifications, widgets) open their target inside the correct tab stack
- Settings/Profile is accessed via a gear icon on the Home header

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for mobile testing)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/SnapAndTrackAppV2.git
cd SnapAndTrackAppV2
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on iOS or Android
```bash
npm run ios     # for iOS
npm run android # for Android
```

## Development

This project uses TaskMaster for task management. View current tasks:

```bash
npx task-master-ai list
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Required for AI Food Recognition
OPENAI_API_KEY=your_openai_api_key

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

Run tests using:

```bash
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Sync Service

The sync service handles data synchronization between the local device and server. It provides:

- Background syncing on a schedule
- Force sync capability
- Offline support with conflict resolution
- Sync status tracking and notifications

### Testing the Sync Service

We've implemented a robust testing approach for the sync service using dependency injection for mocks:

```bash
# Run tests with mocked dependencies
node scripts/test-sync-mock.js
```

The testing approach uses:

1. **Dependency Injection**: The sync service's dependencies (API, storage, network, notifications) are mocked and injected during testing.
2. **Service Isolation**: Tests run in a controlled environment with predictable responses.
3. **Error Scenarios**: Tests coverage includes network failures and authentication issues.

### Sync Service Structure

The sync service has the following components:

- **Initialization**: Setting up listeners and initial sync
- **Periodic Sync**: Background syncing on a schedule
- **Force Sync**: Immediate sync on demand
- **Status Management**: Track and report sync status
- **Data Flow**: Pull from server, then push local changes

For more details, see the code in `app/services/syncService.js`.

## Implementation Status

### Completed Features

1. **Food Diary Screen**
   - Calendar-based date selection
   - Daily totals display (calories, macros)
   - Meal sections (breakfast, lunch, dinner, snack)
   - Quick-add functionality

2. **Food Search**
   - Search for foods by name or brand
   - Recent searches history
   - Clear search results display
   - Support for custom food entry

3. **Food Details**
   - Serving size customization
   - Meal type selection
   - Date and time selection
   - Nutrition information display

4. **Data Management**
   - Local storage of diary entries
   - Synchronization with backend server
   - Offline capability

### In Progress

1. **Workout Tracking**
   - Workout history and templates
   - Exercise tracking with sets, reps, and RPE
   - Calorie burn calculations
   - Integration with nutrition data
   - Weekly workout summary
   - Timers for workout and rest periods

2. **Graphs & Analytics**
   - Segmented controls for nutrition and workout data
   - Date range picker with quick-jump options
   - Interactive data points linking to relevant details

3. **Authentication Add-ons**
   - Forgot password functionality
   - Reset password screen
   - Biometric authentication options

### Upcoming Features

1. **Food Photo Analysis**
   - Enhanced camera integration with barcode scanning
   - Gallery import option
   - AI-based food recognition improvements
   - "Search manually" fallback option
   - AI prompt and image recognition will estimate total calories and macros in the picture and then log this data in the users diary

2. **On-Boarding Wizard**
   - Goal selection (Lose/Maintain/Gain)
   - Physical data collection
   - Macro & calorie target calculation
   - Units selection (metric/imperial)

3. **Settings & Profile Updates**
   - Combined settings and profile screens
   - Enhanced data export/import
   - Health app integrations (Apple Health/Google Fit)
   - Notification preferences