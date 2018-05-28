import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const data2 = [
    {
        id: 0,
        hash: '0x14ce80ec89e1ed33701299d833d8b691d34f2fd2', name: "Server S",
        month: '2018-04',
        latency: 4,
        dropPackets: 5,
        availability: 97.8
    },
    {
        id: 0,
        hash: '0x14ce80ec89e1ed33701299d833d8b691d34f2fd2', name: "Server S",
        month: '2018-03',
        latency: 2,
        dropPackets: 12,
        availability: 96
    },
    {
        id: 0,
        hash: '0x14ce80ec89e1ed33701299d833d8b691d34f2fd2', name: "Server S",
        month: '2018-02',
        latency: 21,
        dropPackets: 9,
        availability: 99.999
    },
    {
        id: 1,
        hash: '0x13f93b519261bf56d58e6e5d2a028a04ac6fa691', name: "Server M",
        month: '2018-04',
        latency: 55,
        dropPackets: 2,
        availability: 99.99
    },
    {
        id: 1,
        hash: '0x13f93b519261bf56d58e6e5d2a028a04ac6fa691', name: "Server M",
        month: '2018-03',
        latency: 4,
        dropPackets: 5,
        availability: 97.8
    },
    {
        id: 1,
        hash: '0x13f93b519261bf56d58e6e5d2a028a04ac6fa691', name: "Server M",
        month: '2018-02',
        latency: 60,
        dropPackets: 8,
        availability: 94.8
    },
    {
        id: 2,
        hash: '0xbe559c7a90427fb5b629b0703385480570190a36', name: "Server M",
        month: '2018-04',
        latency: 4,
        dropPackets: 5,
        availability: 97.8
    },
    {
        id: 2,
        hash: '0xbe559c7a90427fb5b629b0703385480570190a36', name: "Server M",
        month: '2018-03',
        latency: 60,
        dropPackets: 8,
        availability: 94.8
    },
    {
        id: 2,
        hash: '0xbe559c7a90427fb5b629b0703385480570190a36', name: "Server M",
        month: '2018-02',
        latency: 55,
        dropPackets: 2,
        availability: 99.99
    },
];


const provider = {
    name: "myProvider",
    serviceContracts: [
        {
            id: 0,
            hash: '0x14ce80ec89e1ed33701299d833d8b691d34f2fd2',
            name: "Server S",
            balance: 25,
            endDate: '2018-06-21',
            costPerDay: 2,
            startDate: '2018-05-22',
            availability: [99, 100, 21, 88, 95, 66, 85],
            sla: [0, 90, 75, 25, 100],
        },
        {
            id: 1,
            hash: '0x13f93b519261bf56d58e6e5d2a028a04ac6fa691',
            name: "Server M",
            balance: 15,
            endDate: '2018-05-31',
            costPerDay: 10,
            startDate: '2018-05-22',
            availability: [99, 100, 21, 88, 95, 66, 85],
            sla: [0, 90, 75, 25, 100],
        },
        {
            id: 2,
            hash: '0xbe559c7a90427fb5b629b0703385480570190a36',
            name: "Server M",
            balance: 33,
            endDate: '2018-06-07',
            costPerDay: 10,
            startDate: '2018-05-22',
            availability: [99, 100, 21, 88, 95, 66, 85],
            sla: [0, 90, 75, 25, 100],
        }],
    products: [
        {
            name: "Server S",
            id: 0,
            costPerDay: 2,
            details: {cpu: 1, ram: 2, ssd: 25, price: 5},
        },
        {
            name: "Server M",
            id: 1,
            costPerDay: 10,
            details: {cpu: 2, ram: 4, ssd: 50, price: 10}
        },
        {
            name: "Server L",
            id: 2,
            costPerDay: 20,
            details: {cpu: 8, ram: 16, ssd: 100, price: 20}
        }],
};

ReactDOM.render(
    <App data={provider.serviceContracts} services={provider.products} provider={provider}/>
    , document.getElementById('root'));
registerServiceWorker();
