const SubjectService = require('../services/SubjectService');
const HttpUtils = require('../utils/httpUtils');

class SubjectController {
    constructor() {
        this.subjectService = new SubjectService();
        this.handleRequest = this.handleRequest.bind(this);
    }

    async handleRequest(req, res) {
        if (HttpUtils.handleCors(req, res)) return;

        const { method, url } = req;
        const urlParts = url.split('/').filter(part => part !== '');

        try {
            // Routing para materias
            if (method === 'GET' && urlParts[0] === 'subjects' && urlParts.length === 1) {
                await this.handleGetAllSubjects(req, res);
            } else if (method === 'GET' && urlParts[0] === 'subjects' && urlParts.length === 2) {
                await this.handleGetSubjectById(req, res, urlParts[1]);
            } else if (method === 'POST' && urlParts[0] === 'subjects' && urlParts.length === 1) {
                await this.handleCreateSubject(req, res);
            } else if (method === 'PUT' && urlParts[0] === 'subjects' && urlParts.length === 2) {
                await this.handleUpdateSubject(req, res, urlParts[1]);
            } else if (method === 'DELETE' && urlParts[0] === 'subjects' && urlParts.length === 2) {
                await this.handleDeleteSubject(req, res, urlParts[1]);
            }
            // Routing para estudiantes en materias
            else if (method === 'GET' && urlParts[0] === 'subjects' && urlParts[1] && urlParts[2] === 'students') {
                await this.handleGetSubjectStudents(req, res, urlParts[1]);
            } else if (method === 'POST' && urlParts[0] === 'subjects' && urlParts[1] && urlParts[2] === 'students') {
                await this.handleAddStudentToSubject(req, res, urlParts[1]);
            } else if (method === 'DELETE' && urlParts[0] === 'subjects' && urlParts[1] && urlParts[2] === 'students' && urlParts[3]) {
                await this.handleRemoveStudentFromSubject(req, res, urlParts[1], urlParts[3]);
            }
            // Routing para profesores en materias
            else if (method === 'GET' && urlParts[0] === 'subjects' && urlParts[1] && urlParts[2] === 'teachers') {
                await this.handleGetSubjectTeachers(req, res, urlParts[1]);
            } else if (method === 'POST' && urlParts[0] === 'subjects' && urlParts[1] && urlParts[2] === 'teachers') {
                await this.handleAssignTeacherToSubject(req, res, urlParts[1]);
            } else if (method === 'DELETE' && urlParts[0] === 'subjects' && urlParts[1] && urlParts[2] === 'teachers' && urlParts[3]) {
                await this.handleRemoveTeacherFromSubject(req, res, urlParts[1], urlParts[3]);
            }
            // Routing para materias por usuario
            else if (method === 'GET' && urlParts[0] === 'students' && urlParts[1] && urlParts[2] === 'subjects') {
                await this.handleGetStudentSubjects(req, res, urlParts[1]);
            } else if (method === 'GET' && urlParts[0] === 'teachers' && urlParts[1] && urlParts[2] === 'subjects') {
                await this.handleGetTeacherSubjects(req, res, urlParts[1]);
            } else {
                HttpUtils.sendError(res, 404, 'Endpoint not found');
            }
        } catch (error) {
            console.error('Controller error:', error);
            HttpUtils.sendError(res, 500, 'Internal server error');
        }
    }

    async handleGetAllSubjects(req, res) {
        try {
            const subjects = await this.subjectService.getAllSubjects();
            HttpUtils.sendResponse(res, 200, subjects.map(subject => subject.toJSON()));
        } catch (error) {
            HttpUtils.sendError(res, 500, error.message);
        }
    }

    async handleGetSubjectById(req, res, subjectId) {
        try {
            const id = parseInt(subjectId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid subject ID');
            }

            const subject = await this.subjectService.getSubjectById(id);
            HttpUtils.sendResponse(res, 200, subject.toJSON());
        } catch (error) {
            if (error.message === 'Subject not found') {
                HttpUtils.sendError(res, 404, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleCreateSubject(req, res) {
        try {
            const body = await HttpUtils.parseRequestBody(req);
            HttpUtils.validateRequiredFields(body, ['code', 'name']);

            const subject = await this.subjectService.createSubject(body);
            HttpUtils.sendResponse(res, 201, subject.toJSON());
        } catch (error) {
            if (error.message.includes('Missing required fields') ||
                error.message.includes('already exists') ||
                error.message.includes('must be')) {
                HttpUtils.sendError(res, 400, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleUpdateSubject(req, res, subjectId) {
        try {
            const id = parseInt(subjectId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid subject ID');
            }

            const body = await HttpUtils.parseRequestBody(req);
            const subject = await this.subjectService.updateSubject(id, body);
            HttpUtils.sendResponse(res, 200, subject.toJSON());
        } catch (error) {
            if (error.message === 'Subject not found') {
                HttpUtils.sendError(res, 404, error.message);
            } else if (error.message.includes('already exists')) {
                HttpUtils.sendError(res, 400, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleDeleteSubject(req, res, subjectId) {
        try {
            const id = parseInt(subjectId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid subject ID');
            }

            await this.subjectService.deleteSubject(id);
            HttpUtils.sendResponse(res, 200, { message: 'Subject deleted successfully' });
        } catch (error) {
            if (error.message === 'Subject not found') {
                HttpUtils.sendError(res, 404, error.message);
            } else if (error.message.includes('Cannot delete')) {
                HttpUtils.sendError(res, 400, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleGetSubjectStudents(req, res, subjectId) {
        try {
            const id = parseInt(subjectId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid subject ID');
            }

            const students = await this.subjectService.getStudentsBySubjectId(id);
            HttpUtils.sendResponse(res, 200, students.map(student => student.toJSON()));
        } catch (error) {
            if (error.message === 'Subject not found') {
                HttpUtils.sendError(res, 404, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleAddStudentToSubject(req, res, subjectId) {
        try {
            const id = parseInt(subjectId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid subject ID');
            }

            const body = await HttpUtils.parseRequestBody(req);
            HttpUtils.validateRequiredFields(body, ['student_id']);

            const enrollmentId = await this.subjectService.addStudentToSubject(id, body.student_id);
            HttpUtils.sendResponse(res, 201, {
                message: 'Student enrolled successfully',
                enrollment_id: enrollmentId
            });
        } catch (error) {
            if (error.message === 'Subject not found') {
                HttpUtils.sendError(res, 404, error.message);
            } else if (error.message.includes('already enrolled')) {
                HttpUtils.sendError(res, 400, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleRemoveStudentFromSubject(req, res, subjectId, studentId) {
        try {
            const subId = parseInt(subjectId);
            const studId = parseInt(studentId);

            if (isNaN(subId) || isNaN(studId)) {
                return HttpUtils.sendError(res, 400, 'Invalid subject or student ID');
            }

            await this.subjectService.removeStudentFromSubject(subId, studId);
            HttpUtils.sendResponse(res, 200, { message: 'Student removed from subject successfully' });
        } catch (error) {
            if (error.message.includes('not enrolled')) {
                HttpUtils.sendError(res, 400, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleGetSubjectTeachers(req, res, subjectId) {
        try {
            const id = parseInt(subjectId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid subject ID');
            }

            const teachers = await this.subjectService.getTeachersBySubjectId(id);
            HttpUtils.sendResponse(res, 200, teachers.map(teacher => teacher.toJSON()));
        } catch (error) {
            if (error.message === 'Subject not found') {
                HttpUtils.sendError(res, 404, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleAssignTeacherToSubject(req, res, subjectId) {
        try {
            const id = parseInt(subjectId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid subject ID');
            }

            const body = await HttpUtils.parseRequestBody(req);
            HttpUtils.validateRequiredFields(body, ['teacher_id']);

            const assignmentId = await this.subjectService.assignTeacherToSubject(id, body.teacher_id);
            HttpUtils.sendResponse(res, 201, {
                message: 'Teacher assigned successfully',
                assignment_id: assignmentId
            });
        } catch (error) {
            if (error.message === 'Subject not found') {
                HttpUtils.sendError(res, 404, error.message);
            } else if (error.message.includes('already assigned')) {
                HttpUtils.sendError(res, 400, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleRemoveTeacherFromSubject(req, res, subjectId, teacherId) {
        try {
            const subId = parseInt(subjectId);
            const teachId = parseInt(teacherId);

            if (isNaN(subId) || isNaN(teachId)) {
                return HttpUtils.sendError(res, 400, 'Invalid subject or teacher ID');
            }

            await this.subjectService.removeTeacherFromSubject(subId, teachId);
            HttpUtils.sendResponse(res, 200, { message: 'Teacher removed from subject successfully' });
        } catch (error) {
            if (error.message.includes('not assigned')) {
                HttpUtils.sendError(res, 400, error.message);
            } else {
                HttpUtils.sendError(res, 500, error.message);
            }
        }
    }

    async handleGetStudentSubjects(req, res, studentId) {
        try {
            const id = parseInt(studentId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid student ID');
            }

            const subjects = await this.subjectService.getSubjectsByStudentId(id);
            HttpUtils.sendResponse(res, 200, subjects.map(subject => subject.toJSON()));
        } catch (error) {
            HttpUtils.sendError(res, 500, error.message);
        }
    }

    async handleGetTeacherSubjects(req, res, teacherId) {
        try {
            const id = parseInt(teacherId);
            if (isNaN(id)) {
                return HttpUtils.sendError(res, 400, 'Invalid teacher ID');
            }

            const subjects = await this.subjectService.getSubjectsByTeacherId(id);
            HttpUtils.sendResponse(res, 200, subjects.map(subject => subject.toJSON()));
        } catch (error) {
            HttpUtils.sendError(res, 500, error.message);
        }
    }
}

module.exports = SubjectController;