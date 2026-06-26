import React, { useMemo } from "react";

import {
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

import styled from "styled-components";

const SummaryGrid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:1.5rem;
`;

const Card = styled.div`
  background:#fff;
  padding:1.5rem;
  border-radius:1rem;
  border:1px solid #E2E8F0;
  box-shadow:0 10px 25px rgba(15,23,42,.05);

  display:flex;
  align-items:center;
  gap:1rem;

  transition:.3s;

  &:hover{
    transform:translateY(-5px);
  }
`;

const IconBox = styled.div`
  width:60px;
  height:60px;

  border-radius:15px;

  display:flex;
  justify-content:center;
  align-items:center;

  font-size:1.6rem;

  color:white;

  background:${({color})=>color};
`;

const Content = styled.div`
  h2{
    margin:0;
    color:#0F172A;
    font-size:1.7rem;
  }

  p{
    margin:.4rem 0 0;
    color:#64748B;
  }
`;

const AttendanceSummary = ({ workers }) => {

  const summary = useMemo(() => {

    const total = workers.length;

    const present = workers.filter(
      (item)=>item.status==="Present"
    ).length;

    const absent = workers.filter(
      (item)=>item.status==="Absent"
    ).length;

    const leave = workers.filter(
      (item)=>item.status==="Leave"
    ).length;

    return {

      total,
      present,
      absent,
      leave,

    };

  },[workers]);

  return (

    <SummaryGrid>

      <Card>

        <IconBox color="#2563EB">

          <FiUsers/>

        </IconBox>

        <Content>

          <h2>

            {summary.total}

          </h2>

          <p>Total Workers</p>

        </Content>

      </Card>

      <Card>

        <IconBox color="#16A34A">

          <FiCheckCircle/>

        </IconBox>

        <Content>

          <h2>

            {summary.present}

          </h2>

          <p>Present Today</p>

        </Content>

      </Card>

      <Card>

        <IconBox color="#DC2626">

          <FiXCircle/>

        </IconBox>

        <Content>

          <h2>

            {summary.absent}

          </h2>

          <p>Absent Today</p>

        </Content>

      </Card>

      <Card>

        <IconBox color="#F59E0B">

          <FiClock/>

        </IconBox>

        <Content>

          <h2>

            {summary.leave}

          </h2>

          <p>On Leave</p>

        </Content>

      </Card>

    </SummaryGrid>

  );

};

export default AttendanceSummary;