import axios from "../api/axios";

const BASE = "/notifications";

const notificationService = {
    /** POST /notifications */
    createNotification: (data) =>
        axios.post(BASE, data),

    /** GET /notifications */
    getNotifications: (params = {}) =>
        axios.get(BASE, { params }),

    /** GET /notifications/:id */
    getNotificationById: (id) =>
        axios.get(`${BASE}/${id}`),

    /** GET /notifications/unread-count */
    getUnreadCount: (params = {}) =>
        axios.get(`${BASE}/unread-count`, { params }),

    /** PATCH /notifications/:id/read */
    markAsRead: (id) =>
        axios.patch(`${BASE}/${id}/read`),

    /** PATCH /notifications/read-all */
    markAllAsRead: () =>
        axios.patch(`${BASE}/read-all`),

    /** DELETE /notifications/:id */
    deleteNotification: (id) =>
        axios.delete(`${BASE}/${id}`),
};

export default notificationService;
