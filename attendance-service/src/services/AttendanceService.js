const AttendanceSessionRepository = require('../repositories/AttendanceSessionRepository');
const AttendanceRecordRepository = require('../repositories/AttendanceRecordRepository');
const UserServiceClient = require('../clients/UserServiceClient');
const CatalogServiceClient = require('../clients/CatalogServiceClient');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const DateUtils = require('../utils/dateUtils');

class AttendanceService {
    constructor() {
        this.sessionRepository = new AttendanceSessionRepository();
        this.recordRepository = new AttendanceRecordRepository();
        this.userClient = new UserServiceClient();
        this.catalogClient = new CatalogServiceClient();
    }

    async createSession(sessionData) {
        try {
            // Validar datos básicos
            if (!sessionData.subject_id || !sessionData.professor_id) {
                throw new Error('Subject ID and Professor ID are required');
            }

            // Usar fecha actual si no se proporciona
            const sessionDate = sessionData.session_date || DateUtils.getCurrentDate();

            // Validar que la fecha sea válida
            if (!DateUtils.isValidDate(sessionDate)) {
                throw new Error('Invalid session date format. Use YYYY-MM-DD');
            }

            // Validar que el profesor existe y es un profesor
            await this.userClient.validateProfessor(sessionData.professor_id);

            // Validar que la materia existe
            await this.catalogClient.getSubjectById(sessionData.subject_id);

            // Validar que el profesor está asignado a la materia
            const isAssigned = await this.catalogClient.isProfessorAssignedToSubject(
                sessionData.professor_id, 
                sessionData.subject_id
            );
            
            if (!isAssigned) {
                throw new Error('Professor is not assigned to this subject');
            }

            // Verificar que no existe una sesión para la misma materia y fecha
            const existingSession = await this.sessionRepository.findBySubjectAndDate(
                sessionData.subject_id, 
                sessionDate
            );
            
            if (existingSession) {
                throw new Error('A session already exists for this subject and date');
            }

            // Crear la sesión
            const sessionToCreate = {
                subject_id: sessionData.subject_id,
                professor_id: sessionData.professor_id,
                session_date: sessionDate,
                status: 'open'
            };

            const session = new AttendanceSession(sessionToCreate);
            session.validate();

            const sessionId = await this.sessionRepository.insert(sessionToCreate);
            
            // Obtener estudiantes inscritos en la materia
            const enrolledStudents = await this.catalogClient.getStudentsBySubjectId(sessionData.subject_id);
            
            // Crear registros de asistencia iniciales (todos ausentes por defecto)
            const initialRecords = enrolledStudents.map(student => ({
                session_id: sessionId,
                student_id: student.student_id,
                status: 'absent'
            }));

            if (initialRecords.length > 0) {
                await this.recordRepository.bulkInsert(initialRecords);
            }

            return await this.getSessionWithDetails(sessionId);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async getSessionWithDetails(sessionId) {
        try {
            const session = await this.sessionRepository.findById(sessionId);
            if (!session) {
                throw new Error('Session not found');
            }

            const records = await this.recordRepository.findBySessionId(sessionId);
            
            // Enriquecer datos con información de usuarios y materias
            const [subject, professor, students] = await Promise.all([
                this.catalogClient.getSubjectById(session.subject_id),
                this.userClient.getUserById(session.professor_id),
                this.userClient.getUsersByIds(records.map(r => r.student_id))
            ]);

            const enrichedRecords = records.map(record => {
                const student = students.find(s => s.id === record.student_id);
                return {
                    ...record.toJSON(),
                    student_name: student ? student.full_name : 'Unknown',
                    student_username: student ? student.username : 'unknown'
                };
            });

            return {
                ...session.toJSON(),
                subject_name: subject.name,
                professor_name: professor.full_name,
                records: enrichedRecords,
                total_students: enrichedRecords.length,
                present_count: enrichedRecords.filter(r => r.status === 'present').length,
                absent_count: enrichedRecords.filter(r => r.status === 'absent').length
            };
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async updateAttendanceRecords(sessionId, updates) {
        try {
            const session = await this.sessionRepository.findById(sessionId);
            if (!session) {
                throw new Error('Session not found');
            }

            if (!session.isOpen()) {
                throw new Error('Cannot update records for a closed session');
            }

            if (!Array.isArray(updates)) {
                throw new Error('Updates must be an array of records');
            }

            let updatedCount = 0;
            const errors = [];

            for (const update of updates) {
                try {
                    if (!update.student_id || !update.status) {
                        errors.push(`Invalid record data for student ${update.student_id}`);
                        continue;
                    }

                    // Validar que el estudiante existe
                    await this.userClient.validateStudent(update.student_id);

                    // Validar que el estudiante está inscrito en la materia
                    const isEnrolled = await this.catalogClient.isStudentEnrolledInSubject(
                        update.student_id,
                        session.subject_id
                    );

                    if (!isEnrolled) {
                        errors.push(`Student ${update.student_id} is not enrolled in this subject`);
                        continue;
                    }

                    // Actualizar el registro
                    const success = await this.recordRepository.updateStatus(
                        sessionId, 
                        update.student_id, 
                        update.status
                    );

                    if (success) {
                        updatedCount++;
                    } else {
                        errors.push(`Record not found for student ${update.student_id}`);
                    }
                } catch (error) {
                    errors.push(`Error updating student ${update.student_id}: ${error.message}`);
                }
            }

            return {
                updated_count: updatedCount,
                error_count: errors.length,
                errors: errors.length > 0 ? errors : undefined
            };
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async closeSession(sessionId) {
        try {
            const session = await this.sessionRepository.findById(sessionId);
            if (!session) {
                throw new Error('Session not found');
            }

            if (!session.isOpen()) {
                throw new Error('Session is already closed');
            }

            const success = await this.sessionRepository.closeSession(sessionId);
            if (!success) {
                throw new Error('Failed to close session');
            }

            return await this.getSessionWithDetails(sessionId);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async getStudentAttendance(studentId, subjectId = null) {
        try {
            // Validar que el estudiante existe
            await this.userClient.validateStudent(studentId);

            let records;
            if (subjectId) {
                // Obtener asistencia para una materia específica
                records = await this.recordRepository.findByStudentAndSubject(studentId, subjectId);
                
                // Validar que la materia existe
                await this.catalogClient.getSubjectById(subjectId);
            } else {
                // Obtener estadísticas generales del estudiante
                return await this.recordRepository.getAttendanceStatsByStudent(studentId);
            }

            // Enriquecer registros con información de las sesiones
            const enrichedRecords = await Promise.all(
                records.map(async (record) => {
                    const session = await this.sessionRepository.findById(record.session_id);
                    const subject = await this.catalogClient.getSubjectById(session.subject_id);
                    
                    return {
                        ...record.toJSON(),
                        session_date: session.session_date,
                        subject_name: subject.name,
                        subject_code: subject.code
                    };
                })
            );

            return enrichedRecords;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async getSessionsByProfessor(professorId) {
        try {
            // Validar que el profesor existe
            await this.userClient.validateProfessor(professorId);

            const sessions = await this.sessionRepository.findSessionsByProfessor(professorId);
            
            // Enriquecer sesiones con información de materias
            const enrichedSessions = await Promise.all(
                sessions.map(async (session) => {
                    try {
                        const subject = await this.catalogClient.getSubjectById(session.subject_id);
                        const records = await this.recordRepository.findBySessionId(session.id);
                        
                        return {
                            ...session.toJSON(),
                            subject_name: subject.name,
                            subject_code: subject.code,
                            total_students: records.length,
                            present_count: records.filter(r => r.status === 'present').length
                        };
                    } catch (error) {
                        console.error(`Error enriching session ${session.id}:`, error.message);
                        return session.toJSON();
                    }
                })
            );

            return enrichedSessions;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async getSessionsBySubject(subjectId) {
        try {
            // Validar que la materia existe
            await this.catalogClient.getSubjectById(subjectId);

            const sessions = await this.sessionRepository.findSessionsBySubject(subjectId);
            
            // Enriquecer sesiones con información del profesor
            const enrichedSessions = await Promise.all(
                sessions.map(async (session) => {
                    try {
                        const professor = await this.userClient.getUserById(session.professor_id);
                        const records = await this.recordRepository.findBySessionId(session.id);
                        
                        return {
                            ...session.toJSON(),
                            professor_name: professor.full_name,
                            total_students: records.length,
                            present_count: records.filter(r => r.status === 'present').length
                        };
                    } catch (error) {
                        console.error(`Error enriching session ${session.id}:`, error.message);
                        return session.toJSON();
                    }
                })
            );

            return enrichedSessions;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async deleteSession(sessionId) {
        try {
            const session = await this.sessionRepository.findById(sessionId);
            if (!session) {
                throw new Error('Session not found');
            }

            // Eliminar primero los registros de asistencia
            await this.recordRepository.deleteBySession(sessionId);
            
            // Luego eliminar la sesión
            const success = await this.sessionRepository.delete(sessionId);
            if (!success) {
                throw new Error('Failed to delete session');
            }

            return true;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }
}

module.exports = AttendanceService;