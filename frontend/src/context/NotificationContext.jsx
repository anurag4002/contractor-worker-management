import {
    createContext, useState, useCallback, useRef, useEffect,
} from "react";
import notificationService from "../services/notification.service";
import { showError, showSuccess } from "../components/common/toast";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef(null);

    /* ── fetch list ── */
    const fetchNotifications = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            const res = await notificationService.getNotifications(params);
            setNotifications(res.data?.data || []);
            setPagination(res.data?.pagination || {});
        } catch (error) {
            showError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    /* ── unread count (also used by auto-poll) ── */
    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await notificationService.getUnreadCount();
            const count = Number(
                res.data?.data?.unreadCount ??
                res.data?.data?.count ??
                res.data?.count ??
                0
            );
            setUnreadCount(count);
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
        } catch (error) {
            showError(error);
        }
    }, []);

    /* ── mark all read ── */
    const markAllAsRead = useCallback(async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
            showSuccess("All notifications marked as read.");
        } catch (error) {
            showError(error);
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
        } catch (error) {
            showError(error);
        }
    }, []);

    /* ── clear all ── */
    const clearAll = useCallback(async () => {
        try {
            await notificationService.clearAllNotifications();
            setNotifications([]);
            setUnreadCount(0);
            showSuccess("All notifications cleared.");
        } catch (error) {
            showError(error);
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
                markAsRead, markAllAsRead, deleteNotification, clearAll,
                startPolling, stopPolling,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
