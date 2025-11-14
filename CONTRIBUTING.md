# Contributing to WikiGo

Thank you for your interest in contributing to WikiGo! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue using the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:

- A clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS information

### Suggesting Features

Have an idea for a new feature? Open an issue using the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md). Include:

- A clear description of the feature
- Use cases and benefits
- Possible implementation approach (if you have ideas)

### Submitting Pull Requests

1. **Fork the repository** and create a new branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes** thoroughly
   - Test in multiple browsers if UI changes
   - Verify no console errors
   - Test edge cases

4. **Commit your changes** with clear, descriptive commit messages
   ```bash
   git commit -m "Add feature: description of what you did"
   ```

5. **Push to your fork** and open a Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Fill out the PR template** completely

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/wikigo.git
   cd wikigo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see README.md)

4. Set up Supabase tables (see README.md)

5. Start the development server:
   ```bash
   npm run dev
   ```

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and single-purpose

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings (unless double quotes are needed)
- Use semicolons
- Maximum line length: 100 characters
- Use trailing commas in arrays and objects

### File Organization

- Components in `src/components/`
- Utilities in `src/lib/`
- Contexts in `src/contexts/`
- Keep related files together

### Component Structure

```jsx
// Imports
import React, { useState } from 'react';
import { SomeComponent } from './SomeComponent';

// Component
export function MyComponent({ prop1, prop2 }) {
  // Hooks
  const [state, setState] = useState(null);
  
  // Handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## Testing

- Test your changes manually before submitting
- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices if UI changes
- Verify no console errors or warnings

## Commit Messages

Use clear, descriptive commit messages:

- Start with a verb (Add, Fix, Update, Remove, etc.)
- Be specific about what changed
- Reference issue numbers if applicable

Examples:
- `Add Zen Mode practice games feature`
- `Fix leaderboard date filtering bug`
- `Update README with new features`
- `Remove unused dependencies`

## Pull Request Process

1. Ensure your PR addresses a single concern
2. Update documentation if needed
3. Add tests if applicable
4. Ensure all checks pass
5. Request review from maintainers
6. Address review feedback promptly

## Questions?

If you have questions about contributing, feel free to:
- Open an issue with the `question` label
- Check existing issues and discussions
- Review the codebase for examples

Thank you for contributing to WikiGo! 🚀

