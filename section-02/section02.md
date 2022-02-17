# Next-Gen JavaScript

## 목차

- [let & const](#let_&_const)
- [Arrow Functions](#Arrow_Functions_화살표_함수)

</br>

## let & const

- 과거의 JavaScript에서는 var가 존재했으나, ES6 부터는 let과 const가 등장했다.
- let은 재선언이 가능한 변수값을 만들 때 사용한다.
- const는 재선언이 불가능한 상수값을 만들 때 사용한다.

### let

```js
let myName = "min";
console.log(myName); // min

myName = "teasan";
console.log(myName); // teasan
```

### const

```js
let myName = "min";
console.log(myName); // min

myName = "teasan";
console.log(myName); // TypeError: Assignment to constant variable.
```

</br>

## Arrow Functions 화살표 함수

- Arrow Functions 구문은 function을 생략하기 때문에 일반 function 구문 보다 짧은 편이다.
- Arrow Function 은 this가 들어가서 발생하는 대부분의 JavaScript 문제를 해결해준다는 큰 장점이 있다.
- 일반적인 함수로 코드를 작성할 때 this가 항상 원하는 객체를 참조하지 않는다. 하지만 Arrow Function을 사용하면 이런 문제를 일으키지 않는다.

### 일반적인 함수

```js
function printMyName(name) {
  console.log(name);
}

printMyName("Teasan"); // Teasan
```

### Arrow Functions 화살표 함수

```js
const printMyName = (name) => {
  console.log(name);
};

printMyName("Teasan"); // Teasan
```

- 만약 인수가 하나 뿐이라면, 인수를 둘러싸고 있는 괄호를 생략할 수도 있다.

```js
const printMyName = (name) => {
  console.log(name);
};

printMyName("Teasan"); // Teasan
```

- 만약 인수가 없는 함수를 작성한다면, 반드시 빈 괄호 한쌍을 입력해주어야 한다.

```js
const printMyName = () => {
  console.log("Teasan"); // Teasan
};
```

- 만약 인수가 하나 이상일 때에도, 인수를 둘러싸고 있는 괄호가 반드시 필요하다.

```js
const printMyName = (name, age) => {
  console.log(name, age);
};

printMyName("Teasan", 17); // Teasan 17
```

- 만약 본문이 return 하나라면,

```js
const multiply = (number) => {
  return number * 2;
};

console.log(multiply(2)); // 4
```

- 한줄로 생략할 수 있으며, return도 생략이 가능해진다.

```js
const multiply = number => number * 2;

console.log(multiply(2)); // 4
```
