import {
  HeaderWrapper,
  Search,
  UserBox,
} from "./Header.style";

const Header = () => {
  return (
    <HeaderWrapper>
      <Search
        placeholder="Search..."
      />

      <UserBox>
        Admin User
      </UserBox>
    </HeaderWrapper>
  );
};

export default Header;