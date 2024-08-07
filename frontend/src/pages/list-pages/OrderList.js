import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import {COMMON_LABELS, ORDER_LABELS, PAGE_HEADERS} from "../../helpers/Labels";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import IconButton from "../../components/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PageLoader from "../../components/PageLoader";
import {createColumnHelper} from "@tanstack/react-table";
import TanStackCheckbox from "../../components/tanstack-table/TanStackCheckbox";
import TanStackTable from "../../components/tanstack-table/TanStackTable";

export default function OrderList() {

    const LABEL = COMMON_LABELS;
    const ORDER = ORDER_LABELS;
    const navigate = useNavigate();
    const checkedRows = useRef([]);
    const [listData, setListData] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [rowChecked, setRowChecked] = useState(false);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    function fetchAllOrders(){
        axios('/getAllOrders').then(response => {
            setListData(response.data);
            setPageLoading(false);
        });
    }

    function handleDelete() {
        axios.delete('/deleteOrder', {data: {ids: checkedRows.current}})
            .then(() => fetchAllOrders());
    }

    function handleCheckBox(row) {
        const rowId = row.original.id;
        if (checkedRows.current.includes(rowId)) {
            checkedRows.current = checkedRows.current.filter(existId => existId !== rowId);
        } else {
            checkedRows.current = [...checkedRows.current, rowId];
        }
        setRowChecked(checkedRows.current.length > 0)
    }

    const handleRowProps = (row) => ({
        onDoubleClick: () => {
            navigate(`/orders/${row.original.id}`);
        }
    })

    const data = React.useMemo(() => listData, [listData]);
    const columnHelper = createColumnHelper();
    const columns = useMemo(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <TanStackCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <TanStackCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
        },
        columnHelper.accessor('customer.fullName', {
            header: LABEL.NAME.toUpperCase(),
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('dateOfPurchase', {
            header: ORDER.DATE_OF_PURCHASE.toUpperCase(),
            cell: info => info.getValue()
        }),
        columnHelper.accessor('netAmount', {
            header: ORDER.NET_AMOUNT.toUpperCase(),
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('tax', {
            header: ORDER.TAX.toUpperCase(),
            cell: cell => cell.getValue()
        }),
        columnHelper.accessor('totalAmount', {
            header: ORDER.TOTAL_AMOUNT.toUpperCase(),
            cell: cell => cell.getValue()
        }),
        columnHelper.accessor('paymentStatus', {
            header: ORDER.PAYMENT_STATUS.toUpperCase(),
            cell: cell => cell.getValue()})
    ], []);

    return (
        <Row className='px-3'>
            <PageLoader loading={pageLoading}/>
            <Row>
                <Col md={2}><h5>{PAGE_HEADERS.ORDER}</h5></Col>
                <Col md={10} className='mb-2'>
                    {rowChecked && <IconButton className='float-end' icon='trash' variant='danger'
                        onClick={() => handleDelete()} toolTip='Delete All'/>}
                    <Link to={'new'}>
                        <Button className='w-auto float-end me-1' size='sm' variant='secondary'>
                            <FontAwesomeIcon icon='plus' className='me-1'/>{LABEL.CREATE}
                        </Button>
                    </Link>
                </Col>
            </Row>
            <TanStackTable data={data} columns={columns} rowProps={handleRowProps}/>
        </Row>
    );
}
