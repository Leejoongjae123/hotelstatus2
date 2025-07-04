import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    // 세션에서 액세스 토큰 가져오기
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 임시로 더미 데이터 반환 (외부 API 연결 전)
    if (!API_BASE_URL || API_BASE_URL === 'http://localhost:8000') {
      const dummyLog = {
        id: parseInt(id),
        user_id: "test-user-id",
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
      };
      
      return NextResponse.json(dummyLog);
    }

    // 실제 외부 API 호출
    const response = await fetch(`${API_BASE_URL}/logs/${id}`, {
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