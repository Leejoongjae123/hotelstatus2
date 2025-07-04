'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, FileText, Search, Filter, X, RefreshCw } from 'lucide-react';

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  source: string;
}

export default function LogsTable() {
  const [logs] = useState<LogEntry[]>([]);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [logLevel, setLogLevel] = useState('ALL');
  const [error] = useState('');

  // 임시 데이터 (실제로는 API에서 가져올 예정)
  const sampleLogs: LogEntry[] = [];

  const getLogLevelVariant = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'destructive';
      case 'WARN':
        return 'secondary';
      case 'INFO':
        return 'default';
      case 'DEBUG':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleSearch = () => {
    // 검색 로직 구현 예정
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRefresh = () => {
    // 로그 새로고침 로직 구현 예정
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">로그를 불러오는 중...</p>
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
              onClick={handleRefresh}
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
    <Card>
      <CardHeader>
        <Button
          onClick={handleRefresh}
          size="sm"
          className="h-8 w-46"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          로그 새로고침
        </Button>

        {/* 검색 섹션 */}
        <div className="pt-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label htmlFor="search" className="text-sm font-medium leading-none">
                로그 검색
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="로그 내용, 소스로 검색하세요"
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
            
            <div className="w-32 space-y-2">
              <label className="text-sm font-medium leading-none">
                레벨
              </label>
              <Select value={logLevel} onValueChange={setLogLevel}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="DEBUG">DEBUG</SelectItem>
                </SelectContent>
              </Select>
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
              <Button variant="outline" className="h-10">
                <Filter className="h-4 w-4" />
              </Button>
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
        {sampleLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? '검색 결과가 없습니다.' : '로그 데이터가 없습니다.'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              시스템 활동이 시작되면 로그가 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>시간</TableHead>
                  <TableHead>레벨</TableHead>
                  <TableHead>소스</TableHead>
                  <TableHead>메시지</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getLogLevelVariant(log.level) as any}>
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.source}
                    </TableCell>
                    <TableCell>
                      {log.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 