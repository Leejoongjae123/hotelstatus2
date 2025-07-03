# 호텔 상태 관리 시스템 API 명세서

## 개요
호텔 상태 관리 시스템의 RESTful API 명세서입니다. 사용자 인증 및 호텔 플랫폼 로그인 정보 관리 기능을 제공합니다.

- **Base URL**: `http://localhost:8080`
- **API Version**: 1.0.0
- **인증 방식**: Bearer Token (JWT)

---

## 🔐 인증 관련 API

### 1. 회원가입
새로운 사용자 계정을 생성합니다.

**Endpoint**: `POST /signup`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response** (200):
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "full_name": null,
  "role": "client",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Error Responses**:
- `400`: 이미 등록된 이메일입니다

---

### 2. 로그인 (일반)
이메일과 비밀번호로 로그인하여 액세스 토큰을 발급받습니다.

**Endpoint**: `POST /login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response** (200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses**:
- `401`: 이메일 또는 비밀번호가 잘못되었습니다

---

### 3. 로그인 (OAuth2)
OAuth2 형식으로 로그인합니다. (토큰 발급)

**Endpoint**: `POST /token`

**Request Body** (form-data):
```
username: user@example.com  # 이메일 또는 사용자명
password: your_password
```

**Response** (200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses**:
- `401`: 이메일/사용자명 또는 비밀번호가 잘못되었습니다

---

### 4. 현재 사용자 정보 조회
로그인한 사용자의 정보를 조회합니다.

**Endpoint**: `GET /users/me`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response** (200):
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "full_name": null,
  "role": "client",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Error Responses**:
- `401`: 인증 정보를 확인할 수 없습니다
- `400`: 비활성화된 사용자입니다

---

### 5. 보호된 라우트 예시
인증된 사용자만 접근 가능한 테스트 엔드포인트입니다.

**Endpoint**: `GET /protected`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response** (200):
```json
{
  "message": "안녕하세요, {사용자명}님! 인증된 사용자만 접근할 수 있는 페이지입니다."
}
```

---

## 🏨 호텔 플랫폼 관리 API

### 6. 사용 가능한 플랫폼 목록 조회
등록 가능한 호텔 플랫폼 목록을 조회합니다.

**Endpoint**: `GET /platforms`

**Response** (200):
```json
[
  {
    "value": "booking_com",
    "name": "부킹닷컴"
  },
  {
    "value": "agoda",
    "name": "아고다"
  },
  {
    "value": "expedia",
    "name": "익스피디아"
  },
  {
    "value": "hotels_com",
    "name": "호텔스닷컴"
  },
  {
    "value": "trip_com",
    "name": "트립닷컴"
  },
  {
    "value": "yanolja",
    "name": "야놀자"
  },
  {
    "value": "goodchoice",
    "name": "여기어때"
  }
]
```

---

### 7. 호텔 플랫폼 등록
새로운 호텔 플랫폼 로그인 정보를 등록합니다.

**Endpoint**: `POST /hotel-platforms`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Request Body**:
```json
{
  "platform": "booking_com",
  "login_id": "your_platform_id",
  "login_password": "your_platform_password",
  "hotel_name": "호텔명",
  "mfa_id": "mfa_id",           // 선택사항
  "mfa_password": "mfa_pass",   // 선택사항
  "mfa_platform": "google"     // 선택사항
}
```

**Response** (200):
```json
{
  "id": 1,
  "user_id": 1,
  "platform": "booking_com",
  "login_id": "your_platform_id",
  "hotel_name": "호텔명",
  "mfa_id": "mfa_id",
  "mfa_platform": "google",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Error Responses**:
- `400`: {플랫폼명} 플랫폼은 이미 등록되어 있습니다. 수정을 원하시면 PUT 요청을 사용하세요.
- `401`: 인증 정보를 확인할 수 없습니다

---

### 8. 호텔 플랫폼 목록 조회
현재 사용자가 등록한 호텔 플랫폼 목록을 조회합니다. (비밀번호 제외)

**Endpoint**: `GET /hotel-platforms`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response** (200):
```json
[
  {
    "id": 1,
    "user_id": 1,
    "platform": "booking_com",
    "login_id": "your_platform_id",
    "hotel_name": "호텔명",
    "mfa_id": "mfa_id",
    "mfa_platform": "google",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

---

### 9. 호텔 플랫폼 상세 조회 (ID)
특정 ID의 호텔 플랫폼 상세 정보를 조회합니다. (비밀번호 포함)

**Endpoint**: `GET /hotel-platforms/{platform_id}`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Path Parameters**:
- `platform_id` (integer): 플랫폼 ID

**Response** (200):
```json
{
  "id": 1,
  "user_id": 1,
  "platform": "booking_com",
  "login_id": "your_platform_id",
  "login_password": "decrypted_password",
  "hotel_name": "호텔명",
  "mfa_id": "mfa_id",
  "mfa_password": "decrypted_mfa_password",
  "mfa_platform": "google",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Error Responses**:
- `404`: 플랫폼 정보를 찾을 수 없습니다

---

### 10. 호텔 플랫폼 상세 조회 (플랫폼명)
플랫폼명으로 호텔 플랫폼 정보를 조회합니다. (비밀번호 포함)

**Endpoint**: `GET /hotel-platforms/platform/{platform_name}`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Path Parameters**:
- `platform_name` (string): 플랫폼명 (예: booking_com, agoda)

**Response** (200):
```json
{
  "id": 1,
  "user_id": 1,
  "platform": "booking_com",
  "login_id": "your_platform_id",
  "login_password": "decrypted_password",
  "hotel_name": "호텔명",
  "mfa_id": "mfa_id",
  "mfa_password": "decrypted_mfa_password",
  "mfa_platform": "google",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Error Responses**:
- `400`: 지원하지 않는 플랫폼입니다
- `404`: {플랫폼명} 플랫폼 정보를 찾을 수 없습니다

---

### 11. 호텔 플랫폼 정보 수정
등록된 호텔 플랫폼 정보를 수정합니다.

**Endpoint**: `PUT /hotel-platforms/{platform_id}`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Path Parameters**:
- `platform_id` (integer): 플랫폼 ID

**Request Body** (수정할 필드만 포함):
```json
{
  "login_id": "new_login_id",
  "login_password": "new_password",
  "hotel_name": "새로운 호텔명",
  "mfa_id": "new_mfa_id",
  "mfa_password": "new_mfa_password",
  "mfa_platform": "kakao"
}
```

**Response** (200):
```json
{
  "id": 1,
  "user_id": 1,
  "platform": "booking_com",
  "login_id": "new_login_id",
  "hotel_name": "새로운 호텔명",
  "mfa_id": "new_mfa_id",
  "mfa_platform": "kakao",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T12:00:00"
}
```

**Error Responses**:
- `404`: 플랫폼 정보를 찾을 수 없습니다

---

### 12. 호텔 플랫폼 정보 삭제
등록된 호텔 플랫폼 정보를 삭제합니다.

**Endpoint**: `DELETE /hotel-platforms/{platform_id}`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Path Parameters**:
- `platform_id` (integer): 플랫폼 ID

**Response** (200):
```json
{
  "message": "{플랫폼명} 플랫폼 정보가 성공적으로 삭제되었습니다"
}
```

**Error Responses**:
- `404`: 플랫폼 정보를 찾을 수 없습니다

---

## 📝 기타 API

### 13. 루트 엔드포인트
API 서버 상태를 확인합니다.

**Endpoint**: `GET /`

**Response** (200):
```json
{
  "message": "호텔 상태 관리 시스템 API에 오신 것을 환영합니다!"
}
```

---

## 🔧 사용 예시

### JavaScript (Fetch API) 예시

```javascript
// 1. 회원가입
const signup = async () => {
  const response = await fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'password123'
    })
  });
  const data = await response.json();
  console.log(data);
};

// 2. 로그인
const login = async () => {
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'password123'
    })
  });
  const data = await response.json();
  
  // 토큰 저장
  localStorage.setItem('access_token', data.access_token);
  return data.access_token;
};

// 3. 인증이 필요한 API 호출
const getMyInfo = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
};

// 4. 호텔 플랫폼 등록
const createHotelPlatform = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/hotel-platforms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      platform: 'booking_com',
      login_id: 'my_booking_id',
      login_password: 'my_booking_password',
      hotel_name: '우리호텔'
    })
  });
  const data = await response.json();
  console.log(data);
};
```

---

## 📋 지원하는 플랫폼 목록

| 플랫폼 코드 | 플랫폼명 |
|------------|----------|
| `booking_com` | 부킹닷컴 |
| `agoda` | 아고다 |
| `expedia` | 익스피디아 |
| `hotels_com` | 호텔스닷컴 |
| `trip_com` | 트립닷컴 |
| `yanolja` | 야놀자 |
| `goodchoice` | 여기어때 |

---

## 🚨 에러 코드

| HTTP 상태 코드 | 설명 |
|---------------|------|
| `200` | 요청 성공 |
| `400` | 잘못된 요청 (이미 존재하는 데이터, 유효하지 않은 파라미터 등) |
| `401` | 인증 실패 (잘못된 토큰, 만료된 토큰 등) |
| `404` | 요청한 리소스를 찾을 수 없음 |
| `500` | 서버 내부 오류 |

---

## 📝 참고사항

1. **토큰 만료**: 액세스 토큰은 30분 후 만료됩니다.
2. **비밀번호 암호화**: 플랫폼 비밀번호는 암호화되어 저장됩니다.
3. **사용자 권한**: 현재는 `client` 권한만 지원합니다.
4. **플랫폼 중복**: 한 사용자당 같은 플랫폼은 하나만 등록 가능합니다.
5. **MFA 정보**: MFA 관련 필드는 모두 선택사항입니다. 