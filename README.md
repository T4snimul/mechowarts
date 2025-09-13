# 🎓 MechoWarts - Student Directory

A magical, responsive student directory application built with modern web technologies. Features a beautiful Harry Potter-inspired design with advanced filtering, sorting, and responsive card layouts.

## ✨ Features

- 🎨 **Modern UI/UX**: Beautiful, responsive design with dark/light theme support
- 🔍 **Advanced Search**: Real-time filtering by name, roll number, blood group, hometown, and phone
- 📊 **Smart Sorting**: Sort by multiple criteria with intelligent numeric handling
- 🏠 **House System**: Hogwarts-inspired house categorization with themed styling
- 📱 **Mobile-First**: Fully responsive design that works perfectly on all devices
- ⚡ **Performance**: Optimized with React hooks, memoization, and efficient rendering
- 🎭 **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- 🌙 **Theme System**: Automatic dark/light mode with system preference detection
- 📋 **Copy to Clipboard**: One-click phone number copying functionality
- 🎯 **TypeScript**: Fully typed for better developer experience and code reliability

## 🏗️ Architecture

### Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Card.tsx
│   ├── layout/          # Layout components
│   ├── Header.tsx       # Main header with search and controls
│   ├── Footer.tsx       # Application footer
│   ├── Grid.tsx         # Student grid layout
│   └── ProfileCard.tsx  # Individual student card
├── contexts/            # React context providers
│   ├── AppContext.tsx   # Global app state
│   └── ThemeContext.tsx # Theme management
├── hooks/               # Custom React hooks
│   ├── index.ts         # Utility hooks
│   └── usePeopleFilter.ts # Filtering and sorting logic
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── index.ts
├── data/                # Static data and API functions
│   └── people.ts
├── styles/              # Global styles and design system
│   └── variables.css
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

### Key Design Patterns

- **Component Composition**: Small, focused components that can be easily combined
- **Custom Hooks**: Reusable logic extraction for filtering, localStorage, clipboard, etc.
- **Context Providers**: Centralized state management for theme and app data
- **TypeScript Integration**: Full type safety with proper interfaces and generics
- **CSS Custom Properties**: Scalable design system with consistent spacing and colors

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern web browser with ES2020+ support

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mechowarts
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## 🎨 Design System

### Color Palette

The application uses a carefully crafted color system with CSS custom properties:

- **Primary**: Blue tones for main UI elements
- **Secondary**: Gray scale for text and backgrounds
- **Accent**: Purple tones for highlights
- **House Colors**: Themed colors for Gryffindor, Hufflepuff, Ravenclaw, and Slytherin

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1536px
- **Large**: > 1536px

### Typography Scale

Using a modular scale with consistent sizing:

- **xs**: 0.75rem
- **sm**: 0.875rem
- **base**: 1rem
- **lg**: 1.125rem
- **xl**: 1.25rem
- **2xl**: 1.5rem
- **3xl**: 1.875rem

## 🧩 Component API

### ProfileCard

```tsx
interface ProfileCardProps {
  person: Person;
  index: number;
}
```

Features:

- Hover/tap interactions
- House-themed styling
- Contact information panel
- Responsive image handling

### Header

```tsx
interface HeaderProps {
  query: string;
  setQuery: (query: string) => void;
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  totalCount?: number;
  filteredCount?: number;
}
```

Features:

- Real-time search
- Sort controls
- Theme toggle
- Statistics display

### UI Components

All UI components follow consistent patterns:

- TypeScript interfaces for props
- Forwarded refs where applicable
- Consistent styling API
- Accessibility features

## 🔧 Customization

### Adding New Students

Update the `PEOPLE` array in `src/data/people.ts`:

```typescript
{
  id: "unique-id",
  roll: "2408XXX",
  name: "Student Name",
  bloodGroup: "A+",
  hometown: "City Name",
  phone: "+8801XXXXXXXXX",
  fb: "https://facebook.com/username",
  avatar: "https://i.pravatar.cc/160?img=X",
  house: "gryffindor", // or hufflepuff, ravenclaw, slytherin
  houseRoll: "GR001",
  status: "active"
}
```

### Theme Customization

Modify CSS custom properties in `src/styles/variables.css`:

```css
:root {
  --color-primary-500: #your-color;
  --color-accent-500: #your-accent;
  /* ... other variables */
}
```

### Adding New Sort Options

1. Update the `SortBy` type in `src/types/index.ts`
2. Add the option to the sort control in `src/components/Header.tsx`
3. Handle the new sort logic in `src/hooks/usePeopleFilter.ts`

## 🧪 Testing

The application is built with testability in mind:

- Pure functions for easy unit testing
- Separated business logic in custom hooks
- Predictable component interfaces
- Type safety reducing runtime errors

## 📱 Mobile Features

- **Touch-friendly**: Large tap targets and gesture support
- **Responsive Images**: Optimized loading and display
- **Performance**: Smooth animations and transitions
- **Accessibility**: Screen reader support and proper focus management

## 🌟 Advanced Features

### Search Functionality

- **Multi-field search**: Searches across name, roll, blood group, hometown, and phone
- **Case-insensitive**: Works regardless of input case
- **Real-time**: Updates as you type
- **Debounced**: Optimized for performance

### Sorting System

- **Intelligent numeric sorting**: Proper handling of roll numbers
- **Alphabetical sorting**: For text fields
- **Stable sorting**: Maintains relative order for equal elements

### Theme System

- **System preference detection**: Automatically matches OS theme
- **Manual override**: User can choose specific theme
- **Persistent storage**: Remembers user choice
- **Smooth transitions**: Animated theme switching

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm run lint && npm run type-check`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Harry Potter Universe**: For the magical inspiration
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For beautiful animations
- **React**: For the component-based architecture
- **TypeScript**: For type safety and developer experience
- **Vite**: For fast development and building

## 📞 Support

If you have any questions or need help:

- 📧 **Email**: [your-email@example.com]
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/mechowarts/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/mechowarts/discussions)

---

**Made with ❤️ by the community**
