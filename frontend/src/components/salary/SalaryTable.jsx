import React from "react";

import {
  FiDollarSign,
  FiClock,
  FiFileText,
  FiEdit2,
} from "react-icons/fi";

import {
  TableCard,
  Table,
  Status,
  PaymentButton,
} from "../../pages/salary/Salary.style";

const SalaryTable = ({
  workers,
  onPaySalary,
  onAdvance,
  onHistory,
  onEdit,
}) => {

  return (

    <TableCard>

      <Table>

        <thead>

          <tr>

            <th>Worker</th>

            <th>Site</th>

            <th>Daily Wage</th>

            <th>Days</th>

            <th>Total Salary</th>

            <th>Advance</th>

            <th>Paid</th>

            <th>Remaining</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {

            workers.length === 0

            ?

            <tr>

              <td
                colSpan="10"
                style={{
                  textAlign:"center",
                  padding:"2rem",
                  color:"#64748B"
                }}
              >

                No Salary Records Found

              </td>

            </tr>

            :

            workers.map((worker)=>{

              const totalSalary =
                worker.dailyWage *
                worker.daysWorked;

              const remaining =
                totalSalary -
                worker.advance -
                worker.paid;

              return(

                <tr key={worker.id}>

                  <td>

                    <strong>

                      {worker.name}

                    </strong>

                    <br/>

                    <small>

                      {worker.id}

                    </small>

                  </td>

                  <td>

                    {worker.site}

                  </td>

                  <td>

                    ₹{worker.dailyWage}

                  </td>

                  <td>

                    {worker.daysWorked}

                  </td>

                  <td>

                    ₹{totalSalary}

                  </td>

                  <td>

                    ₹{worker.advance}

                  </td>

                  <td>

                    ₹{worker.paid}

                  </td>

                  <td
                    style={{
                      color:
                        remaining>0
                        ? "#DC2626"
                        : "#16A34A",
                      fontWeight:"600"
                    }}
                  >

                    ₹{remaining}

                  </td>

                  <td>

                    <Status
                      status={worker.status}
                    >

                      {worker.status}

                    </Status>

                  </td>

                  <td>

                    <div
                      style={{
                        display:"flex",
                        gap:".5rem",
                        flexWrap:"wrap"
                      }}
                    >

                      {

                        worker.status==="Pending"

                        &&

                        <PaymentButton
                          onClick={()=>
                            onPaySalary(worker)
                          }
                        >

                          <FiDollarSign/>

                        </PaymentButton>

                      }

                      <PaymentButton
                        onClick={()=>
                          onAdvance(worker)
                        }
                      >

                        <FiClock/>

                      </PaymentButton>

                      <PaymentButton
                        onClick={()=>
                          onHistory(worker)
                        }
                      >

                        <FiFileText/>

                      </PaymentButton>

                      <PaymentButton
                        onClick={()=>
                          onEdit(worker)
                        }
                      >

                        <FiEdit2/>

                      </PaymentButton>

                    </div>

                  </td>

                </tr>

              );

            })

          }

        </tbody>

      </Table>

    </TableCard>

  );

};

export default SalaryTable;