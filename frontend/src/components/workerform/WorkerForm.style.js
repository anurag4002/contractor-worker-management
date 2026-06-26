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
    color:#334155;
    font-size:.9rem;
    font-weight:600;
  }

  input,
  select{
    width:100%;
    padding:.9rem 1rem;

    border:1px solid #CBD5E1;

    border-radius:.8rem;

    outline:none;

    font-size:.95rem;

    transition:.3s;

    &:focus{
      border-color:#2563EB;
    }
  }
`;

export const ImagePreview = styled.div`
  width:7rem;
  height:7rem;

  border-radius:1rem;

  border:2px dashed #CBD5E1;

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
    color:#94A3B8;
    font-size:.8rem;
  }
`;