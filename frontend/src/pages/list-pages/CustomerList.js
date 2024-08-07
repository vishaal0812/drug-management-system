import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {COMMON_LABELS, PAGE_HEADERS} from "../../helpers/Labels";
import axios from "axios";
import IconButton from "../../components/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PageLoader from "../../components/PageLoader";
import {createColumnHelper} from "@tanstack/react-table";
import TanStackCheckbox from "../../components/tanstack-table/TanStackCheckbox";
import TanStackTable from "../../components/tanstack-table/TanStackTable";

export default function CustomerList() {

    const LABEL = COMMON_LABELS;
    const [pageLoading, setPageLoading] = useState(true);
    const [allData, setAllData] = useState([]);
    const [rowChecked, setRowChecked] = useState(false);
    const navigate = useNavigate();
    const checkedRows = useRef([]);

    useEffect(() => {
        fetchAllCustomers();
    }, []);

    function fetchAllCustomers() {
        axios(`/getAllCustomers`).then(response => {
            setAllData(response.data);
            setPageLoading(false);
        })
    }

    function handleDelete() {
        axios.post('/deleteCustomer', {ids: checkedRows.current})
            .then(() => fetchAllCustomers());
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
            navigate(`/customers/${row.original.id}`);
        }
    })

    const data = React.useMemo(() => Array.isArray(allData) ? allData : [], [allData]);
    const columnHelper = createColumnHelper();
    const columns = useMemo(() => [
        {
            id: 'id',
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
        columnHelper.accessor('fullName', {
            header: LABEL.FULL_NAME.toUpperCase(),
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('age', {
            header: LABEL.AGE.toUpperCase(),
            cell: info => info.getValue()
        }),
        columnHelper.accessor('email', {
            header: LABEL.EMAIL.toUpperCase(),
            cell: cell => cell.getValue()
        }),
        columnHelper.accessor('gender', {
            header: LABEL.GENDER.toUpperCase(),
            cell: cell => cell.getValue()
        }),
        columnHelper.accessor('contactNumber', {
            header: LABEL.CONTACT_NUMBER.toUpperCase(),
            cell: cell => cell.getValue()})
    ], []);

    return (
        <Row className='px-3'>
            <PageLoader loading={pageLoading}/>
            <Row>
                <Col md={2}><h5>{PAGE_HEADERS.CUSTOMER}</h5></Col>
                <Col md={10} className='mb-2'>
                    {rowChecked && <IconButton className='float-end' icon='trash' variant='danger'
                                               onClick={() => handleDelete()} toolTip='Delete All'/>}
                    <Link to={'new'}>
                        <Button className='w-auto float-end me-1' variant='secondary' size='sm'>
                            <FontAwesomeIcon icon='plus' className='me-1'/>{LABEL.CREATE}
                        </Button>
                    </Link>
                </Col>
            </Row>
            <TanStackTable data={data} columns={columns} rowProps={handleRowProps}/>
        </Row>
    );
}
