import {useEffect, useState} from "react";
import {Form} from "react-bootstrap";

export default function ColumnFilter({ column }) {

    const initialValue = column.getFilterValue();
    const [value, setValue] = useState(initialValue)
    const setValueInFilter = (value) => column.setFilterValue(value);

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setValueInFilter(value);
        }, 1000)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <Form.Control size='sm' type='text' style={{fontSize: 'x-small'}} className='mb-1'
               value={value} onChange={e => setValue(e.target.value)} />
    )
}
