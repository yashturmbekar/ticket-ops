# IT Ticket Management System

A comprehensive IT helpdesk and ticket management system built with React, TypeScript, and Vite. This system provides a modern, user-friendly interface for managing IT support tickets, assets, users, and more.

## 🚀 Features

- **Ticket Management** - Create, assign, track, and resolve IT support tickets
- **Asset Management** - Track IT assets, hardware, software, and licenses
- **User Management** - Manage employees, IT staff, and administrators
- **Knowledge Base** - Self-service documentation and FAQs
- **Reporting & Analytics** - IT metrics, SLA tracking, and performance reports
- **Network Monitoring** - Basic network device monitoring and alerts
- **Role-Based Access Control** - Granular permissions system
- **Responsive Design** - Mobile-friendly interface
- **Dark/Light Theme** - Theme switching capability

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0, TypeScript 5.8.3, Vite 6.3.5
- **Routing**: React Router DOM 7.6.3
- **Icons**: React Icons 5.5.0
- **Styling**: CSS3 with custom properties, responsive design
- **State Management**: React Context API
- **Form Handling**: React Hook Form (ready for implementation)
- **Charts**: Chart.js/Recharts (ready for implementation)

## 📋 Prerequisites

- Node.js 20.19.0 or higher
- npm 10.8.2 or higher

## 🔧 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd it-ticket-management
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔐 Default Login Credentials

For demonstration purposes, use these credentials:

- **Email**: admin@example.com
- **Password**: password123

## 📁 Project Structure

```
it-ticket-management/
├── public/                    # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── admin/            # Admin dashboard components
│   │   ├── assets/           # Asset management components
│   │   ├── common/           # Reusable UI components
│   │   ├── knowledge/        # Knowledge base components
│   │   ├── network/          # Network monitoring components
│   │   ├── reports/          # Reporting components
│   │   ├── tickets/          # Ticket management components
│   │   └── users/            # User management components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   ├── services/             # API services
│   ├── styles/               # Global styles
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   └── constants/            # Application constants
├── .github/                  # GitHub specific files
└── docs/                     # Documentation
```

## 🎨 Design System

The application uses a comprehensive design system with:

- **CSS Custom Properties** for theming
- **Responsive Grid Layout** for different screen sizes
- **Consistent Spacing** using CSS variables
- **Professional Color Palette** with light/dark theme support
- **Accessibility Features** following WCAG 2.1 guidelines

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

## 📊 Current Implementation Status

### ✅ Completed Features

- Authentication system with mock login
- Responsive layout with sidebar navigation
- Dashboard with statistics and activity feed
- Theme switching (light/dark)
- Common UI components (Button, Card, Header, Sidebar)
- TypeScript type definitions
- Constants and configuration system

### 🚧 In Progress

- Ticket management components
- Asset tracking system
- User management interface
- Knowledge base articles
- Reporting and analytics
- Network monitoring

### 📋 Planned Features

- Real-time notifications
- Email integration
- File upload system
- Advanced search and filtering
- Export capabilities
- Mobile app support

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
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

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Email: support@company.com
- Documentation: Check the `/docs` folder
- Issues: Submit via GitHub Issues

## 📈 Performance

The application is optimized for performance with:

- Code splitting for routes
- Lazy loading of components
- Optimized bundle size
- Efficient state management
- Minimal re-renders

## 🔒 Security

Security measures implemented:

- Input validation
- XSS protection
- CSRF protection
- Role-based access control
- Secure authentication flow

---

Built with ❤️ using React, TypeScript, and Vite
