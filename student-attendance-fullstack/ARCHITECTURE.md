# Architecture Overview

## Complete Rewrite Summary

This document describes the modernized architecture implemented in the student attendance tracking system.

## Backend Architecture (Spring Boot)

### Layered Design
```
┌─────────────────────────────────────────┐
│          Controllers                     │  ← REST endpoints, validation
├─────────────────────────────────────────┤
│            Services                      │  ← Business logic
├─────────────────────────────────────────┤
│         Repositories                     │  ← Data access
├─────────────────────────────────────────┤
│           MongoDB                        │  ← Persistence
└─────────────────────────────────────────┘
```

### Package Structure
- **config/** - Application configuration (CORS, MongoDB)
- **controller/** - REST API endpoints
  - `StudentController` - Student CRUD operations
  - `AttendanceController` - Attendance tracking
- **service/** - Business logic
  - `StudentService` - Student management
  - `AttendanceService` - Attendance operations & statistics
- **repository/** - Data access with custom queries
  - `StudentRepository` - Student data access
  - `AttendanceRepository` - Attendance data access
- **dto/** - Data Transfer Objects
  - Request DTOs with validation
  - Response DTOs
  - `ApiResponse` wrapper
- **mapper/** - Entity ↔ DTO conversion
- **model/** - MongoDB entities with indexes
- **exception/** - Custom exceptions & global handler

### Key Improvements
1. **Separation of Concerns** - Clear boundaries between layers
2. **DTO Pattern** - Decoupled API contracts from domain models
3. **Validation** - Bean Validation on all inputs
4. **Error Handling** - Consistent error responses via GlobalExceptionHandler
5. **Type Safety** - Records for immutable DTOs
6. **Database Optimization** - Indexes on frequently queried fields

## Frontend Architecture (React + TypeScript)

### Structure
```
src/
├── api/              # API client layer
│   ├── client.ts     # Base HTTP client
│   ├── students.ts   # Student endpoints
│   └── attendance.ts # Attendance endpoints
├── pages/            # Route components
│   ├── StudentsPage
│   ├── AttendancePage
│   └── ReportsPage
├── store/            # State management (Zustand)
│   ├── useStudentStore
│   └── useAttendanceStore
└── types/            # TypeScript definitions
    ├── student.ts
    ├── attendance.ts
    └── api.ts
```

### Key Improvements
1. **Type Safety** - Full TypeScript coverage
2. **State Management** - Zustand for predictable state
3. **Routing** - React Router for SPA navigation
4. **API Layer** - Centralized, typed API client
5. **Component Organization** - Feature-based pages
6. **Modern Patterns** - Hooks, functional components

## API Design

### RESTful Endpoints

**Students API**
- GET `/api/students` - List all students
- POST `/api/students` - Create student
- GET `/api/students/{id}` - Get by ID
- GET `/api/students/roll/{rollNumber}` - Get by roll number
- PUT `/api/students/{id}` - Update student
- DELETE `/api/students/{id}` - Delete student
- PATCH `/api/students/{id}/deactivate` - Deactivate student

**Attendance API**
- POST `/api/attendance/mark` - Mark attendance
- GET `/api/attendance/today` - Today's attendance
- GET `/api/attendance/date/{date}` - Get by date
- GET `/api/attendance/student/{rollNumber}` - Student history
- GET `/api/attendance/student/{rollNumber}/stats` - Statistics

### Response Format
All endpoints return consistent `ApiResponse<T>`:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": null
}
```

## Database Schema

### Students Collection
```javascript
{
  _id: ObjectId,
  name: String,
  rollNumber: String,        // Unique index
  email: String,
  phone: String,
  department: String,
  year: Integer,
  active: Boolean,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Attendance Collection
```javascript
{
  _id: ObjectId,
  studentId: String,
  date: Date,
  status: Enum("PRESENT", "ABSENT"),
  createdAt: DateTime,
  updatedAt: DateTime
}
// Compound unique index on (studentId, date)
```

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.3.4
- Spring Data MongoDB
- Bean Validation
- Maven

### Frontend
- React 18
- TypeScript
- React Router 6
- Zustand
- Vite

### Database
- MongoDB 5.0+

## Benefits of This Architecture

### Maintainability
- Clear separation of concerns
- Consistent patterns across codebase
- Easy to locate and modify code

### Scalability
- Service layer can be extracted to microservices
- Repository pattern allows easy database changes
- API versioning ready

### Testability
- Each layer can be tested independently
- DTOs simplify test data creation
- Mock-friendly service boundaries

### Developer Experience
- Type safety catches errors early
- Clear API contracts
- Predictable state management
- Hot reload in development

## Running the Application

1. **Start MongoDB**: `mongod`
2. **Backend**: `mvnw spring-boot:run` (port 8081)
3. **Frontend**: `npm run dev` (port 5173)

Access at: http://localhost:5173
