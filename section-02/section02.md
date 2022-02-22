# Next-Gen JavaScript

## 목차

- [let & const](#let-&-const)
- [Arrow Functions](#Arrow-Functions-화살표-함수)
- [Exports and Imports(Modules)](#Exports와-Imports)
- [Understanding Classes](#클래스를-이해하기)
- [Classes, Properties and Methods](#클래스의-속성-및-메서드)
- [The Spread & Rest Operator](#스프레드-및-나머지-연산자)
- [Destructuring](#Destructuring-구조분해할당)
- [Reference and Primitive Types Refresher](#참조형-및-원시형-데이터타입)

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
const multiply = (number) => number * 2;

console.log(multiply(2)); // 4
```

</br>

## Exports와 Imports

- 차세대 자바스크립트는 모듈식 코드 작성이 가능하다.

### Exports

- default 명령어를 통해파일을 내보내기 할 수 있게 만들어준다.

#### person.js

```js
const person = {
  name: "Teasan",
};

export default person;
```

- 여러파일 내보낼 때는 이렇게 작성할 수 있다.

#### utilty.js

```js

export const clean = () => { ...}
export const baseData = 10;
```

### Imports

- person.js와 utilty.js를 import 해보자.

#### app.js

```js
// "default" 명령어를 사용하여 내보낸 person.js를 가져올 때
import person from "./person.js";
import pss from "./poerson.js";
```

- person.js는 default를 사용하여 export 하였다. 파일을 가져올 때, 다른 이름을 설정하여 가져올 수 있도록 만들어주는 역할을 한다. 즉, 한 번 default로 지정해놓으면 언제나 참조할 수 있게 되는 것이다.

```js
// utility.js를 가져올 때
import { clean } from "./utility.js";
import { baseData } from "./utility.js";
```

- 반면, default를 사용하지 않고 export를 한 utility.js를 가져올 때는 두 가지 상수를 가져왔으므로 구문을 가져올 때 중괄호를 사용한다. 파일에 있는 특정한 콘텐츠를 대상으로 하기 때문이다. utility.js는 clean과 baseData를 이름을 통해 내보냈기 때문에 '이름으로 내보내기'라고 부른다.
- 두 가지의 상수를 하나의 파일에서 가져오기 떄문에, 중괄호를 감싼 명령문 하나로 사용해도 된다.

```js
import { clean, baseData } from "./utility.js";
```

- JavaScript가 문제 없이 동작하기 위해서는 '이름'을 정확하게 입력하여 받아와야 할 것이다.

### 기본 내보내기를 할 때 다르게 작성해보기 (변형 구문)

- default export

```js
import person from "./person.js";
import prs from "./person.js";
```

- named export

```js
// 이름으로 가져오기 * 가장 흔히 사용하는 방법
import { clean } from "./utility.js";

// 이름을 변경하여 가져오기
import { clean as Clean } from "./utility.js";

// utility에서 정의된 모든 상수들을 전부 가져오기
import * as bundled from "./utility.js";
```

- 파일 속성으로 각각 내보낼 때는 `bundled.baseData` 혹은 `bundled.clean` 으로 내보내면 된다.

</br>

## 클래스를 이해하기

- 클래스는 개체를 위한 청사진이다.
- 클래스는 class를 통해 생성할 수 있다.

```js
class Person {
  name = "Teasan"; // Property 속성, 클래스의 변수
  call = () => {...} // Method, 클래스의 함수
}

```

- Property나 Method를 추가할 때 Class는 '인스턴스'화 된다.

```js
const myPerson = newPerson();
myPerson.call();
console.log(myPerson.name);
```

- Class는 생성자 함수를 만드는 간단한 방법이라고 보면 된다.
- Class 청사진으로 JavaScript 개체를 만드는 것이다.
- Class는 상속도 가능하다.

```js

class Person extends Master;

```

- 다른 Class를 상속하면 해당하는 클래스의 모든 속성과 메서드를 그대로 가져올 수 있다. 또한, 새로운 속성과 메서드도 추가할 수 있게 된다.

### constuctor 생성자

- 생성자 메서드로 속성을 추가한다. 모든 클래스에 추가할 수 있으며, 언제든지 클래스를 인스턴스화하면 실행된다.

```js
class Person {
  constructor() {
    this.name = "Teasan";
  }

  printMyName() {
    // 메서드 함수 추가
    console.log(this.name);
  }
}

// 상수로 클래스를 인스턴스로 저장하기
const person = new Person();

person.printMyName(); // "Teasan"
```

- 물론 이 Class도 상속이 가능하다.

```js
class Human {
  consturctor() {
    this.gender = "female";
  }

  printGender() {
    console.log(this.gender);
  }
}
```

- 이 Human 클래스를 Person에 상속해서 사용해보자.

```js
class Human {
  consturctor() {
    this.gender = "female";
  }

  printGender() {
    console.log(this.gender);
  }
}

class Person extends Human {
  constructor() {
    this.name = "Teasan";
  }

  printMyName() {
    console.log(this.name);
  }
}

const person = new Person();
person.printGeander(); // error!!!
person.printMyName(); // error!!!
```

- 에러가 나는 이유 : 파생 클래스에는 반드시 `super` 생성자가 필요하다.

### super 파생 클래스 확장을 위한 super 메서드

```js
class Human {
  constructor() {
    this.gender = "female";
  }

  printGender() {
    console.log(this.gender);
  }
}

class Person extends Human {
  constructor() {
    super();
    this.name = "Teasan";
  }

  printMyName() {
    console.log(this.name);
  }
}

const person = new Person();
person.printGender(); // error!!!
person.printMyName(); // error!!!
```

- 다른 클래스를 확장하려고 생성자를 구현하고 있기 때문에 생성자에 super 메서드를 추가해야 정상적으로 동작한다.
- 이렇게 작성해주면 부모 생성자를 실행해주고, 동시에 부모 클래스를 초기화할 수 있게 된다.

```js
class Human {
  constructor() {
    this.gender = "female";
  }

  printGender() {
    console.log(this.gender);
  }
}

class Person extends Human {
  constructor() {
    // 파생 클래스에는 반드시 super() 메서드를 추가해야 한다.
    super();
    this.name = "Teasan";
  }

  printMyName() {
    console.log(this.name);
  }
}

// 상수로 클래스를 인스턴스로 저장하기
const person = new Person();
person.printGender(); // "female"
person.printMyName(); // "Teasan"
```

- 파생 클래스에서는 상속 받은 부모 클래스의 속성을 새롭게 추가할 수도 있을 것이다.

```js
class Human {
  constructor() {
    this.gender = "female";
  }

  printGender() {
    console.log(this.gender);
  }
}

class Person extends Human {
  constructor() {
    super();
    this.name = "Teasan";
    this.gender = "male";
  }

  printMyName() {
    console.log(this.name);
  }
}

// 상수로 클래스를 인스턴스로 저장하기
const person = new Person();
person.printGender(); // "male"
person.printMyName(); // "Teasan"
```

- 클래스는 리액트 구성 요소를 만들 때 사용한다.

</br>

## 클래스의 속성 및 메서드

- 새로운 JavaScript 는 속성, 메서드를 초기화하는 다양한 구문을 지원한다.

### ES6 | Property

```js
constructor() {
  this.myProperty = 'value';
}

```

### ES7 | Property

```js
myProperty = "value";
```

- 최신 JS에서는 this 없이 클래스에 바로 속성을 할당할 수 있게 되었다.
- 또한, constructor 생성자 함수 호출도 필요하지 않게 되었다.

### ES6 | Methods

```js

myMethod() { ... };

```

### ES7 | Methods

```js

myMethod = () => { ... };

```

- 최신 JS에서는 속성을 설정하는 왼쪽 구문을 사용한다.
- 메서드는 함수를 값으로 저장하는 속성이라고 보면 된다.
- 최신 JS에서의 클래스 메서드는 화살표 함수를 속성 값으로 쓰기 때문에, this를 문제없이 사용할 수 있게 된다.

### ES6 | Example

```js
class Human {
  constructor() {
    this.gender = "female";
  }

  printGender() {
    console.log(this.gender);
  }
}

class Person extends Human {
  constructor() {
    super();
    this.name = "Teasan";
    this.gender = "male";
  }

  printMyName() {
    console.log(this.name);
  }
}

const person = new Person();
person.printGender(); // "male"
person.printMyName(); // "Teasan"
```

### ES7 | Example

```js
class Human {
  // constructor : 생성자 함수 생략
  gender = "female"; // this 생략

  printGender = () => {
    // 화살표 함수 사용
    console.log(this.gender);
  };
}

class Person extends Human {
  // constructor 생성자 함수 생략
  // super() : 파생 클래스에 추가해야하는 super도 생략
  name = "Teasan";
  gender = "male";

  printMyName = () => {
    // 화살표 함수 사용
    console.log(this.name);
  };
}

const person = new Person();
person.printGender(); // "male"
person.printMyName(); // "Teasan"
```

</br>

## 스프레드 및 나머지 연산자

- 전개 연산자 및 나머지 연산자는 최신 JavaScript에서 사용할 수 있게 되었다.
- 연산자 하나에 점 세개 `...`로 표기할 수 있다.
- 연산자는 어디에서 사용하는지에 따라 전개 연산자(Spread Operator)와 나머지 연산자(Rest Operator)로 나뉜다.

### Spread Operator 전개 연산자

- Spread Operator(전개 연산자)는 '배열' 요소나 '객체' 속성을 나누는 데 사용된다.
- 예를 들어, 예전 배열(혹은 객체)의 모든 요소를 새로운 배열(혹은 객체)에 추가하고 싶을 때 사용할 수 있다.

```js
// array
const newAray = [...oldArray, 1, 2];
// object
const newObject = { ...oldObject, newProp: 5 };
```

- Spread Operator를 사용하지 않고 새로운 배열을 생성했을 때

```js
const numbers = [1, 2, 3];
const newNumber = [numbers, 4];

console.log(newNumber); // [[1, 2, 3], 4] <= 새 배열 안에 예전 요소가 배열로 추가되고 있다.
```

- Spread Operator를 사용해서 새로운 배열을 생성했을 때

```js
const numbers = [1, 2, 3];
const newNumber = [...numbers, 4];

console.log(newNumber); // [1, 2, 3, 4]
```

- Spread Operator를 사용해서 새로운 객체를 생성했을 때

```js
const person = {
  name: "Teasan",
};

const newPerson = {
  ...person,
  age: 28,
};

console.log(newPerson); // [object Object] {age: 28, name: "Teasan"}
```

- Spread Operator는 배열을 편리하게 복사하거나, 예전 객체를 복사하면서 객체에 속성을 추가할 때 사용된다.

### Rest Operator 나머지 연산자

- 매개변수 리스트를 배열로 통합하는 연산자. 전개 연산자와 하는 일이 다르다.

```js
function sortArgs(...args) {
  return args.sort();
}
```

- 예시의 `sortArgs`는 매개변수를 무한정 받는다.
- 매개변수가 몇 개인지는 상관이 없다. 하나 이상의 매개변수를 받고 그것을 배열로 합쳐준다.
- 따라서, 배열 방법을 매개변수 리스트에 적용하거나, 기존의 매개변수에 뭐든지 할 수 있게 된다.

```js
const filter = (...args) => {
  return args.filter((el) => el === 1);
};

console.log(filter(1, 2, 3)); // [1]
```

</br>

## 구조분해할당

- 구조 분해(Destructuring)는 배열 요소나 객체 속성을 추출해서 변수로 저장하는 역할을 한다.
- 전개 연산자(Spread Operator)는 모든 요소와 속성을 새 배열이나 새 객체에 분배하는 반면, 구조 분해(Destructuring)는 하나의 요소나 속성만을 배열이나 객체를 위한 변수로 저장한다.
- 구조 분해(Destructuring)는 배열에서 사용하는 Array Destructuring(배열 구조 분해)과 객체에서 사용하는 Object Destructuring(객체 구조 분해)로 나뉜다.
- Array Destructuring(배열 구조 분해)에서는 순서가 어떤 속성을 취할지 정했다면, Object Destructuring(객체 구조 분해)에서는 속성의 이름이 정한다.

### Array Destructuring 배열 구조분해할당

```js
[a, b] = ["Hello", "Teasan"];
console.log(a); // Hello
console.log(b); // Teasan
```

- 변수 a와 b를 "Hello"와 "Teasan"에 순서대로 할당해주고 있다.

```js
const numbers = [1, 2, 3];
[num1, num2] = numbers;
console.log(num1, num2);
// 1
// 2
```

```js
const numbers = [1, 2, 3];
[num1, , num3] = numbers;
console.log(num1, num3);
// 1
// 3
```

### Object Destructuring 객체 구조분해할당

```js

{name} = {name: "Teasan", age: 28};
console.log(name); // Teasan
console.log(age); // undefined

```

- 객체 구조 분해에서는 속성의 이름이 어떤 속성을 취할지를 정하기 때문에, 왼쪽에 있는 중괄호가 오른쪽에 있는 속성을 지정하고 값을 추출하는 방식이다.
- 따라서, 왼쪽 중괄호 안에 있는 이름이 두번째 속성 `age`를 취하고 있지 않기 때문에 `age`의 값이 정의되지 않았다(`undefined`)고 나오는 것이다. 즉, 변수가 `age`라는 객체를 추출하지 않았다는 뜻과 동일하다.

</br>

## 참조형 및 원시형 데이터타입

- JavaScript에는 원시형 타입과 참조형 타입으로 나뉜다.

### Primitive Type 원시형 타입

```js
const number = 1;
const num2 = number;

console.log(num2); // 1
```

- `number` 값인 1을 `num2`가 복사했기 때문에 `num2`의 값은 1이 나온다.
- 숫자, 문자, boolean 등이 원시형 타입의 종류라고 할 수 있다.
- 원시형 타입은 언제든 다른 변수에 변수를 재할당하고 저장할 수 있다.

### Reference Type 참조형 타입

- 객체와 배열은 참조형 타입이다.

```js
const person = {
  name: "Teasan",
};

const secondPerson = person;
console.log(secondPerson); // const person = { name: "Teasan" };
```

- 실행하면 `secondPerson`은 `person`과 같은 결과값을 출력한다. 하지만 `person` 자체를 복사하지는 않았다.
- 객체인 `person`은 메모리에 저장되고, 상수인 `person`은 메모리에 포인터를 저장한다. 그리고 `person`을 `secondPerson`에 할당하면 포인터가 복사될 것이다.

```js
const person = {
  name: "Teasan",
};

const secondPerson = person;
person.name = "Min";
console.log(secondPerson); // const person = { name: "Min" };
```

- `person`을 복사했기 때문에 `Teasan`이 나올 것이라는 예상과는 달리, `Min`이라는 값이 출력됐다.
- 왜냐하면, 포인터를 복사해서 메모리에 있는 같은 객체를 지정했기 때문이다. 따라서 `person`의 `name`이 바뀌면 자동으로 `secondPerson`의 이름 역시 바뀌게 되는 것을 확인할 수 있다.
- 이렇게 객체나 배열을 복사하면 하나의 장소에서 컨트롤 할 수 있게 된다.
- 따라서 원하지 않는 방식으로 객체 혹은 배열의 변화를 방지하기 위해 복사하는 방법을 이해하며 사용해야 할 것이다. 즉, 포인터가 아니라 객체를 완전히 복사하는 방식으로 이루어져야 한다는 의미이다.

```js
const person = {
  name: "Teasan",
};

const secondPerson = {
  ...person,
};

person.name = "Min";
console.log(secondPerson); // const person = { name: "Teasan" };
```

- Spread Operator 전개 연산자를 통해 `secondPerson` 객체 안에서 `person`을 복사하면, 객체의 속성과 값을 추출하고 새로 만들어진 `secondPerson` 객체에 추가가 된다.
- Spread Operator 전개 연산자를 사용하면 `person.name`으로 지정한 값인 `Min`이 아니라, 앞서 복사한 값인 `person`의 값인 `Teasan`이 출력됨을 확인할 수 있다.
- 이처럼 객체와 배열은 참조형 타입이며 객체와 배열을 재할당하게 됐을 시, 값이 아니라 포인터를 복사하게 됨을 명심해야 한다. (따라서, 완전히 객체와 배열을 복사해야한다면, 새 객체를 만들고 전개 연산자를 통해 속성만 복사하는 방식을 사용해야 한다.)
