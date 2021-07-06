const ChuSo = [' Không ', ' Một ', ' Hai ', ' Ba ', ' Bốn ', ' Năm ', ' Sáu ', ' Bảy ', ' Tám ', ' Chín '];
export default function convertNumberToText(value: number): string {
	// eslint-disable-next-line radix
	const chuc = value / 10;
	const donvi = value % 10;
	let KetQua = '';
	if (chuc === 0 && donvi === 0) return ChuSo[0];
	if (chuc === 1) KetQua += 'Mười ';
	switch (donvi) {
		case 1:
			if (chuc !== 0 && chuc !== 1) {
				KetQua += ' Mốt ';
			} else {
				KetQua += ChuSo[donvi];
			}
			break;
		case 5:
			if (chuc === 0) {
				KetQua += ChuSo[donvi];
			} else {
				KetQua += ' Lăm ';
			}
			break;
		default:
			if (donvi !== 0) {
				KetQua += ChuSo[donvi];
			}
			break;
	}
	return KetQua;
}
