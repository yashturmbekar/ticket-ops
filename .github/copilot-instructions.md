# IT Ticket Management System - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a comprehensive IT ticket management system built with React + TypeScript + Vite, similar to Spiceworks. The system includes:

- **Ticket Management**: Create, assign, track, and resolve IT support tickets
- **Asset Management**: Track IT assets, hardware, software, and licenses
- **User Management**: Manage employees, IT staff, and administrators
- **Knowledge Base**: Self-service documentation and FAQs
- **Reporting & Analytics**: IT metrics, SLA tracking, and performance reports
- **Network Monitoring**: Basic network device monitoring and alerts

## Code Style Guidelines

- Use TypeScript for all components and utilities
- Follow React functional components with hooks
- Use proper TypeScript interfaces for all data structures
- Implement responsive design with CSS Grid/Flexbox
- Use React Context for global state management
- Implement proper error handling and loading states
- Follow accessibility best practices (WCAG 2.1)

## Architecture Patterns

- **Components**: Organized by feature domains (tickets, assets, users, etc.)
- **Hooks**: Custom hooks for business logic and API calls
- **Services**: API service layer for backend communication
- **Types**: Comprehensive TypeScript type definitions
- **Context**: Global state management with React Context
- **Utils**: Utility functions for common operations

## Security Considerations

- Implement role-based access control (RBAC)
- Validate all user inputs
- Use proper authentication and authorization
- Implement CSRF protection
- Follow secure coding practices

## Performance Guidelines

- Use React.memo for component optimization
- Implement lazy loading for routes
- Use proper key props for lists
- Implement virtual scrolling for large datasets
- Optimize bundle size with code splitting

## UI/UX Guidelines

- Follow Material Design principles
- Use consistent color scheme (professional blue theme)
- Implement proper loading states and error messages
- Use proper typography hierarchy
- Ensure mobile-responsive design
- Implement dark/light theme support

## API Integration

- Use React Query for server state management
- Implement proper error handling for API calls
- Use WebSocket for real-time updates
- Follow REST API conventions
- Implement proper caching strategies

## Testing Guidelines

- Write unit tests for utility functions
- Implement integration tests for components
- Use proper mocking for API calls
- Follow test-driven development where applicable
- Maintain good test coverage

## File Organization

- Group related components in feature folders
- Use index.ts files for clean exports
- Follow consistent naming conventions
- Separate concerns (business logic, UI, types)
- Use proper import/export patterns

When generating code, please follow these guidelines and maintain consistency with the existing codebase structure.
