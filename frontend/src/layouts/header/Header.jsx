import React from "react";

import {
  FiMenu,
  FiSearch,
  FiBell,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";

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
          />

        </SearchBar>

      </LeftSection>

      <RightSection>

        <IconButton>

          <FiBell />

          <NotificationBadge>
            3
          </NotificationBadge>

        </IconButton>

        <IconButton>

          <FiSettings />

        </IconButton>

        <UserProfile>

          <Avatar>
            A
          </Avatar>

          <UserInfo>

            <h4>Admin</h4>

            <p>Administrator</p>

          </UserInfo>

          <FiChevronDown />

        </UserProfile>

      </RightSection>

    </HeaderContainer>
  );
};

export default Header;