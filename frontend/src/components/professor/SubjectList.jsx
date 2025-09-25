import React from 'react';
import './SubjectList.css';

const SubjectList = ({ subjects, onSubjectSelect }) => {
  if (!subjects || subjects.length === 0) {
    return (
      <div className="subjects-container">
        <div className="no-subjects">
          <h3>No tienes materias asignadas</h3>
          <p>Contacta al administrador para que te asigne materias.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subjects-container">
      <h2>Mis Materias</h2>
      <p>Selecciona una materia para gestionar la asistencia</p>
      
      <div className="subjects-grid">
        {subjects.map((subject) => (
          <div 
            key={subject.subject_id} 
            className="subject-card"
            onClick={() => onSubjectSelect(subject)}
          >
            <div className="subject-info">
              <h3>{subject.name}</h3>
              <span className="subject-code">{subject.code}</span>
              {subject.description && (
                <p className="subject-description">{subject.description}</p>
              )}
            </div>
            <div className="subject-actions">
              <button className="select-btn">
                Gestionar Asistencia →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectList;