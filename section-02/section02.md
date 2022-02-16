# Next-Gen JavaScript

## 목차

- [let & const](#let_&_const)
- [let & const](#let_&_const)

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

</br>

### const

```js
let myName = "min";
console.log(myName); // min

myName = "teasan";
console.log(myName); // TypeError: Assignment to constant variable.
```

</br>
