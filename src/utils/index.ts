export function formatCurrency(number:string) {
    // 1. Redondea el número al entero más cercano (0 decimales).
    const roundedNumber = Math.round(+number);

    // 2. Crea una instancia de Intl.NumberFormat para el formato de moneda en español de Colombia.
    // La configuración `style: 'currency'` formatea el valor como moneda.
    // `currency: 'COP'` especifica la moneda (pesos colombianos).
    // `minimumFractionDigits: 0` y `maximumFractionDigits: 0` aseguran 0 decimales.
    const formatter = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    // 3. Formatea el número y reemplaza el símbolo de la moneda 'COP' por '$'.
    return formatter.format(roundedNumber).replace('COP', '$');
}

export function formatDate(isoDate:string){
    const date = new Date(isoDate)

    const formatter = new Intl.DateTimeFormat('es-ES',{
        month:'short',
        year:'numeric',
        day:'2-digit'
    })

    return formatter.format(date)
}