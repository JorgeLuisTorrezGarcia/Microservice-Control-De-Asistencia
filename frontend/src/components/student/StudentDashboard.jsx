import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import AttendanceHistory from './AttendanceHistory';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, [user]);

  const loadStudentData = async () => {
    try {
      const [subjectsData, statsData] = await Promise.all([
        apiService.getStudentSubjects(user.id),
        apiService.getStudentAttendance(user.id)
      ]);
      
      // Crear un mapa de ID de materia -> nombre de materia desde los datos de estadísticas
      const subjectNamesMap = new Map(statsData.map(stat => [stat.subject_id, stat.subject_name]));

      // Enriquecer los datos de las materias con el nombre correspondiente
      const enrichedSubjects = subjectsData.map(subject => ({
        ...subject,
        name: subjectNamesMap.get(subject.subject_id) || 'Nombre no disponible'
      }));

      setSubjects(enrichedSubjects);
      setAttendanceStats(statsData);
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando información...</div>;
  }

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Panel del Estudiante</h1>
        <p>Bienvenido, {user.full_name}</p>
      </header>

      <div className="dashboard-content">
        <section className="attendance-overview">
          <h2>Resumen de Asistencia</h2>
          <div className="stats-grid">
            {attendanceStats.map(stat => (
              <div key={stat.subject_id} className="stat-card">
                <h3>{stat.subject_name}</h3>
                <div className="stat-numbers">
                  <span>Asistencias: {stat.present_count}/{stat.total_sessions}</span>
                  <span className={`percentage ${stat.attendance_percentage >= 80 ? 'good' : 'warning'}`}>
                    {stat.attendance_percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="subjects-section">
          <h2>Mis Materias</h2>
          <div className="subjects-list">
            {subjects.map(subject => (
              <div key={subject.subject_id} className="subject-card">
                <h3>{subject.name}</h3>
                <button 
                  onClick={() => setSelectedSubject(subject)}
                  className="view-details-btn"
                >
                  Ver Detalles de Asistencia
                </button>
              </div>
            ))}
          </div>
        </section>

        {selectedSubject && (
          <AttendanceHistory 
            subject={selectedSubject}
            studentId={user.id}
            onClose={() => setSelectedSubject(null)}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
