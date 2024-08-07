import React from 'react';
import {ClipLoader} from "react-spinners";

const PageLoader = ({loading}) => {
    return (
        <>
            {loading &&
                <div className="page-loading-overlay">
                    <ClipLoader color={'#7983ff'} loading={true} size={70}/>
                </div>
            }
        </>
    );
};

export default PageLoader;