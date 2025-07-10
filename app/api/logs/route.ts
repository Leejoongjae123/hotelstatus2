import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    // 쿼리 파라미터 추출
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const agent = searchParams.get('agent') || '';
    const result = searchParams.get('result') || '';
    const platform = searchParams.get('platform') || '';

    // 세션에서 액세스 토큰 가져오기
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 외부 API 호출을 위한 URL 구성
    const params = new URLSearchParams({
      page,
      limit,
      ...(agent && { agent }),
      ...(result && { result }),
      ...(platform && { platform })
    });

    // 임시로 더미 데이터 반환 (외부 API 연결 전)
    if (!API_BASE_URL || API_BASE_URL === 'http://localhost:8000') {
      const dummyData = {
        items: [
          {
            id: 1,
            user_id: "test-user-id",
            accom_id: "ACCOM_001",
            room_reserve_id: "ROOM_RES_001",
            ota_place_name: "테스트 호텔",
            prepaid: 50000,
            fee: 70000,
            check_in_sched: Date.now(),
            check_out_sched: Date.now() + (24 * 60 * 60 * 1000),
            visit_type: "ON_CAR",
            stay_type: "DAYS",
            reserve_no: "R123456789",
            phone: "01012345678",
            guest_name: "홍길동",
            ota_room_name: "스탠다드 더블",
            canceled: false,
            agent: "YANOLJA",
            result: "success",
            description: "정상 처리",
            error_message: null,
            platform: "야놀자",
            login_id: "hotel_manager",
            login_password: "decrypted_password",
            hotel_name: "서울 그랜드 호텔",
            mfa_id: null,
            mfa_password: null,
            mfa_platform: null,
            platform_status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            user_id: "test-user-id",
            accom_id: "ACCOM_002",
            room_reserve_id: "ROOM_RES_002",
            ota_place_name: "부산 비즈니스 호텔",
            prepaid: 80000,
            fee: 90000,
            check_in_sched: Date.now() - (24 * 60 * 60 * 1000),
            check_out_sched: Date.now(),
            visit_type: "WALK_IN",
            stay_type: "DAYS",
            reserve_no: "R987654321",
            phone: "01087654321",
            guest_name: "김영희",
            ota_room_name: "비즈니스 트윈",
            canceled: false,
            agent: "YEOGI_BOSS",
            result: "fail",
            description: "로그인 실패",
            error_message: "네트워크 연결 오류",
            platform: "여기어때_사장님",
            login_id: "hotel_admin",
            login_password: "decrypted_password",
            hotel_name: "부산 비즈니스 호텔",
            mfa_id: "mfa_123",
            mfa_password: "decrypted_mfa",
            mfa_platform: "Google Authenticator",
            platform_status: "active",
            created_at: new Date(Date.now() - (2 * 60 * 60 * 1000)).toISOString(),
            updated_at: new Date(Date.now() - (1 * 60 * 60 * 1000)).toISOString()
          }
        ],
        total: 2,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: 1,
        has_next: false,
        has_prev: false
      };
      
      return NextResponse.json(dummyData);
    }

    // 실제 외부 API 호출
    const response = await fetch(`${API_BASE_URL}/logs?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || '로그 데이터를 가져올 수 없습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 