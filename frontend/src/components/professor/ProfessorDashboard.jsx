import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import SubjectList from './SubjectList';
import AttendanceSession from './AttendanceSession';
import SessionHistory from './SessionHistory';
import './ProfessorDashboard.css';

const ProfessorDashboard = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [view, setView] = useState('subjects'); // 'subjects', 'session', 'history'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfessorSubjects();
  }, [user]);

  const loadProfessorSubjects = async () => {
    try {
      const subjectsData = await apiService.getTeacherSubjects(user.id);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);
    
    // Asegurarnos de que subject tiene la estructura correcta
    const subjectWithProfessor = {
        ...subject,
        professor_id: subject.professor_id || user.id // Usar el professor_id de la materia o el del usuario actual
    };
    
    setSelectedSubject(subjectWithProfessor);
    
    // Check for active session
    try {
        const sessions = await apiService.getSubjectSessions(subject.subject_id);
        const openSession = sessions.find(s => s.status === 'open');
        setActiveSession(openSession || null);
        
        if (openSession) {
            setView('session');
        } else {
            setView('session');
        }
    } catch (error) {
        console.error('Error checking sessions:', error);
    }
};

  const handleSessionCreated = (session) => {
    setActiveSession(session);
    setView('session');
  };

  const handleSessionClosed = () => {
    setActiveSession(null);
    setView('history');
  };

  if (loading) {
    return <div className="loading">Cargando materias...</div>;
  }

  return (
    <div className="professor-dashboard">
      <header className="dashboard-header">
        <h1>Panel del Profesor</h1>
        <p>Bienvenido, {user.full_name}</p>
      </header>

      <nav className="dashboard-nav">
        <button 
          onClick={() => setView('subjects')} 
          className={view === 'subjects' ? 'active' : ''}
        >
          Mis Materias
        </button>
        {selectedSubject && (
          <>
            <button 
              onClick={() => setView('session')} 
              className={view === 'session' ? 'active' : ''}
            >
              {activeSession ? 'Sesión Activa' : 'Nueva Sesión'}
            </button>
            <button 
              onClick={() => setView('history')} 
              className={view === 'history' ? 'active' : ''}
            >
              Historial
            </button>
          </>
        )}
      </nav>

      <main className="dashboard-content">
        {view === 'subjects' && (
          <SubjectList 
            subjects={subjects} 
            onSubjectSelect={handleSubjectSelect}
          />
        )}

        {view === 'session' && selectedSubject && (
          <AttendanceSession
            subject={selectedSubject}
            activeSession={activeSession}
            onSessionCreated={handleSessionCreated}
            onSessionClosed={handleSessionClosed}
          />
        )}

        {view === 'history' && selectedSubject && (
          <SessionHistory subjectId={selectedSubject.subject_id} />
        )}
      </main>
    </div>
  );
};

export default ProfessorDashboard;