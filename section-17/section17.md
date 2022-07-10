# Practice Project : Adding Http & Forms To The Food Order App

## 목차

- [Moving "Meals" Data To The Backend](#Meals-데이터를-백엔드로-이동하기)
- [Fetching Meals via Http](#Http를-통해-Meal-데이터-가져오기)
- [Handling the Loading State](#로딩-State-다루기)
- [Handling Errors](#오류-처리하기)
- [Adding A Checkout Form](#결제-양식-추가하기)

</br>

## Meals 데이터를 백엔드로 이동하기

### Firebase Realtime Database

<img width="438" alt="image" src="https://user-images.githubusercontent.com/53133662/175865538-85636935-423b-4315-ba02-3039ba8c43a5.png">

- `AvailableMeals.js` 파일 내부에 있던 더미 데이터 `DUMMY_MEALS` 를 Firebase Realtime Database 에 수기로 작성하여 옮긴다.

</br>

## Http를 통해 Meal 데이터 가져오기

```js
const [meals, setMeals] = useState([]);

useEffect(() => {
  const fetchMaels = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx/meals.json"
    ).then();

    const responseData = await response.json();

    // 객체로 받아오기 때문에 배열화 시켜야 함.
    const loadedMeals = [];

    for (const key in responseData) {
      loadedMeals.push({
        id: key,
        name: responseData[key].name,
        description: responseData[key].description,
        price: responseData[key].price,
      });
    }

    setMeals(loadedMeals);
  };

  fetchMaels();
}, []);
```

- `fetch()` 함수를 사용하여 API를 연결하고 http 요청을 통해 데이터를 받아오는 로직이다.

```js
fetch();
```

- 먼저 `fetch()` 함수를 작성하되, `useEffect()` 훅 안에 넣어주자. 최초 1회 이후로 데이터를 새로 받아올 필요가 없기 때문에, 의존성 배열은 빈 배열로 남겨준다.

```js
useEffect(() => {
  fetch();
}, []);
```

- Firbase Realtime database 에 우리가 데이터를 담아둔 프로젝트의 링크에 "meals" 로 접근하여 해당 데이터를 받아올 수 있도록 한다. 주소 끝에는 `.json`을 붙여줘야 하는데, 이는 파이어베이스에서 요구하는 것으로 접근하고 싶은 데이터 이름 뒤에 붙이면 된다.

```js
useEffect(() => {
  fetch("https://react-http2-xxxxxxxxx/meals.json");
}, []);
```

- 다음으로는 파이어베이스가 이곳에서 노출한 REST API 엔드포인트로 요청을 보낼 것이다. 이 요청을 통해서 `meals` 데이터를 가져와야 한다. 앞서 `fetch` 를 통한 HTTP 요청에서 두 번째 인자로 HTTP 메소드 등을 변경하여 요청을 보낼 수도 있다. 하지만 현재는 데이터를 읽어오기만 하면 되고, `fetch` 함수의 디톨트는 "GET" 이기 때문에, 굳이 추가하거나 수정할 필요가 없을 것이다.

```js
useEffect(() => {
  fetch("https://react-http2-xxxxxxxxx/meals.json");
}, []).then();
```

- 이제 `fetch`는 promise를 반환한다. HTTP 요청을 보내는 것은 비동기 테스크이기 때문이다. 뒤에 `.then()` 함수를 추가한다. 이 `then()` 함수는 응답을 받으면 요청이 이루어질 때 트리거가 된다. 에러를 핸들링하거나 할 때 사용하기도 한다.

```js
useEffect(async () => {
  await fetch("https://react-http2-xxxxxxxxx.firebaseio.com/meals.json").then();
}, []);
```

- `async/await` 키워드를 사용할 수도 있다. 하지만 여기서 오류가 발생하는데 그 이유는 `useEffect()`로 입력한 함수에서는 promise로 반환해서는 안되기 때문이다. 앞서 학습했던 내용처럼 `useEffect`에 입력한 함수는 실행 가능한 cleanup 함수를 반환할지도 모르고, 이는 cleanup 함수가 동시에 실행되어야 한다는 뜻이기도 하다. 즉, promise 나 `async/await` 키워드를 사용한다면 cleanup을 반환하지 않는다. 따라서 `useEffect`에 입력한 현재의 이 함수는 `async` 함수로 변경해서는 안된다. 하지만 `useEffect` 대신 `async/await` 키워드를 사용하고 싶다면, 이런 방법을 사용할 수도 있다.

```js
useEffect(() => {
  const fetchMeals = async () => {
    await fetch("https://react-http2-xxxxxxxxx.firebaseio.com/meals.json");
  };

  fetchMeals();
}, []);
```

- 새로운 함수(`fetchMeals`)를 만들고 이 안에서 `async/await` 키워드를 사용하여 비동기적으로 프로미스를 반환하도록 하는 것이다. 그렇게 되면 `.then()`은 필요가 없으니 이 부분은 삭제해준다. 이러한 방식을 통해서 해당 함수는 여전히 실행되고, `useEffect` 함수 전체에서는 이제 promise를 반환하지 않고서도 우리는 `async/await` 키워드를 사용할 수 있게 된다. 이것은 모두 약간의 회피?방법이라고 말할 수 있을 것이다.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals.json"
    );
  };

  fetchMeals();
}, []);
```

- 그 다음에는 `fetchMeals` 함수 내부에서 `fetch()` 로 가져온 데이터를 `response` 상수 안에 넣어준다.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals.json"
    );
    const responseData = await response.json();
  };

  fetchMeals();
}, []);
```

- `response` 를 `json()`으로 변환하고, 그것을 `responseData` 변수에 할당한다. 이 역시 `fetchMeals` 함수 내부에서 promise를 반환하기 때문에 `await`를 붙여준다.

![image](https://user-images.githubusercontent.com/53133662/176393762-4cd43eaa-500d-4ee4-963b-4cd9d949a221.png)

- 이제 파이어베이스에서 얻은 `responseData`는 파이어베이스에 특정되어 있으며, 항상 이러한 `id`가 있는 객체가 될 것이다. 그리고 "m1, m2, m3, m4"가 key 가 되고, 키에 대한 값은

![image](https://user-images.githubusercontent.com/53133662/176394106-fad2f8ac-3e14-4d23-bf6e-cf5ded563153.png)

- 이러한 프로퍼티를 가진 중첩 객체가 된다. 코드로 다시 돌아가보자.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals.json"
    );
    const responseData = await response.json();
  };

  fetchMeals();
}, []);
```

- 우리는 현재 `responseData` 라는 객체를 가지고 있다. 하지만 우리가 아래의 코드들을 확인해봤을 때 객체가 아닌 배열이 필요하기 때문에 이것을 배열로 변환할 필요성이 있다.

```js
// 배열의 형태로 데이터를 받아야 한다.
const mealsList = DUMMY_MEALS.map((item) => (
  <MealItem
    key={item.id}
    id={item.id}
    name={item.name}
    description={item.description}
    price={item.price}
  />
));
```

- 먼저, `loadedMeals` 라는 이름의 빈 배열 상수를 생성하고,

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals.json"
    );
    const responseData = await response.json();

    const loadedMeals = [];
  };

  fetchMeals();
}, []);
```

- for in 반복문을 사용해서 `responseData` 즉, `responseData` 객체의 모든 키를 반복하여 `loadedMeals` 배열 안에 넣어주어야 한다.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals.json"
    );
    const responseData = await response.json();

    const loadedMeals = [];

    for (const key in responseData) {
      loadedMeals.push();
    }
  };

  fetchMeals();
}, []);
```

- `key`는 앞에서 얘기한 대로 파이어베이스의 "meals"이란 이름의 데이터 내부의 `id`를 가르킨다.

![image](https://user-images.githubusercontent.com/53133662/176394106-fad2f8ac-3e14-4d23-bf6e-cf5ded563153.png)

- 그리고 키의 값은 중첩 객체가 된다. 따라서 이곳에서 `loadedMeals`를 이용해 새로운 객체를 처음에 비어있던 배열에 밀어 넣을 것이다.

```js
for (const key in responseData) {
  loadedMeals.push({});
}
```

- 우리가 객체 안에 `id`를 상정하는 것은 `meals`가 `id` 필드를 가진다고 예상하기 때문이다.

```js
const mealsList = DUMMY_MEALS.map((item) => (
  <MealItem
    key={item.id}
    //
    id={item.id}
    //
    name={item.name}
    description={item.description}
    price={item.price}
  />
));
```

- 따라서 로딩된 데이터를 변환하여 `id` 필드를 갖도록 해야 한다.

```js
for (const key in responseData) {
  loadedMeals.push({
    id: key,
  });
}
```

- `id`는 `key`로 값을 설정하는데, 이는 앞서 말했다시피 `key`는 우리가 가지고 오는 개별 meal의 `id`가 되기 때문이다. 이제 나머지 `name, description, price` 필드를 마저 작성해보자. 주어진 데이터인 `responseData`에서 for in 으로 돌면서 각각의 필드 속성을 가져올 수 있을 것이다.

```js
for (const key in responseData) {
  loadedMeals.push({
    id: key,
    name: responseData[key].name,
    description: responseData[key].description,
    price: responseData[key].price,
  });
}
```

- 이제 가져와서 변환한 데이터 배열인 `loadedMeals` 를 나머지 컴포넌트에 노출해야만 한다. 그리고 가져오기가 완료되면 해당 컴포넌트를 다시 렌더링해야 한다. 이것은 비동기 테스크로 컴포넌트가 처음으로 로딩된 후에만 시작하기 때문이다. 따라서 처음에는 데이터가 없으며, 데이터가 그곳에 있을 경우에 컴포넌트를 업데이트해야 한다. 또 데이터가 변경되어 컴포넌트가 업데이트되고, 또 어플리케이션 전체가 다시 업데이트되어야 하는 경우를 고려해서 이를 위한 상태(state)가 필요하다는 걸 추측할 수 있을 것이다.

```js
const [meals, setMeals] = useState([]);
```

- 처음에는 빈 배열을 초기값으로 둔다. 데이터를 받아오기 전에 빈 배열로 처리해야 할 수도 있기 때문이다. 비록 처음은 빈 배열이지만 데이터가 로딩되면 meals 상태가 변경될 것이다.

```js
const mealsList = meals.map((item) => (
  <MealItem
    key={item.id}
    id={item.id}
    name={item.name}
    description={item.description}
    price={item.price}
  />
));
```

- 이제 아래의 `mealsList` 컴포넌트에서 `DUMMY_MEALS` 로 매핑해주던 것을 meals 상태(state)로 수정해준다. 이도 처음에는 빈 배열이지만 데이터가 로딩되면 변경될 것이다.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals.json"
    );
    const responseData = await response.json();

    const loadedMeals = [];

    for (const key in responseData) {
      loadedMeals.push();
    }

    setMeals(loadedMeals);
  };

  fetchMeals();
}, []);
```

- 따라서 for in 반복문 이후에 변환된 `loadedMeals` 데이터를 meals 업데이트 함수인 `setMeals`에 넣어준다. 이제 컴포넌트는 데이터가 업데이트가 될 것이다.

### 정리

- 비어있는 의존성 배열이 신경 쓰일테지만, 현재 `useEffect` 함수 내부에서 실행되는 로직들은 전부 의존성이 없고, 외부 컴포넌트에 특정된 데이터를 쓰고 있지도 않으니, 처음 로딩 될 때만 데이터를 받아오도록 즉 실행할 수 있도록 빈 배열로 두는 것이 맞기에 걱정할 필요가 없다는 걸 기억하자.

</br>

## 로딩 State 다루기

- `isLoding` 상태(state) 만들고, 초기값을 true로 설정하기.

```js
const [isLoding, setIsLoading] = useState(true);
```

- 데이터를 받아오고 있는 `useEffect` 내부의 `fetchMeals` 함수에서 모든 데이터 로딩이 끝나면 `setIsLoading` 상태 업데이트 함수를 사용해서 false로 업데이트하기.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals.json"
    );
    const responseData = await response.json();

    const loadedMeals = [];

    for (const key in responseData) {
      loadedMeals.push();
    }

    setMeals(loadedMeals);
    setIsLoading(false);
  };

  fetchMeals();
}, []);
```

- `isLoding` 상태 값을 이용하여 로딩 중임을 알리는 마크업 코드를 `mealsList` 컴포넌트 위에 작성.

```js
if (isLoding) {
  return (
    <section className={classes.MealsLoading}>
      <p>Loding...</p>
    </section>
  );
}

const mealsList = meals.map((item) => (
  <MealItem
    key={item.id}
    id={item.id}
    name={item.name}
    description={item.description}
    price={item.price}
  />
));
```

- 로딩 중임을 알리는 `<section>` 에 스타일을 입힌다.

```css
.MealsLoading {
  text-align: center;
  color: white;
}
```

- 저장하고 확인해보면,

![ezgif com-gif-maker - 2022-06-29T182010 608](https://user-images.githubusercontent.com/53133662/176401188-d7777858-e029-49df-bff7-b622d08079eb.gif)

- 새로고침을 할 때마다 "Loding..." 텍스트가 잠깐 보였다가 사라지는 걸 볼 수 있다. (파이어베이스가 빠른 백엔드를 가지고 있기 때문에 아주 잠시 동안만 깜빡인다.)

</br>

## 오류 처리하기

- error를 처리하는 방법을 학습하기 위해서 오류를 한 번 시뮬레이션 해볼 것이다. 아래는 우리가 데이터를 성공적으로 받아오도록 만들었던 `useEffect` 로직이다.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals.json"
    );
    const responseData = await response.json();

    const loadedMeals = [];

    for (const key in responseData) {
      loadedMeals.push();
    }

    setMeals(loadedMeals);
    setIsLoading(false);
  };

  fetchMeals();
}, []);
```

- 파이어베이스에서 요구하는 형식인 `.json`을 주소에서 삭제하고 저장한 뒤 확인해보면,

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals"
    );
    const responseData = await response.json();

    const loadedMeals = [];

    for (const key in responseData) {
      loadedMeals.push();
    }

    setMeals(loadedMeals);
    setIsLoading(false);
  };

  fetchMeals();
}, []);
```

![ezgif com-gif-maker - 2022-06-29T182608 692](https://user-images.githubusercontent.com/53133662/176402455-153b3f1a-c7f5-4f67-89ad-c442c0774ad4.gif)

- 데이터를 로딩하는 데 실패하게 된다. 앱에서는 "Loding..." 이라는 로딩 중일 때 화면에 출력되는 텍스트만 확인할 수 있다. 보통은 콘솔에서 이 데이터를 가져오는데 실패했다는 메세지를 보여주겠지만 사용자들은 콘솔을 사용해서 에러 메세지를 확인할리 만무하다. 그렇다면 우리는 어떻게 해야할까? 어떻게 사용자들에게 에러를 알려줄 수 있는 것일까?

### 오류를 표시하는 방법

- error를 표시하는 방법에는 여러가지가 있다. 즉, 우리가 선택하기 나름이라는 것이다. 이번에는 "Loding..." 처럼 메세지로 에러 메세지를 표시하려고 한다. 따라서 우리가 필요한 것은 에러가 발생할 때마다 업데이트되어 사용할 수 있는 상태(state) 값이다.

```js
const [httpError, setHttpError] = useState(null);
```

- `httpError` 상태를 생성하고, 초기 값을 비워두거나 아예 `null`로 설정해서 처음에 값을 갖지 않는다는 목적을 더 분명히 해두는 것도 좋을 것이다. 이제 데이터를 가져오는데 실패했을 때의 오류를 설정하자.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals"
    );

    if (!response.ok) {
    }

    const responseData = await response.json();

    const loadedMeals = [];

    for (const key in responseData) {
      loadedMeals.push();
    }

    setMeals(loadedMeals);
    setIsLoading(false);
  };

  fetchMeals();
}, []);
```

- 이 경우, 우선 실패 여부를 확인해야 하기 때문에, `if` 문을 작성하고 내부에 `!response.ok` 라는 조건을 넣는다. `ok`가 truthy 인 경우를 말하기 때문에 느낌표를 넣어서 falsy로 만들고, `response`가 `ok` 되지 않았을 때 즉, 데이터를 받아오는데 실패했을 때를 가정하고 로직을 작성한다.

```js
if (!response.ok) {
  throw new Error("Something went wrong!");
}
```

> throw new Error()는 줄이 실행되지 않는다는 것을 의미한다.

- 만약 `!response.ok`라면(데이터를 받아오는데 실패했다면) `throw new Error()`를 작성해서 새로운 오류를 생성하고 이 에러에 일반적인 오류 메세지("Something went wrong!")를 할당한다. 이제 이 만들어진 새로운 `error`를 가지고 핸들링을 해야한다.

- 우리는 여기서 `fetch` 로직을 랩핑 하기 위해 별도의 함수(`fetchMeals`)를 사용하는 것에 대한 또 다른 장점을 알 수 있다. `fetchMeals` 함수는 요청을 보낼 때 문제가 생기면 에러 메세지를 발생시킬 것이다. 따라서 `fetchMeals`로 이동해서 무언가를 추가해야만 한다.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals"
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const responseData = await response.json();
    const loadedMeals = [];

    for (const key in responseData) {
      loadedMeals.push();
    }

    setMeals(loadedMeals);
    setIsLoading(false);
  };

  try {
  } catch {}

  fetchMeals();
}, []);
```

- `fetchMeals()` 함수를 호출하는 줄은 `useEffect` 안에 있지만 ` fetchMeals` 함수의 외부에 있다. 그리고 이것을 우리는 `try/catch`로 래핑할 수 있게 된다.

> `try/catch` 는 try(시도하기)해서 catch(잡기)한다는 의미이다.

```js
try {
  fetchMeals();
} catch {}
```

- `try`(시도하기) 로직 안에서 `fetchMeals` 함수를 호출하고, `fetchMeals` 함수 내부에서 오류가 발생한다면 `catch`(잡기) 블록 안에서 무언가를 처리하도록 한다.

```js
try {
  fetchMeals();
} catch {
  setIsLoading(false);
}
```

- `catch` 블록 안에서 `setIsLoading(false)` 로 처리한다. `fetchMeals()` 함수를 `try`(시도) 했는데, 오류가 발생한다면 로딩을 멈추고(`setIsLoading(false)`), 뭔가의 에러 메세지를 처리하도록 해야되기 때문이다.

```js
try {
  fetchMeals();
} catch (error) {
  setIsLoading(false);
  setHttpError(error.message);
}
```

- 에러를 설정하기 위해 `setHttpError`를 호출하고 우리가 `catch`(잡은)한 오류 메세지(`error.message`)를 보여주도록 한다. 그럼 `try/catch`를 사용하여 이 `error`에 접근할 수 있게 되며 `httpError` 상태(state)에 우리가 이를 통해서 잡게 된 `error`에 대해 설정할 수 있게 되는 것이다. 더 정확하게는 `error.message`에 접근하고 설정할 수 있다는 뜻이다.

```js
if (!response.ok) {
  throw new Error("Something went wrong!");
}
```

- 우리는 `catch`를 통해서 `error` 객체를 얻게 되었고, 이 `error` 객체는 디폴트로 `message` 속성을 가지게 된다. `throw new Error()`를 통해서 `error`를 생성하고 생성자에 문자열("Something went wrong!")을 입력하면 생성된 `error` 객체의 `message` 속성에 해당 문자열이 저장될 것이다.

```js
if (isLoding) {
  return (
    <section className={classes.MealsLoading}>
      <p>Loding...</p>
    </section>
  );
}

if (httpError) {
  return (
    <section>
      <p></p>
    </section>
  );
}
```

- 이제 `httpError` 상태를 설정해야 한다. if 문을 통해서 `httpError` 상태 값이 비워져 있지 않다면 즉, 우리가 `throw new Error()`로 저장한 "Something went wrong!"가 `httpError` 상태 안에 들어있다면 분명 에러가 발생헀을 경우일 것이고 이에 대한 로직을 작성해야 할 것이다.

```js
if (httpError) {
  return (
    <section>
      <p>{httpError}</p>
    </section>
  );
}
```

- `httpError` 에 저장된 메세지를 출력하도록 `<p>` 태그 안에 `httpError` 상태를 넣어두고,

```js
if (httpError) {
  return (
    <section className={classes.MealsError}>
      <p>{httpError}</p>
    </section>
  );
}
```

- 에러 상태임을 알리도록 `<section>` 에 스타일을 입힌다.

```css
.MealsError {
  text-align: center;
  color: red;
}
```

- 저장하고, 다시 새로고침을 해보면 여전히 "Loding..." 만 표시되고 있는 걸 알 수 있다. 왜 그럴까?

```js
try {
  fetchMeals().catch();
} catch {
  setIsLoading(false);
}
```

- 이런 부분을 잡아내는 것은 꽤나 까다로울 수 있다. 이에 관한 이유를 이해하기 위해서는 우리가 `try/catch`를 사용하고 있지만 `fetchMeals` 는 `async` 함수 라는 사실을 기억해야 할 것이다.

### `fetchMeals` 는 `async` 함수이다.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals"
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const responseData = await response.json();
    const loadedMeals = [];

    for (const key in responseData) {
      loadedMeals.push();
    }

    setMeals(loadedMeals);
    setIsLoading(false);
  };

  try {
    fetchMeals().catch();
  } catch {
    setIsLoading(false);
  }
}, []);
```

- `fetchMeals` 는 `async` 함수이다. 이것이 무슨 뜻이냐 하면, 언제나 이 함수는 promise를 반환한다는 것이다. promise 대신 error를 가져오는 경우 그 오류로 인해 해당 promise가 거부하게 되고, 따라서 우리의 `try/catch`를 사용해서 그것을 래핑할 수 없게 되는 것이다. 그렇다면 우리는 어떻게 해결해야 할까? 방법은 간단하다.

```js
try {
  fetchMeals().catch(() => {});
} catch {
  setIsLoading(false);
  setHttpError(error.message);
}
```

- 바로 `try/catch`로 래핑한 것을 별도의 함수에 입력하는 것이다. promise에 `catch` 메서드에 추가하는 것이다. `fetchMeals()`가 promise를 반환하므로 `then()`을 추가해서 성공할 수 있었는데, 이는 promise가 성공적으로 이행했을 때를 가정해서 사용해야 한다. 아무튼 `fetchMeals()`에 `catch` 메서드를 추가하여, erorr를 다룰 수 있게 되었다. 그리고 이 error는 promise 내부에서 발생한다.

```js
fetchMeals().catch((error) => {});
```

- 따라서 `try/catch`를 사용하는 대신 우리가 얻는 error에 대해 `catch()`를 적용할 수 있을 것이다.

```js
fetchMeals().catch((error) => {
  setIsLoading(false);
  setHttpError(error.message);
});
```

- 그리고 `try/catch` 블록(`catch{}`) 안에서 호출하던 `setIsLoading`와 `setHttpError` 상태 로직도 `catch()` 안으로 옮기도록 한다.

```js
fetchMeals().catch((error) => {
  setIsLoading(false);
  setHttpError(error.message);
});
```

- 이것이 promise 내부의 error를 다룰 수 있는, 그리고 promise 만이 가능한 방법이다. 이제 다시 저장하고 로딩해보면,

![ezgif com-gif-maker - 2022-06-29T211212 035](https://user-images.githubusercontent.com/53133662/176433313-5a9cc6d5-2253-448d-aef1-f8fe0e81af29.gif)

- 잠깐 동안만 로딩이 표시되고 error 메세지 "Failed to fetch" 가 표시되는 걸 확인할 수 있다.

</br>

## 결제 양식 추가하기

- Cart 에 아이템 몇개를 추가하게 되면 이제 주문을 해야할 것이다. 주문을 하려면 Order 버튼을 누르도록 했지만, 현재 order 버튼은 아무런 기능을 수행하고 있지 않다.

![스크린샷 2022-07-10 오후 5 36 01](https://user-images.githubusercontent.com/53133662/178137576-132cc0fb-92e7-4514-ad16-d5d07f0d63c4.png)

- 이제 이 아무런 기능을 수행하고 있지 않은 order 버튼을 이용해서 사용자가 주소와 이름을 입력할 수 있는 양식을 표시하고자 한다. 그리고 그 양식에 대한 입력을 확인해서 해당 주문을 백엔드로 보낼 것이다.

### order 버튼을 이용한 사용자 양식 추가하기

- 먼저 Cart 컴포넌트의 코드로 돌아가보자.

```js
<Modal onClose={props.onClose}>
  {cartItems}
  <div className={classes.total}>
    <span>Total Amount</span>
    <span>{totalAmount}</span>
  </div>
  <div>
    <button className=['button--alt'] onClick={props.onClose}>
      Close
    </button>
    {hasItems && <button className={classes.button}>Order</button>}
  </div>
```

- 현재 Modal 컴포넌트를 렌더링해주고 있는 Cart 컴포넌트이다. 우리는 일단 Oder 버튼을 사용자가 누르면, 사용자가 입력을 할 수 있는 양식 폼을 추가하도록 할 것이다. 그 전에 새로운 컴포넌트 하나를 추가해보자.

### Checkout.js

```js
const Checkout = (props) => {
  return (
    <form>
      <div className={classes.control}>
        <label htmlFor="name">Your name</label>
        <input type="text" id="name" />
      </div>
      <div className={classes.control}>
        <label htmlFor="street">Street</label>
        <input type="text" id="street" />
      </div>
      <div className={classes.control}>
        <label htmlFor="postal">Postal Code</label>
        <input type="text" id="postal" />
      </div>
      <div className={classes.control}>
        <label htmlFor="city">City</label>
        <input type="text" id="city" />
      </div>
      <button type="button">Cancel</button>
      <button>Confirm</button>
    </form>
  );
};
```

- `<form>` 태그 안에 각각의 사용자 입력값을 받을 input 창을 만들고, 이것을 다 마치면 보낼 수 있는 버튼을 추가한다. 그리고 다시 Cart 컴포넌트로 돌아와, 해당 Checkout 컴포넌트를 import 하여 가져온다.

```js
import Checkout from "./Checkout";
```

- 그리고 Total Amount 아래에 해당 컴포넌트를 렌더링 한다.

```js
return (
  <Modal onClose={props.onClose}>
    {cartItems}
    <div className={classes.total}>
      <span>Total Amount</span>
      <span>{totalAmount}</span>
    </div>
    <Checkout />
    <div>
      <button className=['button--alt'] onClick={props.onClose}>
        Close
      </button>
      {hasItems && <button className={classes.button}>Order</button>}
    </div>
  </Modal>
);
```

- Cart 컴포넌트 모달에 Checkout 컴포넌트의 폼 양식이 제대로 표기되는 걸 확인할 수 있다. 그러나 아직 폼이 Order 버튼을 누르기 전부터 드러나고 있으므로 이 부분을 해결해야 한다.

### order 버튼으로 사용자 양식 드러내기

- 먼저 order 버튼이 될 때만 결제 양식이 표시되도록 하기 위해서는 상태(state) 값이 필요하다.

```js
const [isCheckout, setIsCheckout] = useState(false);
```

- `isCheckout` 상태의 기본값은 false로 설정해주고, `onClick` 트리거 함수를 하나 만들어서 버튼이 클릭 될 때마다 해당 `isCheckout`가 업데이트될 수 있도록 해준다.

```js
const orderHandler = () => {
  setIsCheckout(true);
};
```

- 이제 우리가 설정한 이 `isCheckout` 상태(state)를 이용해서 조건부로 Checkout 컴포넌트(사용자 양식 폼)를 렌더링해줄 것이다.

```js
return (
  <Modal onClose={props.onClose}>
    {cartItems}
    <div className={classes.total}>
      <span>Total Amount</span>
      <span>{totalAmount}</span>
    </div>
    {isCheckout && <Checkout />}
    <div>
      <button className=['button--alt'] onClick={props.onClose}>
        Close
      </button>
      {hasItems && <button className={classes.button}>Order</button>}
    </div>
  </Modal>
);
```

- `isCheckout` 가 truthy 라면 Checkout 컴포넌트를 렌더링해줄 수 있도록 설정했다. 그리고 Order 버튼을 클릭했을 때 사용자 양식 폼(Chekcout 컴포넌트)이 가시화되고, 이전의 Close나 Order 버튼은 더이상 나타나지 않도록 해주면 더 좋을 것이다.

```js
const modalActions = (
  <div className={classes.actions}>
    <button className={classes["button--alt"]} onClick={props.onClose}>
      Close
    </button>
    {hasItems && (
      <button onClick={orderHandler} className={classes.button}>
        Order
      </button>
    )}
  </div>
);
```

- 아래에서 버튼을 담당하고 있는 태그들을 모조리 긁어와, 변수 `modalActions`에 할당한다. 그리고,

```js
return (
  <Modal onClose={props.onClose}>
    {cartItems}
    <div className={classes.total}>
      <span>Total Amount</span>
      <span>{totalAmount}</span>
    </div>
    {isCheckout && <Checkout onCancel={props.onClose} />}
    {!isCheckout && modalActions}
  </Modal>
);
```

- `isCheckout` 상태(state)가 false가 되어 있을 때만 해당 버튼들을 담은 변수 `modalActions`가 렌더링되도록 연산했다.

### 양식에 새로운 버튼 추가하기

- Checkout 컴포넌트의 사용자 양식에 Confirm 버튼 뿐만 아니라, 새로운 버튼을 추가해보고자 한다. 바로 Cancle 이라는 버튼이다. 이때 중요한 것인 `type="button"`을 입력하여, 이 버튼이 양식을 제출하지 않아야만 한다. 그러니까, Confirm 버튼만 양식 폼을 제출하도록 제어해야 한다는 뜻이다.

```js
const modalActions = (
  <div className={classes.actions}>
    <button className={classes["button--alt"]} onClick={props.onClose}>
      Close
    </button>
    {hasItems && (
      <button onClick={orderHandler} className={classes.button}>
        Order
      </button>
    )}
  </div>
);
```

- Cart 컴포넌트의 Cancel 버튼을 클릭하면 모달이 닫히는 것처럼 결국에는 Cart 컴포넌트에 적용한 작업과 동일한 작업을 해주면 된다.

```js
<Modal onClose={props.onClose}>
  {cartItems}
  <div className={classes.total}>
    <span>Total Amount</span>
    <span>{totalAmount}</span>
  </div>
  {isCheckout && <Checkout onCancel={props.onClose} />}
  {!isCheckout && modalActions}
</Modal>
```

- 일단 Checkout 컴포넌트에 `props`로 `onClose` 트리거 이벤트 함수를 `onCancel` 라는 이름으로 내려주고, Checkout 컴포넌트로 이동하여,

```js
<button type="button" onClick={props.onCancel}>
  Cancel
</button>
<button>Confirm</button>
```

- Cancel 버튼의 `onClick` 이벤트로 해당 트리거 함수를 포인터해준다. 저장하고 확인해보면,

![ezgif com-gif-maker - 2022-07-10T182232 161](https://user-images.githubusercontent.com/53133662/178138923-e6797755-b543-4dc6-a23e-26d931b144d1.gif)

- Order 버튼을 누르면 사용자 폼이 나타나고, 사용자 폼의 cancel 버튼을 누르면 모달이 정상적으로 닫히는 것을 확인할 수 있다.

### 사용자 양식 폼 제출하기

- 이제 Confirm 버튼을 클릭하면 양식을 제출할 수 있도록 작업해줄 것이다. 그 전에 사용자 폼에서 사용자의 입력을 검증하고, 오류 역시 표시하고자 한다. 물론 이것이 유효한 양식인 경우에 백엔드 즉 파이어베이스로 제출하려고 한다. 먼저, 제출을 하기 위한 트리거 함수를 작성해보자.

```js
const confirmHandler = (event) => {
  event.preventDefault();
};
```

- 사용자 양식 form을 submit을 할 때 HTTP 요청을 전달할 브라우저 디폴트를 막기 위해 ` event.preventDefault()`를 미리 작성해준다. 이렇게 작성해주면, 이 새로고침을 발생시키는 요청은 전송되지 않을 것이다.

```js
<form onSubmit={confirmHandler}>...</form>
```

- 그리고 양식을 제출할 수 있도록 form 태그에 `onSubmit`으로 해당 함수를 포인터해준다.

  </br>
