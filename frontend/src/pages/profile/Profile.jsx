import React from "react";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiEdit2,
} from "react-icons/fi";

import {
  ProfileContainer,
  Header,
  ProfileCard,
  Avatar,
  Info,
  InfoGrid,
  InfoItem,
  Label,
  Value,
  EditButton,
} from "./Profile.style";

const Profile = () => {

  const user = {
    name: "Admin",
    email: "admin@example.com",
    phone: "+91 9876543210",
    role: "Administrator",
  };

  return (
    <ProfileContainer>

      <Header>

        <h2>My Profile</h2>

        <p>
          Manage your account information
        </p>

      </Header>

      <ProfileCard>

        <Avatar>

          A

        </Avatar>

        <Info>

          <h3>

            {user.name}

          </h3>

          <p>

            {user.role}

          </p>

        </Info>

        <EditButton>

          <FiEdit2 />

          Edit Profile

        </EditButton>

      </ProfileCard>

      <InfoGrid>

        <InfoItem>

          <Label>

            <FiUser />

            Full Name

          </Label>

          <Value>

            {user.name}

          </Value>

        </InfoItem>

        <InfoItem>

          <Label>

            <FiMail />

            Email

          </Label>

          <Value>

            {user.email}

          </Value>

        </InfoItem>

        <InfoItem>

          <Label>

            <FiPhone />

            Mobile

          </Label>

          <Value>

            {user.phone}

          </Value>

        </InfoItem>

        <InfoItem>

          <Label>

            <FiShield />

            Role

          </Label>

          <Value>

            {user.role}

          </Value>

        </InfoItem>

      </InfoGrid>

    </ProfileContainer>
  );

};

export default Profile;