import React from "react";

import Modal from "../modal/Modal";

import {
  FiDollarSign,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const PaymentHistoryModal = ({
  open,
  worker,
  onClose,
}) => {

  if (!worker) return null;

  const history = [

    {
      id: 1,
      date: "01 Jun 2026",
      type: "Advance",
      amount: 3000,
    },

    {
      id: 2,
      date: "10 Jun 2026",
      type: "Advance",
      amount: 2000,
    },

    {
      id: 3,
      date: "30 Jun 2026",
      type: "Salary Paid",
      amount: worker.paid,
    },

  ];

  return (

    <Modal
      open={open}
      title="Payment History"
      submitText="Close"
      onClose={onClose}
      onSubmit={onClose}
    >

      <div
        style={{
          display:"flex",
          flexDirection:"column",
          gap:"1rem",
        }}
      >

        <div
          style={{
            padding:"1rem",
            borderRadius:"12px",
            background:"#EFF6FF",
          }}
        >

          <h3
            style={{
              margin:0,
              color:"#0F172A",
            }}
          >

            {worker.name}

          </h3>

          <p
            style={{
              marginTop:".4rem",
              color:"#64748B",
            }}
          >

            {worker.id}

          </p>

        </div>

        {

          history.map((item)=>(

            <div

              key={item.id}

              style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                padding:"1rem",
                border:"1px solid #E2E8F0",
                borderRadius:"12px",
              }}

            >

              <div
                style={{
                  display:"flex",
                  alignItems:"center",
                  gap:"1rem",
                }}
              >

                <div
                  style={{
                    width:"45px",
                    height:"45px",
                    borderRadius:"50%",
                    background:
                      item.type==="Advance"
                      ? "#FEF3C7"
                      : "#DCFCE7",

                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                  }}
                >

                  {

                    item.type==="Advance"

                    ?

                    <FiClock color="#D97706"/>

                    :

                    <FiCheckCircle color="#16A34A"/>

                  }

                </div>

                <div>

                  <strong>

                    {item.type}

                  </strong>

                  <br/>

                  <small
                    style={{
                      color:"#64748B",
                    }}
                  >

                    {item.date}

                  </small>

                </div>

              </div>

              <div
                style={{
                  fontWeight:"700",
                  color:"#2563EB",
                }}
              >

                ₹{item.amount}

              </div>

            </div>

          ))

        }

        <div
          style={{
            marginTop:"1rem",
            padding:"1rem",
            background:"#F8FAFC",
            borderRadius:"12px",
            display:"flex",
            justifyContent:"space-between",
            fontWeight:"700",
          }}
        >

          <span>

            Total Paid

          </span>

          <span>

            ₹{

              history.reduce(
                (sum,item)=>
                  sum+item.amount,
                0
              )

            }

          </span>

        </div>

      </div>

    </Modal>

  );

};

export default PaymentHistoryModal;