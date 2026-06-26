import React, { useMemo } from "react";

import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";

import styled from "styled-components";

const Grid = styled.div`
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
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
    transform:translateY(-4px);
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
  }

  p{
    margin:.35rem 0 0;
    color:#64748B;
  }
`;

const SalarySummary = ({ workers }) => {

  const summary = useMemo(()=>{

    const totalWorkers = workers.length;

    const totalSalary = workers.reduce(
      (sum,item)=>
        sum + item.dailyWage * item.daysWorked,
      0
    );

    const totalAdvance = workers.reduce(
      (sum,item)=>
        sum + item.advance,
      0
    );

    const totalRemaining = workers.reduce(
      (sum,item)=>

        sum +

        (
          item.dailyWage *
          item.daysWorked -

          item.advance -

          item.paid
        ),

      0
    );

    return{

      totalWorkers,

      totalSalary,

      totalAdvance,

      totalRemaining,

    };

  },[workers]);

  return(

    <Grid>

      <Card>

        <IconBox color="#2563EB">

          <FiUsers/>

        </IconBox>

        <Content>

          <h2>

            {summary.totalWorkers}

          </h2>

          <p>

            Total Workers

          </p>

        </Content>

      </Card>

      <Card>

        <IconBox color="#16A34A">

          <FiDollarSign/>

        </IconBox>

        <Content>

          <h2>

            ₹{summary.totalSalary.toLocaleString()}

          </h2>

          <p>

            Total Salary

          </p>

        </Content>

      </Card>

      <Card>

        <IconBox color="#F59E0B">

          <FiTrendingUp/>

        </IconBox>

        <Content>

          <h2>

            ₹{summary.totalAdvance.toLocaleString()}

          </h2>

          <p>

            Advance Paid

          </p>

        </Content>

      </Card>

      <Card>

        <IconBox color="#DC2626">

          <FiAlertCircle/>

        </IconBox>

        <Content>

          <h2>

            ₹{summary.totalRemaining.toLocaleString()}

          </h2>

          <p>

            Remaining Salary

          </p>

        </Content>

      </Card>

    </Grid>

  );

};

export default SalarySummary;