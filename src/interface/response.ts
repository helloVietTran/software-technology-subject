export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T = any>{
  data: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  success: boolean;
  message: string;
}

export interface AttendanceFixResponse {
  id: number;
  employeeId: number;
  workDate: string;
  reason?: string;

  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  requestedAt: string;
  approvedAt?: string;
  approvedBy?: number;
}
