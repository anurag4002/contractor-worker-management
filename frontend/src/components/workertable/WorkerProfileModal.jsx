import React from "react";

import {
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

import Modal from "../modal/Modal";

const labelStyle = {
  color: "#64748B",
  fontSize: ".85rem",
  marginBottom: ".25rem",
};

const valueStyle = {
  color: "#0F172A",
  fontWeight: "600",
};

const cardStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2,1fr)",
  gap: "1.25rem",
};

const infoStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: ".8rem",
};

const WorkerProfileModal = ({
  open,
  worker,
  onClose,
}) => {

  if (!worker) return null;

  return (

    <Modal
      open={open}
      title="Worker Profile"
      submitText="Close"
      onClose={onClose}
      onSubmit={onClose}
    >

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >

        <div
          style={{
            width: "7rem",
            height: "7rem",
            borderRadius: "50%",
            overflow: "hidden",
            background: "#2563EB",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontSize: "2.2rem",
            fontWeight: "700",
          }}
        >

          {worker.photo ? (

            <img
              src={worker.photo}
              alt={worker.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

          ) : (

            worker.name.charAt(0)

          )}

        </div>

        <h2
          style={{
            marginTop: "1rem",
            marginBottom: ".25rem",
            color: "#0F172A",
          }}
        >
          {worker.name}
        </h2>

        <p
          style={{
            color: "#64748B",
          }}
        >
          {worker.id}
        </p>

      </div>

      <div style={cardStyle}>

        <div style={infoStyle}>

          <FiUser size={20} color="#2563EB"/>

          <div>

            <div style={labelStyle}>
              Worker Name
            </div>

            <div style={valueStyle}>
              {worker.name}
            </div>

          </div>

        </div>

        <div style={infoStyle}>

          <FiPhone size={20} color="#2563EB"/>

          <div>

            <div style={labelStyle}>
              Mobile
            </div>

            <div style={valueStyle}>
              {worker.phone}
            </div>

          </div>

        </div>

        <div style={infoStyle}>

          <FiBriefcase size={20} color="#2563EB"/>

          <div>

            <div style={labelStyle}>
              Skill
            </div>

            <div style={valueStyle}>
              {worker.skill}
            </div>

          </div>

        </div>

        <div style={infoStyle}>

          <FiMapPin size={20} color="#2563EB"/>

          <div>

            <div style={labelStyle}>
              Site
            </div>

            <div style={valueStyle}>
              {worker.site}
            </div>

          </div>

        </div>

        <div style={infoStyle}>

          <FiDollarSign size={20} color="#2563EB"/>

          <div>

            <div style={labelStyle}>
              Daily Wage
            </div>

            <div style={valueStyle}>
              {worker.salary}
            </div>

          </div>

        </div>

        <div style={infoStyle}>

          <FiCalendar size={20} color="#2563EB"/>

          <div>

            <div style={labelStyle}>
              Joining Date
            </div>

            <div style={valueStyle}>
              {worker.joiningDate}
            </div>

          </div>

        </div>

      </div>

    </Modal>

  );

};

export default WorkerProfileModal;