import excel from 'exceljs';

const exportExcelService = (res: any, workbook: any, worksheet: excel.Worksheet, dataRow: any[]) => {
	// template
	worksheet.mergeCells('G2:I2');
	worksheet.mergeCells('G3:I3');
	worksheet.getCell('G2').value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
	worksheet.getCell('G2').font = {
		family: 4,
		size: 17,
		bold: true,
	};
	worksheet.getCell('G2').alignment = { horizontal: 'center' };
	worksheet.getCell('G3').value = 'Độc lập - Tự do - Hạnh phúc';
	worksheet.getCell('G3').font = {
		family: 4,
		size: 14,
		underline: true,
	};
	worksheet.getCell('G3').alignment = { vertical: 'middle', horizontal: 'center' };
	// Add Array Rows
	worksheet.addRows(dataRow);
	worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
		if (rowNumber >= 9) {
			worksheet.getCell(`A${rowNumber}`).border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' },
			};
			worksheet.getCell(`A${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'center' };

			const insideColumns = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
			insideColumns.forEach(v => {
				worksheet.getCell(`${v}${rowNumber}`).alignment = { vertical: 'middle', horizontal: 'center' };
				worksheet.getCell(`${v}${rowNumber}`).border = {
					top: { style: 'thin' },
					bottom: { style: 'thin' },
					left: { style: 'thin' },
					right: { style: 'thin' },
				};
			});

			worksheet.getCell(`F${rowNumber}`).border = {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' },
			};
		}
	});
	res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	res.setHeader('Content-Disposition', 'attachment; filename=' + 'test.xlsx');

	workbook.xlsx
		.write(res)
		.then(function() {
			res.end();
			console.log('File write done........');
		})
		.catch((err: any) => {
			console.log(err);
			res.status(500).json({ errors: 'Lỗi hệ thống' });
		});
};
const exportExcelServiceCustomRow = (res: any, workbook: any, worksheet: excel.Worksheet) => {
	// template
	worksheet.mergeCells('G2:L2');
	worksheet.mergeCells('G3:L3');
	worksheet.getCell('G2').value = 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM';
	worksheet.getCell('G2').font = {
		family: 3,
		size: 15,
		bold: true,
	};
	worksheet.getCell('G2').alignment = { horizontal: 'center' };
	worksheet.getCell('G3').value = 'Độc lập - Tự do - Hạnh phúc';
	worksheet.getCell('G3').font = {
		family: 3,
		size: 12,
		underline: true,
	};
	worksheet.getCell('G3').alignment = { vertical: 'middle', horizontal: 'center' };


	res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	res.setHeader('Content-Disposition', 'attachment; filename=' + 'test.xlsx');

	workbook.xlsx
		.write(res)
		.then(function() {
			res.end();
			console.log('File write done........');
		})
		.catch((err: any) => {
			console.log(err);
			res.status(500).json({ errors: 'Lỗi hệ thống' });
		});
};

export { exportExcelService, exportExcelServiceCustomRow };
