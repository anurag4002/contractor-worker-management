import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import superadminSidebarData from "./Sidebar.data.json";

import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiDollarSign,
  FiAlertCircle,
  FiBox,
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
} from "./SuperAdminLayout.style";

import { useAuth } from "../../context/AuthContext";

const iconMap = {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiDollarSign,
  FiAlertCircle,
  FiBox,
  FiLogOut,
};

const SuperAdminSidebar = ({ sidebarOpen, onClose }) => {
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
        navigate("/super-admin/login", { replace: true });
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
            <LogoIcon>S</LogoIcon>
            <LogoText $sidebarOpen={sidebarOpen}>
              <h2>Super Admin</h2>
              <p>Platform Console</p>
            </LogoText>
          </LogoSection>

          <Menu>
            {superadminSidebarData.menu.map((item) => {
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
          <UserCard>
            <Avatar>S</Avatar>
            <UserInfo $sidebarOpen={sidebarOpen}>
              <h4>Super Admin</h4>
              <p>Platform Administrator</p>
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

      {sidebarOpen && (
        <SidebarBackdrop onClick={onClose} />
      )}
    </>
  );
};

export default SuperAdminSidebar;
