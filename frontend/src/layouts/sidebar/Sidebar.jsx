import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import sidebarData from "./Sidebar.data.json";

import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiLogOut,
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
  LogoutConfirm,
  LogoutConfirmOverlay,
  LogoutConfirmCard,
  LogoutConfirmTitle,
  LogoutConfirmText,
  LogoutConfirmActions,
  LogoutConfirmBtn,
  LogoutCancelBtn,
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
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);
    try {
      await logout();
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

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

        <UserCard
          as={NavLink}
          to="/profile"
          onClick={() => {
            if (!sidebarOpen) {
              /* allow navigation when sidebar is collapsed */
            }
          }}
        >

          <Avatar>A</Avatar>

          <UserInfo $sidebarOpen={sidebarOpen}>

            <h4>Admin User</h4>

            <p>Administrator</p>

          </UserInfo>

        </UserCard>

        {sidebarOpen && (

          <>

            <LogoutButton
              type="button"
              onClick={handleLogoutClick}
            >

              <FiLogOut />

              Logout

            </LogoutButton>

            {showLogoutConfirm && (

              <LogoutConfirm>

                <LogoutConfirmOverlay />

                <LogoutConfirmCard>

                  <LogoutConfirmTitle>Confirm Logout</LogoutConfirmTitle>

                  <LogoutConfirmText>
                    Are you sure you want to logout?
                  </LogoutConfirmText>

                  <LogoutConfirmActions>

                    <LogoutCancelBtn onClick={handleLogoutCancel}>
                      Cancel
                    </LogoutCancelBtn>

                    <LogoutConfirmBtn onClick={handleLogoutConfirm}>
                      Logout
                    </LogoutConfirmBtn>

                  </LogoutConfirmActions>

                </LogoutConfirmCard>

              </LogoutConfirm>

            )}
          </>

        )}

      </BottomSection>

    </SidebarContainer>
  );
};

export default Sidebar;