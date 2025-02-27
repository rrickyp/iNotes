const arr = ['css', 'js', 'ts'];

const fromIndex = arr.indexOf('css'); // 👉️ 0
const toIndex = 2;

const element = arr.splice(fromIndex, 1)[0];
console.log(arr); // ['css']

arr.splice(toIndex, 0, element);

console.log(arr); // 👉️ ['js', 'ts', 'css']
