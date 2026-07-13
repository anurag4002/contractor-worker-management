import React from "react";

import { useNavigate } from "react-router-dom";

import {
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import {
  Dropdown,
  UserSection,
  Avatar,
  UserDetails,
  Menu,
  MenuItem,
} from "./ProfileDropdown.style";

const ProfileDropdown = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  return (

    <Dropdown>

      <UserSection>

        <Avatar>

          A

        </Avatar>

        <UserDetails>

          <h4>

            Admin

          </h4>

          <p>

            Administrator

          </p>

        </UserDetails>

      </UserSection>

      <Menu>

        <MenuItem
          onClick={() =>
            navigate("/profile")
          }
        >

          <FiUser />

          My Profile

        </MenuItem>

        <MenuItem
          onClick={() =>
            navigate("/settings")
          }
        >

          <FiSettings />

          Settings

        </MenuItem>

        <MenuItem
          danger
          onClick={handleLogout}
        >

          <FiLogOut />

          Logout

        </MenuItem>

      </Menu>

    </Dropdown>

  );

};

export default ProfileDropdown;