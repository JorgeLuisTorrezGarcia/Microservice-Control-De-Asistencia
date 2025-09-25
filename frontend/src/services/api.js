import { API_ENDPOINTS } from './apiEndpoints';

class ApiService {
  constructor() {
    this.baseConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async request(endpoint, options = {}) {
    const config = {
      ...this.baseConfig,
      ...options,
      headers: {
        ...this.baseConfig.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(endpoint, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // User Service Methods
  async login(username, password) {
    return this.request(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getUserById(userId) {
    return this.request(`${API_ENDPOINTS.USERS}/${userId}`);
  }

  // Catalog Service Methods
  async getSubjects() {
    return this.request(API_ENDPOINTS.SUBJECTS);
  }

  async getSubjectById(subjectId) {
    return this.request(`${API_ENDPOINTS.SUBJECTS}/${subjectId}`);
  }

  async getStudentsBySubject(subjectId) {
    return this.request(API_ENDPOINTS.SUBJECT_STUDENTS(subjectId));
  }

  async getTeacherSubjects(teacherId) {
    return this.request(API_ENDPOINTS.TEACHER_SUBJECTS(teacherId));
  }

  async getStudentSubjects(studentId) {
    return this.request(API_ENDPOINTS.STUDENT_SUBJECTS(studentId));
  }

  // Attendance Service Methods
  async createSession(sessionData) {
    return this.request(API_ENDPOINTS.SESSIONS, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async getSessionWithDetails(sessionId) {
    return this.request(`${API_ENDPOINTS.SESSIONS}/${sessionId}`);
  }

  async updateAttendanceRecords(sessionId, records) {
    return this.request(API_ENDPOINTS.SESSION_RECORDS(sessionId), {
      method: 'PUT',
      body: JSON.stringify({ records }),
    });
  }

  async closeSession(sessionId) {
    return this.request(API_ENDPOINTS.CLOSE_SESSION(sessionId), {
      method: 'PUT',
    });
  }

  async getStudentAttendance(studentId, subjectId = null) {
    const endpoint = subjectId 
      ? `${API_ENDPOINTS.STUDENT_ATTENDANCE(studentId)}/${subjectId}`
      : API_ENDPOINTS.STUDENT_ATTENDANCE(studentId);
    
    return this.request(endpoint);
  }

  async getProfessorSessions(professorId) {
    return this.request(API_ENDPOINTS.PROFESSOR_SESSIONS(professorId));
  }

  async getSubjectSessions(subjectId) {
    return this.request(API_ENDPOINTS.SUBJECT_SESSIONS(subjectId));
  }

  // Agregar estos métodos a la clase ApiService:

  // User Service Methods
  async getUsers() {
    return this.request(API_ENDPOINTS.USERS);
  }

  async createUser(userData) {
    return this.request(API_ENDPOINTS.USERS, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId, userData) {
    return this.request(`${API_ENDPOINTS.USERS}/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deactivateUser(userId) {
    return this.request(`${API_ENDPOINTS.USERS}/${userId}`, {
      method: 'DELETE',
    });
  }

  // Catalog Service Methods
  async createSubject(subjectData) {
    return this.request(API_ENDPOINTS.SUBJECTS, {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  }

  async updateSubject(subjectId, subjectData) {
    return this.request(`${API_ENDPOINTS.SUBJECTS}/${subjectId}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    });
  }

  async deleteSubject(subjectId) {
    return this.request(`${API_ENDPOINTS.SUBJECTS}/${subjectId}`, {
      method: 'DELETE',
    });
  }

  async assignTeacherToSubject(subjectId, teacherId) {
    return this.request(API_ENDPOINTS.SUBJECT_TEACHERS(subjectId), {
      method: 'POST',
      body: JSON.stringify({ teacher_id: teacherId }),
    });
  }

  async enrollStudentInSubject(subjectId, studentId) {
    return this.request(API_ENDPOINTS.SUBJECT_STUDENTS(subjectId), {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId }),
    });
  }
}

export const apiService = new ApiService();