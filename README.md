# FitSync Frontend

React-based web application for the FitSync fitness management platform.

## Features

- User authentication and authorization
- Role-based dashboards (Client, Trainer, Admin, Gym Owner)
- Workout program management
- Exercise library with instructions
- Session booking and calendar
- Progress tracking and analytics
- Real-time notifications
- Responsive design for mobile and desktop

## Technology Stack

- React 18
- React Router for navigation
- Axios for API calls
- Context API for state management
- Tailwind CSS / Material-UI for styling
- Chart.js for analytics

## Running the Full FitSync Application

This service is part of the FitSync multi-repository application. To run the complete application:

### Quick Start

1. **Clone all repositories:**

```bash
mkdir fitsync-app && cd fitsync-app

git clone https://github.com/FitSync-G13/fitsync-docker-compose.git
git clone https://github.com/FitSync-G13/fitsync-api-gateway.git
git clone https://github.com/FitSync-G13/fitsync-user-service.git
git clone https://github.com/FitSync-G13/fitsync-training-service.git
git clone https://github.com/FitSync-G13/fitsync-schedule-service.git
git clone https://github.com/FitSync-G13/fitsync-progress-service.git
git clone https://github.com/FitSync-G13/fitsync-notification-service.git
git clone https://github.com/FitSync-G13/fitsync-frontend.git
```

2. **Run setup:**

```bash
cd fitsync-docker-compose
./setup.sh    # Linux/Mac
setup.bat     # Windows
```

3. **Access:** http://localhost:3000

### Test Users

| Role | Email | Password |
|------|-------|----------|
| Client | client@fitsync.com | Client@123 |
| Trainer | trainer@fitsync.com | Trainer@123 |
| Admin | admin@fitsync.com | Admin@123 |
| Gym Owner | gym@fitsync.com | Gym@123 |

## Development - Run This Service Locally

1. **Start backend services:**
```bash
cd ../fitsync-docker-compose
docker compose up -d
docker compose stop frontend
```

2. **Install dependencies:**
```bash
cd ../fitsync-frontend
npm install
```

3. **Configure environment (.env):**
```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_WS_URL=ws://localhost:4000
```

4. **Start development server:**
```bash
npm start
```

Application runs on http://localhost:3000

## Available Scripts

- `npm start` - Start development server
- `npm test` - Run tests in watch mode
- `npm run test:ci` - Run tests once (CI mode)
- `npm run test:coverage` - Run tests with coverage report
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run format` - Format code

## Testing

This project uses React Testing Library and Jest for testing.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (for CI/scripts)
npm run test:ci

# Run tests with coverage report
npm run test:coverage

# Run a specific test file
npm test -- src/contexts/__tests__/AuthContext.test.js
```

### Test Structure

```
src/
├── contexts/
│   └── __tests__/
│       └── AuthContext.test.js    # Auth context tests (15 tests)
├── services/
│   └── __tests__/
│       ├── api.test.js            # API service tests (12 tests)
│       └── authService.test.js    # Auth service tests (18 tests)
└── components/
    └── ui/
        └── __tests__/
            ├── Button.test.js     # Button component tests (22 tests)
            └── Input.test.js      # Input component tests (23 tests)
```

### Test Coverage

The test suite covers:

#### AuthContext (`AuthContext.test.js`)
- **Initial State** - Loading state, token checking, user restoration
- **Login** - Successful login, error handling, user state updates
- **Logout** - User clearing, error clearing, localStorage cleanup
- **Register** - User registration, error handling
- **useAuth Hook** - Context usage validation

#### API Service (`api.test.js`)
- **Request Interceptor Logic** - Authorization header injection
- **Token Storage** - localStorage token management
- **Error Response Handling** - 401 errors, retry logic, storage clearing
- **Base URL Configuration** - Environment variable handling

#### Auth Service (`authService.test.js`)
- **login()** - API calls, token storage, user data return
- **register()** - User registration, token handling
- **getMe()** - Current user fetching
- **logout()** - Token clearing, error handling

#### Button Component (`Button.test.js`)
- **Rendering** - Text rendering, default styles
- **Variants** - Default, destructive, outline, secondary, ghost, link
- **Sizes** - Default, small, large, icon
- **Interactions** - Click events, disabled state
- **Accessibility** - Focus states, ARIA attributes

#### Input Component (`Input.test.js`)
- **Rendering** - Element rendering, type handling
- **Props Handling** - Placeholder, value, name, id, ref forwarding
- **Interactions** - onChange, onFocus, onBlur events
- **Disabled State** - Disabled rendering and behavior
- **Accessibility** - Focus states, ARIA attributes, required

### Current Test Status

- **Total Tests:** 90
- **Passing:** 90
- **Coverage Areas:** Auth context, API services, UI components

### Writing New Tests

1. Create test files in `__tests__` folders next to the code being tested
2. Use `@testing-library/react` for component tests
3. Mock external dependencies (API calls, services)
4. Follow the Arrange-Act-Assert pattern

Example:
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── context/        # Context providers
├── hooks/          # Custom React hooks
├── services/       # API services
├── utils/          # Utility functions
└── App.js          # Main app component
```

## Features by Role

### Client Dashboard
- View assigned workout programs
- Book training sessions
- Track progress and metrics
- View exercise library
- Manage notifications

### Trainer Dashboard
- Create workout programs
- Assign programs to clients
- View client list and progress
- Manage schedule and availability
- Track client achievements

### Admin Dashboard
- User management
- System analytics
- Gym management
- Configuration settings

### Gym Owner Dashboard
- Gym metrics and analytics
- Trainer management
- Member statistics
- Revenue tracking

## More Information

See [fitsync-docker-compose](https://github.com/FitSync-G13/fitsync-docker-compose) for complete documentation.

## License

MIT
