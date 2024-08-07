import React, {useEffect, useState} from "react";
import ReactEcharts from "echarts-for-react";
import Chart from 'react-apexcharts';
import axios from "axios";
import {Card, Col, Row} from "react-bootstrap";
import {DASHBOARD} from "../../helpers/Labels";

export default function DashBoard() {

    const LABEL = DASHBOARD;
    const [available, setAvailable] = useState({drugs: [], stocks: []});
    const [soldReport, setSoldReport] = useState({drugs: [], soldCount: []});

    useEffect(() => {
        axios('/getDrugsSalesReport').then(response => setSoldReport(response.data));
        axios('/getDrugAvailability').then(response => setAvailable(response.data));
    }, []);

    const drugSaleOptions = {
        chart: {id: "basic-bar"},
        xaxis: {categories: soldReport.drugs}
    };
    const drugSaleSeries = [{name: "sales", data: soldReport.soldCount}];

    const drugAvailabilityOption = {
        chart: {id: "basic-bar"},
        xaxis: {categories: available.drugs}
    };
    const drugAvailabilitySeries = [{name: "sales", data: available.stocks}];

    return (
        <>
            <Card className='my-2' style={{backgroundColor: 'white'}}>
                <Card.Body>
                    <Card.Title>{LABEL.DRUG_AVAILABILITY}</Card.Title>
                    <Chart
                        options={drugAvailabilityOption}
                        series={drugAvailabilitySeries}
                        type="bar"
                        height="375"
                        width="960"/>
                </Card.Body>
            </Card>
            <Card className='my-2' style={{backgroundColor: 'white'}}>
                <Card.Body>
                    <Card.Title>{LABEL.DRUG_SALES}</Card.Title>
                    <Chart
                        options={drugSaleOptions}
                        series={drugSaleSeries}
                        type="line"
                        height="375"
                        width="960"/>
                </Card.Body>
            </Card>
        </>
    );
}
