import React, {useEffect, useState} from 'react';
import {Button, Col, Row, Dropdown} from "react-bootstrap";
import {COMMON_LABELS, PAGE_HEADERS} from "../../helpers/Labels";
import {dateFormatter} from "../../helpers/Formatter";
import {useNavigate, useParams, Link} from "react-router-dom";
import axios from "axios";
import {createInputField} from "../../helpers/InputFieldHelper";
import {states} from "../../helpers/IndianStates";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import IconButton from "../../components/IconButton";
import {checkIsValid, FORMAT, validateFields} from "../../helpers/Validations";

export default function CustomerPage() {

    const COMMON_LABEL = COMMON_LABELS;
    const filters = ['All', 'Pending', 'Paid'];
    const [customerData, setCustomerData] = useState({});
    const [cacheData, setCacheData] = useState({});
    const [nonEditable, setNonEditable] = useState(true);
    const [errors, setErrors] = useState({});
    const [showOrders, setShowOrders] = useState(false);
    const [orders, setOrders] = useState();
    const [filterOrders, setFilterOrders] = useState();
    const [filterIndex, setFilterIndex] = useState(0);
    const params = useParams();
    const navigate = useNavigate();
    const requiredFields = ['firstName', 'lastName', 'email', 'age', 'email',
        'contactNumber', 'gender', 'addressLine1', 'city', 'state', 'pinCode'];
    const formatFields = [FORMAT.FIRST_NAME, FORMAT.LAST_NAME, FORMAT.EMAIL, FORMAT.CONTACT_NUMBER,
        FORMAT.CITY, FORMAT.PIN_CODE];

    useEffect(() => {
        if (params.customerId !== 'new') {
            axios(`/getCustomer/${params.customerId}`).then(response => {
                setCustomerData({...response.data, id : params.customerId});
                setCacheData({...response.data, id : params.customerId});
                handleCustomerOrders();
            });
        }else setNonEditable(false);
    }, []);

    function handleInput(event) {
        setCustomerData({...customerData, [event.target.name] : event.target.value});
    }

    function handleCustomerOrders() {
        axios.post(`/getCustomerOrders/${params.customerId}`).then((response) => {
            setOrders(response.data);
            setFilterOrders(response.data);
        })
    }

    function handleSaveOrUpdate() {
        const formatErrors = checkIsValid(formatFields, customerData);
        const emptyFieldErrors = validateFields(customerData, requiredFields);
        const errors = {...formatErrors, ...emptyFieldErrors}
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            axios.post('/createAndUpdateCustomer', customerData)
                .then(() => navigate('/customers'));
        }
    }

    function handleDelete() {
        axios.post('/deleteCustomer', {ids: [params.customerId]})
            .then(() => navigate('/customers'));
    }

    function handleMenuFilter() {
        let filteredOrders = [];
        if (filterIndex === 0) {
            setFilterOrders(orders.filter((order) => order.paymentStatus === 'Pending'));
        }else if (filterIndex === 1) {
            setFilterOrders(orders.filter((order) => order.paymentStatus === 'Paid'));
        }else {
            setFilterOrders(orders);
        }
        setFilterIndex(filterIndex === 2 ? 0 : filterIndex + 1);
    }

    const MenuOption = ({order}) => {
        const isPaid = order.paymentStatus === 'Paid';
        return(
            <Dropdown.Item className='fs-10'>
                <Link to={'/orders/' + order.id} style={{textDecoration: 'none'}}>
                    <IconButton
                        className={'me-1 icon-only p-0 color-' + (isPaid ? 'green':'blue') }
                        icon={order.paymentStatus === 'Paid' ? 'check-circle':'clock'}/>
                    <span className='me-1'>{dateFormatter(order.dateOfPurchase)}</span>
                    <span className={'me-1 color-' + (isPaid ? 'green':'blue')}>
                        ₹{Number(order.totalAmount).toFixed(2)} {order.paymentStatus}
                    </span>
                    <span className='color-grey'>{order.orderDrugs.length + ' items'}</span>
                </Link>
           </Dropdown.Item>
        )
    }

    return (
        <>
            <Row className='d-flex align-items-center py-0'>
                <Col md={9}><h5 className='me-4 float-start'>{PAGE_HEADERS.CUSTOMER_DETAILS}</h5></Col>
                <Col md={3}>
                    <Dropdown show={showOrders}>
                        <IconButton className='float-end' variant='secondary' icon='list' toolTip='orders'
                            onClick={()=> {
                                setShowOrders(!showOrders);
                            }}> Orders</IconButton>
                        <Dropdown.Menu className='mt-5' style={{margin: '-2rem'}}>
                            {filterOrders ? <Dropdown.Header className='mb-2'>
                            {filterIndex < 1 ? 'Orders' : 'Payment ' + filters[filterIndex] + ' Orders'}
                                <IconButton
                                    className='icon-only float-end color-grey'
                                    icon='filter' toolTip='Filter'
                                    onClick={() => handleMenuFilter()}/>
                            </Dropdown.Header> :
                            <Dropdown.Header className='d-flex justify-content-center'>
                                NO ORDERS PLACED
                            </Dropdown.Header>}
                            <div className='scrollbar' style={{width: '100%', height: '25vh'}}>
                                {filterOrders && filterOrders.map((order) => (<MenuOption order={order}/>))}
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button size='sm' className='w-auto float-end me-2' variant={nonEditable ? 'secondary' : 'success'}
                            onClick={() => {nonEditable ? setNonEditable(false) : handleSaveOrUpdate()}}>
                        <FontAwesomeIcon icon={nonEditable ? 'edit' : 'circle-check'} className='me-1'/>
                        {nonEditable ? COMMON_LABEL.EDIT : params.customerId !== 'new' ? COMMON_LABELS.UPDATE : COMMON_LABEL.SAVE}
                    </Button>
                    <Button size='sm' className='w-auto me-2 float-end' variant='danger'
                            onClick={() => { nonEditable ? handleDelete() :
                                params.customerId === 'new' ? navigate('/customers'): setNonEditable(true); setCustomerData(cacheData)}}>
                        <FontAwesomeIcon icon={nonEditable ? 'trash' : 'times'} className='me-1'/>
                        {nonEditable ? COMMON_LABEL.DELETE : COMMON_LABEL.CANCEL}
                    </Button>
                </Col>
            </Row><hr/>
            <Row id='form-page' className='scrollbar detail-row'>
                <Col md={6}>
                    {createInputField([
                        { label: COMMON_LABEL.FIRST_NAME, name: 'firstName' },
                        { label: COMMON_LABEL.MIDDLE_NAME, name: 'middleName'},
                        { label: COMMON_LABEL.LAST_NAME, name: 'lastName' },
                        { label: COMMON_LABEL.AGE, name: 'age', type: 'number' },
                        { label: COMMON_LABEL.EMAIL, name: 'email' },
                        { label: COMMON_LABEL.GENDER, name: 'gender',radios: ['Male', 'Female'] }
                    ], handleInput, customerData, errors, nonEditable)}
                </Col>
                <Col md={6}>
                    {createInputField([
                        { label: COMMON_LABEL.CONTACT_NUMBER, name: 'contactNumber' },
                        { label: COMMON_LABEL.ADDRESS.ADDRESS_LINE1, name: 'addressLine1' },
                        { label: COMMON_LABEL.ADDRESS.ADDRESS_LINE2, name: 'addressLine2' },
                        { label: COMMON_LABEL.ADDRESS.CITY, name: 'city' },
                        { label: COMMON_LABEL.ADDRESS.STATE, name: 'state', options: states, selectLabel: 'label', value: 'value'},
                        { label: COMMON_LABEL.ADDRESS.PIN_CODE, name: 'pinCode'}
                    ], handleInput, customerData, errors, nonEditable)}
                </Col>
            </Row>
        </>
    );
}