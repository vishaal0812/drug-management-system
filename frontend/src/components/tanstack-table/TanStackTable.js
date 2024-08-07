import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    getFilteredRowModel
} from "@tanstack/react-table";
import React, {useState} from "react";
import '../../css/TanStack.css'
import {Button, Col, Form, Row} from "react-bootstrap";
import ColumnFilter from './ColumnFilter';

export default function TanStackTable({data, columns, rowProps}) {

    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        state: {columnFilters, rowSelection},
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
        enableRowSelection: true
    })

    return (
        <div id='tan-stack-table'>
            <table className='scrollbar overflow-auto w-100'>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder ? null :
                                    <>
                                        <div {...{
                                            className: (header.column.getCanSort() ?
                                                'cursor-pointer select-none' : '') + ' fs-10',
                                            onClick: header.column.getToggleSortingHandler()
                                        }}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{asc: ' 🔼', desc: ' 🔽'} [header.column.getIsSorted()] ?? null}
                                        </div>
                                        {header.column.getCanFilter() ? (
                                            <div className='mx-2'>
                                                <ColumnFilter className column={header.column}/>
                                            </div>
                                        ) : null}
                                    </>
                                }
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className='border-bottom mx-3' {...rowProps ? rowProps(row) : {}}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className='fs-10 table-row'>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext())
                                }
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <tfoot>
            {table.getFooterGroups().map(footerGroup => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.footer,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
            <Row className='d-flex m-1'>
                <Col md={8} className='d-flex'>
                    <span className='fs-10 mx-1 pt-1'>Page</span>
                    <Form.Control
                        className='w-10 fs-10'
                        size='sm'
                        value={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            if (/^[0-9]+$/.test(e.target.value)) {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                            }
                        }}
                    />
                    <span className='fs-10 mx-1 pt-1'>of {table.getPageCount()}</span>
                    <span className='fs-10 ms-4 me-1 pt-1'>rows per page </span>
                    <Form.Select
                        className='w-auto fs-10'
                        size='sm'
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}>
                        {[5, 10, 20, 30, 40, 50, 100].map(pageSize => (
                            <option key={pageSize} value={pageSize}>{pageSize}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Button size='sm' variant='falcon-default' className='float-end'
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}> next</Button>
                    <Button size='sm' variant='falcon-default' className='me-1 float-end'
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}>previous</Button>
                </Col>
            </Row>
        </div>
    )
}


