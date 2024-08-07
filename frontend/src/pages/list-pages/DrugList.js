import React, {useEffect, useMemo, useRef, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {COMMON_LABELS, DRUG_LABELS, PAGE_HEADERS} from "../../helpers/Labels";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import IconButton from "../../components/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PageLoader from "../../components/PageLoader";
import TanStackTable from "../../components/tanstack-table/TanStackTable";
import {createColumnHelper} from "@tanstack/react-table";
import TanStackCheckbox from "../../components/tanstack-table/TanStackCheckbox";

export default function DrugList() {

    const LABEL = COMMON_LABELS;
    const DRUG = DRUG_LABELS;
    const navigate = useNavigate();
    const checkedRows = useRef([]);
    const [listData, setListData] = useState([]);
    const [rowChecked, setRowChecked] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        fetchAllDrugs();
    }, []);

    function fetchAllDrugs() {
        axios('/getAllDrugs')
            .then(response => {
                setListData(response.data);
                setPageLoading(false);
            });
    }

    function handleDelete() {
        axios.post('/deleteDrug', {ids: checkedRows.current})
            .then(() => fetchAllDrugs());
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
            navigate(`/drugs/${row.original.id}`);
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
        columnHelper.accessor('drugName', {
            header: DRUG.DRUG_NAME.toUpperCase(),
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('manufacturer.companyName', {
            header: DRUG.MANUFACTURER.toUpperCase(),
            cell: info => info.getValue()
        }),
        columnHelper.accessor('manufacturedDate', {
            header: 'MFD DATE',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('expiryDate', {
            header: 'EXP DATE',
            cell: cell => cell.getValue()
        }),
        columnHelper.accessor('price', {
            header: DRUG.PRICE.toUpperCase(),
            cell: cell => cell.getValue()
        }),
        columnHelper.accessor('quantityInStock', {
            header: DRUG.QUANTITY_IN_STOCK.toUpperCase(),
            cell: cell => cell.getValue()})
    ], []);

    return (
        <div className='px-3'>
            <PageLoader loading={pageLoading}/>
            <Row>
                <Col md={2} className='ps-0'><h5>{PAGE_HEADERS.DRUG}</h5></Col>
                <Col md={10} className='mb-2'>
                    {rowChecked && <IconButton className='float-end' icon='trash' variant='danger'
                                               onClick={() => handleDelete()} toolTip='Delete All'/>}
                    <Link to={'new'}>
                        <Button size='sm' className='w-auto float-end me-1' variant='secondary'>
                            <FontAwesomeIcon icon='plus' className='me-1'/>
                            {COMMON_LABELS.CREATE}
                        </Button>
                    </Link>
                </Col>
            </Row>
            <TanStackTable data={data} columns={columns} rowProps={handleRowProps}/>
        </div>
    );
}
