/**
 * sort random element in array
 * @param arr array
 */
export default function shuffle(arr: String[]): String[] {
	let arrLenght = arr.length;
	let index;
	let temp;
	while (arrLenght > 0) {
		index = Math.floor(Math.random() * arrLenght);
		arrLenght--;
		temp = arr[arrLenght];
		arr[arrLenght] = arr[index];
		arr[index] = temp;
	}
	return arr;
}
