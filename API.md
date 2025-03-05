# ReliableNet API Documentation

## Authentication

Most API endpoints require authentication using NextAuth.js. Include the session token in the Authorization header:

```http
Authorization: Bearer <session_token>
```

## Rate Limiting

The API implements rate limiting to ensure fair usage and prevent abuse. Rate limits are applied per IP address and per authenticated user.

### Rate Limit Headers

All responses include the following headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limits

| Endpoint | Rate Limit | Window |
|----------|------------|---------|
| Authentication | 5 requests | 1 minute |
| Speed Tests | 10 requests | 1 minute |
| Reviews | 20 requests | 1 minute |
| Complexes | 100 requests | 1 minute |
| User Settings | 50 requests | 1 minute |
| Messaging | 30 requests | 1 minute |
| Tips/FAQs | 200 requests | 1 minute |

### Rate Limit Exceeded

When rate limit is exceeded, the API returns a 429 Too Many Requests response:

```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again in {seconds} seconds.",
  "retryAfter": 60
}
```

The `retryAfter` field indicates the number of seconds to wait before making another request.

### Rate Limit Exemptions

The following endpoints are exempt from rate limiting:
- Health check endpoint (`/api/health`)
- Static assets and public resources

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

Request body:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

#### Login
```http
POST /api/auth/login
```

Request body:
```json
{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "success": true,
  "session": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string"
    }
  }
}
```

### Speed Tests

#### Submit Speed Test
```http
POST /api/speed-tests/submit
```

Request body:
```json
{
  "downloadSpeed": number,
  "uploadSpeed": number,
  "ping": number,
  "location": {
    "latitude": number,
    "longitude": number,
    "city": "string",
    "state": "string",
    "country": "string",
    "zip": "string"
  }
}
```

Response:
```json
{
  "success": true,
  "speedTest": {
    "id": "string",
    "downloadSpeed": number,
    "uploadSpeed": number,
    "ping": number,
    "createdAt": "string",
    "location": {
      "latitude": number,
      "longitude": number,
      "city": "string",
      "state": "string",
      "country": "string",
      "zip": "string"
    }
  }
}
```

#### Get Speed Tests
```http
GET /api/speed-tests
```

Query parameters:
- `userId`: string (optional)
- `complexId`: string (optional)
- `isp`: string (optional)
- `startDate`: string (optional)
- `endDate`: string (optional)

Response:
```json
{
  "speedTests": [
    {
      "id": "string",
      "downloadSpeed": number,
      "uploadSpeed": number,
      "ping": number,
      "createdAt": "string",
      "location": {
        "latitude": number,
        "longitude": number,
        "city": "string",
        "state": "string",
        "country": "string",
        "zip": "string"
      }
    }
  ]
}
```

### ISP Reviews

#### Create ISP Review
```http
POST /api/isp/reviews
```

Request body:
```json
{
  "ispMetricId": "string",
  "rating": number,
  "comment": "string",
  "pros": ["string"],
  "cons": ["string"],
  "speedRating": number,
  "reliabilityRating": number,
  "valueRating": number,
  "supportRating": number,
  "installationRating": number,
  "verificationProof": "string",
  "photos": ["string"]
}
```

Response:
```json
{
  "success": true,
  "review": {
    "id": "string",
    "rating": number,
    "comment": "string",
    "pros": ["string"],
    "cons": ["string"],
    "speedRating": number,
    "reliabilityRating": number,
    "valueRating": number,
    "supportRating": number,
    "installationRating": number,
    "verificationProof": "string",
    "photos": ["string"],
    "createdAt": "string",
    "user": {
      "name": "string"
    }
  }
}
```

#### Get ISP Reviews
```http
GET /api/isp/reviews/[ispId]
```

Query parameters:
- `sortBy`: "rating" | "date" | "helpful" (optional)
- `minRating`: number (optional)
- `verified`: boolean (optional)

Response:
```json
{
  "reviews": [
    {
      "id": "string",
      "rating": number,
      "comment": "string",
      "pros": ["string"],
      "cons": ["string"],
      "speedRating": number,
      "reliabilityRating": number,
      "valueRating": number,
      "supportRating": number,
      "installationRating": number,
      "verificationProof": "string",
      "photos": ["string"],
      "createdAt": "string",
      "helpful": number,
      "notHelpful": number,
      "user": {
        "name": "string"
      }
    }
  ]
}
```

### Apartment Complexes

#### Create Complex
```http
POST /api/complexes
```

Request body:
```json
{
  "name": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zip": "string",
  "latitude": number,
  "longitude": number,
  "website": "string",
  "amenities": ["string"],
  "managementContact": {
    "name": "string",
    "email": "string",
    "phone": "string"
  }
}
```

Response:
```json
{
  "success": true,
  "complex": {
    "id": "string",
    "name": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip": "string",
    "latitude": number,
    "longitude": number,
    "website": "string",
    "amenities": ["string"],
    "managementContact": {
      "name": "string",
      "email": "string",
      "phone": "string"
    }
  }
}
```

#### Get Complexes
```http
GET /api/complexes
```

Query parameters:
- `city`: string (optional)
- `state`: string (optional)
- `amenities`: string[] (optional)
- `hasISP`: boolean (optional)
- `page`: number (optional)
- `limit`: number (optional)

Response:
```json
{
  "complexes": [
    {
      "id": "string",
      "name": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zip": "string",
      "website": "string",
      "amenities": ["string"],
      "reviews": { "count": number }[],
      "isps": {
        "ispMetric": {
          "id": "string",
          "isp": "string",
          "avgDownload": number,
          "avgUpload": number,
          "avgPing": number
        }
      }[]
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

### User Settings

#### Get User Settings
```http
GET /api/user/settings
```

Response:
```json
{
  "settings": {
    "name": "string",
    "email": "string",
    "notifications": {
      "speedTestReminders": boolean,
      "newReviews": boolean,
      "ispUpdates": boolean
    }
  }
}
```

#### Update User Settings
```http
PATCH /api/user/settings
```

Request body:
```json
{
  "name": "string",
  "notifications": {
    "speedTestReminders": boolean,
    "newReviews": boolean,
    "ispUpdates": boolean
  }
}
```

Response:
```json
{
  "success": true,
  "settings": {
    "name": "string",
    "email": "string",
    "notifications": {
      "speedTestReminders": boolean,
      "newReviews": boolean,
      "ispUpdates": boolean
    }
  }
}
```

### Messaging

#### Get Conversations
```http
GET /api/conversations
```

Response:
```json
{
  "conversations": [
    {
      "id": "string",
      "name": "string",
      "complexId": "string",
      "lastMessage": {
        "content": "string",
        "createdAt": "string"
      },
      "participants": {
        "user": {
          "id": "string",
          "name": "string"
        }
      }[],
      "unreadCount": number
    }
  ]
}
```

#### Create Conversation
```http
POST /api/conversations
```

Request body:
```json
{
  "name": "string",
  "complexId": "string",
  "participantIds": ["string"]
}
```

Response:
```json
{
  "success": true,
  "conversation": {
    "id": "string",
    "name": "string",
    "complexId": "string",
    "participants": {
      "user": {
        "id": "string",
        "name": "string"
      }
    }[]
  }
}
```

### Tips and FAQs

#### Get Tips
```http
GET /api/tips
```

Query parameters:
- `categoryId`: string (optional)
- `searchQuery`: string (optional)

Response:
```json
{
  "tips": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "category": {
        "name": "string",
        "slug": "string"
      },
      "tags": ["string"],
      "helpfulCount": number,
      "unhelpfulCount": number
    }
  ]
}
```

#### Get FAQs
```http
GET /api/faqs
```

Query parameters:
- `searchQuery`: string (optional)

Response:
```json
{
  "faqs": [
    {
      "id": "string",
      "question": "string",
      "answer": "string",
      "category": "string",
      "tags": ["string"],
      "helpfulCount": number,
      "unhelpfulCount": number
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "string",
  "message": "string"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "You must be logged in to perform this action"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "The requested resource was not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
``` 