import {useEffect, useRef} from "react";

export default function TanStackCheckbox({indeterminate, className, ...rest }) {
    const ref = useRef(null);

    useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest}/>
    )
}