const DateUtils = require('../utils/dateUtils');

class AttendanceSession {
    constructor({ id, subject_id, professor_id, session_date, status, created_at }) {
        this.id = id;
        this.subject_id = subject_id;
        this.professor_id = professor_id;
        this.session_date = session_date;
        this.status = status || 'open';
        this.created_at = created_at;
    }

    toJSON() {
        return {
            id: this.id,
            subject_id: this.subject_id,
            professor_id: this.professor_id,
            session_date: this.session_date,
            status: this.status,
            created_at: this.created_at
        };
    }

    validate() {
        if (!this.subject_id || !this.professor_id || !this.session_date) {
            throw new Error('Subject ID, Professor ID, and session date are required');
        }

        if (!DateUtils.isValidDate(this.session_date)) {
            throw new Error('Invalid session date format. Use YYYY-MM-DD');
        }

        if (!['open', 'closed'].includes(this.status)) {
            throw new Error('Status must be either "open" or "closed"');
        }
    }

    close() {
        if (this.status === 'closed') {
            throw new Error('Session is already closed');
        }
        this.status = 'closed';
    }

    isOpen() {
        return this.status === 'open';
    }

    isToday() {
        return DateUtils.isToday(this.session_date);
    }
}

module.exports = AttendanceSession;