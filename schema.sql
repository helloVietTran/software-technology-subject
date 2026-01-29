CREATE Database IF NOT EXISTS do_an_cnpm;
USE do_an_cnpm;

CREATE TABLE attendance_device (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id VARCHAR(50) UNIQUE NOT NULL,
  api_key VARCHAR(100) UNIQUE NOT NULL,
  api_secret VARCHAR(255) NOT NULL,
  is_active TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- init sample device
Insert INTO attendance_device (device_id, api_key, api_secret) VALUES
('device_001', 'api_key_001', 'supersecret');

CREATE TABLE attendance_log (
	attendance_log_id INT primary key auto_increment,
    employee_id INT,
    employee_name VARCHAR(100),
    email VARCHAR(100),
    log_date DATE,
    work_start TIME,
    work_end TIME,
    checked_time TIME,
);

CREATE TABLE daily_work_time_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,

    employee_id INT NOT NULL, -- 'Mã nhân viên',
    work_date DATE NOT NULL, -- 'Ngày làm việc',

    late_minutes INT DEFAULT 0, -- 'Số phút đi muộn',
    early_leave_minutes INT DEFAULT 0, -- 'Số phút về sớm',
    lack_minutes INT DEFAULT 0, -- 'Số phút nợ',
    over_time_minutes INT DEFAULT 0, -- 'Số phút làm thêm (OT)',
    in_office_minutes INT DEFAULT 0, -- 'Tổng số phút có mặt ở công ty',

    work_time_minutes INT DEFAULT 0, -- 'Số phút làm việc',
    first_check_in TIME, -- 'Thời gian vào công ty lần đầu',
    last_check_out TIME, -- 'Thời gian ra công ty lần cuối',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 'Thời gian tạo bản ghi',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    shift_start_time TIME NOT NULL, -- 'Thời gian bắt đầu ca làm',
    shift_end_time TIME NOT NULL -- 'Thời gian kết thúc ca làm'
);
ALTER TABLE daily_work_time_analysis ADD UNIQUE KEY uniq_employee_date (employee_id, work_date);

-- Bảng lưu trữ các yêu cầu sửa điểm danh
CREATE TABLE attendance_fix_request (
  id INT AUTO_INCREMENT PRIMARY KEY,

  employee_id INT NOT NULL,
  work_date DATE NOT NULL,

  reason VARCHAR(255),

  -- ai gửi
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- ai duyệt
  approved_by BIGINT NULL,
  approved_at DATETIME NULL,

  status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',

  -- quota theo tháng
  request_month CHAR(7) NOT NULL, -- YYYY-MM

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_employee_date (employee_id, work_date),
  INDEX idx_employee_month (employee_id, request_month)
);

-- Bảng lưu lịch chốt công
CREATE TABLE attendance_close_calendar (
  id INT AUTO_INCREMENT PRIMARY KEY,

  work_year INT NOT NULL,
  work_month TINYINT NOT NULL, -- 1..12
  close_day TINYINT NOT NULL, -- ngày chốt công (1..31)

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_year_month (work_year, work_month)
);

INSERT INTO attendance_close_calendar (work_year, work_month, close_day) VALUES
(2026, 1, 20),
(2026, 2, 20),
(2026, 3, 20),
(2026, 4, 21),
(2026, 5, 20),
(2026, 6, 20),
(2026, 7, 21),
(2026, 8, 20),
(2026, 9, 22),
(2026, 10, 20),
(2026, 11, 20),
(2026, 12, 22);