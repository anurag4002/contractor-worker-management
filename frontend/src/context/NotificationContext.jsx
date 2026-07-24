import React, {
    createContext, useState, useCallback, useRef, useEffect,
} from "react";
import notificationService from "../services/notification.service";
import { toast } from "react-toastify";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef(null);

    /* ── helpers ── */
    const err = (e, fallback) => {
        const msg = e?.response?.data?.message || fallback;
        toast.error(msg);
    };

    /* ── fetch list ── */
    const fetchNotifications = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            const res = await notificationService.getNotifications(params);
            setNotifications(res.data?.data || []);
            setPagination(res.data?.pagination || {});
        } catch (e) {
            err(e, "Failed to load notifications.");
        } finally {
            setLoading(false);
        }
    }, []);

    /* ── unread count (also used by auto-poll) ── */
    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await notificationService.getUnreadCount();
            // Backend may return { data: { count: N } } or { data: N }
            const count =
                res.data?.data?.count ??
                res.data?.data ??
                res.data?.count ??
                0;
            setUnreadCount(Number(count));
        } catch {
            // silent — badge just won't update
        }
    }, []);

    /* ── mark one as read ── */
    const markAsRead = useCallback(async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((c) => Math.max(0, c - 1));
        } catch (e) {
            err(e, "Failed to mark notification as read.");
        }
    }, []);

    /* ── mark all read ── */
    const markAllAsRead = useCallback(async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success("All notifications marked as read.");
        } catch (e) {
            err(e, "Failed to mark all as read.");
        }
    }, []);

    /* ── delete ── */
    const deleteNotification = useCallback(async (id) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications((prev) => {
                const removed = prev.find((n) => n._id === id);
                if (removed && !removed.isRead) setUnreadCount((c) => Math.max(0, c - 1));
                return prev.filter((n) => n._id !== id);
            });
        } catch (e) {
            err(e, "Failed to delete notification.");
        }
    }, []);

    /* ── auto-poll: refresh unread count every 30 s ── */
    const startPolling = useCallback(() => {
        if (intervalRef.current) return;
        fetchUnreadCount();
        intervalRef.current = setInterval(fetchUnreadCount, 30_000);
    }, [fetchUnreadCount]);

    const stopPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => () => stopPolling(), [stopPolling]);

    return (
        <NotificationContext.Provider
            value={{
                notifications, unreadCount, pagination, loading,
                fetchNotifications, fetchUnreadCount,
                markAsRead, markAllAsRead, deleteNotification,
                startPolling, stopPolling,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
