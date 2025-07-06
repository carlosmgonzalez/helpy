export function formatPrice(num: number): string {
	const numeroBase = Math.ceil(num);
	const esNegativo = numeroBase < 0;
	const absNumeroStr = String(Math.abs(numeroBase));

	const longitud = absNumeroStr.length;
	let numeroAbsFormateado = '';

	for (let i = 0; i < longitud; i++) {
		numeroAbsFormateado = absNumeroStr[longitud - 1 - i] + numeroAbsFormateado;

		if ((i + 1) % 3 === 0 && i + 1 < longitud) {
			numeroAbsFormateado = '.' + numeroAbsFormateado;
		}
	}

	const signo = esNegativo ? '-' : '';

	return `${signo}$${numeroAbsFormateado}`;
}
