<<<<<<< HEAD
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ae90fd7b-319b-4890-9e1b-00a9b0a1ce66

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
=======
# Agent Sentinel — Enterprise Behavioral Anomaly Detection System

An enterprise-grade diagnostic platform for analyzing AI agent interaction logs and detecting behavioral anomalies, alignment failures, and security risks in production AI systems.

[![CI/CD](https://github.com/your-org/agent-sentinel/workflows/CI/badge.svg)](https://github.com/your-org/agent-sentinel/actions)
[![Security](https://img.shields.io/badge/security-enterprise-green.svg)](docs/SECURITY.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Docker
- Valid API keys (Gemini or Groq)

### Development Setup
```bash
# Clone and install
git clone https://github.com/your-org/agent-sentinel.git
cd agent-sentinel
npm install

# Configure environment
cp .env.example .env.local
# Add your API keys to .env.local

# Start development server
npm run dev
```

### Production Deployment
```bash
# Docker deployment (recommended)
docker-compose up -d

# Or build and deploy
npm run build
npm run preview
```

---

## 🏗️ Enterprise Features

### Security & Compliance
- ✅ **Input Validation & Sanitization** - Comprehensive data validation
- ✅ **API Key Security** - Secure credential management
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Security Headers** - CORS, CSP, and security hardening
- ✅ **Audit Logging** - Complete activity tracking
- ✅ **Data Encryption** - Secure data handling

### Reliability & Performance
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Health Monitoring** - System status tracking
- ✅ **Performance Metrics** - Real-time monitoring
- ✅ **Retry Logic** - Automatic failure recovery
- ✅ **Circuit Breakers** - Service protection
- ✅ **Load Balancing** - Horizontal scaling support

### Development & Operations
- ✅ **Comprehensive Testing** - Unit, integration, and E2E tests
- ✅ **CI/CD Pipeline** - Automated testing and deployment
- ✅ **Code Quality** - ESLint, Prettier, and TypeScript strict mode
- ✅ **Docker Support** - Containerized deployment
- ✅ **Monitoring** - Application and business metrics
- ✅ **Documentation** - Complete technical documentation

---

## 🔍 What It Does

Agent Sentinel analyzes AI agent interaction logs to detect 17+ categories of behavioral anomalies:

### Core Detection Categories
- **Goal Drift** - Deviation from intended objectives
- **Deception Patterns** - Misleading or false information
- **Policy Violations** - Breach of operational guidelines
- **Resource Exploitation** - Inefficient resource usage
- **Security Risks** - Potential vulnerabilities
- **Alignment Issues** - Misalignment with human values

### Analysis Capabilities
- Real-time anomaly detection
- Severity classification (LOW/MEDIUM/HIGH/CRITICAL)
- Evidence-based reporting
- Intervention recommendations
- Exportable audit records
- Risk trend analysis

---

## 🏛️ Architecture

### System Components
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
├─────────────────────────────────────────────────────────────┤
│  React + TypeScript │ Error Boundaries │ Performance       │
│  Lazy Loading       │ Health Checks    │ Monitoring        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
├─────────────────────────────────────────────────────────────┤
│  AI Providers       │ Validation       │ Security          │
│  Rate Limiting      │ Error Handling   │ Logging           │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Docker Containers  │ Load Balancing   │ Monitoring        │
│  Health Checks      │ Security Headers │ Audit Logs       │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack
- **Frontend**: React 19, TypeScript 5.8, Vite 6
- **AI/ML**: Google Gemini API, Groq API
- **Testing**: Jest, Testing Library, E2E tests
- **Infrastructure**: Docker, Nginx, GitHub Actions
- **Monitoring**: Performance metrics, Health checks
- **Security**: Input validation, Rate limiting, Audit logs

---

## 📊 Usage

### 1. Upload Analysis Data
- Mount local log directories via File System Access API
- Upload individual log files (JSON, TXT)
- Paste log content directly
- Load demo data for testing

### 2. Configure Analysis
- Select files for analysis
- Set analysis parameters
- Choose AI provider (Gemini/Groq)
- Configure security settings

### 3. Run Analysis
- Real-time anomaly detection
- Progress monitoring
- Error handling and recovery
- Performance tracking

### 4. Review Results
- Interactive dashboard
- Anomaly categorization
- Evidence presentation
- Risk assessment
- Export capabilities

---

## 🔧 Configuration

### Environment Variables
```bash
# API Configuration
VITE_GEMINI_API_KEY=your_gemini_key
VITE_GROQ_API_KEY=your_groq_key

# Application Settings
VITE_APP_ENVIRONMENT=production
VITE_LOG_LEVEL=info
VITE_ENABLE_SECURITY_HEADERS=true

# Performance Settings
VITE_MAX_FILE_SIZE=5242880
VITE_RATE_LIMIT_REQUESTS=100
```

### Security Configuration
- API key validation and rotation
- Input sanitization and validation
- Rate limiting and abuse protection
- Security headers and CORS
- Audit logging and monitoring

---

## 🧪 Testing

### Test Suite
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test files
npm test -- --testPathPattern=validation
```

### Test Categories
- **Unit Tests** - Component and utility testing
- **Integration Tests** - Service integration testing
- **Security Tests** - Input validation and security
- **Performance Tests** - Load and stress testing

---

## 🚀 Deployment

### Docker Deployment (Recommended)
```bash
# Build and run
docker-compose up -d

# With monitoring
docker-compose --profile monitoring up -d

# Scale services
docker-compose up -d --scale agent-sentinel=3
```

### Cloud Deployment
- **Vercel** - Serverless deployment
- **AWS/GCP/Azure** - Container deployment
- **Kubernetes** - Orchestrated deployment
- **CDN** - Global content delivery

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

---

## 📈 Monitoring

### Health Checks
- Application health endpoint
- Service dependency checks
- Performance monitoring
- Error rate tracking

### Metrics
- Request/response times
- Error rates and types
- Resource utilization
- User interaction analytics

### Alerting
- Critical error notifications
- Performance degradation alerts
- Security incident detection
- Capacity planning alerts

---

## 🔒 Security

### Data Protection
- Input validation and sanitization
- Secure API communication
- Data encryption at rest and in transit
- Privacy-preserving analysis

### Access Control
- API key management
- Rate limiting and throttling
- CORS and security headers
- Audit logging

### Compliance
- GDPR compliance
- SOC 2 alignment
- Security audit support
- Data retention policies

---

## 📚 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Guide](docs/SECURITY.md)
- [API Documentation](docs/API.md)
- [Contributing Guide](CONTRIBUTING.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

### Code Quality
- Follow TypeScript best practices
- Write comprehensive tests
- Use semantic commit messages
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: Check our [docs](docs/) directory
- **Issues**: Report bugs on [GitHub Issues](https://github.com/your-org/agent-sentinel/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/your-org/agent-sentinel/discussions)
- **Security**: Report security issues to security@yourorg.com

---

## 🔬 Research Applications

Agent Sentinel is designed for AI safety research, particularly:

- **Behavioral Observability** - Detecting hidden patterns in AI behavior
- **Alignment Research** - Measuring goal alignment and drift
- **Safety Evaluation** - Comprehensive safety assessment
- **Risk Assessment** - Identifying potential failure modes
- **Compliance Monitoring** - Ensuring policy adherence

The anomaly taxonomy maps to open questions in AI safety research, including shadow reasoning, omission deception, and system gaslighting patterns that are critical for understanding AI behavior in production environments.

---

*Built with ❤️ for AI Safety Research*
>>>>>>> ea0fc0a (feat: Implement ErrorBoundary component with tests)
