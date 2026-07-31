import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2,1fr);
  gap: 1rem;

  @media(max-width:768px){
    grid-template-columns:1fr;
  }
`;

export const FormGroup = styled.div`
  display:flex;
  flex-direction:column;
  gap:.5rem;

  label{
    color:var(--text);
    font-size:.9rem;
    font-weight:600;
  }

  input,
  select{
    width:100%;
    padding:.9rem 1rem;

    border:1px solid var(--input-border);

    border-radius:.8rem;

    outline:none;

    font-size:.95rem;

    transition:.3s;

    &:focus{
      border-color:var(--primary);
    }
  }
`;

export const ImagePreview = styled.div`
  width:7rem;
  height:7rem;

  border-radius:1rem;

  border:2px dashed var(--input-border);

  display:flex;
  justify-content:center;
  align-items:center;

  overflow:hidden;

  img{
    width:100%;
    height:100%;
    object-fit:cover;
  }

  span{
    color:var(--text-secondary);
    font-size:.8rem;
  }
`;