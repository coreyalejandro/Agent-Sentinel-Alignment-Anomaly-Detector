# Contributing to Agent Sentinel

We welcome contributions to Agent Sentinel! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please treat all contributors with respect and create a welcoming environment for everyone.

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- Docker (for containerized development)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/agent-sentinel.git
   cd agent-sentinel
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Add your API keys to .env.local
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Commit Messages
We use conventional commits:
- `feat: add new anomaly detection category`
- `fix: resolve memory leak in analysis service`
- `docs: update deployment guide`
- `test: add unit tests for validation utils`
- `refactor: improve error handling`

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run test:coverage
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Standards

### TypeScript
- Use strict TypeScript configuration
- Provide proper type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines
- Use semantic HTML elements

### Testing
- Write unit tests for all utilities
- Test React components with Testing Library
- Aim for >80% code coverage
- Include integration tests for critical paths

### Security
- Validate all inputs
- Sanitize user data
- Follow OWASP guidelines
- Never commit secrets or API keys

## Project Structure

```
src/
├── components/          # React components
│   ├── __tests__/      # Component tests
│   └── *.tsx           # Component files
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── utils/              # Utility functions
│   ├── __tests__/      # Utility tests
│   └── *.ts            # Utility files
├── types/              # TypeScript type definitions
└── config/             # Configuration files
```

## Testing Guidelines

### Unit Tests
- Test individual functions and components
- Mock external dependencies
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Integration Tests
- Test component interactions
- Test API integrations
- Test error scenarios
- Use realistic test data

### Example Test Structure
```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should do expected behavior', () => {
      // Arrange
      const props = { ... };
      
      // Act
      render(<ComponentName {...props} />);
      
      // Assert
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });
});
```

## Documentation

### Code Documentation
- Use JSDoc for functions and classes
- Document complex algorithms
- Explain business logic
- Include usage examples

### README Updates
- Update feature lists
- Add new configuration options
- Update installation instructions
- Include breaking changes

## Security Considerations

### Sensitive Data
- Never commit API keys or secrets
- Use environment variables for configuration
- Sanitize all user inputs
- Validate data at boundaries

### Dependencies
- Keep dependencies updated
- Review security advisories
- Use `npm audit` regularly
- Prefer well-maintained packages

## Performance Guidelines

### Frontend Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle size
- Use lazy loading where appropriate

### Code Optimization
- Avoid unnecessary re-renders
- Use efficient algorithms
- Profile performance bottlenecks
- Monitor memory usage

## Deployment

### Before Deployment
- Run full test suite
- Check for security vulnerabilities
- Verify environment configuration
- Test in staging environment

### Docker
- Update Dockerfile if needed
- Test container builds locally
- Verify health checks work
- Check resource requirements

## Issue Reporting

### Bug Reports
Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Screenshots if applicable

### Feature Requests
Include:
- Use case description
- Proposed solution
- Alternative solutions considered
- Additional context

## Review Process

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Security considerations addressed
- [ ] Performance impact considered
- [ ] Breaking changes documented

### Review Criteria
- Functionality works as expected
- Code is readable and maintainable
- Tests provide adequate coverage
- Security best practices followed
- Performance is acceptable

## Release Process

### Version Numbering
We follow Semantic Versioning (SemVer):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped
- [ ] Security scan completed
- [ ] Performance benchmarks run

## Getting Help

### Resources
- [Architecture Documentation](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Documentation](docs/API.md)

### Communication
- GitHub Issues for bugs and features
- GitHub Discussions for questions
- Email security@yourorg.com for security issues

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to Agent Sentinel! 🚀