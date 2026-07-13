import React from "react";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Grid,
  Item,
  Label,
  Value,
  Footer,
  Button,
} from "./SiteDetailsModal.style";

const SiteDetailsModal = ({
  open,
  site,
  workers = [],
  attendance = [],
  onClose,
}) => {

  if (!open || !site) return null;

  const assignedWorkers = Array.isArray(site.workers)
    ? workers.filter((worker) =>
        site.workers.includes(worker.id)
      )
    : workers.filter(
        (worker) => worker.site === site.name
      );

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todayAttendance = attendance.filter(
    (item) =>
      item.site === site.name &&
      item.date === today
  );

  const present = todayAttendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absent = todayAttendance.filter(
    (item) => item.status === "Absent"
  ).length;

  const leave = todayAttendance.filter(
    (item) => item.status === "Leave"
  ).length;

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Site Details

          </Title>

          <CloseButton
            onClick={onClose}
          >
            ×
          </CloseButton>

        </Header>

        <Body>

          <Grid>

            <Item>

              <Label>

                Site ID

              </Label>

              <Value>

                {site.id}

              </Value>

            </Item>

            <Item>

              <Label>

                Site Name

              </Label>

              <Value>

                {site.name}

              </Value>

            </Item>

            <Item>

              <Label>

                Location

              </Label>

              <Value>

                {site.location || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Supervisor

              </Label>

              <Value>

                {site.supervisor || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Start Date

              </Label>

              <Value>

                {site.startDate || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Capacity

              </Label>

              <Value>

                {site.capacity || "-"}

              </Value>

            </Item>

            <Item>

              <Label>

                Assigned Workers

              </Label>

              <Value>

                {assignedWorkers.length}

              </Value>

            </Item>

            <Item>

              <Label>

                Present Today

              </Label>

              <Value>

                {present}

              </Value>

            </Item>

            <Item>

              <Label>

                Absent

              </Label>

              <Value>

                {absent}

              </Value>

            </Item>

            <Item>

              <Label>

                Leave

              </Label>

              <Value>

                {leave}

              </Value>

            </Item>

            <Item>

              <Label>

                Site Status

              </Label>

              <Value>

                {site.status}

              </Value>

            </Item>

            <Item>

              <Label>

                Assigned Worker List

              </Label>

              <Value>

                {assignedWorkers.length === 0
                  ? "No Workers Assigned"
                  : assignedWorkers
                      .map((worker) => worker.name)
                      .join(", ")}

              </Value>

            </Item>

          </Grid>

        </Body>

        <Footer>

          <Button
            onClick={onClose}
          >

            Close

          </Button>

        </Footer>

      </Modal>

    </Overlay>

  );

};

export default SiteDetailsModal;