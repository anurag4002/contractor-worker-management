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
  FiCreditCard,
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
  SidebarBackdrop,
} from "./Sidebar.style";

const iconMap = {
  FiHome,
  FiUsers,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiCreditCard,
};

const Sidebar = ({ sidebarOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.email ||
    "User";

  const avatarInitial = displayName.trim().charAt(0).toUpperCase();

  const userRole = user?.role || "Administrator";

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
    <>
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
                  onClick={() => {
                    if (window.innerWidth <= 768 && onClose) {
                      onClose();
                    }
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
            $sidebarOpen={sidebarOpen}
            onClick={() => {
              if (!sidebarOpen) {
                /* allow navigation when sidebar is collapsed */
              }
            }}
          >

            <Avatar
              aria-label={`${displayName} profile`}
              title={displayName}
            >
              {avatarInitial}
            </Avatar>

            <UserInfo $sidebarOpen={sidebarOpen}>

              <h4>{displayName}</h4>

              <p>{userRole}</p>

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
                      Are you sure you want to log out?
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

      {sidebarOpen && (
        <SidebarBackdrop onClick={onClose} />
      )}
    </>
  );
};

export default Sidebar;