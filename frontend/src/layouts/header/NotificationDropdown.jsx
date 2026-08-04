import React, { useEffect, useRef } from "react";
import { FiBell, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiTrash2, FiCheck } from "react-icons/fi";
import useNotification from "../../hooks/useNotification";
import {
  Dropdown, DropdownHeader, NotificationItem,
  NotificationIcon, NotificationText, EmptyState,
} from "./NotificationDropdown.style";
import styled from "styled-components";

/* ─── Extra styles ────────────────────────────────────────────── */
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem;
  font-size: 1rem; font-weight: 700; color: var(--text);
  border-bottom: 1px solid var(--border); background: var(--table-header-bg);
`;

const MarkAllBtn = styled.button`
  font-size: 0.78rem; font-weight: 600; color: var(--primary);
  background: none; border: none; cursor: pointer; padding: 0;
  &:hover { text-decoration: underline; }
`;

const UnreadDot = styled.span`
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--primary); flex-shrink: 0;
  display: ${({ $show }) => ($show ? "block" : "none")};
`;

const TimeStamp = styled.p`
  margin: 0.2rem 0 0; font-size: 0.72rem; color: var(--text-secondary);
`;

const ItemActions = styled.div`
  display: flex; gap: 0.3rem; opacity: 0; transition: 0.2s;
  flex-shrink: 0;
  ${NotificationItem}:hover & { opacity: 1; }
`;

const SmBtn = styled.button`
  background: none; border: none; cursor: pointer; padding: 0.25rem;
  border-radius: 0.35rem; font-size: 0.85rem;
  color: ${({ $danger }) => ($danger ? "var(--danger)" : "var(--text-secondary)")};
  &:hover { background: ${({ $danger }) => ($danger ? "var(--badge-danger-bg)" : "var(--surface-hover)")}; }
`;

const Footer = styled.div`
  padding: 0.75rem 1.25rem; border-top: 1px solid var(--border);
  text-align: center; background: var(--table-header-bg);
  font-size: 0.8rem; color: var(--text-secondary);
`;

const ScrollBody = styled.div`
  max-height: 26rem; overflow-y: auto;
`;

/* ─── Icon per type ──────────────────────────────────────────── */
const TYPE_META = {
  INFO: { icon: <FiInfo />, bg: "var(--badge-info-bg)", color: "var(--badge-info-fg)" },
  SUCCESS: { icon: <FiCheckCircle />, bg: "var(--badge-success-bg)", color: "var(--badge-success-fg)" },
  WARNING: { icon: <FiAlertTriangle />, bg: "var(--badge-warning-bg)", color: "var(--badge-warning-fg)" },
  ERROR: { icon: <FiAlertCircle />, bg: "var(--badge-danger-bg)", color: "var(--badge-danger-fg)" },
};

const fmt = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString("en-IN");
};

const NotificationDropdown = ({ onClose }) => {
  const {
    notifications, unreadCount, loading, pagination,
    fetchNotifications, markAsRead, markAllAsRead, deleteNotification,
  } = useNotification();

  /* fetch on open */
  useEffect(() => { fetchNotifications({ limit: 20, sortBy: "createdAt", sortOrder: "desc" }); }, []);

  const data = Array.isArray(notifications) ? notifications : [];

  return (
    <Dropdown>
      <Header>
        <span>
          Notifications
          {unreadCount > 0 && (
            <span style={{
              marginLeft: "0.5rem", background: "var(--primary)", color: "var(--text-on-primary)",
              fontSize: "0.7rem", fontWeight: 700, padding: "0.1rem 0.5rem",
              borderRadius: "999px",
            }}>
              {unreadCount}
            </span>
          )}
        </span>
        {unreadCount > 0 && (
          <MarkAllBtn onClick={markAllAsRead}>Mark all read</MarkAllBtn>
        )}
      </Header>

      <ScrollBody>
        {loading ? (
          <EmptyState>Loading notifications…</EmptyState>
        ) : data.length === 0 ? (
          <EmptyState>
            <FiBell style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "var(--border)" }} />
            <br />No notifications
          </EmptyState>
        ) : (
          data.map((n) => {
            const meta = TYPE_META[n.type] || TYPE_META.INFO;
            return (
              <NotificationItem
                key={n._id}
                style={{ background: n.isRead ? "var(--surface)" : "var(--primary-light)" }}
                onClick={() => { if (!n.isRead) markAsRead(n._id); }}
              >
                <NotificationIcon style={{ background: meta.bg, color: meta.color }}>
                  {meta.icon}
                </NotificationIcon>

                <NotificationText style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: n.isRead ? 400 : 700, fontSize: "0.88rem", color: "var(--text)" }}>
                    {n.title}
                  </div>
                  {n.message && (
                    <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {n.message}
                    </p>
                  )}
                  <TimeStamp>{fmt(n.createdAt)}</TimeStamp>
                </NotificationText>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                  <UnreadDot $show={!n.isRead} />
                  <ItemActions>
                    {!n.isRead && (
                      <SmBtn title="Mark read" onClick={(e) => { e.stopPropagation(); markAsRead(n._id); }}>
                        <FiCheck />
                      </SmBtn>
                    )}
                    <SmBtn $danger title="Delete" onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }}>
                      <FiTrash2 />
                    </SmBtn>
                  </ItemActions>
                </div>
              </NotificationItem>
            );
          })
        )}
      </ScrollBody>

      <Footer>
        {pagination?.total
          ? `Showing ${data.length} of ${pagination.total} notifications`
          : "All notifications"}
      </Footer>
    </Dropdown>
  );
};

export default NotificationDropdown;