# Practice Project : Adding Http & Forms To The Food Order App

## 목차

- [Moving "Meals" Data To The Backend](#Meals-데이터를-백엔드로-이동하기)
- [Fetching Meals via Http](#Http를-통해-Meal-데이터-가져오기)

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
    await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals.json"
    ).then();
  };

  fetchMeals();
}, []);
```

- 새로운 함수(`fetchMeals`)를 만들고 이 안에서 `async/await` 키워드를 사용하여 비동기적으로 프로미스를 반환하도록 하는 것이다. 이러한 방식을 통해서 해당 함수는 여전히 실행되고, `useEffect` 함수 전체에서는 이제 promise를 반환하지 않고서도 우리는 `async/await` 키워드를 사용할 수 있게 된다. 이것은 모두 약간의 회피?방법이라고 말할 수 있을 것이다.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals.json"
    ).then();
  };

  fetchMeals();
}, []);
```

- 그 다음에는 `fetchMeals` 함수 내부에서 `fetch()` 로 가져온 데이터를 `response` 변수 안에 넣어준다.

```js
useEffect(() => {
  const fetchMeals = async () => {
    const response = await fetch(
      "https://react-http2-xxxxxxxxx.firebaseio.com/meals.json"
    ).then();
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
    ).then();
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
    ).then();
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
    ).then();
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
    ).then();
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

- </br>
