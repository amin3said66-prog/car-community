# 🚗 Car Community

A modern, fully responsive Angular 20 community platform for car enthusiasts. Built with clean architecture, Tailwind CSS, and standalone components.

## ✨ Features

### Core Features
- **🔐 Authentication System** - Mock-based login with email/password validation
- **🚗 Car Listings** - Browse, filter, and view detailed car listings
- **💬 Community Posts** - Share discussions, advice, news, and showcases
- **🎉 Events** - Discover and join community events
- **👥 Member Directory** - Connect with other car enthusiasts
- **📊 Dashboard** - Overview of community activity and statistics

### Technical Features
- ✅ **Standalone Architecture** - Modern Angular 20 standalone components
- ✅ **Responsive Design** - Mobile-first, fully responsive on all devices (320px - 4K)
- ✅ **Tailwind CSS v3** - Utility-first styling with custom scrollbars
- ✅ **TypeScript** - Fully typed, zero compilation errors
- ✅ **Dark Theme** - Beautiful gradient backgrounds with glassmorphism
- ✅ **Mock Data** - Complete mock services for testing without backend
- ✅ **Clean Architecture** - Centralized models, services, and routing
- ✅ **Material Design** - Angular Material components for consistency

## 📁 Project Structure

```
src/app/
├── auth/                    # Authentication module
│   ├── login/              # Login page with password visibility toggle
│   ├── register/           # Registration form
│   └── auth.service.ts     # Mock authentication service
├── cars/                    # Car listings module
│   ├── car-list/           # Responsive car grid
│   ├── car-details/        # Individual car detail page
│   ├── car-form/           # Add/edit car form
│   └── car.service.ts      # Car data service
├── posts/                   # Community posts module
│   ├── post-list/          # Posts feed
│   ├── post-details/       # Post detail with comments
│   └── post.service.ts     # Post data service
├── events/                  # Events module
│   ├── event-list/         # Events grid
│   ├── event-details/      # Event details with attendance
│   └── event.service.ts    # Event data service
├── customers/              # Members directory
│   ├── customer-list/      # Members grid
│   ├── customer-details/   # Member profile
│   └── customer.service.ts # Member data service
├── dashboard/              # Admin dashboard
│   └── overview/           # Statistics and overview
├── models/                 # Centralized data models
│   ├── car.model.ts
│   ├── post.model.ts
│   ├── event.model.ts
│   ├── user.model.ts
│   └── comment.model.ts
├── data/                   # Mock data
│   ├── mock-cars.ts
│   ├── mock-posts.ts
│   ├── mock-events.ts
│   └── mock-users.ts
└── styles/                 # Global styles
    ├── styles.scss         # Global styles with custom scrollbars
    └── variables.scss      # Tailwind + custom variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- npm 10+ installed

### Installation

```bash
# Clone the repository
git clone https://github.com/Mostafa-SAID7/car-community.git
cd car-community

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:4200`

### Test Login Credentials

Use any of these mock accounts to test:

```
Email: user@example.com
Password: password123

Email: admin@example.com
Password: admin123

Email: test@example.com
Password: test123
```

## 📖 Usage

### Development

```bash
# Start dev server with hot reload
npm start

# Run production build
npm run build

# Preview production build
npm run preview
```

### Build

```bash
# Development build
ng build

# Production build (optimized)
npm run build
```

## 🎨 Styling

### Tailwind CSS Integration
- Version: 3.4.1
- Dark mode enabled
- Custom scrollbar styling (purple-cyan gradient)
- Mobile-first responsive design

### Color Scheme
- **Primary**: Cyan (#06b6d4) & Purple (#9333ea)
- **Background**: Slate dark (#0f172a)
- **Text**: White with opacity variations
- **Accents**: Green (#4ade80), Orange (#fb923c), Red (#f87171)

## 🔧 Architecture Decisions

### Why Standalone Components?
- Simpler, more modern Angular approach
- Reduced boilerplate code
- Direct dependency injection in components
- Better tree-shaking and bundle optimization

### Why Tailwind CSS?
- Utility-first approach for rapid development
- Better consistency and maintainability
- Smaller CSS footprint with PurgeCSS
- Excellent responsive design tools

### Why Mock Services?
- No backend dependency
- Fast development and testing
- Easy to replace with real APIs
- Observable-based for realistic async patterns

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 640px (1 column)
- **Tablet**: 641px - 1024px (2 columns)
- **Desktop**: 1025px+ (3-4 columns)
- **4K**: 2560px+ (full width optimized)

All pages tested on:
- iPhone 12, 13, 14 (375px)
- iPad Air (768px)
- MacBook Air (1440px)
- 4K displays (2560px)

## 🔐 Authentication Flow

1. User enters email and password on login page
2. Mock auth service validates credentials
3. JWT token stored in localStorage
4. User redirected to dashboard
5. Auth guard protects private routes
6. Token included in all API requests

## 🎯 Pages & Routes

| Route | Component | Features |
|-------|-----------|----------|
| `/auth/login` | LoginComponent | Email/password login |
| `/auth/register` | RegisterComponent | User registration |
| `/cars` | CarListComponent | Browse cars with filters |
| `/cars/:id` | CarDetailsComponent | View car details |
| `/cars/new` | CarFormComponent | List a new car |
| `/posts` | PostListComponent | Browse community posts |
| `/posts/:id` | PostDetailsComponent | View post with comments |
| `/events` | EventListComponent | Browse events |
| `/events/:id` | EventDetailsComponent | View event with RSVP |
| `/customers` | CustomerListComponent | Browse members |
| `/customers/:id` | CustomerDetailsComponent | View member profile |
| `/dashboard` | DashboardComponent | Admin overview |

## 📊 Component Hierarchy

```
AppComponent (root)
├── NavigationComponent (sidebar + header)
├── RouterOutlet
│   ├── LoginComponent
│   ├── RegisterComponent
│   ├── CarListComponent → CarDetailsComponent
│   ├── PostListComponent → PostDetailsComponent
│   ├── EventListComponent → EventDetailsComponent
│   ├── CustomerListComponent → CustomerDetailsComponent
│   └── DashboardComponent
└── GlobalStyles (Tailwind + custom scrollbars)
```

## 🛠 Available Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# View production build stats
npm run preview

# Run Angular CLI commands directly
ng generate component component-name
ng generate service service-name
```

## 🌐 Browser Support

- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

## 📦 Dependencies

- **Angular**: 20.3.3
- **Angular Material**: 20.x
- **Tailwind CSS**: 3.4.1
- **TypeScript**: 5.6+
- **RxJS**: 7.8+

## 🎨 Design Highlights

### Dark Theme with Gradients
- Background: `linear-gradient(135deg, #0f172a 0%, #2d1b69 50%, #0f172a 100%)`
- Text: `white` with `rgba(255, 255, 255, 0.7)` for secondary text
- Accents: Cyan to Purple gradients

### Responsive Cards
- **Mobile**: Full width with 1rem padding
- **Tablet**: 2-column grid with 1.5rem gap
- **Desktop**: 3-4 column grid with 2rem gap

### Interactive Elements
- Hover effects with opacity and transforms
- Smooth transitions (0.2s - 0.3s)
- Loading states with spinners
- Error handling with user-friendly messages

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🔗 Links

- [GitHub Repository](https://github.com/Mostafa-SAID7/car-community)
- [Angular Documentation](https://angular.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ using Angular 20, Tailwind CSS, and clean architecture principles**
