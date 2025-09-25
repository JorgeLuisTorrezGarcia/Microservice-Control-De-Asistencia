class DateUtils {
    static getCurrentDate() {
        return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    }

    static formatDateForDisplay(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static isValidDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;
        
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    static isToday(dateString) {
        return dateString === this.getCurrentDate();
    }
}

module.exports = DateUtils;