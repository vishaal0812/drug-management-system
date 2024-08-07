import {Col, Form, Row} from "react-bootstrap";
import React from "react";

export function createInputField(fields, handleInput, data, errors, nonEditable) {

    return fields.map((field, index) => (
        <Row key={index}>
            <Col md={4}><Form.Label column={4}>{field.label}</Form.Label></Col>
            <Col>
                {field.options ? <Form.Select
                    name={field.name}
                    disabled={nonEditable}
                    value={data[field.name] || ''}
                    onChange={(event) => handleInput(event)}>
                    <option value={null}></option>
                    {field.options.length > 0 && field.options.map((option, index) => (
                        <option key={index} value={option[field.value]}>{option[field.selectLabel]}</option>))}
                </Form.Select> : field.radios ?
                    <div className='d-flex justify-content-center'>{field.radios.map((radio, index) => (
                        <Form.Check
                            key={index}
                            type="radio"
                            className='me-5'
                            disabled={nonEditable}
                            value={field.radios[index]}
                            label={field.radios[index]}
                            name={field.name}
                            checked={data[field.name] === field.radios[index]}
                            onChange={(event) => handleInput(event)}
                        />))}
                    </div> :
                    <Form.Control
                        name={field.name}
                        disabled={nonEditable}
                        type={field.type || 'text'}
                        value={data[field.name] || field.default}
                        readOnly={field.readOnly}
                        onChange={(event) => handleInput(event)}/>}
                <span className='error-msg'>{errors[field.name]}</span>
            </Col>
        </Row>)
    );
}