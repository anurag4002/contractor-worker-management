import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiEdit,
  FiSave,
  FiX,
} from "react-icons/fi";

import { useAuth } from "../../../context/AuthContext.jsx";
import {
  Page,
  Card,
  Avatar,
  Title,
  Form,
  InputGroup,
  Icon,
  Input,
  ButtonGroup,
  PrimaryButton,
  SecondaryButton,
} from "./Profile.style";

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    updateProfile(form);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);

    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "",
    });
  };

  return (
    <Page>

      <Card>

        <Avatar>

          <FiUser size={42} />

        </Avatar>

        <Title>

          My Profile

        </Title>

        <Form>

          <InputGroup>

            <Icon>

              <FiUser />

            </Icon>

            <Input
              name="name"
              value={form.name}
              disabled={!isEditing}
              onChange={handleChange}
            />

          </InputGroup>

          <InputGroup>

            <Icon>

              <FiMail />

            </Icon>

            <Input
              name="email"
              value={form.email}
              disabled
            />

          </InputGroup>

          <InputGroup>

            <Icon>

              <FiPhone />

            </Icon>

            <Input
              name="phone"
              value={form.phone}
              disabled={!isEditing}
              onChange={handleChange}
            />

          </InputGroup>

          <InputGroup>

            <Icon>

              <FiShield />

            </Icon>

            <Input
              name="role"
              value={form.role}
              disabled
            />

          </InputGroup>

          <ButtonGroup>

            {!isEditing ? (

              <PrimaryButton
                type="button"
                onClick={() =>
                  setIsEditing(true)
                }
              >

                <FiEdit />

                Edit Profile

              </PrimaryButton>

            ) : (

              <>

                <PrimaryButton
                  type="button"
                  onClick={handleSave}
                >

                  <FiSave />

                  Save

                </PrimaryButton>

                <SecondaryButton
                  type="button"
                  onClick={handleCancel}
                >

                  <FiX />

                  Cancel

                </SecondaryButton>

              </>

            )}

          </ButtonGroup>

        </Form>

      </Card>

    </Page>
  );
};

export default Profile;