# InterviewAce AI — Deployment Guide

## Option 1: Local Development (Recommended for Testing)

### Prerequisites
```
Java 17+
Node.js 18+
MySQL 8.x running locally
Maven 3.8+
```

### Step-by-Step

**1. Start MySQL and run schema:**
```bash
mysql -u root -p -e "source database/schema.sql"
mysql -u root -p interviewace_db -e "source database/seed.sql"
```

**2. Configure backend `application.yml`:**
```yaml
spring.datasource.password: your_mysql_root_password
gemini.api.key: AIza...your_gemini_key
```

**3. Start backend:**
```bash
cd backend
mvn spring-boot:run
# → Starts at http://localhost:8080
# → Swagger UI: http://localhost:8080/api/swagger-ui.html
```

**4. Start frontend:**
```bash
cd frontend
npm install
npm run dev
# → Starts at http://localhost:5173
```

---

## Option 2: Docker Compose (Production-Like)

Create `docker-compose.yml` in the project root:

```yaml
version: '3.9'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: interviewace_root
      MYSQL_DATABASE: interviewace_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./database/seed.sql:/docker-entrypoint-initdb.d/02-seed.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/interviewace_db?useSSL=false&serverTimezone=UTC
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: interviewace_root
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      mysql:
        condition: service_healthy
    volumes:
      - resume_uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mysql_data:
  resume_uploads:
```

**Backend `Dockerfile`:**
```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Frontend `Dockerfile`:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**`nginx.conf`:**
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Run:**
```bash
export GEMINI_API_KEY=AIza...
export JWT_SECRET=your_512_bit_secret
docker compose up --build
```

Access at `http://localhost:3000`

---

## Option 3: Cloud Deployment (Railway)

Railway is the easiest cloud option for this stack.

### Backend on Railway
1. Push backend to GitHub
2. Create Railway project → "New Service" → "GitHub Repo"
3. Set environment variables:
   ```
   GEMINI_API_KEY=AIza...
   JWT_SECRET=your_jwt_secret
   SPRING_DATASOURCE_URL=jdbc:mysql://${{MySQL.MYSQL_HOST}}:${{MySQL.MYSQL_PORT}}/railway
   SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQL_USER}}
   SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
   ```
4. Add MySQL plugin from Railway marketplace

### Frontend on Railway (or Vercel)
1. Create another Railway service for frontend
2. Set `VITE_API_BASE_URL` to your backend Railway URL
3. Or deploy to Vercel:
   ```bash
   npm i -g vercel
   cd frontend && vercel --prod
   ```

---

## Option 4: AWS Deployment

### Architecture
```
Route 53 (DNS)
    └── CloudFront (CDN for frontend)
         └── S3 (React SPA static files)
    └── Application Load Balancer
         └── EC2 (Spring Boot, t3.small)
              └── RDS MySQL (db.t3.micro)
```

### Steps

**1. Build frontend:**
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://interviewace-frontend-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**2. Deploy backend to EC2:**
```bash
# Build JAR
mvn clean package -DskipTests

# Copy to EC2
scp target/interviewace-backend-1.0.0.jar ec2-user@your-ec2-ip:/home/ec2-user/

# SSH and run
ssh ec2-user@your-ec2-ip
java -jar interviewace-backend-1.0.0.jar \
  --spring.datasource.url=jdbc:mysql://your-rds-endpoint:3306/interviewace_db \
  --spring.datasource.password=your_rds_password \
  --gemini.api.key=AIza...
```

**3. Configure RDS:**
```
Engine: MySQL 8.0
Instance: db.t3.micro (free tier eligible)
Enable: Multi-AZ (for production)
Security Group: Allow 3306 from EC2 only
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key |
| `JWT_SECRET` | ✅ Yes | 512-bit JWT signing secret |
| `SPRING_DATASOURCE_URL` | ✅ Yes | MySQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | ✅ Yes | MySQL username |
| `SPRING_DATASOURCE_PASSWORD` | ✅ Yes | MySQL password |
| `MAIL_USERNAME` | Optional | Gmail for password reset |
| `MAIL_PASSWORD` | Optional | Gmail app password |
| `UPLOAD_DIR` | Optional | Resume upload directory (default: `./uploads`) |

---

## Getting a Gemini API Key (Free)

1. Visit [https://ai.google.dev/](https://ai.google.dev/)
2. Click "Get API key in Google AI Studio"
3. Create a new project
4. Generate API key
5. Free tier: 1500 requests/day on Gemini 1.5 Flash

---

## Production Checklist

- [ ] Change `spring.jpa.hibernate.ddl-auto` to `validate` (never `create` or `update`)
- [ ] Use strong JWT secret (512+ bits)
- [ ] Enable HTTPS/SSL
- [ ] Set `CORS` to only your frontend domain
- [ ] Configure rate limiting on auth endpoints
- [ ] Enable MySQL SSL connection
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable Spring Boot Actuator for health checks
