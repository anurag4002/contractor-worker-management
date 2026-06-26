import React, { useState } from "react";

import {
  Form,
  Row,
  FormGroup,
  ImagePreview,
} from "./WorkerForm.style";

const WorkerForm = ({
  initialValues = {},
  onChange,
}) => {

  const [preview,setPreview]=useState(
    initialValues.photo || ""
  );

  const handleImage=(e)=>{

    const file=e.target.files[0];

    if(!file) return;

    const url=URL.createObjectURL(file);

    setPreview(url);

    onChange("photo",url);

  };

  return(

    <Form>

      <Row>

        <FormGroup>

          <label>Worker Name</label>

          <input
            type="text"
            defaultValue={initialValues.name}
            onChange={(e)=>
              onChange("name",e.target.value)
            }
          />

        </FormGroup>

        <FormGroup>

          <label>Mobile Number</label>

          <input
            type="text"
            defaultValue={initialValues.phone}
            onChange={(e)=>
              onChange("phone",e.target.value)
            }
          />

        </FormGroup>

      </Row>

      <Row>

        <FormGroup>

          <label>Skill</label>

          <select
            defaultValue={initialValues.skill}
            onChange={(e)=>
              onChange("skill",e.target.value)
            }
          >

            <option>Mason</option>

            <option>Electrician</option>

            <option>Plumber</option>

            <option>Painter</option>

            <option>Helper</option>

          </select>

        </FormGroup>

        <FormGroup>

          <label>Daily Wage</label>

          <input
            type="number"
            defaultValue={initialValues.dailyWage}
            onChange={(e)=>
              onChange("dailyWage",e.target.value)
            }
          />

        </FormGroup>

      </Row>

      <Row>

        <FormGroup>

          <label>Site</label>

          <input
            type="text"
            defaultValue={initialValues.site}
            onChange={(e)=>
              onChange("site",e.target.value)
            }
          />

        </FormGroup>

        <FormGroup>

          <label>Joining Date</label>

          <input
            type="date"
            defaultValue={initialValues.joiningDate}
            onChange={(e)=>
              onChange("joiningDate",e.target.value)
            }
          />

        </FormGroup>

      </Row>

      <FormGroup>

        <label>Worker Photo</label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

      </FormGroup>

      <ImagePreview>

        {preview ? (

          <img
            src={preview}
            alt="preview"
          />

        ) : (

          <span>No Image</span>

        )}

      </ImagePreview>

    </Form>

  );

};

export default WorkerForm;