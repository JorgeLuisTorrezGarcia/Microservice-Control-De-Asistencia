import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import './AttendanceSession.css';

const AttendanceSession = ({ subject, activeSession, onSessionCreated, onSessionClosed }) => {
  const [students, setStudents] = useState([]);
  const [session, setSession] = useState(activeSession);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session) {
      loadSessionDetails();
    }
  }, [session]);

  const loadSessionDetails = async () => {
    try {
      setLoading(true);
      const sessionDetails = await apiService.getSessionWithDetails(session.id);
      setStudents(sessionDetails.records);
      
      // Initialize attendance state
      const initialAttendance = {};
      sessionDetails.records.forEach(record => {
        initialAttendance[record.student_id] = record.status;
      });
      setAttendance(initialAttendance);
    } catch (error) {
      setMessage('Error cargando la sesión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      setLoading(true);
      const newSession = await apiService.createSession({
        subject_id: subject.id,
        professor_id: subject.professor_id
      });
      
      setSession(newSession);
      onSessionCreated(newSession);
      setMessage('Sesión creada exitosamente');
    } catch (error) {
      setMessage('Error creando sesión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAttendance = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: parseInt(studentId),
        status
      }));

      await apiService.updateAttendanceRecords(session.id, records);
      setMessage('Asistencia guardada exitosamente');
    } catch (error) {
      setMessage('Error guardando asistencia: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const closeSession = async () => {
    try {
      setSaving(true);
      await apiService.closeSession(session.id);
      setMessage('Sesión cerrada exitosamente');
      onSessionClosed();
    } catch (error) {
      setMessage('Error cerrando sesión: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return (
      <div className="attendance-session">
        <h2>Nueva Sesión de Asistencia - {subject.name}</h2>
        <p>Crear una nueva sesión de asistencia para la fecha actual.</p>
        
        <button 
          onClick={createNewSession} 
          disabled={loading}
          className="create-session-btn"
        >
          {loading ? 'Creando Sesión...' : 'Crear Sesión de Asistencia'}
        </button>
        
        {message && <div className="message">{message}</div>}
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Cargando sesión...</div>;
  }

  return (
    <div className="attendance-session">
      <div className="session-header">
        <h2>Sesión de Asistencia - {subject.name}</h2>
        <div className="session-info">
          <span>Fecha: {new Date(session.session_date).toLocaleDateString()}</span>
          <span className={`status ${session.status}`}>
            Estado: {session.status === 'open' ? 'Abierta' : 'Cerrada'}
          </span>
        </div>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="attendance-list">
        <h3>Lista de Estudiantes ({students.length})</h3>
        
        <div className="students-grid">
          {students.map(student => (
            <div key={student.student_id} className="student-card">
              <div className="student-info">
                <strong>{student.student_name}</strong>
                <span>ID: {student.student_id}</span>
              </div>
              
              <div className="attendance-controls">
                <button
                  onClick={() => updateAttendance(student.student_id, 'present')}
                  disabled={session.status !== 'open' || saving}
                  className={`present-btn ${attendance[student.student_id] === 'present' ? 'active' : ''}`}
                >
                  ✅ Presente
                </button>
                <button
                  onClick={() => updateAttendance(student.student_id, 'absent')}
                  disabled={session.status !== 'open' || saving}
                  className={`absent-btn ${attendance[student.student_id] === 'absent' ? 'active' : ''}`}
                >
                  ❌ Ausente
                </button>
              </div>
              
              <div className="current-status">
                Estado actual: <span className={attendance[student.student_id]}>
                  {attendance[student.student_id] === 'present' ? 'Presente' : 'Ausente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {session.status === 'open' && (
        <div className="session-actions">
          <button 
            onClick={saveAttendance} 
            disabled={saving}
            className="save-btn"
          >
            {saving ? 'Guardando...' : 'Guardar Asistencia'}
          </button>
          
          <button 
            onClick={closeSession} 
            disabled={saving}
            className="close-btn"
          >
            {saving ? 'Cerrando...' : 'Cerrar Sesión'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceSession;