'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, FileText } from 'lucide-react';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>시스템 로그</span>
        </CardTitle>
        <CardDescription>
          시스템에서 발생한 로그 정보를 실시간으로 확인할 수 있습니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sampleLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">로그 데이터가 없습니다.</p>
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