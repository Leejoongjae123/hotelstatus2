'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { HotelPlatform } from '@/app/types';
import { PlatformFormData } from './types';
import PlatformModal from './PlatformModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, RefreshCw, Eye, EyeOff, MoreHorizontal, Edit, Trash2, Plus, Search, X } from 'lucide-react';

export default function LoginInfoTable() {
  const [platforms, setPlatforms] = useState<HotelPlatform[]>([]);
  const [filteredPlatforms, setFilteredPlatforms] = useState<HotelPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<(PlatformFormData & { id: number }) | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchPlatforms();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = platforms.filter(platform => 
        getPlatformName(platform.platform).toLowerCase().includes(searchTerm.toLowerCase()) ||
        platform.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        platform.login_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getStatusName(platform.status).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlatforms(filtered);
    } else {
      setFilteredPlatforms(platforms);
    }
  }, [platforms, searchTerm]);

  const fetchPlatforms = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('/api/hotel-platforms', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = '데이터를 가져올 수 없습니다.';
        
        if (data.error) {
          if (typeof data.error === 'string') {
            errorMessage = data.error;
          } else if (typeof data.error === 'object') {
            errorMessage = '서버에서 오류가 발생했습니다.';
          }
        }
        
        setError(errorMessage);
        return;
      }

      setPlatforms(data);
    } catch (error) {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatformDetails = async (platformId: number): Promise<HotelPlatform | null> => {
    if (!token) return null;

    try {
      const response = await fetch(`/api/hotel-platforms/${platformId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;
      
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  const handleEdit = async (platform: HotelPlatform) => {
    // 비밀번호 포함된 상세 정보 가져오기
    const detailPlatform = await fetchPlatformDetails(platform.id);
    if (detailPlatform) {
      setEditingPlatform({
        id: detailPlatform.id,
        platform: detailPlatform.platform,
        login_id: detailPlatform.login_id,
        login_password: detailPlatform.login_password || '',
        hotel_name: detailPlatform.hotel_name,
        mfa_id: detailPlatform.mfa_id || '',
        mfa_password: detailPlatform.mfa_password || '',
        mfa_platform: detailPlatform.mfa_platform || '',
        status: detailPlatform.status || 'active',
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (platformId: number) => {
    if (!token) return;

    if (!confirm('정말로 이 플랫폼 정보를 삭제하시겠습니까?')) {
      return;
    }

    try {
      setDeletingId(platformId);
      const response = await fetch(`/api/hotel-platforms/${platformId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        let errorMessage = '삭제 중 오류가 발생했습니다.';
        
        if (data.detail) {
          if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          }
        } else if (data.error) {
          if (typeof data.error === 'string') {
            errorMessage = data.error;
          }
        }
        
        alert(errorMessage);
        return;
      }

      await fetchPlatforms(); // 목록 새로고침
    } catch (error) {
      alert('서버 오류가 발생했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSuccess = () => {
    fetchPlatforms(); // 목록 새로고침
    setEditingPlatform(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPlatform(null);
  };

  const handleSearch = () => {
    // 검색은 useEffect에서 자동으로 처리됨
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getPlatformName = (platform: string) => {
    const platformNames: { [key: string]: string } = {
      'booking_com': '부킹닷컴',
      'agoda': '아고다',
      'expedia': '익스피디아',
      'hotels_com': '호텔스닷컴',
      'trip_com': '트립닷컴',
      'yanolja': '야놀자',
      'goodchoice': '여기어때',
      'airbnb': '에어비앤비',
      'naver': '네이버',
    };
    return platformNames[platform] || platform;
  };

  const getStatusName = (status: string) => {
    const statusNames: { [key: string]: string } = {
      'active': '활성',
      'inactive': '비활성',
    };
    return statusNames[status] || status;
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const togglePasswordVisibility = (platformId: string, field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [`${platformId}-${field}`]: !prev[`${platformId}-${field}`]
    }));
  };

  const getPlatformBadgeVariant = (platform: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'booking_com': 'default',
      'agoda': 'secondary',
      'expedia': 'outline',
      'hotels_com': 'default',
      'trip_com': 'secondary',
      'yanolja': 'outline',
      'goodchoice': 'default',
      'airbnb': 'secondary',
      'naver': 'outline',
    };
    return variants[platform] || 'outline';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">데이터를 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button 
              onClick={fetchPlatforms}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
            <Button
              onClick={() => setIsModalOpen(true)}
              size="sm"
              className="h-8 w-46"
            >
              <Plus className="mr-2 h-4 w-4" />
              로그인 정보 추가
            </Button>

          
          {/* 검색 섹션 */}
          <div className="pt-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label htmlFor="search" className="text-sm font-medium leading-none">
                  검색
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="플랫폼명, 호텔명, 로그인 ID, 상태로 검색하세요"
                    className="pl-10 pr-10"
                  />
                  {searchTerm && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={handleClearSearch}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <Button onClick={handleSearch} className="h-10">
                  <Search className="h-4 w-4 mr-2" />
                  검색
                </Button>
                {searchTerm && (
                  <Button onClick={handleClearSearch} variant="outline" className="h-10">
                    <X className="h-4 w-4 mr-2" />
                    초기화
                  </Button>
                )}
              </div>
            </div>
            {searchTerm && (
              <div className="mt-3 text-sm text-muted-foreground">
                <span className="font-medium">'{searchTerm}'</span>에 대한 검색 결과
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredPlatforms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? '검색 결과가 없습니다.' : '등록된 플랫폼 정보가 없습니다.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  첫 번째 플랫폼 추가하기
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>플랫폼</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>로그인 ID</TableHead>
                    <TableHead>로그인 비밀번호</TableHead>
                    <TableHead>호텔명</TableHead>
                    <TableHead>MFA ID</TableHead>
                    <TableHead>MFA 비밀번호</TableHead>
                    <TableHead>MFA 플랫폼</TableHead>
                    <TableHead className="w-[50px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlatforms.map((platform) => (
                    <TableRow key={platform.id}>
                      <TableCell>
                        <Badge variant={getPlatformBadgeVariant(platform.platform)}>
                          {getPlatformName(platform.platform)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(platform.status || 'active')}>
                          {getStatusName(platform.status || 'active')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {platform.login_id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">
                            {showPasswords[`${platform.id}-login`] 
                              ? platform.login_password || '••••••••'
                              : '••••••••'
                            }
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => togglePasswordVisibility(platform.id.toString(), 'login')}
                          >
                            {showPasswords[`${platform.id}-login`] 
                              ? <EyeOff className="h-3 w-3" />
                              : <Eye className="h-3 w-3" />
                            }
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {platform.hotel_name}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {platform.mfa_id || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        {platform.mfa_password ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm">
                              {showPasswords[`${platform.id}-mfa`] 
                                ? platform.mfa_password
                                : '••••••••'
                              }
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => togglePasswordVisibility(platform.id.toString(), 'mfa')}
                            >
                              {showPasswords[`${platform.id}-mfa`] 
                                ? <EyeOff className="h-3 w-3" />
                                : <Eye className="h-3 w-3" />
                              }
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {platform.mfa_platform ? (
                          <Badge variant="outline" className="text-xs">
                            {platform.mfa_platform}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled={deletingId === platform.id}
                            >
                              {deletingId === platform.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(platform)}>
                              <Edit className="mr-2 h-4 w-4" />
                              수정
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(platform.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <PlatformModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editingPlatform={editingPlatform}
      />
    </>
  );
} 