import React from "react";

import {
  FiBell,
} from "react-icons/fi";

import {
  Dropdown,
  DropdownHeader,
  NotificationItem,
  NotificationIcon,
  NotificationText,
  EmptyState,
} from "./NotificationDropdown.style";

const NotificationDropdown = () => {

  const notifications = [
    {
      id: 1,
      title: "Rahul marked Present",
    },
    {
      id: 2,
      title: "Salary generated successfully",
    },
    {
      id: 3,
      title: "New worker added",
    },
  ];

  return (

    <Dropdown>

      <DropdownHeader>

        Notifications

      </DropdownHeader>

      {

        notifications.length === 0

          ? (

            <EmptyState>

              No notifications

            </EmptyState>

          )

          : (

            notifications.map((item) => (

              <NotificationItem
                key={item.id}
              >

                <NotificationIcon>

                  <FiBell />

                </NotificationIcon>

                <NotificationText>

                  {item.title}

                </NotificationText>

              </NotificationItem>

            ))

          )

      }

    </Dropdown>

  );

};

export default NotificationDropdown;