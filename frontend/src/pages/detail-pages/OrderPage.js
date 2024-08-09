import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Image, Modal, Row} from "react-bootstrap";
import {BANKS, COMMON_LABELS, ORDER_LABELS, PAGE_HEADERS} from "../../helpers/Labels";
import axios from "axios";
import {createInputField} from "../../helpers/InputFieldHelper";
import {useNavigate, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SweetAlert from "react-bootstrap-sweetalert";
import IconButton from "../../components/IconButton";
import {validateFields} from "../../helpers/Validations";
import PageLoader from "../../components/PageLoader";
import TanStackTable from "../../components/tanstack-table/TanStackTable";
import {createColumnHelper} from "@tanstack/react-table";

export default function OrderPage() {

    const LABEL = ORDER_LABELS;
    const COMMON = COMMON_LABELS;
    const BANK = BANKS;
    const params = useParams();
    const navigate = useNavigate();

    const paymentOptions = [
        {label: BANK.PAYMENT_MODE.CASH, value: 'Cash'},
        {label: BANK.PAYMENT_MODE.UPI, value: 'UPI'},
        {label: BANK.PAYMENT_MODE.CARD, value: 'Card'}];
    const requiredFields = ['customer', 'paymentMode', 'drugs'];

    const [drugs, setDrugs] = useState([]);
    const [errors, setErrors] =useState({});
    const [newDrug, setNewDrug] =useState({});
    const [editDrug, setEditDrug] =useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [nonEditable, setNonEditable] = useState(true);
    const [orderData, setOrderData] = useState({dateOfPurchase: new Date().toISOString().substring(0, 10)});
    const [customers, setCustomers] = useState([]);
    const [activeCustomers, setActiveCustomers] = useState([]);
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const [showDrugModal, setShowDrugModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [editRowId, setEditRowId] = useState(null);

    useEffect(() => {
        if (params.orderId !== 'new') {
            getOrderData();
            setOrderData({...orderData, id : params.orderId});
        }else setNonEditable(false);
        axios('/findAllCustomers').then(response => {
            setCustomers(response.data);
            setActiveCustomers(response.data.filter(customer => !customer.isDeleted))
        });
        axios('/getAllDrugs').then(response => {setDrugs(response.data.filter(drug => drug.quantityInStock > 0))});
        setPageLoading(false);
    }, []);

    const data = React.useMemo(() => selectedDrugs, [selectedDrugs]);
    const columnHelper = createColumnHelper();
    const columns = useMemo(() => [
        columnHelper.accessor('drug.drugName', {
            header: 'DRUG NAME',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('quantity', {
            header: 'QUANTITY',
            cell: info => info.getValue()
        }),
        columnHelper.accessor('drug.price', {
            header: 'PRICE',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('amount', {
            header: 'AMOUNT',
            cell: cell => cell.getValue()
        }),{
            id: 'delete',
            header: '',
            cell: ({ row }) => (
                <IconButton
                    icon='times' variant='falcon-danger' disabled={nonEditable}
                    toolTip='remove' onClick={() => handleRemoveDrug(row)}/>
            )
        }
    ], [nonEditable]);

    function getOrderData() {
        if (params.orderId !== 'new') {
            axios(`/getOrder/${params.orderId}`).then(response => {
                setOrderData(response.data);
                setSelectedDrugs(response.data.drugs);
            });
        }
    }

    function handleInput(event) {
        setOrderData({...orderData, [event.target.name] : event.target.value})
    }

    function handleEditDrug(row) {
        const values = row.original;
        setNewDrug({drugId: values.drugId, quantity: values.quantity});
        setShowDrugModal(true);
        setEditDrug(true);
    }

    function handlePlaceOrUpdateOrder() {
        let data = {...orderData};
        if (selectedDrugs.length > 0){
            data = {...orderData, drugs: selectedDrugs};
            setOrderData(data);
        }
        const errors = validateFields(data, requiredFields);
        setErrors(errors);
        if (Object.keys(errors).length === 0)
            setShowPaymentModal(true);
    }

    function handlePayment(paymentStatus) {
        let errors=[];
        if (orderData.paymentMode === 'Card') {
            errors = validateFields(orderData, ['cardNumber', 'expiryDate', 'cvv']);
            setErrors(errors.length === 0 ? [] : errors);
        }
        if (Object.keys(errors).length === 0) {
            setPageLoading(true);
            let data = {...orderData, paymentStatus: paymentStatus};
            axios.post('/createAndUpdateOrder', data)
                .then(() => {
                    navigate('/orders');
                    setPageLoading(false);
                });
        }
    }

    function handleAddDrug() {
        if (newDrug.drugId && newDrug.quantity > 0) {
            const isExist = selectedDrugs.some(item => item.drugId === Number(newDrug.drugId));
            let selectedDrug = {}, preData;
            if (isExist) {
                preData = selectedDrugs.filter(drug => drug.drugId === Number(newDrug.drugId))[0];
                selectedDrug = selectedDrugs.filter(drug => drug.drugId === Number(newDrug.drugId)).map(drug => drug.drug)[0];
                const addedQuantity = newDrug.drugId === editRowId ? newDrug.quantity : preData.quantity + newDrug.quantity;
                preData = {...preData, quantity: addedQuantity, amount: addedQuantity * selectedDrug.price}
            }else {
                selectedDrug = drugs.filter(drug => drug.id === Number(newDrug.drugId))[0];
                preData = {drugId: selectedDrug.id, drug: selectedDrug, quantity: newDrug.quantity, amount: newDrug.quantity * selectedDrug.price}
            }
            const finalList = [...selectedDrugs.filter(drug => drug.drugId !== selectedDrug.id), preData];
            const amount = finalList.reduce((total, drug) => total + drug.amount, 0);
            const tax = amount / 100 * 18;
            if (preData.drug.quantityInStock >= newDrug.quantity) {
                setSelectedDrugs(finalList);
                setShowDrugModal(false);
                setOrderData({...orderData, netAmount: amount, tax: tax.toFixed(2), totalAmount: amount + tax});
            }else setErrors({quantity: `Quantity out of stock, Only ${preData.drug.quantityInStock} stocks are available`});
        }else {
            setErrors(validateFields(newDrug, ['drug', 'quantity']));
        }
    }

    function handleRemoveDrug(row) {
        const id = row.original.drugId;
        const drugList = selectedDrugs.filter(drug => drug.drugId !== id);
        const amount = drugList.reduce((total, drug) => total + drug.amount, 0);
        const tax = amount / 100 * 18;
        setOrderData({...orderData, netAmount: amount, tax: tax.toFixed(2), totalAmount: amount + tax});
        setSelectedDrugs(drugList);
    }

    const handelPaymentPopup = (
        <Modal centered show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{orderData.paymentMode === 'UPI' ? BANK.SCANNER : BANK.CARD_DETAILS}</Modal.Title>
            </Modal.Header>
            <Modal.Body id='form-page'>
                <Row>
                    {orderData.paymentMode === 'UPI' ?
                        <Col className='d-flex justify-content-center'>
                            <Image alt='QRCode' width='300px' height='300px' src={require("../../assets/img/payment_qr_code.png")}/>
                        </Col> :
                        <>
                            <Row>
                                <Col md={5}><Form.Label>{BANK.CARD_NUMBER}</Form.Label></Col>
                                <Col>
                                    <Form.Control
                                        name='cardNumber'
                                        value={orderData.cardNumber}
                                        onChange={(event) => handleInput(event)}/>
                                        <span className='error-msg'>{errors['cardNumber']}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={5}><Form.Label>{BANK.CARD_EXPIRY_DATE}</Form.Label></Col>
                                <Col>
                                    <Form.Control
                                        name='expiryDate'
                                        value={orderData.expiryDate}
                                        type='date'
                                        onChange={(event) => handleInput(event)}/>
                                        <span className='error-msg'>{errors['expiryDate']}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={5}><Form.Label>{BANK.CVV}</Form.Label></Col>
                                <Col>
                                    <Form.Control
                                        name='cvv'
                                        value={orderData.cvv}
                                        onChange={(event) => handleInput(event)}/>
                                        <span className='error-msg'>{errors['cvv']}</span>
                                </Col>
                            </Row>
                        </>
                    }
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button size='sm' variant='danger' onClick={() => setShowPaymentModal(false)}><FontAwesomeIcon icon="times" className='me-1'/>{COMMON.CANCEL}</Button>
                <Button size='sm' variant='secondary' onClick={() => handlePayment('Pending')}><FontAwesomeIcon icon="clock" className='me-1'/>{BANKS.PAY_LATER}</Button>
                <Button size='sm' variant='success' onClick={() => handlePayment('Paid')}><FontAwesomeIcon icon="money-bill" className='me-1'/>{BANKS.PAID}</Button>
            </Modal.Footer>
        </Modal>
    );

    const addDrugModal = (
        <Modal centered show={showDrugModal} onHide={() => {setShowDrugModal(false); setEditRowId(null);}}>
            <Modal.Header closeButton>
                <Modal.Title>{LABEL.ADD_DRUG}</Modal.Title>
            </Modal.Header>
            <Modal.Body id='form-page'>
                <Row>
                    <Col md={4}><Form.Label>{ORDER_LABELS.DRUG}</Form.Label></Col>
                    <Col>
                        <Form.Select
                            name='drug'
                            value={newDrug.drugId}
                            disabled={editDrug}
                            onChange={(event) => {
                                setNewDrug({...newDrug, drugId: event.target.value})
                            }}>
                            <option value={null}/>
                            {drugs.map((drug, index) => (
                                <option key={index} value={drug.id}>{drug.drugName}</option>
                            ))}
                        </Form.Select><span className='error-msg'>{errors['drug']}</span>
                    </Col>
                </Row>
                <Row>
                <Col md={4}><Form.Label>{ORDER_LABELS.QUANTITY}</Form.Label></Col>
                    <Col>
                        <Form.Control
                            name='quantity'
                            type='number'
                            value={newDrug.quantity}
                            onChange={(event) => {
                                setNewDrug({...newDrug, quantity: Number(event.target.value)})
                            }}/>
                        <span className='error-msg'>{errors['quantity']}</span>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button size='sm' variant='danger' onClick={() => {
                    setNewDrug({});
                    setShowDrugModal(false);
                }}><FontAwesomeIcon icon="times" className='me-1'/>{COMMON.CANCEL}</Button>
                <Button size='sm' variant='success' onClick={() => handleAddDrug()}>
                    <FontAwesomeIcon icon='check' className='me-1'/>
                    {ORDER_LABELS.ADD_DRUG}
                </Button>
            </Modal.Footer>
        </Modal>
    );

    function handleDelete() {
        axios.delete('/deleteOrder', {data: {ids: [params.orderId]}})
            .then(() => navigate('/orders'));
    }

    const handleRowProps = (row) => ({
        onDoubleClick: () => {
            if (!nonEditable) {
                handleEditDrug(row);
                setEditRowId(row.original.drugId);
            }
        }
    });

    return (
        <>
            {addDrugModal}
            {handelPaymentPopup}
            {alertMessage &&
                <SweetAlert
                    title={alertMessage}
                    showCancel={true}
                    cancelBtnBsStyle='secondary'
                    confirmBtnBsStyle='secondary'
                    onCancel={() => setAlertMessage(null)}
                    onConfirm={() => handleDelete()}
                    confirmBtnText= {LABEL.YES}
                    cancelBtnText={LABEL.NO}/>}
            <PageLoader loading={pageLoading}/>
            <Row className='d-flex align-items-center ps-0'>
                <Col md={3} className='ps-0'><h5>{PAGE_HEADERS.ORDER_DETAILS}</h5></Col>
                <Col md={9}>
                    {orderData.paymentStatus !== 'Paid' || !customers.filter(customer => customer.id === orderData.customer)[0]['isDeleted'] &&
                    <Button size='sm' className='w-auto float-end' variant={nonEditable ? 'secondary' : 'success'}
                            onClick={() => {nonEditable ? setNonEditable(false) : handlePlaceOrUpdateOrder()}}>
                        <FontAwesomeIcon icon={nonEditable ? 'edit' : 'circle-check'} className='me-1'/>
                        {nonEditable ? COMMON.EDIT : params.orderId !== 'new' ? LABEL.UPDATE_ORDER : LABEL.PLACE_ORDER}
                    </Button>}
                    <Button size='sm' className='w-auto me-2 float-end' variant='danger'
                            onClick={() => {nonEditable ? setAlertMessage('Are You Sure, You Want To Delete The Order Of ' +
                            customers.filter(customer => customer.id === orderData.customer)[0]['fullName']) :
                                params.orderId === 'new' ? navigate('/orders') : setNonEditable(true); getOrderData()}}>
                        <FontAwesomeIcon icon={nonEditable ? 'trash' : 'times'} className='me-1'/>
                        {nonEditable ? COMMON.DELETE : COMMON.CANCEL}
                    </Button>
                </Col>
            </Row><hr/>
            <Row id='form-page' className='scrollbar'>
                <Col md={6}>
                    {createInputField([
                        { label: LABEL.CUSTOMER_NAME, name: 'customer', options: nonEditable ? customers : activeCustomers
                            , selectLabel: 'fullName', value: 'id'},
                        { label: LABEL.PRESCRIPTION, name: 'prescription'},
                        { label: LABEL.PAYMENT_MODE, name: 'paymentMode', options: paymentOptions, selectLabel: 'label', value: 'value'},
                        { label: LABEL.PAYMENT_STATUS, name: 'paymentStatus', readOnly: true, default: 'Pending'}
                    ], handleInput, orderData, errors, nonEditable)}
                </Col>
                <Col md={6}>
                    {createInputField([
                        { label: LABEL.DATE_OF_PURCHASE, name: 'dateOfPurchase', type: 'date'},
                        { label: LABEL.NET_AMOUNT, name: 'netAmount', readOnly: true, default: 0},
                        { label: LABEL.TAX , name: 'tax', readOnly: true, default: 0},
                        { label: LABEL.TOTAL_AMOUNT, name: 'totalAmount', readOnly: true, default: 0}
                    ], handleInput, orderData, errors, nonEditable)}
                </Col>
                <Row className='d-flex justify-content-center'>
                    <Col md={8}>
                        <span className='float-start ms-3 pt-2 fw-bold '>{PAGE_HEADERS.DRUG}</span>
                        <span className='error-msg'>{errors['drugs']}</span>
                    </Col>
                    <Col md={2}>
                    <Button
                        className='w-auto float-end mb-2 me-3'
                        size='sm' variant='warning'
                        disabled={nonEditable}
                        onClick={() => {
                            setShowDrugModal(true);
                            setNewDrug({});
                            setErrors({});
                            setEditDrug(false);
                        }}><FontAwesomeIcon icon="fa-solid fa-pills" className='me-1'/>{ORDER_LABELS.ADD_DRUG}</Button>
                    </Col>
                    <Col md={10}>
                        <TanStackTable data={data} columns={columns} rowProps={handleRowProps}/>
                    </Col>
                </Row>
            </Row>
        </>
    );
}