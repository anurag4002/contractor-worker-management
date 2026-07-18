import React from "react";

import {
  FiUser,
  FiLock,
  FiBell,
  FiGlobe,
  FiDatabase,
} from "react-icons/fi";

import {
  SettingsContainer,
  Header,
  Card,
  CardTitle,
  SettingItem,
  SettingInfo,
  SettingButton,
} from "./Settings.style";

const settings = [
  {
    icon: <FiUser />,
    title: "Profile",
    description: "Update your profile information",
  },
  {
    icon: <FiLock />,
    title: "Change Password",
    description: "Update your account password",
  },
  {
    icon: <FiBell />,
    title: "Notifications",
    description: "Manage notification settings",
  },
  {
    icon: <FiGlobe />,
    title: "Language",
    description: "Select application language",
  },
  {
    icon: <FiDatabase />,
    title: "Backup",
    description: "Backup & Restore data",
  },
];

const Settings = () => {
  return (
    <SettingsContainer>

      <Header>

        <h2>Settings</h2>

        <p>
          Manage application settings
        </p>

      </Header>

      <Card>

        {settings.map((item) => (

          <SettingItem key={item.title}>

            <SettingInfo>

              {item.icon}

              <div>

                <h4>{item.title}</h4>

                <p>{item.description}</p>

              </div>

            </SettingInfo>

            <SettingButton>

              Manage

            </SettingButton>

          </SettingItem>

        ))}

      </Card>

    </SettingsContainer>
  );
};

export default Settings;