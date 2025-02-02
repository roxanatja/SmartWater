import moment from "moment";
import { District, Zone } from "../type/City";
import { Client } from "../type/Cliente/Client";
import { Devolution } from "../type/Devolution/devolution";
import { Item } from "../type/Item";
import { Loans } from "../type/Loans/Loans";
import { User } from "../type/User";
import * as XLSX from "xlsx";

export const exportData = (fileName: string, data: any) => {
    //Exporta los datos a un archivo excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
};

export const searchUser = (id: string, userList: User[]) => {
    //Busca el nombre del usuario
    const user = userList.find(user => user._id === id);
    if (user) {
        return `${user.fullName} ${user.role === 'admin' ? "(Administrador)" : ""}`;
    } else {
        return "Usuario no encontrado";
    }
};

export const searchZone = (id: string, zones: Zone[]): Zone | undefined => {
    //Busca la zona del cliente
    const zone = zones.find((zone: any) => zone._id === id);
    return zone;
};

export const searchDistrict = (id: string, districts: District[]): District | undefined => {
    //Busca el distrito del cliente
    const district = districts.find((district: any) => district._id === id);
    return district;
};


export const setContract = (client: Client) => {
    //Guarda los detalles del contrato
    if (client.hasContract) {
        if (client.hasExpiredContract) {
            return "CONTRATO VENCIDO";
        } else {
            return "CONTRATO VIGENTE";
        }
    } else {
        return "SIN CONTRATO";
    }
};

export const setContractLoan = (hasContract: boolean, dateValid: string | null) => {
    if (hasContract && dateValid) {
        if (moment(dateValid).isBefore(moment())) {
            return "CONTRATO VENCIDO";
        } else {
            return "CONTRATO VIGENTE";
        }
    } else {
        return "SIN CONTRATO";
    }
};

export const setDevolutions = (
    id: string,
    devolutions: Array<Devolution>,
    products: Array<Item>
): { itemId: string; itemName: string; quantity: number }[] => {
    //Guarda los detalles de las devoluciones
    const devolution = devolutions.filter(
        (devolution) => devolution.client === id
    );

    if (devolution.length > 0) {
        const prod: Array<string> = [];
        const dataToSend: { itemId: string; itemName: string; quantity: number }[] = [];

        devolution.forEach(async (devolution: any) => {
            devolution.detail.forEach((detail: any) => {
                const product = products.find(
                    (product: any) => product._id === detail.item
                );
                if (product === undefined) return;

                if (prod.includes(product.name)) {
                    const existingProduct = dataToSend.find(
                        (item) => item.itemName === product.name
                    );
                    if (existingProduct) {
                        existingProduct.quantity += detail.quantity;
                    } else {
                        dataToSend.push({
                            itemName: product.name,
                            quantity: detail.quantity,
                            itemId: product._id
                        });
                    }
                } else {
                    prod.push(product.name);
                    dataToSend.push({
                        itemName: product.name,
                        quantity: detail.quantity,
                        itemId: product._id
                    });
                }
            });
        })

        return dataToSend;
    } else {
        return [];
    }
};

export const setLoans = (
    id: string,
    loans: Array<Loans>,
    devolutions: Array<Devolution>,
    products: Array<Item>
): { itemId: string; itemName: string; quantity: number }[] => {
    //Guarda los detalles de los prestamos
    let devolution = devolutions.filter(
        (devolution: any) => devolution.client === id
    );
    const prod: Array<string> = [];
    const dataToSend: Array<{ itemId: string; itemName: string; quantity: number }> = [];

    if (loans.length > 0 || devolution.length > 0) {
        if (loans.length > 0) {
            loans.forEach((loan: any) => {
                const devolutionFiltered = devolution.filter(
                    (devolution: any) => devolution.loan === loan._id
                );
                devolution = devolution.filter(
                    (devolution: any) => devolution.loan !== loan._id
                );

                loan.detail.forEach((detail: any) => {
                    const product = products.find(
                        (product) => product._id === detail.item
                    );

                    if (product) {
                        if (prod.includes(product.name)) {
                            const existingProduct = dataToSend.find(
                                (item) => item.itemName === product.name
                            );
                            if (existingProduct) {
                                existingProduct.quantity += detail.quantity;
                            } else {
                                dataToSend.push({
                                    itemName: product.name,
                                    quantity: detail.quantity,
                                    itemId: product._id
                                });
                            }
                        } else {
                            prod.push(product.name);
                            dataToSend.push({
                                itemName: product.name,
                                quantity: detail.quantity,
                                itemId: product._id
                            });
                        }
                    }

                    devolutionFiltered.forEach((devolution: any) => {
                        devolution.detail.forEach((devolutionDetail: any) => {
                            const item = products.find(
                                (product) => product._id === devolutionDetail.item
                            );

                            if (item) {
                                if (prod.includes(item.name)) {
                                    const existingProduct = dataToSend.find(
                                        (itemDats) => itemDats.itemName === item.name
                                    );
                                    if (existingProduct) {
                                        existingProduct.quantity += devolutionDetail.quantity;
                                    } else {
                                        dataToSend.push({
                                            itemName: item.name,
                                            quantity: devolutionDetail.quantity,
                                            itemId: item._id
                                        });
                                    }
                                } else {
                                    prod.push(item.name);
                                    dataToSend.push({
                                        itemName: item.name,
                                        quantity: devolutionDetail.quantity,
                                        itemId: item._id
                                    });
                                }
                            }
                        });
                    });
                });
            });
        }

        if (devolution.length > 0) {
            devolution.forEach((devolution: any) => {
                devolution.detail.forEach((devolutionDetail: any) => {
                    const item = products.find(
                        (product: any) => product._id === devolutionDetail.item
                    );

                    if (item) {
                        if (prod.includes(item.name)) {
                            const existingProduct = dataToSend.find(
                                (itemDats) => itemDats.itemName === item.name
                            );
                            if (existingProduct) {
                                existingProduct.quantity += devolutionDetail.quantity;
                            } else {
                                dataToSend.push({
                                    itemName: item.name,
                                    quantity: devolutionDetail.quantity,
                                    itemId: item._id
                                });
                            }
                        } else {
                            prod.push(item.name);
                            dataToSend.push({
                                itemName: item.name,
                                quantity: devolutionDetail.quantity,
                                itemId: item._id
                            });
                        }
                    }
                });
            });
        }

        return dataToSend;
    } else {
        return [];
    }
};

export const getSaleClientContract = (client: Client | null) => {
    if (client) {
        if (!client.hasLoan) {
            return "SIN PRESTAMO"
        } else {
            if (client.hasExpiredContract) {
                return "PRESTAMO CON CONTRATO VENCIDO"
            } else {
                return client.hasContract ? "PRESTAMO CON CONTRATO VIGENTE" : "PRESTAMO SIN CONTRATO"
            }
        }
    } else {
        return "SIN CLIENTE"
    }
}

export const setDetailClient = (loans: Array<Loans>, products: Array<Item>): { itemId: string; itemName: string; quantity: number }[] => {
    //Guarda los detalles del cliente
    if (loans.length > 0) {
        const prod: Array<string> = [];
        const dataToSend: { itemId: string; itemName: string; quantity: number }[] = [];
        loans.forEach((loan: any) => {
            loan.detail.forEach((detail: any) => {
                const product = products.find(
                    (product: any) => product._id === detail.item
                );
                if (product === undefined) return;

                if (prod.includes(product.name)) {
                    const existingProduct = dataToSend.find(
                        (item) => item.itemName === product.name
                    );
                    if (existingProduct) {
                        existingProduct.quantity += detail.quantity;
                    } else {
                        dataToSend.push({
                            itemName: product.name,
                            quantity: detail.quantity,
                            itemId: product._id
                        });
                    }
                } else {
                    prod.push(product.name);
                    dataToSend.push({
                        itemName: product.name,
                        quantity: detail.quantity,
                        itemId: product._id
                    });
                }
            })
        });

        return dataToSend;
    } else {
        return [];
    }
};