import smartwaterApi from "../api/SmartWaterApi";

const crearRegistroCaja = async (
  montoACobrar,
  clienteId,
  cashBills,
  creditBills
) => {
  try {
    const respuesta = await fetch("/cashRegisters/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: montoACobrar,
        type: "cobro",
        clientId: clienteId,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        cashSales: 0,
        cashBills: cashBills, // Usa el valor recibido
        currentSales: 0,
        creditBills: creditBills, // Usa el valor recibido
        accountsReceivable: 0,
        expenses: 0,
        cashExpenses: 0,
        currentExpenses: 0,
        cashObligationPayments: 0,
        currentObligationPayments: 0,
        expensesToPay: 0,
      }),
    });

    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status} ${respuesta.statusText}`);
    }

    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al registrar el cobro:", error);
    throw error;
  }
};

export default crearRegistroCaja;
