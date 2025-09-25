import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import './SubjectForm.css';

const SubjectForm = ({ subject = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        code: subject?.code || '',
        name: subject?.name || '',
        description: subject?.description || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEdit = !!subject;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await apiService.updateSubject(subject.id, formData);
            } else {
                await apiService.createSubject(formData);
            }
            
            onSave();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="subject-form">
            <h3>{isEdit ? 'Editar Materia' : 'Agregar Nueva Materia'}</h3>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Código *</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            maxLength="20"
                            placeholder="Ej: MAT101"
                        />
                    </div>

                    <div className="form-group">
                        <label>Nombre *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength="100"
                            placeholder="Ej: Cálculo I"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Descripción opcional de la materia..."
                    />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn-secondary">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Materia')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubjectForm;