import LogsTable from './components/LogsTable';
import LogsSearchSection from './components/LogsSearchSection';

export default function LogsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">로그 메뉴</h1>
        <p className="mt-1 text-sm text-gray-600">
          시스템 로그를 조회하고 관리합니다.
        </p>
      </div>

      <LogsSearchSection />
      <LogsTable />
    </div>
  );
} 