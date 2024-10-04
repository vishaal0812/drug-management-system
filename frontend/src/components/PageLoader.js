import React from 'react';
import {ClipLoader} from "react-spinners";

export default function PageLoader() {

    return (
        <div className="page-loading-overlay">
            <div className={'loader'}/>
        </div>
    );
};