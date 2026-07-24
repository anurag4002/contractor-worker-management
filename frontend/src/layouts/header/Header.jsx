import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu, FiSearch, FiBell, FiSettings, FiChevronDown,
} from "react-icons/fi";

import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import useNotification from "../../hooks/useNotification";
import { useAuth } from "../../context/AuthContext";

import {
  HeaderContainer, LeftSection, MenuButton, SearchBar,
  RightSection, IconButton, NotificationBadge, UserProfile,
  Avatar, UserInfo,
} from "./Header.style";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  /* ── Live unread counter ── */
  const { unreadCount, startPolling, stopPolling } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, []);

  const toggleNotification = () => {
    setShowNotifications((prev) => !prev);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    setShowNotifications(false);
  };

  /* ── Click outside ── */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={toggleSidebar}>
          <FiMenu />
        </MenuButton>
        <SearchBar>
          <FiSearch />
          <input
            type="text"
            placeholder="Search workers, sites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBar>
      </LeftSection>

      <RightSection>
        {/* Notification Bell */}
        <div ref={notificationRef} style={{ position: "relative" }}>
          <IconButton onClick={toggleNotification} aria-label="Notifications">
            <FiBell />
            {unreadCount > 0 && (
              <NotificationBadge>
                {unreadCount > 99 ? "99+" : unreadCount}
              </NotificationBadge>
            )}
          </IconButton>
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        <IconButton onClick={() => navigate("/settings")}>
          <FiSettings />
        </IconButton>

        {/* Profile */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <UserProfile onClick={toggleProfile}>
            <Avatar>
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <UserInfo>
              <h4>{user?.fullName || user?.email || "User"}</h4>
              <p>{typeof user?.role === "object" ? user.role.name : (user?.role || "—")}</p>
            </UserInfo>
            <FiChevronDown />
          </UserProfile>
          {showProfile && <ProfileDropdown />}
        </div>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;