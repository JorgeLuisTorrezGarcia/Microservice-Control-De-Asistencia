import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import UserForm from './UserForm';
import SubjectForm from './SubjectForm';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    
    // Estados para modales
    const [showUserModal, setShowUserModal] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editingSubject, setEditingSubject] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersData, subjectsData] = await Promise.all([
                apiService.getUsers(),
                apiService.getSubjects()
            ]);
            setUsers(usersData);
            setSubjects(subjectsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStats = () => {
        const professors = users.filter(u => u.role === 'professor').length;
        const students = users.filter(u => u.role === 'student').length;
        const activeUsers = users.filter(u => u.is_active).length;

        return { professors, students, activeUsers, totalSubjects: subjects.length };
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setShowUserModal(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowUserModal(true);
    };

    const handleAddSubject = () => {
        setEditingSubject(null);
        setShowSubjectModal(true);
    };

    const handleEditSubject = (subject) => {
        setEditingSubject(subject);
        setShowSubjectModal(true);
    };

    const handleDeactivateUser = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres desactivar este usuario?')) {
            try {
                await apiService.deactivateUser(userId);
                await loadData(); // Recargar datos
            } catch (error) {
                console.error('Error deactivating user:', error);
                alert('Error al desactivar usuario: ' + error.message);
            }
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta materia?')) {
            try {
                await apiService.deleteSubject(subjectId);
                await loadData(); // Recargar datos
            } catch (error) {
                console.error('Error deleting subject:', error);
                alert('Error al eliminar materia: ' + error.message);
            }
        }
    };

    const handleUserSave = () => {
        setShowUserModal(false);
        loadData(); // Recargar datos
    };

    const handleSubjectSave = () => {
        setShowSubjectModal(false);
        loadData(); // Recargar datos
    };

    if (loading) {
        return <Loading message="Cargando panel de administración..." />;
    }

    const stats = getStats();

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>Panel de Administración</h1>
                <p>Gestión completa del sistema</p>
            </header>

            <nav className="admin-nav">
                <button 
                    className={activeTab === 'overview' ? 'active' : ''}
                    onClick={() => setActiveTab('overview')}
                >
                    Resumen
                </button>
                <button 
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Usuarios ({users.length})
                </button>
                <button 
                    className={activeTab === 'subjects' ? 'active' : ''}
                    onClick={() => setActiveTab('subjects')}
                >
                    Materias ({subjects.length})
                </button>
            </nav>

            <div className="admin-content">
                {activeTab === 'overview' && (
                    <div className="overview-tab">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Profesores</h3>
                                <div className="stat-number">{stats.professors}</div>
                            </div>
                            <div className="stat-card">
                                <h3>Estudiantes</h3>
                                <div className="stat-number">{stats.students}</div>
                            </div>
                            <div className="stat-card">
                                <h3>Materias</h3>
                                <div className="stat-number">{stats.totalSubjects}</div>
                            </div>
                            <div className="stat-card">
                                <h3>Usuarios Activos</h3>
                                <div className="stat-number">{stats.activeUsers}</div>
                            </div>
                        </div>

                        <div className="recent-activity">
                            <h3>Resumen del Sistema</h3>
                            <div className="activity-content">
                                <p><strong>Total de usuarios:</strong> {users.length}</p>
                                <p><strong>Total de materias:</strong> {subjects.length}</p>
                                <p><strong>Usuarios inactivos:</strong> {users.length - stats.activeUsers}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="users-tab">
                        <div className="tab-header">
                            <h2>Gestión de Usuarios</h2>
                            <button 
                                className="add-btn"
                                onClick={handleAddUser}
                            >
                                + Agregar Usuario
                            </button>
                        </div>
                        
                        <div className="users-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Usuario</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.full_name}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email || '-'}</td>
                                            <td>
                                                <span className={`role-badge ${user.role}`}>
                                                    {user.role === 'professor' ? 'Profesor' : 
                                                     user.role === 'student' ? 'Estudiante' : 
                                                     'Administrador'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                                                    {user.is_active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => handleEditUser(user)}
                                                    className="edit-btn"
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => handleDeactivateUser(user.id)}
                                                    className="delete-btn"
                                                    disabled={!user.is_active}
                                                >
                                                    Desactivar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'subjects' && (
                    <div className="subjects-tab">
                        <div className="tab-header">
                            <h2>Gestión de Materias</h2>
                            <button 
                                className="add-btn"
                                onClick={handleAddSubject}
                            >
                                + Agregar Materia
                            </button>
                        </div>
                        
                        <div className="subjects-grid">
                            {subjects.map(subject => (
                                <div key={subject.id} className="subject-admin-card">
                                    <h3>{subject.name}</h3>
                                    <p className="subject-code">{subject.code}</p>
                                    {subject.description && (
                                        <p className="subject-desc">{subject.description}</p>
                                    )}
                                    <div className="subject-meta">
                                        <span>Creado: {new Date(subject.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="subject-actions">
                                        <button 
                                            onClick={() => handleEditSubject(subject)}
                                            className="edit-btn"
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteSubject(subject.id)}
                                            className="delete-btn"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal para Usuarios */}
            <Modal
                isOpen={showUserModal}
                onClose={() => setShowUserModal(false)}
                title={editingUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
                size="medium"
            >
                <UserForm
                    user={editingUser}
                    onSave={handleUserSave}
                    onCancel={() => setShowUserModal(false)}
                />
            </Modal>

            {/* Modal para Materias */}
            <Modal
                isOpen={showSubjectModal}
                onClose={() => setShowSubjectModal(false)}
                title={editingSubject ? 'Editar Materia' : 'Agregar Nueva Materia'}
                size="medium"
            >
                <SubjectForm
                    subject={editingSubject}
                    onSave={handleSubjectSave}
                    onCancel={() => setShowSubjectModal(false)}
                />
            </Modal>
        </div>
    );
};

export default AdminDashboard;