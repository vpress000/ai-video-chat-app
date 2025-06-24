# Security Architecture Diagram

## Overview
This diagram illustrates the security layers, authentication flows, and protection mechanisms implemented in the Video Chat Application.

## Diagram

```mermaid
flowchart TB
    subgraph "Threats"
        Threats[🔓 External Threats<br/>DDoS, Attacks, Abuse]
    end

    subgraph "Perimeter"
        WAF[🛡️ Web Application Firewall<br/>+ DDoS Protection]
        CDN[🌐 CDN Security<br/>+ SSL Termination]
    end

    subgraph "Authentication"
        Auth[🎫 Session Management<br/>+ Rate Limiting]
        Validation[✅ Input Validation<br/>+ CORS Policy]
    end

    subgraph "Application"
        Frontend[🖥️ React Frontend<br/>Secure Client]
        Backend[🚀 FastAPI Backend<br/>Security Middleware]
    end

    subgraph "Data Protection"
        Database[(🗄️ Encrypted Database<br/>PostgreSQL + Backups)]
        Cache[(⚡ Secured Cache<br/>Redis + Encryption)]
        Secrets[🔑 Secrets Management<br/>API Keys + Rotation]
    end

    subgraph "External APIs"
        ExternalAPI[� External Services<br/>YouTube + OpenAI]
        APILimits[� Rate Limits<br/>+ Key Management]
    end

    subgraph "Monitoring"
        Security[📊 Security Monitoring<br/>Logs + Threat Detection]
        Compliance[✅ Compliance<br/>Audit + GDPR]
    end

    %% Main security flow
    Threats -.->|Blocked| WAF
    Frontend --> CDN
    CDN --> WAF
    WAF --> Auth
    Auth --> Validation
    Validation --> Backend

    %% Data protection
    Backend --> Database
    Backend --> Cache
    Backend --> Secrets

    %% External integrations
    Backend --> ExternalAPI
    ExternalAPI --> APILimits

    %% Monitoring
    Backend --> Security
    Database --> Security
    Security --> Compliance

    %% Styling for better visual separation
    classDef threat fill:#ffcdd2,stroke:#d32f2f,stroke-width:3px
    classDef security fill:#c8e6c9,stroke:#388e3c,stroke-width:2px
    classDef data fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef monitoring fill:#fff3e0,stroke:#f57c00,stroke-width:2px

    class Threats threat
    class WAF,CDN,Auth,Validation,Backend security
    class Database,Cache,Secrets,ExternalAPI data
    class Security,Compliance monitoring
```

## Security Layers and Controls

### 1. Perimeter Security

#### Web Application Firewall (WAF)
```yaml
Protection Features:
  - SQL Injection prevention
  - XSS attack filtering
  - Rate limiting per IP
  - Geographic blocking
  - Bot detection and mitigation
  
Rules:
  - Block common attack patterns
  - Rate limit: 100 requests/minute per IP
  - Block requests from high-risk countries
  - Challenge suspicious traffic with CAPTCHA
```

#### CDN Security
```yaml
CloudFlare/AWS CloudFront:
  - DDoS protection (Layer 3/4/7)
  - Bot management
  - SSL/TLS encryption
  - Origin hiding
  - Cache poisoning protection
```

### 2. Authentication & Session Management

#### Session Security
```python
# Session Configuration
SESSION_CONFIG = {
    'secret_key': 'cryptographically-strong-key',
    'session_timeout': 3600,  # 1 hour
    'secure_cookies': True,
    'httponly_cookies': True,
    'samesite': 'strict'
}

# Session validation
def validate_session(session_id: str) -> bool:
    session = redis.get(f"session:{session_id}")
    if not session:
        return False
    
    # Check expiration and refresh
    if session.expires < datetime.now():
        redis.delete(f"session:{session_id}")
        return False
    
    return True
```

#### Rate Limiting
```python
# Rate limiting implementation
RATE_LIMITS = {
    'video_processing': '5/minute',
    'chat_messages': '60/minute',
    'search_queries': '30/minute',
    'api_calls': '1000/hour'
}

@rate_limit('60/minute')
async def chat_endpoint():
    # Implementation with sliding window
    pass
```

### 3. Input Validation & Sanitization

#### Frontend Validation
```typescript
// Input validation schemas
const videoUrlSchema = z.string().url().refine(url => {
    return /^https:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(url);
}, "Must be a valid YouTube URL");

const chatMessageSchema = z.string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long")
    .refine(msg => !containsMaliciousContent(msg));
```

#### Backend Validation
```python
# Pydantic models for validation
class ProcessVideoRequest(BaseModel):
    youtube_url: HttpUrl = Field(..., regex=r'youtube\.(com|be)')
    
    @validator('youtube_url')
    def validate_youtube_url(cls, v):
        if not is_public_video(v):
            raise ValueError('Video must be publicly accessible')
        return v

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    
    @validator('message')
    def sanitize_message(cls, v):
        return html.escape(v.strip())
```

### 4. Data Protection

#### Encryption at Rest
```sql
-- Database encryption
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    video_id VARCHAR(255) UNIQUE NOT NULL,
    title TEXT,
    transcript TEXT ENCRYPTED,  -- Encrypted column
    created_at TIMESTAMP DEFAULT NOW()
);

-- Backup encryption
pg_dump --encrypt=AES256 --password-file=.pgpass database_name
```

#### Encryption in Transit
```yaml
# SSL/TLS Configuration
nginx:
  ssl_protocols: TLSv1.2 TLSv1.3
  ssl_ciphers: ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256
  ssl_prefer_server_ciphers: on
  ssl_session_cache: shared:SSL:10m
  ssl_session_timeout: 10m

database:
  sslmode: require
  sslcert: /path/to/client-cert.pem
  sslkey: /path/to/client-key.pem
  sslrootcert: /path/to/ca-cert.pem
```

#### Secrets Management
```python
# Secure secrets handling
import os
from cryptography.fernet import Fernet

class SecretsManager:
    def __init__(self):
        self.key = os.environ.get('ENCRYPTION_KEY')
        self.cipher = Fernet(self.key)
    
    def get_secret(self, name: str) -> str:
        encrypted_value = os.environ.get(name)
        return self.cipher.decrypt(encrypted_value.encode()).decode()
    
    def rotate_keys(self):
        # Implement key rotation logic
        pass

# Environment variables (encrypted)
OPENAI_API_KEY = secrets_manager.get_secret('OPENAI_API_KEY')
YOUTUBE_API_KEY = secrets_manager.get_secret('YOUTUBE_API_KEY')
```

### 5. API Security

#### External API Protection
```python
# API key rotation and monitoring
class ExternalAPIManager:
    def __init__(self):
        self.api_keys = {
            'openai': APIKey('openai', expires=30),  # 30 days
            'youtube': APIKey('youtube', expires=90)  # 90 days
        }
    
    async def make_request(self, service: str, endpoint: str, **kwargs):
        # Rate limiting for external APIs
        if not await self.check_rate_limit(service):
            raise RateLimitExceeded()
        
        # Use current key with automatic rotation
        api_key = await self.get_current_key(service)
        
        # Make request with retry logic
        return await self.request_with_retry(endpoint, api_key, **kwargs)
```

### 6. Monitoring & Incident Response

#### Security Monitoring
```python
# Security event logging
class SecurityLogger:
    def log_security_event(self, event_type: str, details: dict):
        event = {
            'timestamp': datetime.utcnow(),
            'event_type': event_type,
            'source_ip': request.remote_addr,
            'user_agent': request.headers.get('User-Agent'),
            'details': details,
            'severity': self.determine_severity(event_type)
        }
        
        # Send to SIEM system
        self.send_to_siem(event)
        
        # Trigger alerts for high-severity events
        if event['severity'] >= SecurityLevel.HIGH:
            self.trigger_alert(event)

# Threat detection patterns
THREAT_PATTERNS = {
    'sql_injection': r'(\bunion\b|\bselect\b|\binsert\b|\bdelete\b|\bdrop\b)',
    'xss_attempt': r'(<script|javascript:|onload=|onerror=)',
    'path_traversal': r'(\.\./|\.\.\\)',
    'command_injection': r'(;|\|&|&&|\|\|)'
}
```

#### Incident Response
```yaml
Security Incident Response Plan:
  
  Level 1 (Low Risk):
    - Automated blocking
    - Log for analysis
    - No immediate action required
  
  Level 2 (Medium Risk):
    - Temporary IP blocking
    - Enhanced monitoring
    - Security team notification
  
  Level 3 (High Risk):
    - Immediate blocking
    - Incident response team activation
    - Service isolation if necessary
    - Customer notification if data affected
  
  Level 4 (Critical):
    - Service shutdown if necessary
    - Full incident response protocol
    - External security firm engagement
    - Regulatory notification
```

## Compliance and Privacy

### Data Privacy (GDPR/CCPA)
```python
# Privacy controls implementation
class PrivacyManager:
    def anonymize_user_data(self, user_id: str):
        # Remove PII from chat logs
        # Replace with anonymized identifiers
        pass
    
    def handle_data_deletion_request(self, user_id: str):
        # Remove all user data
        # Maintain audit trail without PII
        pass
    
    def export_user_data(self, user_id: str):
        # Generate comprehensive data export
        # Include all data collected about user
        pass
```

### Security Standards Compliance
- **OWASP Top 10**: Protection against all major web vulnerabilities
- **ISO 27001**: Information security management standards
- **SOC 2 Type II**: Security and availability controls
- **PCI DSS**: If payment processing is added

## Security Testing

### Automated Security Testing
```yaml
Security Testing Pipeline:
  SAST (Static Analysis):
    - CodeQL analysis
    - Bandit for Python security issues
    - ESLint security rules for TypeScript
  
  DAST (Dynamic Analysis):
    - OWASP ZAP scanning
    - API security testing
    - Penetration testing tools
  
  Dependency Scanning:
    - Snyk vulnerability scanning
    - npm audit for frontend
    - Safety for Python packages
  
  Infrastructure Testing:
    - Cloud security posture management
    - Network configuration validation
    - Container image scanning
```

### Manual Security Testing
- **Penetration Testing**: Quarterly external assessments
- **Code Reviews**: Security-focused peer reviews
- **Threat Modeling**: Regular threat assessment updates
- **Red Team Exercises**: Annual security simulation
