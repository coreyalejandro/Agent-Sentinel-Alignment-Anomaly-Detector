# Agent Sentinel - Deployment Guide

## Overview

Agent Sentinel is an enterprise-grade behavioral anomaly detection system for AI agent interactions. This guide covers deployment options for production environments.

## Prerequisites

- Node.js 18+ or Docker
- Valid API keys (Gemini or Groq)
- SSL certificates for HTTPS (production)
- Monitoring infrastructure (optional)

## Environment Configuration

### Required Environment Variables

```bash
# API Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here

# Application Configuration
VITE_APP_ENVIRONMENT=production
VITE_APP_VERSION=1.0.0
VITE_LOG_LEVEL=info

# Security Configuration
VITE_ENABLE_SECURITY_HEADERS=true
VITE_CORS_ORIGINS=https://yourdomain.com
```

### Environment Files

1. Copy `.env.example` to `.env.local`
2. Fill in your API keys and configuration
3. Ensure sensitive values are properly secured

## Deployment Options

### 1. Docker Deployment (Recommended)

#### Single Container
```bash
# Build the image
docker build -t agent-sentinel .

# Run the container
docker run -d \
  --name agent-sentinel \
  -p 8080:8080 \
  --env-file .env.local \
  --restart unless-stopped \
  agent-sentinel
```

#### Docker Compose
```bash
# Start the application
docker-compose up -d

# With monitoring stack
docker-compose --profile monitoring up -d

# View logs
docker-compose logs -f agent-sentinel
```

### 2. Vercel Deployment

#### Prerequisites
- Vercel account
- GitHub repository connected

#### Configuration
1. Set environment variables in Vercel dashboard
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

#### Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Traditional Server Deployment

#### Build Application
```bash
npm ci
npm run build
```

#### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /path/to/agent-sentinel/dist;
    index index.html;
    
    # Security headers
    include /etc/nginx/security-headers.conf;
    
    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Health check
    location /health {
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

## Security Considerations

### API Key Management
- Use environment variables, never hardcode keys
- Rotate keys regularly
- Implement key validation and monitoring
- Use different keys for different environments

### Network Security
- Enable HTTPS in production
- Configure proper CORS origins
- Implement rate limiting
- Use security headers (CSP, HSTS, etc.)

### Data Protection
- Sanitize log inputs
- Implement data retention policies
- Encrypt sensitive data at rest
- Audit access logs

## Monitoring and Observability

### Health Checks
- Application health: `/health`
- API connectivity monitoring
- Resource utilization tracking

### Logging
- Structured JSON logging
- Log levels: error, warn, info, debug
- Centralized log aggregation
- Log retention policies

### Metrics
- Performance monitoring
- Error rate tracking
- API response times
- User interaction analytics

### Alerting
- Critical error notifications
- Performance degradation alerts
- Security incident detection
- Capacity planning alerts

## Scaling Considerations

### Horizontal Scaling
- Stateless application design
- Load balancer configuration
- Session management
- Database scaling (if applicable)

### Performance Optimization
- CDN for static assets
- Caching strategies
- Bundle optimization
- Lazy loading implementation

### Resource Management
- Memory usage monitoring
- CPU utilization tracking
- Network bandwidth optimization
- Storage capacity planning

## Backup and Recovery

### Data Backup
- Configuration backup
- Log data archival
- Analysis results storage
- Recovery procedures

### Disaster Recovery
- Multi-region deployment
- Failover procedures
- Data replication
- Recovery time objectives

## Maintenance

### Updates
- Security patch management
- Dependency updates
- Feature releases
- Rollback procedures

### Monitoring
- System health checks
- Performance monitoring
- Security audits
- Compliance verification

## Troubleshooting

### Common Issues

#### API Connection Failures
```bash
# Check API key configuration
curl -H "Authorization: Bearer $GEMINI_API_KEY" \
  https://generativelanguage.googleapis.com/v1/models

# Verify network connectivity
docker exec agent-sentinel curl -I https://api.groq.com
```

#### Performance Issues
```bash
# Check container resources
docker stats agent-sentinel

# View application logs
docker logs agent-sentinel --tail 100

# Monitor memory usage
docker exec agent-sentinel cat /proc/meminfo
```

#### Security Concerns
```bash
# Audit security headers
curl -I https://yourdomain.com

# Check SSL configuration
openssl s_client -connect yourdomain.com:443

# Verify CORS settings
curl -H "Origin: https://malicious.com" https://yourdomain.com
```

## Support

For deployment issues:
1. Check application logs
2. Verify environment configuration
3. Test API connectivity
4. Review security settings
5. Contact support team

## Compliance

### Data Privacy
- GDPR compliance
- Data processing agreements
- User consent management
- Data subject rights

### Security Standards
- SOC 2 compliance
- ISO 27001 alignment
- Security audit requirements
- Penetration testing

### Industry Regulations
- Financial services compliance
- Healthcare data protection
- Government security requirements
- International data transfer