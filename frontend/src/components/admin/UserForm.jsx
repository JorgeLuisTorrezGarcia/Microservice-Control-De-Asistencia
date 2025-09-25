import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { USER_ROLES } from '../../utils/constants';
import './UserForm.css';

const UserForm = ({ user = null, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        password: '',
        full_name: user?.full_name || '',
        email: user?.email || '',
        role: user?.role || 'student'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEdit = !!user;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                // Actualizar usuario existente
                const updateData = { ...formData };
                if (!updateData.password) {
                    delete updateData.password; // No actualizar password si está vacío
                }
                await apiService.updateUser(user.id, updateData);
            } else {
                // Crear nuevo usuario
                await apiService.createUser(formData);
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
        <div className="user-form">
            <h3>{isEdit ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h3>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Usuario *</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={isEdit} // No cambiar username en edición
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            {isEdit ? 'Nueva Contraseña' : 'Contraseña *'}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!isEdit}
                            placeholder={isEdit ? 'Dejar vacío para no cambiar' : ''}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Nombre Completo *</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Rol *</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="student">Estudiante</option>
                        <option value="professor">Profesor</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn-secondary">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Usuario')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;