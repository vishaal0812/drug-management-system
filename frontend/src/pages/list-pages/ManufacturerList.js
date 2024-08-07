import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {COMMON_LABELS, PAGE_HEADERS} from "../../helpers/Labels";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import IconButton from "../../components/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PageLoader from "../../components/PageLoader";
import TanStackTable from "../../components/tanstack-table/TanStackTable";
import TanStackCheckbox from "../../components/tanstack-table/TanStackCheckbox";
import {createColumnHelper} from "@tanstack/react-table";

export default function ManufacturerList() {

    const navigate = useNavigate();
    const LABEL = COMMON_LABELS;
    const [listData, setListData] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [rowChecked, setRowChecked] = useState(false);
    const checkedRows = useRef([]);

    useEffect(() => {
        fetchAllManufacturers();
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

    function fetchAllManufacturers() {
        axios('/getAllManufacturers')        
            .then(response => {
                setListData(response.data);
                setPageLoading(false);
            });
    }

    function handleDelete() {
        axios.post('/deleteManufacturer', {ids: checkedRows.current})
            .then(() => fetchAllManufacturers());
    }

    const data = React.useMemo(() => listData, [listData]);
    const columnHelper = createColumnHelper();
    const columns = useMemo(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <>
                    <TanStackCheckbox
                        {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}/>
                </>
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
        columnHelper.accessor('email', {
            header: LABEL.EMAIL.toUpperCase(),
            cell: cell => cell.getValue()
        }),
        columnHelper.accessor('companyName', {
            header: LABEL.MANUFACTURER.COMPANY_NAME.toUpperCase(),
            cell: cell => cell.getValue()
        }),
        columnHelper.accessor('tinNumber', {
            header: LABEL.MANUFACTURER.TIN_NUMBER.toUpperCase(),
            cell: cell => cell.getValue()})
    ], []);

    const handleRowProps = (row) => ({
        onDoubleClick: () => {
            navigate(`/manufacturers/${row.original.id}`);
        }
    })
    

    return (
        <Row className='px-3'>
            <PageLoader loading={pageLoading}/>
            <Row>
                <Col md={2}><h5>{PAGE_HEADERS.MANUFACTURER}</h5></Col>
                <Col md={10} className='mb-2'>
                    {rowChecked && <IconButton className='float-end' icon='trash' variant='danger'
                                               onClick={() => handleDelete()} toolTip='Delete All'/>}
                    <Link to={'new'}>
                        <Button className='w-auto float-end' size='sm' variant='secondary'>
                            <FontAwesomeIcon icon='plus' className='me-1'/>{LABEL.CREATE}
                        </Button>
                    </Link>
                </Col>
            </Row>
            <TanStackTable data={data} columns={columns} rowProps={handleRowProps}/>
        </Row>
    );
}
