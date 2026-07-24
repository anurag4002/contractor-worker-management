import React from "react";
import { Overlay, Modal, Header, Title, CloseButton, Body, Grid, Item, Label, Value, Footer, Button } from "./SiteDetailsModal.style";

const SiteDetailsModal = ({ open, site, workers = [], attendance = [], onClose }) => {
  if (!open || !site) return null;

  const assignedWorkers = Array.isArray(site.workers)
    ? workers.filter((w) => site.workers.includes(w._id))
    : workers.filter((w) => w.site === site._id);

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter((item) => item.site === site.siteName && item.date === today);

  const present = todayAttendance.filter((item) => item.status === "Present").length;
  const absent = todayAttendance.filter((item) => item.status === "Absent").length;
  const leave = todayAttendance.filter((item) => item.status === "Leave").length;

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>Site Details</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        <Body>
          <Grid>
            <Item>
              <Label>Site ID</Label>
              <Value>{site._id}</Value>
            </Item>
            <Item>
              <Label>Site Name</Label>
              <Value>{site.siteName}</Value>
            </Item>
            <Item>
              <Label>Location</Label>
              <Value>{site.city && site.state ? `${site.city}, ${site.state}` : "-"}</Value>
            </Item>
            <Item>
              <Label>Supervisor</Label>
              <Value>{site.supervisor || "-"}</Value>
            </Item>
            <Item>
              <Label>Start Date</Label>
              <Value>{site.startDate ? site.startDate.split("T")[0] : "-"}</Value>
            </Item>
            <Item>
              <Label>Client Name</Label>
              <Value>{site.clientName || "-"}</Value>
            </Item>
            <Item>
              <Label>Assigned Workers</Label>
              <Value>{assignedWorkers.length}</Value>
            </Item>
            <Item>
              <Label>Present Today</Label>
              <Value>{present}</Value>
            </Item>
            <Item>
              <Label>Absent</Label>
              <Value>{absent}</Value>
            </Item>
            <Item>
              <Label>Leave</Label>
              <Value>{leave}</Value>
            </Item>
            <Item>
              <Label>Site Status</Label>
              <Value>{site.status}</Value>
            </Item>
            <Item>
              <Label>Assigned Worker List</Label>
              <Value>
                {assignedWorkers.length === 0
                  ? "No Workers Assigned"
                  : assignedWorkers.map((w) => w.fullName || w.name).join(", ")}
              </Value>
            </Item>
          </Grid>
        </Body>
        <Footer>
          <Button onClick={onClose}>Close</Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default SiteDetailsModal;