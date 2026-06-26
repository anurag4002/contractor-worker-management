import React from "react";
import { NavLink } from "react-router-dom";

import sidebarData from "./Sidebar.data.json";

import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

import {
  SidebarContainer,
  TopSection,
  LogoSection,
  LogoIcon,
  LogoText,
  Menu,
  MenuItem,
  MenuButton,
  BottomSection,
  UserCard,
  Avatar,
  UserInfo,
  LogoutButton,
} from "./Sidebar.style";

const iconMap = {
  FiHome,
  FiUsers,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
};

const Sidebar = ({ sidebarOpen }) => {
  return (
    <SidebarContainer $sidebarOpen={sidebarOpen}>
      <TopSection>

        <LogoSection>

          <LogoIcon>C</LogoIcon>

          <LogoText $sidebarOpen={sidebarOpen}>
            <h2>Contractor</h2>
            <p>Worker Management</p>
          </LogoText>

        </LogoSection>

        <Menu>

          {sidebarData.menu.map((item) => {

            const Icon = iconMap[item.icon];

            return (

              <MenuItem key={item.id}>

                <NavLink
                  to={item.path}
                  style={{
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  {({ isActive }) => (

                    <MenuButton
                      type="button"
                      $active={isActive}
                      $sidebarOpen={sidebarOpen}
                    >

                      <Icon />

                      <span>{item.title}</span>

                    </MenuButton>

                  )}
                </NavLink>

              </MenuItem>

            );

          })}

        </Menu>

      </TopSection>

      <BottomSection>

        <UserCard>

          <Avatar>A</Avatar>

          <UserInfo $sidebarOpen={sidebarOpen}>

            <h4>Admin User</h4>

            <p>Administrator</p>

          </UserInfo>

        </UserCard>

        {sidebarOpen && (

          <LogoutButton type="button">

            Logout

          </LogoutButton>

        )}

      </BottomSection>

    </SidebarContainer>
  );
};

export default Sidebar;