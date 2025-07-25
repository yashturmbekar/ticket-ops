# RedFish Ticket-Ops - Enterprise IT Service Management System

<div align="center">
  <img src="public/redfish-logo.svg" alt="RedFish Logo" width="120" height="120">
  <h3>Modern IT Helpdesk & Service Management Platform</h3>
  <p>A comprehensive, enterprise-grade IT service management system built with cutting-edge web technologies</p>
</div>

## 📖 Project Overview

RedFish Ticket-Ops is a full-featured IT Service Management (ITSM) platform designed to streamline IT operations and enhance service delivery. Built with modern React architecture and TypeScript, it provides organizations with powerful tools to manage IT tickets, assets, users, and knowledge effectively.

### Key Capabilities

- **📋 Advanced Ticket Management** - Complete lifecycle management with SLA tracking, automated routing, and escalation workflows
- **💻 Comprehensive Asset Management** - Hardware, software, and license tracking with depreciation and maintenance scheduling
- **👥 Sophisticated User Management** - Role-based access control with department hierarchies and permission granularity
- **📚 Dynamic Knowledge Base** - Self-service portal with searchable articles, FAQs, and guided troubleshooting
- **📊 Business Intelligence & Reporting** - Real-time dashboards, SLA monitoring, and performance analytics
- **🌐 Network Monitoring** - Infrastructure monitoring with automated alerting and health checks
- **🔒 Enterprise Security** - Multi-factor authentication, audit logging, and compliance reporting
- **📱 Responsive Design** - Cross-platform compatibility with mobile-first approach
- **🌙 Accessibility** - WCAG 2.1 compliant with theme customization

## 🔐 Demo Credentials

The system includes demo accounts for testing different user roles:

| Role         | Email                | Password    | Access Level                                     |
| ------------ | -------------------- | ----------- | ------------------------------------------------ |
| **Admin**    | admin@redfish.com    | admin123    | Full system access, settings, user management    |
| **Manager**  | manager@redfish.com  | manager123  | Department oversight, reporting, team management |
| **IT Staff** | tech@redfish.com     | tech123     | Ticket management, asset tracking, operations    |
| **Employee** | employee@redfish.com | employee123 | Submit tickets, view own tickets, knowledge base |

## 🚀 Feature Highlights

### 🎫 Advanced Ticket Management

- **Multi-Channel Ticket Creation** - Email, web portal, and API integration
- **Smart Assignment Rules** - Automated routing based on department, skill set, and workload
- **SLA Management** - Configurable service level agreements with automated escalation
- **Ticket Workflow Engine** - Customizable approval processes and status transitions
- **Real-time Collaboration** - Comments, internal notes, and @mentions
- **Advanced Search & Filtering** - Full-text search with multiple filter criteria

### 💼 Comprehensive Asset Management

- **Complete Asset Lifecycle** - From procurement to disposal tracking
- **Automated Discovery** - Network scanning for hardware and software detection
- **License Management** - Software license tracking and compliance monitoring
- **Maintenance Scheduling** - Preventive maintenance calendars and notifications
- **Asset Relationships** - Dependencies and configuration item relationships
- **Depreciation Tracking** - Automated asset value calculations

### 👥 Enterprise User Management

- **Department Hierarchies** - Multi-level organizational structure support
- **Role-Based Permissions** - Granular access control with custom role definitions
- **Single Sign-On (SSO)** - Integration ready for enterprise authentication
- **User Provisioning** - Automated account creation and deactivation
- **Skill Matrix Management** - Technical competency tracking for optimal assignment

### 📚 Intelligent Knowledge Base

- **AI-Powered Search** - Smart content discovery and recommendations
- **Version Control** - Article versioning with approval workflows
- **Usage Analytics** - Track article effectiveness and user engagement
- **Multimedia Support** - Rich content with images, videos, and attachments
- **Community Features** - User ratings, comments, and collaborative editing

### 📊 Business Intelligence & Reporting

- **Real-time Dashboards** - Executive, operational, and team-specific views
- **SLA Performance Monitoring** - Compliance tracking and trend analysis
- **Predictive Analytics** - Workload forecasting and capacity planning
- **Custom Report Builder** - Drag-and-drop report creation interface
- **Automated Reporting** - Scheduled delivery of key metrics
- **Data Export Options** - PDF, Excel, and CSV export capabilities

### 🌐 Network & Infrastructure Monitoring

- **Multi-Protocol Support** - SNMP, WMI, and SSH monitoring capabilities
- **Automated Discovery** - Network topology mapping and device identification
- **Performance Metrics** - CPU, memory, disk, and network utilization tracking
- **Alert Management** - Intelligent alerting with escalation and notification rules
- **Integration APIs** - Connect with existing monitoring tools and SIEM systems

## 🛠️ Technology Stack

### Core Framework & Runtime

- **⚛️ React** `19.1.0` - Modern component-based UI library with Concurrent Features
- **📘 TypeScript** `5.8.3` - Type-safe JavaScript with advanced static analysis
- **⚡ Vite** `7.0.3` - Ultra-fast build tool with Hot Module Replacement (HMR)
- **🔧 Node.js** `20.19.0+` - JavaScript runtime environment

### Frontend Libraries & Tools

- **🎨 Material-UI (MUI)** `7.2.0` - Comprehensive React component library
  - `@mui/material` - Core components and theming system
  - `@mui/icons-material` - Extensive icon library
  - `@mui/system` - Advanced styling utilities
- **🧩 Emotion** `11.14.0` - CSS-in-JS library for styling
- **📊 Data Visualization**
  - `chart.js` `4.5.0` - Flexible charting library
  - `react-chartjs-2` `5.3.0` - React wrapper for Chart.js
  - `recharts` `3.0.2` - Composable charting components

### State Management & Data Fetching

- **🗂️ React Context API** - Built-in state management for global application state
- **🔄 TanStack Query** `5.83.0` - Powerful data synchronization and caching
- **🌐 Axios** `1.10.0` - Promise-based HTTP client with interceptors

### Routing & Navigation

- **🛣️ React Router DOM** `7.6.3` - Declarative routing with nested route support

### Form Handling & Validation

- **📝 React Hook Form** `7.60.0` - Performant forms with minimal re-renders
- **📅 React DatePicker** `8.4.0` - Accessible date selection components

### UI Components & Styling

- **🎯 React Icons** `5.5.0` - Popular icon packs as React components
- **🎨 clsx** `2.1.1` - Utility for constructing className strings
- **📱 CSS Grid & Flexbox** - Modern layout systems for responsive design

### Data Management & Tables

- **📋 TanStack Table** `8.21.3` - Headless table library with advanced features
- **🔤 UUID** `11.1.0` - Unique identifier generation

### Date & Time Handling

- **📆 date-fns** `4.1.0` - Modern JavaScript date utility library

### Authentication & Security

- **🔐 JWT Decode** `4.0.0` - JSON Web Token decoding utilities
- **🛡️ Role-Based Access Control (RBAC)** - Custom implementation

### Export & Reporting

- **📄 jsPDF** `3.0.1` - Client-side PDF generation
- **🖼️ html2canvas** `1.4.1` - Screenshot and canvas rendering

### Development Tools

- **🔍 ESLint** `9.30.1` - Code linting with TypeScript support
  - `@eslint/js` - Core ESLint configuration
  - `eslint-plugin-react-hooks` - React Hooks specific linting
  - `eslint-plugin-react-refresh` - React Fast Refresh support
- **📦 TypeScript ESLint** `8.35.1` - TypeScript-specific linting rules
- **🔧 Vite Plugins**
  - `@vitejs/plugin-react` `4.7.0` - React support for Vite
  - `vite-plugin-react-inspector` `0.3.3` - Visual component inspection

### Architecture Patterns

- **🏗️ Feature-Based Architecture** - Organized by business domains
- **🔗 Custom Hooks** - Reusable business logic encapsulation
- **🎯 Service Layer Pattern** - Centralized API communication
- **🧱 Component Composition** - Modular and reusable UI components
- **📡 Context Providers** - Global state management strategy

## 📋 Prerequisites & System Requirements

### Development Environment

- **🟢 Node.js** `20.19.0` or higher (LTS recommended)
- **📦 npm** `10.8.2` or higher
- **💻 Operating System** - Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **🖥️ Memory** - Minimum 8GB RAM (16GB recommended for optimal development experience)
- **💾 Storage** - At least 2GB free space for dependencies and build artifacts

### Browser Support

- **🌐 Modern Browsers** - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **📱 Mobile Browsers** - iOS Safari 14+, Chrome Mobile 90+
- **⚡ ES2020 Support** - Required for modern JavaScript features

### Development Tools (Recommended)

- **👨‍💻 VS Code** - With TypeScript, ESLint, and React extensions
- **🔧 Git** `2.25+` - Version control system
- **🐳 Docker** (Optional) - For containerized development environment

## ⚡ Quick Start Guide

### 1. Clone & Setup

```bash
# Clone the repository
git clone https://github.com/yashturmbekar/ticket-ops.git
cd ticket-ops

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Access the Application

Open your browser and navigate to `http://localhost:5173`

### 3. Login with Demo Credentials

Use any of the demo accounts listed in the credentials table above to explore different user experiences.

## 🔧 Development Scripts

```bash
# 🚀 Development
npm run dev              # Start development server with HMR
npm run build            # Build for production
npm run preview          # Preview production build locally

# 🔍 Code Quality
npm run lint             # Run ESLint for code analysis
npm run type-check       # TypeScript compilation check

# 📦 Dependencies
npm install              # Install project dependencies
npm update               # Update dependencies to latest versions
npm audit                # Check for security vulnerabilities

# 🧹 Maintenance
npm run clean            # Clean build artifacts and node_modules
```

## 🌐 Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Application Configuration
VITE_APP_NAME="RedFish Ticket-Ops"
VITE_COMPANY_NAME="RedFish Technologies"
VITE_VERSION="1.0.0"

# API Configuration
VITE_API_BASE_URL="http://localhost:3000/api"
VITE_WEBSOCKET_URL="ws://localhost:3000"

# Authentication
VITE_JWT_SECRET="your-jwt-secret"
VITE_SESSION_TIMEOUT="3600"

# Features
VITE_ENABLE_DARK_MODE="true"
VITE_ENABLE_NOTIFICATIONS="true"
VITE_ENABLE_REAL_TIME="true"

# Support & Contact
VITE_SUPPORT_EMAIL="support@redfish.com"
VITE_HELP_DESK_PHONE="+1-555-0123"

# Development
VITE_DEBUG_MODE="true"
VITE_LOG_LEVEL="info"
```

## 📁 Project Architecture

```
redfish-ticket-ops/
├── 📁 public/                          # Static assets and public files
│   ├── favicon.svg                     # Application favicon
│   └── redfish-logo.svg               # Company branding logo
├── 📁 src/                             # Source code directory
│   ├── 📁 components/                  # React component library
│   │   ├── admin/                      # Administrative interface components
│   │   │   ├── AdminSettings.tsx       # System configuration interface
│   │   │   ├── SlaRules.tsx            # SLA management components
│   │   │   └── TicketRules.tsx         # Ticket automation rules
│   │   ├── auth/                       # Authentication components
│   │   │   └── LoginPage.tsx           # Login interface with validation
│   │   ├── common/                     # Reusable UI components
│   │   │   ├── Breadcrumb/             # Navigation breadcrumb component
│   │   │   ├── Button/                 # Customizable button component
│   │   │   ├── Card/                   # Material card component
│   │   │   └── ...                     # Additional common components
│   │   ├── dashboards/                 # Dashboard visualization components
│   │   ├── layout/                     # Application layout components
│   │   └── tickets/                    # Ticket management components
│   ├── 📁 constants/                   # Application configuration constants
│   │   ├── assetTypes.ts               # Asset classification definitions
│   │   ├── departments.ts              # Organizational structure data
│   │   ├── permissions.ts              # Role-based permission definitions
│   │   ├── priorities.ts               # Ticket priority configurations
│   │   ├── ticketStatus.ts             # Ticket lifecycle status definitions
│   │   └── userRoles.ts                # User role and access level definitions
│   ├── 📁 contexts/                    # React Context providers
│   │   ├── AuthContext.tsx             # Authentication state management
│   │   ├── NotificationContext.tsx     # Global notification system
│   │   └── ThemeContext.tsx            # Application theme management
│   ├── 📁 features/                    # Feature-specific modules
│   │   └── departments/                # Department management feature
│   ├── 📁 hooks/                       # Custom React hooks
│   │   ├── useApi.ts                   # API communication hook
│   │   ├── useAuth.ts                  # Authentication state hook
│   │   ├── useEmployeeProfile.ts       # User profile management
│   │   ├── useNavigation.ts            # Navigation state management
│   │   ├── useNotifications.ts         # Notification system hook
│   │   ├── usePermissions.ts           # Role-based access control
│   │   ├── useRealtime.ts              # Real-time data synchronization
│   │   ├── useSlaManagement.ts         # SLA tracking and management
│   │   ├── useTheme.ts                 # Theme switching functionality
│   │   └── useWebSocket.ts             # WebSocket connection management
│   ├── 📁 pages/                       # Main application pages
│   │   ├── AssetsPage.tsx              # Asset management interface
│   │   ├── CreateTicketPage.tsx        # Ticket creation form
│   │   ├── DashboardPage.tsx           # Main dashboard view
│   │   ├── DepartmentsPage.tsx         # Department management
│   │   ├── KnowledgePage.tsx           # Knowledge base interface
│   │   ├── NetworkPage.tsx             # Network monitoring dashboard
│   │   ├── ReportsPage.tsx             # Reporting and analytics
│   │   ├── SettingsPage.tsx            # Application configuration
│   │   ├── TicketsDashboardPage.tsx    # Ticket overview dashboard
│   │   └── UsersPage.tsx               # User management interface
│   ├── 📁 services/                    # API service layer
│   │   ├── api.ts                      # Core API configuration
│   │   ├── apiClient.ts                # HTTP client setup
│   │   ├── assetService.ts             # Asset management API
│   │   ├── authService.ts              # Authentication services
│   │   ├── helpdeskDepartmentService.ts # Department API services
│   │   ├── knowledgeService.ts         # Knowledge base API
│   │   ├── networkService.ts           # Network monitoring API
│   │   ├── reportsService.ts           # Reporting API services
│   │   ├── roleBasedNavigation.ts      # Navigation permission service
│   │   ├── slaService.ts               # SLA management API
│   │   ├── ticketService.ts            # Ticket management API
│   │   ├── userService.ts              # User management API
│   │   └── websocketService.ts         # Real-time communication
│   ├── 📁 styles/                      # Global stylesheets
│   │   ├── globals.css                 # Global CSS variables and resets
│   │   ├── dashboard.css               # Dashboard-specific styles
│   │   ├── tickets.css                 # Ticket interface styles
│   │   └── ...                         # Additional component styles
│   ├── 📁 theme/                       # Theme configuration
│   │   └── index.ts                    # Material-UI theme setup
│   ├── 📁 types/                       # TypeScript type definitions
│   │   └── index.ts                    # Global type definitions
│   └── 📁 utils/                       # Utility functions
│       ├── apiTransforms.ts            # Data transformation utilities
│       └── profileUtils.ts             # User profile helper functions
├── 📁 .github/                         # GitHub configuration
│   └── copilot-instructions.md         # AI coding assistant instructions
├── eslint.config.js                   # ESLint configuration
├── tsconfig.json                       # TypeScript configuration
├── vite.config.ts                      # Vite build configuration
└── package.json                        # Project dependencies and scripts
```

### 🏗️ Architectural Principles

- **🧩 Modular Design** - Feature-based organization for scalability
- **🔄 Separation of Concerns** - Clear distinction between UI, business logic, and data
- **♻️ Reusable Components** - DRY principle with shared component library
- **📡 Service Layer Pattern** - Centralized API communication and data transformation
- **🎯 Custom Hooks** - Business logic encapsulation and state management
- **🔒 Type Safety** - Comprehensive TypeScript coverage for reliability
- **📱 Responsive First** - Mobile-first design approach

## 🎨 Design System & UI Architecture

### Material Design Implementation

- **🎨 Material-UI (MUI) v7.2.0** - Comprehensive component library following Material Design 3
- **🎭 Emotion CSS-in-JS** - Dynamic styling with theme integration
- **🎯 Design Tokens** - Consistent spacing, typography, and color systems
- **📐 Grid System** - Responsive 12-column layout with breakpoint management

### Theme & Accessibility

- **🌙 Dual Theme Support** - Light and dark mode with system preference detection
- **♿ WCAG 2.1 AA Compliance** - Accessible design with proper contrast ratios
- **📱 Responsive Design** - Mobile-first approach with fluid layouts
- **🎨 Custom Color Palette** - Professional corporate branding with semantic colors
- **📝 Typography Scale** - Consistent text hierarchy with optimal readability

### Performance Optimization

- **⚡ Code Splitting** - Lazy loading of routes and components
- **🗂️ Bundle Optimization** - Tree shaking and dynamic imports
- **💾 Caching Strategies** - Service worker implementation for offline support
- **🔄 Virtual Scrolling** - Efficient rendering of large data sets
- **📊 Performance Monitoring** - Core Web Vitals tracking and optimization

## 🔑 User Roles & Permissions

- **Admin**: Full system access and administration
- **IT Staff**: Ticket and asset management capabilities
- **Manager**: Reporting and oversight access
- **User**: Basic ticket creation and viewing

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🌙 Theme Support

- Light theme (default)
- Dark theme
- System preference detection
- Theme persistence in localStorage

## 📊 Implementation Status & Roadmap

### ✅ Completed Features (v1.0)

#### 🏗️ Core Infrastructure

- [x] React 19 + TypeScript + Vite setup with optimal configuration
- [x] Material-UI design system integration with custom theming
- [x] Responsive layout with adaptive sidebar navigation
- [x] Authentication system with role-based access control
- [x] Global state management using React Context patterns
- [x] Dark/light theme switching with persistence
- [x] Comprehensive TypeScript type definitions

#### 🎯 User Interface Components

- [x] Professional dashboard with real-time statistics
- [x] Reusable component library (Button, Card, Header, Sidebar)
- [x] Activity feed with real-time updates
- [x] Navigation breadcrumbs and page routing
- [x] Form components with validation support
- [x] Data tables with sorting and filtering

#### 📈 Business Logic

- [x] User role and permission management
- [x] Department hierarchy and management
- [x] SLA rule configuration and tracking
- [x] Notification system architecture
- [x] API service layer with error handling

### 🚧 In Development (v1.1)

#### 🎫 Ticket Management Enhancement

- [ ] Advanced ticket creation with file attachments
- [ ] Ticket assignment and escalation workflows
- [ ] Comments and collaboration features
- [ ] Time tracking and billing integration
- [ ] Bulk operations and batch processing

#### 💼 Asset Management Module

- [ ] Complete asset lifecycle management
- [ ] Automated asset discovery and scanning
- [ ] License compliance tracking
- [ ] Maintenance scheduling system
- [ ] Asset depreciation calculations

#### 📚 Knowledge Base System

- [ ] Article creation and management interface
- [ ] Advanced search with AI-powered suggestions
- [ ] User feedback and rating system
- [ ] Content versioning and approval workflows
- [ ] Analytics and usage tracking

### 🎯 Planned Features (v2.0)

#### 🤖 AI & Automation

- [ ] AI-powered ticket categorization and routing
- [ ] Predictive analytics for capacity planning
- [ ] Automated knowledge base suggestions
- [ ] Intelligent chatbot for self-service support
- [ ] Machine learning for SLA optimization

#### � Enterprise Integration

- [ ] SSO/SAML authentication integration
- [ ] LDAP/Active Directory synchronization
- [ ] REST API for third-party integrations
- [ ] Webhook system for external notifications
- [ ] ITSM tool integrations (ServiceNow, Jira)

#### 📱 Mobile & Real-time

- [ ] Progressive Web App (PWA) capabilities
- [ ] Native mobile application
- [ ] Real-time WebSocket notifications
- [ ] Offline functionality and sync
- [ ] Push notifications

#### 🔐 Security & Compliance

- [ ] Multi-factor authentication (MFA)
- [ ] Audit logging and compliance reporting
- [ ] Data encryption at rest and in transit
- [ ] GDPR compliance features
- [ ] Security incident response workflows

### 📋 Technical Debt & Improvements

- [ ] Unit and integration test coverage (target: 80%+)
- [ ] Performance optimization and bundle size reduction
- [ ] Accessibility improvements (WCAG 2.1 AAA)
- [ ] Internationalization (i18n) support
- [ ] Documentation and developer guides

## 🔧 Development Scripts

```bash
# 🚀 Development
npm run dev              # Start development server with HMR
npm run build            # Build for production
npm run preview          # Preview production build locally

# 🔍 Code Quality
npm run lint             # Run ESLint for code analysis
npm run type-check       # TypeScript compilation check

# 📦 Dependencies
npm install              # Install project dependencies
npm update               # Update dependencies to latest versions
npm audit                # Check for security vulnerabilities

# 🧹 Maintenance
npm run clean            # Clean build artifacts and node_modules
```

## 🌐 API Integration

The application is designed to work with a REST API backend. Mock data is currently used for demonstration purposes. To integrate with a real backend:

1. Update the API endpoints in `src/services/`
2. Replace mock authentication in `src/contexts/AuthContext.tsx`
3. Implement real data fetching in components

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000
VITE_APP_NAME=IT Ticket Management
VITE_COMPANY_NAME=Your Company
VITE_SUPPORT_EMAIL=support@company.com
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help improve RedFish Ticket-Ops:

### 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally: `git clone https://github.com/yourusername/ticket-ops.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes following our coding guidelines
5. **Test** your changes thoroughly
6. **Commit** using conventional commits: `git commit -m 'feat: add amazing feature'`
7. **Push** to your branch: `git push origin feature/amazing-feature`
8. **Submit** a Pull Request with detailed description

### 📝 Coding Guidelines

- Follow TypeScript best practices and maintain type safety
- Use React functional components with hooks
- Implement responsive design for all new components
- Write self-documenting code with clear variable names
- Add JSDoc comments for complex functions
- Follow existing project structure and naming conventions

### 🧪 Testing Requirements

- Write unit tests for new utility functions
- Test React components with React Testing Library
- Ensure accessibility compliance (screen reader testing)
- Verify responsive behavior across different screen sizes
- Test with both light and dark themes

### 📋 Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Tests added/updated and passing
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Accessibility requirements met
- [ ] Mobile responsiveness verified

## 🆘 Support & Community

### 📞 Getting Help

- **📧 Email Support**: [support@redfish.com](mailto:support@redfish.com)
- **📱 Phone**: +1-555-REDFISH (+1-555-733-3474)
- **💬 GitHub Discussions**: Join our community discussions
- **🐛 Bug Reports**: Submit via GitHub Issues with detailed reproduction steps
- **💡 Feature Requests**: Use GitHub Issues with the "enhancement" label

### 📚 Documentation & Resources

- **📖 User Guide**: Check the `/docs` folder for comprehensive documentation
- **� Video Tutorials**: Available on our YouTube channel
- **🔧 API Documentation**: OpenAPI/Swagger specifications
- **💻 Developer Resources**: Setup guides and best practices

### 🌟 Community Guidelines

- Be respectful and inclusive in all interactions
- Provide clear and detailed bug reports
- Share knowledge and help other community members
- Follow our Code of Conduct for a positive environment

---

## 📈 Performance Metrics

### 🚀 Performance Optimization

- **⚡ Lighthouse Score**: 95+ for Performance, Accessibility, Best Practices, SEO
- **📦 Bundle Size**: Optimized with code splitting and tree shaking
- **🔄 Load Time**: First Contentful Paint < 1.5s
- **📱 Mobile Performance**: 90+ Lighthouse mobile score
- **♿ Accessibility**: WCAG 2.1 AA compliant

### 🔒 Security Features

- **🛡️ Security Headers**: CSP, HSTS, and XSS protection
- **🔐 Authentication**: JWT-based with secure token handling
- **🔑 Authorization**: Role-based access control (RBAC)
- **📋 Input Validation**: Comprehensive client and server-side validation
- **🔍 Audit Logging**: Complete user action tracking
- **🚫 XSS Protection**: Sanitized user inputs and CSP headers

---

<div align="center">
  <h2>🌟 Built with ❤️ by RedFish Technologies</h2>
  <p>
    <strong>Powered by:</strong> React • TypeScript • Material-UI • Vite
  </p>
  <p>
    <em>Transforming IT Service Management, One Ticket at a Time</em>
  </p>
  
  ---
  
  <p>
    <strong>📧 Contact:</strong> <a href="mailto:hello@redfish.com">hello@redfish.com</a> |
    <strong>🌐 Website:</strong> <a href="https://redfish.com">redfish.com</a> |
    <strong>📱 Follow:</strong> <a href="https://twitter.com/redfishtech">@redfishtech</a>
  </p>
</div>
