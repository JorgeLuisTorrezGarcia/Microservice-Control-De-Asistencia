const SubjectRepository = require('../repositories/SubjectRepository');
const EnrollmentRepository = require('../repositories/EnrollmentRepository');
const TeacherAssignmentRepository = require('../repositories/TeacherAssignmentRepository');
const Subject = require('../models/Subject');

class SubjectService {
    constructor() {
        this.subjectRepository = new SubjectRepository();
        this.enrollmentRepository = new EnrollmentRepository();
        this.teacherAssignmentRepository = new TeacherAssignmentRepository();
    }

    async getAllSubjects() {
        try {
            return await this.subjectRepository.findAll();
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async getSubjectById(id) {
        try {
            const subject = await this.subjectRepository.findById(id);
            if (!subject) {
                throw new Error('Subject not found');
            }
            return subject;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async createSubject(subjectData) {
        try {
            const subject = new Subject(subjectData);
            subject.validate();

            const existingSubject = await this.subjectRepository.findByCode(subjectData.code);
            if (existingSubject) {
                throw new Error('Subject code already exists');
            }

            const subjectId = await this.subjectRepository.insert(subjectData);
            return await this.subjectRepository.findById(subjectId);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async updateSubject(id, subjectData) {
        try {
            const subject = await this.subjectRepository.findById(id);
            if (!subject) {
                throw new Error('Subject not found');
            }

            const success = await this.subjectRepository.update(id, subjectData);
            if (!success) {
                throw new Error('Subject not found or no changes made');
            }

            return await this.subjectRepository.findById(id);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async deleteSubject(id) {
        try {
            const subject = await this.subjectRepository.findById(id);
            if (!subject) {
                throw new Error('Subject not found');
            }

            // Verificar si hay estudiantes inscritos
            const enrollmentCount = await this.enrollmentRepository.getEnrollmentCount(id);
            if (enrollmentCount > 0) {
                throw new Error('Cannot delete subject with enrolled students');
            }

            const success = await this.subjectRepository.delete(id);
            if (!success) {
                throw new Error('Failed to delete subject');
            }

            return true;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async getStudentsBySubjectId(subjectId) {
        try {
            const subject = await this.subjectRepository.findById(subjectId);
            if (!subject) {
                throw new Error('Subject not found');
            }

            return await this.enrollmentRepository.findStudentsBySubjectId(subjectId);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async addStudentToSubject(subjectId, studentId) {
        try {
            const subject = await this.subjectRepository.findById(subjectId);
            if (!subject) {
                throw new Error('Subject not found');
            }

            // Aquí podríamos validar que el studentId existe llamando al User Service
            // Por ahora asumimos que existe

            const enrollmentId = await this.enrollmentRepository.addStudentToSubject(subjectId, studentId);
            return enrollmentId;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async removeStudentFromSubject(subjectId, studentId) {
        try {
            const isEnrolled = await this.enrollmentRepository.isStudentEnrolled(subjectId, studentId);
            if (!isEnrolled) {
                throw new Error('Student is not enrolled in this subject');
            }

            const success = await this.enrollmentRepository.removeStudentFromSubject(subjectId, studentId);
            if (!success) {
                throw new Error('Failed to remove student from subject');
            }

            return true;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async getTeachersBySubjectId(subjectId) {
        try {
            const subject = await this.subjectRepository.findById(subjectId);
            if (!subject) {
                throw new Error('Subject not found');
            }

            return await this.teacherAssignmentRepository.findTeachersBySubjectId(subjectId);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async assignTeacherToSubject(subjectId, teacherId) {
        try {
            const subject = await this.subjectRepository.findById(subjectId);
            if (!subject) {
                throw new Error('Subject not found');
            }

            // Aquí podríamos validar que el teacherId existe y es un profesor llamando al User Service

            const assignmentId = await this.teacherAssignmentRepository.assignTeacherToSubject(subjectId, teacherId);
            return assignmentId;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async removeTeacherFromSubject(subjectId, teacherId) {
        try {
            const isAssigned = await this.teacherAssignmentRepository.isTeacherAssigned(subjectId, teacherId);
            if (!isAssigned) {
                throw new Error('Teacher is not assigned to this subject');
            }

            const success = await this.teacherAssignmentRepository.removeTeacherFromSubject(subjectId, teacherId);
            if (!success) {
                throw new Error('Failed to remove teacher from subject');
            }

            return true;
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async getSubjectsByStudentId(studentId) {
        try {
            return await this.enrollmentRepository.findSubjectsByStudentId(studentId);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }

    async getSubjectsByTeacherId(teacherId) {
        try {
            return await this.teacherAssignmentRepository.findSubjectsByTeacherId(teacherId);
        } catch (error) {
            throw new Error(`Service error: ${error.message}`);
        }
    }
}

module.exports = SubjectService;