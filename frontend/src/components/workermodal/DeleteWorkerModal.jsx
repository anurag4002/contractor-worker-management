import React from "react";

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Footer,
  CancelButton,
  SaveButton,
} from "./WorkerModal.style";

import {
  Message,
  WorkerName,
} from "./DeleteWorkerModal.style";

const DeleteWorkerModal = ({
  open,
  worker,
  onClose,
  onDeleteWorker,
}) => {

  if (!open || !worker) return null;

  const handleDelete = () => {

    onDeleteWorker(worker.id);

    onClose();

  };

  return (

    <Overlay>

      <Modal>

        <Header>

          <Title>

            Delete Worker

          </Title>

          <CloseButton
            onClick={onClose}
          >

            ×

          </CloseButton>

        </Header>

        <Message>

          You are about to permanently delete the following worker.

          <br />
          <br />

          <WorkerName>

            {worker.name}

          </WorkerName>

          <br />

          <strong>

            Worker ID :

          </strong>

          {" "}

          {worker.id}

          <br />

          <strong>

            Mobile :

          </strong>

          {" "}

          {worker.mobile}

          <br />

          <strong>

            Site :

          </strong>

          {" "}

          {worker.site || "-"}

          <br />
          <br />

          <span
            style={{
              color: "#DC2626",
              fontWeight: 600,
            }}
          >

            This action cannot be undone.

          </span>

        </Message>

        <Footer>

          <CancelButton
            type="button"
            onClick={onClose}
          >

            Cancel

          </CancelButton>

          <SaveButton
            type="button"
            onClick={handleDelete}
          >

            Yes, Delete Worker

          </SaveButton>

        </Footer>

      </Modal>

    </Overlay>

  );

};

export default DeleteWorkerModal;