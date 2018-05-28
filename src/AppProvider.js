import React, {Component} from 'react';

export const AppContext = React.createContext();

export class AppProvider extends Component {
    state = {
        providerName: "myHostingCompany",
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
                sla: [0, 90, 75, 25, 100],
            },
            {
                name: "Server M",
                id: 1,
                costPerDay: 10,
                details: {cpu: 2, ram: 4, ssd: 50, price: 10},
                sla: [0, 90, 75, 25, 100],
            },
            {
                name: "Server L",
                id: 2,
                costPerDay: 20,
                details: {cpu: 8, ram: 16, ssd: 100, price: 20},
                sla: [0, 90, 75, 25, 100],
            }],
    };

    render() {
        return (
            <AppContext.Provider value={this.state}>{this.props.children}</AppContext.Provider>
        )
    }
}

const Data = {
    providerName: "myHostingCompany",
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
            sla: [0, 90, 75, 25, 100],
        },
        {
            name: "Server M",
            id: 1,
            costPerDay: 10,
            details: {cpu: 2, ram: 4, ssd: 50, price: 10},
            sla: [0, 90, 75, 25, 100],
        },
        {
            name: "Server L",
            id: 2,
            costPerDay: 20,
            details: {cpu: 8, ram: 16, ssd: 100, price: 20},
            sla: [0, 90, 75, 25, 100],
        }],
};

export default Data;