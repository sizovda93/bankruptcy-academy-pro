-- Migration: 003_student_cases
-- Description: Таблица кейсов студентов для курсов

CREATE TABLE IF NOT EXISTS student_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  student_role VARCHAR(255),
  case_text TEXT NOT NULL,
  result_text TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_cases_course ON student_cases(course_id);
CREATE INDEX IF NOT EXISTS idx_student_cases_published ON student_cases(is_published);
CREATE INDEX IF NOT EXISTS idx_student_cases_order ON student_cases(display_order);
