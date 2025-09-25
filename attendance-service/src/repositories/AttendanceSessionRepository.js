const db = require('../../config/database');
const AttendanceSession = require('../models/AttendanceSession');

class AttendanceSessionRepository {
    async findById(id) {
        try {
            const [rows] = await db.execute(
                `SELECT id, subject_id, professor_id, session_date, status, created_at 
                 FROM attendance_sessions 
                 WHERE id = ?`,
                [id]
            );
            return rows.length > 0 ? new AttendanceSession(rows[0]) : null;
        } catch (error) {
            throw new Error(`Error fetching attendance session: ${error.message}`);
        }
    }

    async findBySubjectAndDate(subjectId, date) {
        try {
            const [rows] = await db.execute(
                `SELECT id, subject_id, professor_id, session_date, status, created_at 
                 FROM attendance_sessions 
                 WHERE subject_id = ? AND session_date = ?`,
                [subjectId, date]
            );
            return rows.length > 0 ? new AttendanceSession(rows[0]) : null;
        } catch (error) {
            throw new Error(`Error fetching attendance session: ${error.message}`);
        }
    }

    async findOpenSessionBySubjectAndDate(subjectId, date) {
        try {
            const [rows] = await db.execute(
                `SELECT id, subject_id, professor_id, session_date, status, created_at 
                 FROM attendance_sessions 
                 WHERE subject_id = ? AND session_date = ? AND status = 'open'`,
                [subjectId, date]
            );
            return rows.length > 0 ? new AttendanceSession(rows[0]) : null;
        } catch (error) {
            throw new Error(`Error fetching open session: ${error.message}`);
        }
    }

    async findSessionsBySubject(subjectId) {
        try {
            const [rows] = await db.execute(
                `SELECT id, subject_id, professor_id, session_date, status, created_at 
                 FROM attendance_sessions 
                 WHERE subject_id = ? 
                 ORDER BY session_date DESC, created_at DESC`,
                [subjectId]
            );
            return rows.map(row => new AttendanceSession(row));
        } catch (error) {
            throw new Error(`Error fetching sessions for subject: ${error.message}`);
        }
    }

    async findSessionsByProfessor(professorId) {
        try {
            const [rows] = await db.execute(
                `SELECT id, subject_id, professor_id, session_date, status, created_at 
                 FROM attendance_sessions 
                 WHERE professor_id = ? 
                 ORDER BY session_date DESC, created_at DESC`,
                [professorId]
            );
            return rows.map(row => new AttendanceSession(row));
        } catch (error) {
            throw new Error(`Error fetching sessions for professor: ${error.message}`);
        }
    }

    async insert(sessionData) {
        try {
            const { subject_id, professor_id, session_date, status } = sessionData;
            
            const [result] = await db.execute(
                'INSERT INTO attendance_sessions (subject_id, professor_id, session_date, status) VALUES (?, ?, ?, ?)',
                [subject_id, professor_id, session_date, status]
            );
            
            return result.insertId;
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Session already exists for this subject and date');
            }
            throw new Error(`Error creating attendance session: ${error.message}`);
        }
    }

    async updateStatus(id, status) {
        try {
            const [result] = await db.execute(
                'UPDATE attendance_sessions SET status = ? WHERE id = ?',
                [status, id]
            );
            
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating session status: ${error.message}`);
        }
    }

    async closeSession(id) {
        return await this.updateStatus(id, 'closed');
    }

    async delete(id) {
        try {
            const [result] = await db.execute(
                'DELETE FROM attendance_sessions WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting session: ${error.message}`);
        }
    }
}

module.exports = AttendanceSessionRepository;