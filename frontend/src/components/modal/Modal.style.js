import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(15, 23, 42, 0.55);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;

  animation: fade .25s ease;

  @keyframes fade{
    from{
      opacity:0;
    }

    to{
      opacity:1;
    }
  }
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: 38rem;

  background: var(--surface);

  border-radius: 1rem;

  overflow: hidden;

  box-shadow: 0 20px 50px rgba(15,23,42,.2);

  animation: popup .25s ease;

  @keyframes popup{
    from{
      opacity:0;
      transform:translateY(30px);
    }

    to{
      opacity:1;
      transform:translateY(0);
    }
  }

  @media(max-width:768px){
      width:95%;
  }
`;

export const ModalHeader = styled.div`
  padding:1.2rem 1.5rem;

  display:flex;
  justify-content:space-between;
  align-items:center;

  border-bottom:1px solid var(--border);

  h3{
      margin:0;
      color:var(--text);
      font-size:1.2rem;
  }
`;

export const CloseButton = styled.button`
  width:2.5rem;
  height:2.5rem;

  border:none;

  border-radius:.75rem;

  background:var(--surface-hover);

  cursor:pointer;

  font-size:1.2rem;

  transition:.3s;

  &:hover{
       background: var(--primary);
       color: var(--text-on-primary);
  }
`;

export const ModalBody = styled.div`
  padding:1.5rem;
`;

export const ModalFooter = styled.div`
  padding:1.2rem 1.5rem;

  display:flex;
  justify-content:flex-end;
  gap:1rem;

  border-top:1px solid var(--border);
`;

export const Button = styled.button`
  border:none;

  padding:.9rem 1.5rem;

  border-radius:.8rem;

  cursor:pointer;

  font-weight:600;

  transition:.3s;

  background:${({ variant }) =>
    variant === "primary"
      ? "var(--primary)"
      : "var(--border)"};

  color:${({ variant }) =>
    variant === "primary"
      ? "var(--text-on-primary)"
      : "var(--text)"};

  &:hover{
      opacity:.9;
  }
`;