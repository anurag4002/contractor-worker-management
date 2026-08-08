import React from "react";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
} from "../workermodal/WorkerModal.style";

import {
  ProfileContainer,
  ProfileImage,
  ProfileInfo,
  ProfileGrid,
  ProfileItem,
  Label,
  Value,
  StatusBadge,
} from "./WorkerProfileModal.style";

const WorkerProfileModal = ({
  open,
  worker,
  onClose,
}) => {

  if (!open || !worker) return null;

  const wage =
    worker.salaryType === "DAILY"
      ? `₹${Number(
          worker.dailyWage || 0
        ).toLocaleString("en-IN")}/Day`
      : `₹${Number(
          worker.monthlySalary || 0
        ).toLocaleString("en-IN")}/Month`;

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Worker Profile

          </Title>

          <CloseButton
            onClick={onClose}
          >

            ×

          </CloseButton>

        </Header>

        <ProfileContainer>

          <ProfileImage>

            {

              worker.documents?.photo ? (

                 <img
                   src={worker.documents?.photo}
                   alt={worker.fullName}
                 />

              ) : (

                <span>

                  {

                     worker.fullName

                       ?.charAt(0)

                      ?.toUpperCase() || "W"

                  }

                </span>

              )

            }

          </ProfileImage>

          <ProfileInfo>

            <h2>

              {worker.fullName}

            </h2>

            <p>

              {worker.trade}

            </p>

            <StatusBadge
              status={worker.status}
            >

              {worker.status || "Active"}

            </StatusBadge>

          </ProfileInfo>

        </ProfileContainer>

        <ProfileGrid>

          <ProfileItem>

            <Label>

              Worker ID

            </Label>

            <Value>

              {worker._id}

            </Value>

          </ProfileItem>

          <ProfileItem>

            <Label>

              Mobile Number

            </Label>

            <Value>

              {worker.mobileNumber || "-"}

            </Value>

          </ProfileItem>

          <ProfileItem>

            <Label>

              Skill

            </Label>

            <Value>

              {worker.trade || "-"}

            </Value>

          </ProfileItem>

          <ProfileItem>

            <Label>

              Work Type

            </Label>

            <Value>

              {worker.skillLevel || "-"}

            </Value>

          </ProfileItem>

          <ProfileItem>

            <Label>

              Wage Type

            </Label>

            <Value>

              {worker.salaryType || "-"}

            </Value>

          </ProfileItem>

          <ProfileItem>

            <Label>

              Wage Rate

            </Label>

            <Value>

              {wage}

            </Value>

          </ProfileItem>

          <ProfileItem>

            <Label>

              Joining Date

            </Label>

            <Value>

              {worker.joiningDate || "-"}

            </Value>

          </ProfileItem>

          <ProfileItem>

            <Label>

              Assigned Site

            </Label>

            <Value>

              {worker.site || "-"}

            </Value>

          </ProfileItem>

          <ProfileItem>

            <Label>

              Status

            </Label>

            <StatusBadge
              status={worker.status}
            >

              {worker.status || "Active"}

            </StatusBadge>

          </ProfileItem>

        </ProfileGrid>

      </Modal>

    </Overlay>

  );

};

export default WorkerProfileModal;