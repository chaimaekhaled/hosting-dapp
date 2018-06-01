export const details2array = (details) => {
    return [details.cpu, details.ram, details.traffic, details.ssd]
};

export const details2dict = (details) => {
    return {cpu: details[0], ram: details[1], traffic: details[2], ssd: details[3]}
};

export const strDate2int = (date) => {
    return (new Date(date)).getTime() / 1000
};

export const intDate2str = (date) => {
    return new Date(date * 1000).toISOString().slice(0, 10)
};

export const bigNumArray2intArray = (array) => {
    return array.map(bigNum => bigNum.c[0])
};

export const serviceData2object = (serviceData) => {
    return {
        id: serviceData[4].c[0],
        hash: serviceData[8],
        name: serviceData[9],
        productId: serviceData[5].c[0],
        balance: serviceData[1].c[0],
        endDate: intDate2str(serviceData[3].c[0]),
        costPerDay: serviceData[2].c[0],
        startDate: intDate2str(serviceData[7].c[0]),
        availability: bigNumArray2intArray(serviceData[0]),
        sla: bigNumArray2intArray(serviceData[6])
    }
};

/*
        return (
    0    availabilityHistory,
    1    useableCustomerFunds(),
    2    costPerDay,
    3    endDate,
    4    serviceId,
    5    productId,
    6    sla,
    7    startDay,
    8   address,
    9   name);

 */