export interface AttendanceLogReceivedEvent {
  eventId: string;
  eventType: "ATTENDANCE_LOG_RECEIVED";

  employee: {
    id: number;
    name: string;
    email: string;
  };

  workShift: {
    start: string; // 08:30
    end: string;   // 17:30
  };

  attendance: {
    date: Date;        // 2025-11-19
    checkedTime: string; // 08:48
  };

  source: string; // e.g., "Fingerprint Scanner A1"
  createdAt: string;
}
