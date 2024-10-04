import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import {COMMON_LABELS, PAGE_HEADERS} from "../../helpers/Labels";
import axios from "axios";
import {states} from "../../helpers/IndianStates";
import {createInputField} from "../../helpers/InputFieldHelper";
import {useParams, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {checkIsValid, FORMAT, validateFields} from "../../helpers/Validations";
import PageLoader from "../../components/PageLoader";

export default function ManufacturerPage() {

    const COMMON_LABEL = COMMON_LABELS;
    const params = useParams();
    const navigate = useNavigate();
    const [pageLoading, setPageLoading] = useState(true);
    const [manufacturerData, setManufacturerData] = useState({});
    const [cacheData, setCacheData] = useState({});
    const [errors, setErrors] = useState({});
    const [nonEditable, setNonEditable] = useState(true);
    const requiredFields = ['firstName', 'lastName', 'email', 'companyName',
        'tinNumber', 'addressLine1', 'city', 'state', 'pinCode'];
    const formatFields = [FORMAT.FIRST_NAME, FORMAT.LAST_NAME, FORMAT.EMAIL,
        FORMAT.CITY, FORMAT.PIN_CODE, FORMAT.COMPANY_NAME, FORMAT.TIN_NO];

    useEffect(() => {
        if (params.manufacturerId !== 'new') {
            setManufacturerData({...manufacturerData, id : params.manufacturerId});
            axios(`/getManufacturers/${params.manufacturerId}`)
                .then(response => {
                    setManufacturerData(response.data);
                    setCacheData(response.data);
                });
        }else setNonEditable(false);
        setPageLoading(false);
    }, []);

    function handleInput(event) {
        setManufacturerData({...manufacturerData, [event.target.name] : event.target.value});
    }

    function handleSaveOrUpdate() {
        const formatErrors = checkIsValid(formatFields, manufacturerData);
        const emptyFieldErrors = validateFields(manufacturerData, requiredFields);
        const errors = {...formatErrors, ...emptyFieldErrors}
        setErrors(errors);
        console.log('outSide', errors);
        if (Object.keys(errors).length === 0) {
            console.log('inSide');
            axios.post('/createAndUpdateManufacturer', manufacturerData)
                .then(() => navigate('/manufacturers'));
        }
    }

    function handleDelete() {
        axios.post('/deleteManufacturer', {ids: [params.manufacturerId]})
            .then(() => navigate('/manufacturers'));
    }

    return (
        <>
            <Row className='d-flex align-items-center py-0'>
                <Col md={3} className='ps-0'><h5>{PAGE_HEADERS.MANUFACTURER_DETAILS}</h5></Col>
                <Col md={9}>
                    <Button size='sm' className='w-auto float-end' variant={nonEditable ? 'secondary' : 'success'}
                            onClick={() => {
                                nonEditable ? setNonEditable(false) : handleSaveOrUpdate()
                            }}>
                        <FontAwesomeIcon icon={nonEditable ? 'edit' : 'circle-check'} className='me-1'/>
                        {nonEditable ? COMMON_LABEL.EDIT : params.manufacturerId !== 'new' ? COMMON_LABEL.UPDATE : COMMON_LABEL.SAVE}
                    </Button>
                    <Button size='sm' className='w-auto me-2 float-end' variant='danger'
                            onClick={() => {nonEditable ? handleDelete() :
                                    params.manufacturerId === 'new' ? navigate('/manufacturers') :
                                    setManufacturerData(cacheData); setNonEditable(true)}}>
                        <FontAwesomeIcon icon={nonEditable ? 'trash' : 'times'} className='me-1'/>
                        {nonEditable ? COMMON_LABEL.DELETE : COMMON_LABEL.CANCEL}
                    </Button>
                </Col>
            </Row><hr/>
            <Row id='form-page' className='scrollbar detail-row'>
                <Col md={6}>
                    {createInputField([
                        { label: COMMON_LABEL.FIRST_NAME, name: 'firstName'},
                        { label: COMMON_LABEL.MIDDLE_NAME, name: 'middleName'},
                        { label: COMMON_LABEL.LAST_NAME, name: 'lastName' },
                        { label: COMMON_LABEL.EMAIL, name: 'email' },
                        { label: COMMON_LABEL.MANUFACTURER.COMPANY_NAME, name: 'companyName' },
                        { label: COMMON_LABEL.MANUFACTURER.TIN_NUMBER, name: 'tinNumber' },
                    ], handleInput, manufacturerData, errors, nonEditable)}
                </Col>
                <Col md={6}>
                    {createInputField([
                        { label: COMMON_LABEL.ADDRESS.ADDRESS_LINE1, name: 'addressLine1' },
                        { label: COMMON_LABEL.ADDRESS.ADDRESS_LINE2, name: 'addressLine2' },
                        { label: COMMON_LABEL.ADDRESS.CITY, name: 'city' },
                        { label: COMMON_LABEL.ADDRESS.STATE, name: 'state', options: states, selectLabel: 'label', value: 'value'},
                        { label: COMMON_LABEL.ADDRESS.PIN_CODE, name: 'pinCode'}
                    ], handleInput, manufacturerData, errors, nonEditable)}
                </Col>
            </Row>
        </>
    );
}