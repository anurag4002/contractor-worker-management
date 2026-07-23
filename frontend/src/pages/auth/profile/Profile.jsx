import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiLock,
  FiEdit,
  FiSave,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext.jsx";
import {
  Page,
  Card,
  AvatarCircle,
  HeaderSection,
  Name,
  RoleLabel,
  SummaryText,
  InfoGrid,
  FieldGroup,
  FieldLabel,
  FieldBox,
  FieldIcon,
  FieldInput,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
} from "./Profile.style";

const EMPTY_VALUE = "—";

const getRoleDisplay = (role) => {
  if (!role) return EMPTY_VALUE;
  if (typeof role === "string") return role || EMPTY_VALUE;
  if (typeof role === "object") {
    return role.name || role.code || role.title || EMPTY_VALUE;
  }
  return String(role) || EMPTY_VALUE;
};

const getStatusDisplay = (user) => {
  if (!user) return EMPTY_VALUE;
  if (user.status) return user.status;
  if (typeof user.isActive === "boolean") {
    return user.isActive ? "Active" : "Inactive";
  }
  if (typeof user.active === "boolean") {
    return user.active ? "Active" : "Inactive";
  }
  return EMPTY_VALUE;
};

const getUsernameDisplay = (user) => {
  if (!user) return EMPTY_VALUE;
  return user.username || user.email || EMPTY_VALUE;
};

const displayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }
  return value;
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
  });

  const initiateEdit = () => {
    if (!user) return;
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      role: getRoleDisplay(user.role),
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (typeof updateProfile === "function") {
      updateProfile({
        name: form.name,
        phone: form.phone,
        role: form.role,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({
      name: "",
      phone: "",
      role: "",
    });
  };

  if (!user) {
    return (
      <Page>
        <Card>
          <HeaderSection>
            <Name>Loading profile...</Name>
          </HeaderSection>
        </Card>
      </Page>
    );
  }

  const headerName = displayValue(user.name || user.email || "User");
  const headerRole = getRoleDisplay(user.role);
  const emailValue = displayValue(user.email);
  const phoneValue = isEditing ? form.phone : displayValue(user.phone);
  const nameValue = isEditing ? form.name : displayValue(user.name);
  const roleValue = isEditing ? form.role : getRoleDisplay(user.role);
  const usernameValue = displayValue(getUsernameDisplay(user));
  const statusValue = displayValue(getStatusDisplay(user));

  return (
    <Page>
      <Card>
        <AvatarCircle aria-hidden="true">
          <FiUser size={40} />
        </AvatarCircle>

        <HeaderSection>
          <Name>{headerName}</Name>
          <RoleLabel>{headerRole}</RoleLabel>
          <SummaryText>
            Enterprise profile details for your account, ready for team-level review and security workflows.
          </SummaryText>
        </HeaderSection>

        <InfoGrid>
          <FieldGroup>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <FieldBox>
              <FieldIcon>
                <FiUser />
              </FieldIcon>
              <FieldInput
                id="name"
                name="name"
                value={nameValue}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </FieldBox>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <FieldBox>
              <FieldIcon>
                <FiMail />
              </FieldIcon>
              <FieldInput id="email" name="email" value={emailValue} readOnly />
            </FieldBox>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="phone">Mobile Number</FieldLabel>
            <FieldBox>
              <FieldIcon>
                <FiPhone />
              </FieldIcon>
              <FieldInput
                id="phone"
                name="phone"
                value={phoneValue}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </FieldBox>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <FieldBox>
              <FieldIcon>
                <FiShield />
              </FieldIcon>
              <FieldInput id="username" name="username" value={usernameValue} readOnly />
            </FieldBox>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <FieldBox>
              <FieldIcon>
                <FiShield />
              </FieldIcon>
              <FieldInput
                id="role"
                name="role"
                value={roleValue}
                readOnly={!isEditing}
                onChange={handleChange}
              />
            </FieldBox>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <FieldBox>
              <FieldIcon>
                <FiLock />
              </FieldIcon>
              <FieldInput id="status" name="status" value={statusValue} readOnly />
            </FieldBox>
          </FieldGroup>
        </InfoGrid>

        <ButtonRow>
          <SecondaryButton type="button" onClick={() => navigate("/settings")}> 
            <FiLock />
            Account Settings
          </SecondaryButton>

          {!isEditing ? (
            <PrimaryButton type="button" onClick={initiateEdit}>
              <FiEdit />
              Edit Profile
            </PrimaryButton>
          ) : (
            <>
              <PrimaryButton type="button" onClick={handleSave}>
                <FiSave />
                Save
              </PrimaryButton>
              <SecondaryButton type="button" onClick={handleCancel}>
                <FiX />
                Cancel
              </SecondaryButton>
            </>
          )}
        </ButtonRow>
      </Card>
    </Page>
  );
};

export default Profile;
