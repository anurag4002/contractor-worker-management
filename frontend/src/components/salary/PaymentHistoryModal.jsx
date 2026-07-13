import React from "react";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Body,
  Table,
  EmptyState,
  Footer,
  Button,
} from "./PaymentHistoryModal.style";

const PaymentHistoryModal = ({
  open,
  worker,
  onClose,
}) => {

  if (!open || !worker) return null;

  const history = worker.paymentHistory || [];

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Payment History

          </Title>

          <CloseButton
            onClick={onClose}
          >

            ×

          </CloseButton>

        </Header>

        <Body>

          <div
            style={{
              marginBottom: "1.5rem",
            }}
          >

            <h3
              style={{
                marginBottom: ".25rem",
              }}
            >

              {worker.name}

            </h3>

            <p
              style={{
                margin: 0,
                color: "#64748B",
              }}
            >

              Worker ID : {worker.id}

            </p>

            <p
              style={{
                margin: ".25rem 0 0",
                color: "#64748B",
              }}
            >

              Site : {worker.site || "-"}

            </p>

          </div>

          {

            history.length === 0 ? (

              <EmptyState>

                No payment history available.

              </EmptyState>

            ) : (

              <Table>

                <thead>

                  <tr>

                    <th>Payment ID</th>

                    <th>Date</th>

                    <th>Amount</th>

                    <th>Method</th>

                    <th>Transaction ID</th>

                    <th>Remark</th>

                  </tr>

                </thead>

                <tbody>

                  {

                    history.map((item, index) => (

                      <tr
                        key={
                          item.paymentId ||
                          item.id ||
                          index
                        }
                      >

                        <td>

                          {

                            item.paymentId ||

                            item.id ||

                            `PAY-${String(index + 1).padStart(4, "0")}`

                          }

                        </td>

                        <td>

                          {

                            item.date

                              ? new Date(
                                  item.date
                                ).toLocaleDateString("en-IN")

                              : "-"

                          }

                        </td>

                        <td>

                          ₹{

                            Number(
                              item.amount || 0
                            ).toLocaleString("en-IN")

                          }

                        </td>

                        <td>

                          {item.method || "-"}

                        </td>

                        <td>

                          {

                            item.transactionId ||

                            "-"

                          }

                        </td>

                        <td>

                          {

                            item.remark ||

                            "-"

                          }

                        </td>

                      </tr>

                    ))

                  }

                </tbody>

              </Table>

            )

          }

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

export default PaymentHistoryModal;