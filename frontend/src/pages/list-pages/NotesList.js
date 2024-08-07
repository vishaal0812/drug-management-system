import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button, Col, Form, Row, Card} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import IconButton from "../../components/IconButton";
import axios from "axios";
import {createColumnHelper} from "@tanstack/react-table";
import TanStackCheckbox from "../../components/tanstack-table/TanStackCheckbox";

export default function NotesList() {

    const [rowChecked, setRowChecked] = useState(false);
    const [newNote, setNewNote] = useState({});
    const [notes, setNotes] = useState([]);
    const checkedRows = useRef([]);

    useEffect(() => {
        getAllNotes();
    }, []);

    function handleCheckBox(row) {
        const rowId = row.original.id;
        if (checkedRows.current.includes(rowId)) {
            checkedRows.current = checkedRows.current.filter(existId => existId !== rowId);
        } else {
            checkedRows.current = [...checkedRows.current, rowId];
        }
        setRowChecked(checkedRows.current.length > 0)
    }

    function handleDelete() {
        axios.post('/deleteNote', {ids: checkedRows.current})
            .then(() => getAllNotes());
    }

    function getAllNotes() {
        axios('/getAllNotes')
            .then((response) => setNotes(response.data));
    }

    function handleSaveOrUpdate() {
        axios.post('/createOrUpdateNote', newNote)
            .then(() => {
                getAllNotes();
                setNewNote({});
            });
    }

    const handleRowProps = (row) => ({
        onClick: () => setNewNote(row.original)
    })

    return(
        <Row>
            <Col md={8} className='border-end'>
                <div className='scrollbar' style={{height: '56vh'}}>
                    {Array(Math.round(notes.length / 2)).fill(null).map((_, index) => (
                        <div key={index} className='d-flex'>
                            <Card className='notes-card w-50 mx-1'>
                                <div><FontAwesomeIcon className='float-end m-1 me-2' icon='list'/></div>
                                <Card.Body className='scrollbar'>{notes[index * 2].note}</Card.Body>
                            </Card>
                            {notes[index * 2 + 1] && <Card className='notes-card w-50 mx-1'>
                                <div><FontAwesomeIcon className='float-end m-1 me-2' icon='list'/></div>
                                <Card.Body className='scrollbar'>{notes[index * 2].note}</Card.Body>
                            </Card>}
                        </div>
                    ))}
                </div>
            </Col>
            <Col md={4}>
                <Row>
                    <Col><Form.Label className='fw-bold'>ADD NOTE</Form.Label></Col>
                    <Col>
                        {newNote['id'] && <IconButton
                            className='float-end'
                            variant='falcon-danger'
                            icon='trash'
                            onClick={() => {
                                checkedRows.current = [newNote['id']];
                                setNewNote({});
                                handleDelete();
                            }}
                            toolTip='delete'/>}
                    </Col>
                </Row>
                <Form.Control
                    className='mb-1'
                    as='textarea'
                    value={newNote['note'] || ''}
                    rows={12}
                    onChange={(event) => setNewNote({...newNote, note : event.target.value})}/>
                <Button className='float-end' variant='success' size='sm' onClick={() => handleSaveOrUpdate()}>
                    <FontAwesomeIcon className='me-1' icon='check'/>save</Button>
                <Button className='float-end me-1' variant='danger' size='sm' onClick={() => setNewNote({})}>
                    <FontAwesomeIcon className='me-1' icon='times'/>cancel</Button>
            </Col>
        </Row>
    );
}