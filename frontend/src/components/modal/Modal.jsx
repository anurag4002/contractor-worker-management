import React from "react";

import {
  Overlay,
  ModalCard,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CloseButton,
  Button,
} from "./Modal.style";

const Modal = ({
  open,
  title,
  children,
  onClose,
  onSubmit,
  submitText = "Save",
}) => {

  if (!open) return null;

  return (
    <Overlay>

      <ModalCard>

        <ModalHeader>

          <h3>{title}</h3>

          <CloseButton
            onClick={onClose}
          >
            ✕

          </CloseButton>

        </ModalHeader>

        <ModalBody>

          {children}

        </ModalBody>

        <ModalFooter>

          <Button
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={onSubmit}
          >
            {submitText}
          </Button>

        </ModalFooter>

      </ModalCard>

    </Overlay>
  );
};

export default Modal;