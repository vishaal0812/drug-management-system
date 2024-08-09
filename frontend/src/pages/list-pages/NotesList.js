import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button, Col, Form, Row, Card, DropdownButton, Dropdown} from "react-bootstrap";
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

    function handleDelete(noteId) {
        axios.post('/deleteNote', {ids: [noteId]})
            .then(() => getAllNotes());
    }

    function getAllNotes() {
        axios('/getAllNotes').then((response) => {
            const notes = response.data.sort((a, b) => {return(b.id - a.id)});
            setNotes(notes);
        });
    }

    function handleSaveOrUpdate() {
        axios.post('/createOrUpdateNote', newNote)
            .then(() => {
                getAllNotes();
                setNewNote({});
            });
    }

    function handleEdit(noteId) {
        const selectedNote = notes.filter((note) => note.id === noteId);
        setNewNote(selectedNote[0]);
    }

    return(
        <Row>
            <Col md={8}>
                <div className='scrollbar' style={{height: '60vh'}}>
                    {Array(Math.round(notes.length / 2)).fill(null).map((_, index) => (
                        <div key={index} className='d-flex'>
                            <ActionDropdown index={index * 2} notes={notes} handleEdit={handleEdit} handleDelete={handleDelete}/>
                            {notes[index * 2 + 1] &&
                                <ActionDropdown index={index * 2 + 1} notes={notes} handleEdit={handleEdit}  handleDelete={handleDelete}/>}
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
                            variant='secondary'
                            icon='trash'
                            onClick={() => {
                                checkedRows.current = [newNote['id']];
                                setNewNote({});
                                handleDelete(newNote['id']);
                            }}
                            toolTip='delete'/>}
                    </Col>
                </Row>
                <Form.Control
                    className='mb-2'
                    as='textarea'
                    value={newNote['note'] || ''}
                    rows={12}
                    onChange={(event) => {setNewNote({...newNote, note : event.target.value}); console.log('NOTE : ', newNote)}}/>
                <Button className='float-end' variant='success' size='sm' disabled={!newNote['note']} onClick={() => handleSaveOrUpdate()}>
                    <FontAwesomeIcon className='me-1' icon='check'/>{newNote['id'] ? 'update' : 'save'}</Button>
                <Button className='float-end me-1' variant='danger' size='sm' onClick={() => setNewNote({})}>
                    <FontAwesomeIcon className='me-1' icon='times'/>cancel</Button>
            </Col>
        </Row>
    );
}

const ActionDropdown = ({index, notes, handleEdit, handleDelete}) => {
    return (
        <Card onDoubleClick={() => handleEdit(notes[index].id)} className='notes-card w-50 mx-1'>
            <div>
                <DropdownButton position='left' className="float-end" variant="default" size='sm' title={<FontAwesomeIcon icon='list' />}>
                    <Dropdown.Item onClick={() => handleEdit(notes[index].id)}>
                        <FontAwesomeIcon style={{ color: 'grey' }} className="me-1" icon='edit' />Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(notes[index].id)}>
                        <FontAwesomeIcon style={{ color: 'red' }} variant='danger'  className="me-1" icon='trash' />Delete
                    </Dropdown.Item>
                </DropdownButton>
            </div>
            <Card.Body className='scrollbar'>{notes[index].note}</Card.Body>
        </Card>
    );
};