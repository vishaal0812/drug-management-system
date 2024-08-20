import React from 'react';
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function IconButton({icon, className, variant='secondary', style, toolTip, size = 'sm', onClick, disabled, children}) {

    return(
        <OverlayTrigger overlay={toolTip ? <Tooltip>{toolTip}</Tooltip> : <></>}>
            <Button className={className} size={size} disabled={disabled}
                    variant={variant} style={style} onClick={() => onClick()}>
                <FontAwesomeIcon icon={icon}/>{children}
            </Button>
        </OverlayTrigger>
    );
}