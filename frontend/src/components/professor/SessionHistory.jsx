import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import './SessionHistory.css';

const SessionHistory = ({ subjectId, professorId }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);

  useEffect(() => {
    if (professorId) {
      loadProfessorSessions();
    } else if (subjectId) {
      loadSubjectSessions();
    }
  }, [subjectId, professorId]);

  const loadSubjectSessions = async () => {
    try {
      setLoading(true);
      const sessionsData = await apiService.getSubjectSessions(subjectId);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading subject sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfessorSessions = async () => {
    try {
      setLoading(true);
      const sessionsData = await apiService.getProfessorSessions(professorId);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading professor sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionDetails = async (sessionId) => {
    try {
      const details = await apiService.getSessionWithDetails(sessionId);
      setSessionDetails(details);
      setSelectedSession(sessionId);
    } catch (error) {
      console.error('Error loading session details:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { label: 'Abierta', class: 'status-open' },
      closed: { label: 'Cerrada', class: 'status-closed' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'status-unknown' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return <Loading message="Cargando historial de sesiones..." />;
  }

  return (
    <div className="session-history">
      <h2>{professorId ? 'Historial General de Sesiones' : 'Historial de Sesiones'}</h2>
      
      {sessions.length === 0 ? (
        <div className="no-sessions">
          <p>No hay sesiones registradas.</p>
        </div>
      ) : (
        <div className="sessions-table-container">
          <table className="sessions-table">
            <thead>
              <tr>
                {professorId && <th>Materia</th>}
                <th>Fecha</th>
                <th>Estado</th>
                <th>Estudiantes</th>
                <th>Asistencias</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  {professorId && <td>{session.subject_name}</td>}
                  <td>{new Date(session.session_date).toLocaleDateString()}</td>
                  <td>{getStatusBadge(session.status)}</td>
                  <td>{session.total_students || 0}</td>
                  <td>{`${session.present_count || 0} / ${session.total_students || 0}`}</td>
                  <td>
                    <button 
                      onClick={() => loadSessionDetails(session.id)}
                      className="view-details-btn"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        title={`Detalles de Sesión - ${sessionDetails ? new Date(sessionDetails.session_date).toLocaleDateString() : ''}`}
        size="large"
      >
        {sessionDetails && (
          <div className="session-details">
            <div className="session-info">
              <p><strong>Materia:</strong> {sessionDetails.subject_name}</p>
              <p><strong>Profesor:</strong> {sessionDetails.professor_name}</p>
              <p><strong>Estado:</strong> {getStatusBadge(sessionDetails.status)}</p>
              <p><strong>Total Estudiantes:</strong> {sessionDetails.total_students}</p>
              <p><strong>Asistencias:</strong> {sessionDetails.present_count}</p>
              <p><strong>Ausencias:</strong> {sessionDetails.absent_count}</p>
            </div>
            
            <div className="attendance-details">
              <h3>Registros de Asistencia</h3>
              <div className="records-list">
                {sessionDetails.records.map((record) => (
                  <div key={record.id} className="record-item">
                    <span className="student-name">{record.student_name}</span>
                    <span className={`attendance-status ${record.status}`}>
                      {record.status === 'present' ? '✅ Presente' : '❌ Ausente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SessionHistory;