# 🤝 Contributing to Mechowarts

Thank you for your interest in contributing to Mechowarts! This guide will help you get started.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Git
- A code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/T4snimul/mechowarts.git
   cd mechowarts
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 💻 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch for integration
- `feature/*` - New features
- `fix/*` - Bug fixes
- `refactor/*` - Code refactoring

### Making Changes

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our code standards

3. **Test your changes**:
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

## 📏 Code Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` type - use proper types or `unknown`
- Define interfaces for data structures
- Use type inference where possible

### React

- Use functional components with hooks
- Follow React best practices
- Use lazy loading for routes
- Implement proper error boundaries

### Code Style

- Run `npm run lint:fix` to auto-fix linting issues
- Run `npm run format` to format code with Prettier
- Follow existing code patterns
- Write clear, self-documenting code
- Add comments only when necessary

### File Organization

```
src/
├── components/     # Reusable UI components
│   └── ui/        # Basic UI components
├── contexts/      # React contexts for state management
├── hooks/         # Custom React hooks
├── pages/         # Page components (routes)
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── styles/        # Global styles
└── data/          # Static data
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `interface User {}`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## 🧪 Testing

### Manual Testing

1. Test all affected features
2. Test on different screen sizes
3. Test dark/light mode
4. Test error scenarios
5. Check browser console for errors

### Automated Testing

Currently, automated tests are not set up. If you want to add tests:

- Use Vitest for unit tests
- Use React Testing Library for component tests
- Use Playwright or Cypress for E2E tests

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows project standards
- [ ] TypeScript compilation passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] All features tested manually
- [ ] No console errors in browser
- [ ] Responsive design tested
- [ ] Documentation updated if needed

### Submitting a PR

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe what changed and why
   - Include screenshots for UI changes
   - List any breaking changes

3. **Address review feedback**:
   - Respond to comments
   - Make requested changes
   - Push updates to your branch

### PR Review Checklist

Reviewers will check:

- Code quality and standards
- TypeScript types are correct
- No security vulnerabilities
- Performance implications
- Breaking changes documented
- Tests pass (if applicable)

## 📁 Project Structure

### Key Files

- `src/App.tsx` - Main application component with routing
- `src/main.tsx` - Application entry point
- `src/contexts/` - Global state management
- `vite.config.js` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `.prettierrc` - Prettier configuration

### Key Contexts

- `AuthContext` - User authentication state
- `ThemeContext` - Dark/light mode
- `SettingsContext` - User preferences
- `AppDataContext` - Application data (people, etc.)
- `NotificationContext` - Toast notifications

## 🎨 UI Components

We use:

- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Icons** for icons
- **React Router** for navigation

## 🐛 Bug Reports

When reporting bugs, include:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots/videos if applicable
5. Browser and OS information
6. Console error messages

## 💡 Feature Requests

When requesting features:

1. Describe the problem you're solving
2. Explain your proposed solution
3. List alternatives considered
4. Include mockups if applicable

## ❓ Questions

If you have questions:

- Check existing issues and discussions
- Ask in GitHub Discussions
- Contact the maintainers

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Happy Contributing! 🎉**

Thank you for making Mechowarts better!
