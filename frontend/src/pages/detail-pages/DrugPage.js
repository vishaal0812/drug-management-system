import React, {useEffect, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import {COMMON_LABELS, DRUG_LABELS, PAGE_HEADERS} from "../../helpers/Labels";
import axios from "axios";
import {createInputField} from "../../helpers/InputFieldHelper";
import {useNavigate, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {checkIsValid, checkExpiryDate, FORMAT, validateFields} from "../../helpers/Validations";
import SweetAlert from "react-bootstrap-sweetalert";

export default function DrugPage() {

    const DRUG = DRUG_LABELS;
    const COMMON_LABEL = COMMON_LABELS;
    const params = useParams();
    const navigate = useNavigate();
    const [drugData, setDrugData] = useState({});
    const [cacheData, setCacheData] = useState({});
    const [activeManufactures, setActiveManufactures] = useState({});
    const [manufactures, setManufactures] = useState({});
    const [errors, setErrors] = useState({});
    const [nonEditable, setNonEditable] = useState(true);
    const [alertMessage, setAlertMessage] = useState();
    const requiredFields = ['drugName', 'manufacturer', 'manufacturedDate', 'expiryDate',
        'weight', 'quantityInStock', 'price', 'usageOfDrug'];
    const formatFields = [FORMAT.DRUG_NAME, FORMAT.USAGE_OF_DRUG];

    useEffect(() => {
        if (params.drugId !== 'new') {
            axios(`/getDrug/${params.drugId}`).then(response => {
                setDrugData(response.data);
                setCacheData(response.data);
            });
        }else setNonEditable(false);
        axios('/getAllManufacturers').then(response => setActiveManufactures(response.data));
        axios('/findAllManufacturers').then(response => setManufactures(response.data));
    }, []);

    function handleInput(event) {
        setDrugData({...drugData, [event.target.name] : event.target.value});
    }

    function handleSaveOrUpdate() {
        const dateErrors = checkExpiryDate(drugData);
        const formatErrors = checkIsValid(formatFields, drugData);
        const emptyFieldErrors = validateFields(drugData, requiredFields);
        const errors = {...formatErrors, ...dateErrors, ...emptyFieldErrors}
        setErrors(errors);
        if (Object.keys(errors).length === 0)
            axios.post('/createAndUpdateDrug', drugData)
                .then(() => navigate('/drugs'));
    }

    function handleDelete() {
        console.log(params.drugId)
        axios.post('/deleteDrug', {ids: [params.drugId]})
            .then(() => navigate('/drugs'));
    }

    function handleEdit() {
        const manufacturer = manufactures.filter(manufacturer => manufacturer.id === drugData.manufacturer)[0];
        if (manufacturer['isDeleted']) {
            setAlertMessage(`You cannot modify this drug, Manufacturer ${manufacturer['fullName']} was aldready deleted.`)
        }else {
            setNonEditable(false);
            if (params.drugId !== 'new')
                setDrugData({...drugData, id : params.drugId});
        }
    }

    return (
        <>
            {alertMessage && <SweetAlert onConfirm={() => setAlertMessage(null)} title={alertMessage}/>}
            <Row className='d-flex align-items-center py-0'>
                <Col md={3} className='ps-0'><h5>{PAGE_HEADERS.DRUG_DETAILS}</h5></Col>
                <Col md={9}>
                    <Button size='sm' className='w-auto float-end' variant={nonEditable ? 'secondary' : 'success'}
                            onClick={() => {nonEditable ? handleEdit() : handleSaveOrUpdate()}}>
                        <FontAwesomeIcon icon={nonEditable ? 'edit' : 'circle-check'} className='me-1'/>
                        {nonEditable ? COMMON_LABEL.EDIT : params.drugId !=='new' ? COMMON_LABEL.UPDATE : COMMON_LABEL.SAVE}
                    </Button>
                    <Button size='sm' className='w-auto me-2 float-end' variant='danger'
                            onClick={() => {nonEditable ? handleDelete() :
                                params.drugId === 'new' ? navigate('/drugs') : setNonEditable(true); setDrugData(cacheData)}}>
                        <FontAwesomeIcon icon={nonEditable ? 'trash' : 'times'} className='me-1'/>
                        {nonEditable ? COMMON_LABEL.DELETE : COMMON_LABEL.CANCEL}
                    </Button>
                </Col>
            </Row><hr/>
            <Row id='form-page' className='scrollbar detail-row'>
                <Col md={6}>
                    {createInputField([
                        { label: DRUG.DRUG_NAME, name: 'drugName' },
                        { label: DRUG.MANUFACTURER, name: 'manufacturer', selectLabel: 'companyName',
                            options: nonEditable? manufactures : activeManufactures, value: 'id'},
                        { label: DRUG.MANUFACTURED_DATE, name: 'manufacturedDate', type: 'date' },
                        { label: DRUG.EXPIRY_DATE, name: 'expiryDate', type: 'date' },
                        { label: DRUG.WEIGHT, name: 'weight', type: 'number'},
                        { label: DRUG.PRESCRIPTION, name: 'prescriptionNeed',radios: ['Yes', 'No']}
                    ], handleInput, drugData, errors, nonEditable)}
                </Col>
                <Col md={6}>
                    {createInputField([
                        { label: DRUG.QUANTITY_IN_STOCK, name: 'quantityInStock', type: 'number' },
                        { label: DRUG.PRICE, name: 'price', type: 'number' },
                        { label: DRUG.USAGE_OF_DRUG, name: 'usageOfDrug' },
                        { label: DRUG.BENEFITS_OF_DRUG, name: 'benefitsOfDrug' },
                        { label: DRUG.SIDE_EFFECTS, name: 'sideEffects' }
                    ], handleInput, drugData, errors, nonEditable)}
                </Col>
            </Row>
        </>
    );
}