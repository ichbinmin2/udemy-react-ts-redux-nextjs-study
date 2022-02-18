# Next-Gen JavaScript

## 목차

- [let & const](#let-&-const)
- [Arrow Functions](#Arrow-Functions-화살표-함수)
- [Exports and Imports(Modules)](#Exports와-Imports)
- [Understanding Classes](#클래스를-이해하기)

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
