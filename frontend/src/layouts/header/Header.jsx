import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FiMenu,
  FiSearch,
  FiBell,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";

import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

import {
  HeaderContainer,
  LeftSection,
  MenuButton,
  SearchBar,
  RightSection,
  IconButton,
  NotificationBadge,
  UserProfile,
  Avatar,
  UserInfo,
} from "./Header.style";

const Header = ({ toggleSidebar }) => {

  const navigate = useNavigate();

  const notificationRef = useRef(null);

  const profileRef = useRef(null);

  const [search, setSearch] = useState("");

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  const notifications = [
    "Rahul marked Present",
    "Salary generated successfully",
    "New worker added",
  ];

  const toggleNotification = () => {

    setShowNotifications((prev) => !prev);

    setShowProfile(false);

  };

  const toggleProfile = () => {

    setShowProfile((prev) => !prev);

    setShowNotifications(false);

  };

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {

        setShowNotifications(false);

      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {

        setShowProfile(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);

  const handleSearch = (e) => {

    setSearch(e.target.value);

  };

  return (

    <HeaderContainer>

      <LeftSection>

        <MenuButton
          onClick={toggleSidebar}
        >

          <FiMenu />

        </MenuButton>

        <SearchBar>

          <FiSearch />

          <input
            type="text"
            placeholder="Search workers, sites..."
            value={search}
            onChange={handleSearch}
          />

        </SearchBar>

      </LeftSection>

      <RightSection>

        <div
          ref={notificationRef}
          style={{
            position: "relative",
          }}
        >

          <IconButton
            onClick={toggleNotification}
          >

            <FiBell />

            <NotificationBadge>

              {notifications.length}

            </NotificationBadge>

          </IconButton>

          {

            showNotifications && (

              <NotificationDropdown />

            )

          }

        </div>

        <IconButton
          onClick={() =>
            navigate("/settings")
          }
        >

          <FiSettings />

        </IconButton>

        <div
          ref={profileRef}
          style={{
            position: "relative",
          }}
        >

          <UserProfile
            onClick={toggleProfile}
          >

            <Avatar>

              A

            </Avatar>

            <UserInfo>

              <h4>

                Admin

              </h4>

              <p>

                Administrator

              </p>

            </UserInfo>

            <FiChevronDown />

          </UserProfile>

          {

            showProfile && (

              <ProfileDropdown />

            )

          }

        </div>

      </RightSection>

    </HeaderContainer>

  );

};

export default Header;