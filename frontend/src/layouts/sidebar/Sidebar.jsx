import {
  SidebarWrapper,
  Logo,
  Menu,
  MenuItem,
} from "./Sidebar.style";

const Sidebar = () => {
  return (
    <SidebarWrapper>
      <Logo>
        <h2>Worker CMS</h2>
        <p>Management System</p>
      </Logo>

      <Menu>
        <MenuItem active>
          Dashboard
        </MenuItem>

        <MenuItem>
          Workers
        </MenuItem>

        <MenuItem>
          Attendance
        </MenuItem>

        <MenuItem>
          Sites
        </MenuItem>

        <MenuItem>
          Salary
        </MenuItem>

        <MenuItem>
          Reports
        </MenuItem>
      </Menu>
    </SidebarWrapper>
  );
};

export default Sidebar;