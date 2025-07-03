export interface PlatformFormData {
  platform: string;
  login_id: string;
  login_password: string;
  hotel_name: string;
  mfa_id?: string;
  mfa_password?: string;
  mfa_platform?: string;
  status: 'active' | 'inactive';
}

export interface PlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingPlatform?: PlatformFormData & { id: number } | null;
} 