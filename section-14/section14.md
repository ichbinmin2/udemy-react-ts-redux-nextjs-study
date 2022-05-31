# Sending Http Requests (e.g Connecting to a Database)

## 목차

- [How To (Not) Connect To A Database](#데이터베이스에-연결하지-않는-방법)
- [Our Starting App & Backend](#시작-앱-및-백엔드)
- [Sending a GET Request](#GET-요청-보내기)
- [Using async / await](#async-와-await-사용하기)
- [Handling Loading & Data States](#로딩-및-데이터-State-처리하기)
- [Handling Http Errors](#HTTP-오류-처리하기)
- [Using useEffect() For Requests](#요청에-useEffect-사용하기)
- [Preparing The Project For The Next Steps](#다음-단계를-위한-프로젝트-준비하기)
- [Sending a POST Request](#POST-요청-보내기)

</br>

## 데이터베이스에 연결하지 않는 방법

- 리액트는 데이터베이스와 어떻게 소통을 할까? 리액트 어플리케이션에서 데이터베이스와 연결한 적이 있다면 어떻게 소통을 하는지에 대해서는 기본적으로나마 이해하고 있을 것이다. 리액트 앱이나 일반적인 브라우저 앱 즉, 브라우저에서 실행되는 자바스크립트 코드가 데이터베이스와 직접 통신을 할 수 없다는 사실 또한 알고 있을 것이다.

### 자바스크립트 코드는 데이터베이스와 직접 통신을 할 수 없다

- 만약 리액트 앱이 있고 어떤 종류의 데이터베이스가 있다고 쳐보자. 이를테면 SQL, DB, 몽고DB와 같은 NoSQL 데이터베이스 말이다. 이런 데이터베이스를 데이터베이스 서버에서 실행하는 것은 문제가 되지 않는다. 다만 앱으로 직접 데이터를 가져오거나 저장하고, 연결을 맺는 행위는 외부 환경에서 절대 해서는 안되는 일 중에 하나이다. 기술적으로는 어려울 수 있겠지만 클라이언트 내부에서 데이터베이스에 직접 연결을 하게 된다면, 또는 브라우저의 자바스크립트 코드를 통해 직접 연결을 하게 된다면 이는 이 코드를 통해서 데이터베이스의 인증 정보를 노출시키는 행위와도 같다. 기억해야할 것은 브라우저에서 실행되는 모든 자바스크립트 코드는 브라우저 뿐만이 아니라 웹 사이트의 사용자들 역시 접근하고 읽을 수 있다는 것이다. 우리가 개발자 도구를 열어서 코드를 보는 것처럼 사용자 역시 개발자 도구를 열어서 코드를 모두 확인할 수 있다.

### 직접적으로 통신하는 것에 의한 보안 이슈

- 추가로 데이터베이스에 직접 접근하는 것은 '성능 문제'와 같은 다른 문제들을 발생시킬 수 있지만 그 무엇보다도 가장 큰 이슈는 '보안'에 대한 이슈이다. 따라서 리액트 앱 코드 내부에서 데이터베이스에 직접적으로 통신하는 것은 반드시 지양해야 할 것이며, 이를 위해 다른 방법을 사용해야 할 것이다. 예를 들어 백엔드 어플리케이션은 브라우저 안에서 실행되지 않고 다른 서버에서 실행되고는 한다. 데이터베이스와 같은 서버일 수도 있지만 보통은 다른 서버일 경우가 더 많다.

### 백엔드 어플리케이션을 통한 데이터베이스와의 통신

- 이 백엔드 어플리케이션은 우리의 선택에 따라 모든 서버 측 언어를 통해 만들 수 있다. NodeJS 나 PHP, ASP.NET 같은 것들 말이다. 그리고 데이터베이스와 통신하는 백엔드 어플리케이션은 사용자가 이 백엔드 코드를 확인할 수 없기 때문에 데이터베이스의 인증 정보를 보다 아전하게 저장할 수 있다. 다른 서버에 있기 때문에 웹사이트 사용자는 이 코드 역시 절대로 볼 수 없게 된다. 따라서 리액트 앱은 일반적으로 해당 백엔드 서버, 또는 백엔드 API 라고 불리는 서로 다른 URL 로의 요청을 전송하는 서버와 통신을 하게 된다. 백엔드 앱과의 통신은 보안에 관련된 세부 사항이 필요 없기 때문에 데이터베이스와 안전하게 통신을 주고 받을 수 있다. 이것이 바로 리액트와 데이터베이스가 백엔드 앱을 통해 통신하는 작동 방식이다.

</br>

## 시작 앱 및 백엔드

- 우리는 더미 데이터 대신, 실제로 서버와 통신할 수 있도록 더미 앱 API 서비스를 제공하는 SWAPI 를 사용할 것이다. SWAPI는 백엔드 앱이고 API 이며, 데이터베이스가 아니다. (우리가 데이터베이스와 직접 소통하지 않는 이유는 앞서 거론해왔다.)

  > [실습용 더미 데이터 API - swapi](https://swapi.dev/)

### API(Application Programming Interface)

- 해당 사이트에 기재된 더미 데이터 "API"는 어플리케이션 프로그래밍 인터페이스의 약자로 매우 넓은 개념을 가지고 있지만, 단순이 리액트나 HTTP 요청에만 기능하는 개념이 아니다. 우리는 코드를 통해서 명확하게 정의된 인터페이스를 다루며 또 어떤 결과를 얻기 위한, 작업에 대한 규칙이 명확하게 정의된 것을 다루고 있다는 뜻이다. 그리고 HTTP 요청에 대한 API를 말할 때에는 보통 "REST" 혹은 "GraphQL API"를 의미한다. "RESTful API"에 대한 공부를 한적이 있다면 이는 서버가 데이터를 노출하는 방식에 대한 서로 다른 표준을 의미함을 금방 이해할 것이다.

![스크린샷 2022-05-29 오후 11 13 59](https://user-images.githubusercontent.com/53133662/170873648-4ade7694-8d98-455f-bb62-1771d1b0d4e9.png)

- swapi 사이트에서 제공하는 것은 "REST API"이며 우리가 요청을 전송하게 되면 특정한 형식에 맞춰서 데이터를 전달해준다. 서로 다른 URL에 각기 다른 요청을 보내게 되면 그에 맞는 서로 다른 데이터들을 제공한다. 그리고 바로 이것이 API 이다. 접근 위치가 다르면 결과도 다르다. 이제 우리의 리액트 어플리케이션에서 사용하던 더미 데이터 대신, 이 API로 요청을 보내서 실제 데이터를 표시하고자 한다.

</br>

## GET 요청 보내기

- 리액트 앱에서 요청을 전송하려고 할 때 우리가 잊어서는 안되는 사실이 있다. 우리가 작성하는 것은 정규 자바스크립트 코드 라는 사실이다. 리액트 어플리케이션은 결국 자바스크립트 어플리케이션이라는 뜻이다. 그렇기 때문에 우리는 자바스크립트 솔루션을 통해서 리액트 어플리케이션 내에서 어떤 HTTP 요청이든 전달할 수 있는 것이다.

### fetch API

- 최근에는 자바스크립트 내에서 HTTP 요청을 전송하는 내장 메커니즘이 존재하는데 그것은 fetch API 라고 불린다.

  > [ MDN 공식문서 참고 : fetch API ](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API)

- fetch API 는 브라우저 내장형이며, 데이터를 불러오거나 데이터를 전송하는 것도 가능하다. 이 API를 통해서 HTTP 요청을 전송하고 응답을 처리할 수 있다.

### fetch API 사용해서 영화 정보 데이터 불러오기

- 먼저 해야할 것은 버튼이 클릭될 때마다 영화 정보를 가져오고 이에 대한 결과를 화면에 표시하는 것이다. 우리가 이전에 작성해두었던 더미 데이터 대신에 fetch API를 통해서 데이터를 받아와 화면에 표시하도록 할 것이다.

#### 기존의 더미 데이터

```js
const dummyMovies = [
  {
    id: 1,
    title: "Some Dummy Movie",
    openingText: "This is the opening text of the movie",
    releaseDate: "2021-05-18",
  },
  {
    id: 2,
    title: "Some Dummy Movie 2",
    openingText: "This is the second opening text of the movie",
    releaseDate: "2021-05-19",
  },
];
```

- 먼저 버튼을 클릭하면 실행될 수 있는 트리거 함수를 작성한다. 이 트리거 함수에서 fetch API를 사용할 것이다.

```js
function fetchMoviesHandler() {
  fetch();
}
```

- fetch API 에 대한 가장 단순한 형태는 우리가 요청을 전송하려는 URL을 '문자열'로 전달하는 것이다.

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films");
}
```

- fetch API에는 두 번째 인자를 전달할 수 있는데, 이 두 번째 인자를 통해서 다양한 호출 선택 사항을 지정할 수 있는 자바스크립트 객체를 전달할 수 있게 된다. 예를 들어 헤더나 바디 또는 HTTP 요청 메소드(POST, PUT, PATCH, DELETE)를 변경하거나 할 때 사용된다. fetch API 는 기본적으로 "GET"으로 설정되어 있기 때문에 현재 데이터를 불러오기만 하는 상황에서는 수정할 필요가 없기에 두 번째 인자를 생략했다. 이제 이 함수가 호출될 때마다 매 번 HTTP 요청이 전송될 것이다.

### fetch API 호출에 대한 응답 처리하기 - then()

- HTTP 요청이 전송되는 것 뿐만 아니라 이 호출에 대한 응답 역시 처리해야만 한다. 이 `fetch()` 함수는 프로미스라는 객체를 반환하는데 이 객체는 우리가 잠재적으로 발생할 수 있는 오류나 호출에 대한 응답에 반응할 수 있도록 만들어준다.

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films");
}
```

- `fetch()` 함수를 통해서 프로미스 객체가 반환되었다는 것은 즉각적인 행동 대신 어떤 데이터를 전달하는 객체라는 의미이다. 왜냐하면 HTTP 요청 전송은 '비동기 작업' 이기 때문이다. 즉각적으로 끝내는 것이 아니라, 몇 초-몇 분이 걸리기도 하며 심지어 실패할 가능성도 있다. 따라서 `fetch()` 로 프로미스 객체를 반환한 뒤에 코드의 결과를 바로 확인할 수 없도록 한 것이고, 다만 이 응답을 처리하기 위해 우리는 `then()`을 사용할 수 있게 된다.

  > [ MDN 공식문서 참고 : Promise.prototype.then() ](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films").then();
}
```

- 바로 `then()`을 통해서 응답을 처리하는 것이다. (그리고 `catch` 문을 추가해서 잠재적 오류나 에러등을 핸들링 할 수도 있지만 지금은 일단 무시하도록 하자.)

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films").then((res) => {});
}
```

- `then()`의 인자로 `res`(response) 를 받고, 화살표 함수를 사용해서 반환해보자. 인자로 들어온 `res`는 객체이며 요청의 응답에 대한 많은 데이터를 가지고 있을 것이다. 예를 들어, 응답의 헤더를 읽거나 상태 코드를 얻을 수도 있다. 하지만 우리가 지금 확인해야 할 것은 `res`의 본문이다. API는 데이터를 JSON 형식으로 전송한다.

### API의 데이터는 JSON 형식이다

- JSON은 데이터 교환에 사용하는 간단하지만 유용한 형식이다. 우리가 받아올 API 응답 데이터 파일을 보면, 마치 자바스크립트 객체 같지만 키 값은 큰 따옴표로 묶여있는 걸 볼 수 있다.

![스크린샷 2022-05-30 오후 3 18 40](https://user-images.githubusercontent.com/53133662/170929169-b7230b6b-97db-47e8-9e76-35e2cf904ef9.png)

- 이 외에도 JSON은 염두해둬야 하는 규칙들이 있다. 메소드가 없고 모두 데이터이기도 하다. 그리고 JSON 데이터의 또 다른 이점은 자바스크립트에서 변환 작업이 반드시 필요하지만 글머에도 불구하고 JSON 형식에서 자바스크립트 객체로의 변환이 매우 쉽다는 것에 있다.

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films").then((res) => {
    return res;
  });
}
```

- 그리고 다행히 이 `response` 의 객체에는 내장 메소드가 있어서 JSON response의 본문을 코드에서 사용할 수 있는 자바스크립트 객체로 자동 변환해 줄 수 있다.

### JSON Response 를 자바스크립트 객체로 변환하기 - json()

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films").then((res) => {
    return res.json();
  });
}
```

- response 객체에 있는 내장 메소드인 `json()`를 사용해서 자동으로 변환해줄 수 있도록 한다. 그리고 이 `json()` 메소드 역시, 프로미스 객체를 반환하므로 추가적인 `then()` 구역을 생성해야할 필요성이 있다.

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films")
    .then((res) => {
      return res.json();
    })
    .then();
}
```

- 이렇게 하면, 이 데이터 변환 작업이 끝나고 난 직후에 바로 추가한 `then()`이 작동하게 된다.

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });
}
```

- 그리고 `then()`을 통해서 변환 된 데이터를 가져온다.

![스크린샷 2022-05-30 오후 3 18 40](https://user-images.githubusercontent.com/53133662/170929169-b7230b6b-97db-47e8-9e76-35e2cf904ef9.png)

- 데이터 파일을 보면, 우리가 가져오길 원하는 영역은 'results'의 배열이기 때문에 `data.result`로 접근해서 이 결과를 반환하면 된다.

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data.results;
    });
}
```

- 당연히 이 데이터를 사용하기 위해서는 우리가 `data.result`로 접근해서 반환 된 배열 데이터를 넣어둘 상태(state)도 필요할 것이다.

### 상태(state)에 데이터 저장하기

```js
const [movies, setMovies] = useState([]);
```

- 이 상태(state)에 데이터를 저장하면, `data.results` 에서 갱신되고 이를 화면에 실시간으로 보여줄 수 있을 것이다.

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setMovies(data.results);
    });
}
```

- 이제 JSON의 배열이 `movies` 라는 새로운 상태(state)가 되었다. 이제 여기에 있는 `movies`의 상태(state)를 props에 대한 값으로 전달한다.

```js
<section>
  <MoviesList movies={movies} />
</section>
```

- `MoviesList` 컴포넌트에서 `Movie` 컴포넌트로 전달하는 값을 보면,

```js
<ul className={classes["movies-list"]}>
  {props.movies.map((movie) => (
    <Movie
      key={movie.id}
      title={movie.title}
      releaseDate={movie.release}
      openingText={movie.openingText}
    />
  ))}
</ul>
```

- id 와 title, release, openingText 가 props로 전달되고 있음을 확인할 수 있다. 여기서 주의할 점은 이 어플리케이션에서 props 로 넘겨주는 이름과 받아오는 데이터의 key 값들이 다르다는 것이다. 그럼 props로 전달을 하더라도 이름이 다르기 때문에 해당 데이터를 받아오지 못하게 된다. 어떻게 해야 할까?

### 데이터 형식의 이름 변환하기

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setMovies(data.results);
    });
}
```

- 먼저 HTTP 요청을 생성하는 `App` 컴포넌트 안에서 `data.results`를 새로운 상태로 만들기 전에 변환 과정이 필요하다.

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const transformedMovies = data.results.map();
      setMovies(data.results);
    });
}
```

- `data.results`를 매핑하는 `transformedMovies`라는 새로운 상수를 만들고 넘겨받은 데이터 배열의 모든 객체를 새로운 객체로 반환할 수 있도록 한다.

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const transformedMovies = data.results.map((movieData) => {
        return {};
      });
      setMovies(data.results);
    });
}
```

- 반환되는 새로운 객체는 변환된 새로운 객체로 채워진 배열이 될 것이다. `map()`에서 `movieData`라는 인자의 데이터를 가져오는데, 이 데이터의 형식은 API로 받아오는 객체의 형식과 동일하다.

![스크린샷 2022-05-30 오후 3 18 40](https://user-images.githubusercontent.com/53133662/170933374-a7b90f24-eb52-47ad-b81d-690651dcdcaa.png)

- 이중 우리는 episode_id, title, opening_crawl, release_date 만 가져올 예정이니, 새로운 객체 안에서 우리가 props로 넘겨줄 이름으로 변환하여 return 하면 될 것이다.

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(data.results);
    });
}
```

- 이제 텍스트가 변환 되었으니, 이 변환된 `transformedMovies` 를 `setMovies`에 저장한다.

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    });
}
```

- 마지막으로 모든 데이터가 출력되고 있는지 확인하기 위해서 `fetchMoviesHandler` 함수를 버튼에 `onClick`을 추가하고 포인터해준다.

```js
<button onClick={fetchMoviesHandler}>Fetch Movies</button>
```

![ezgif com-gif-maker (68)](https://user-images.githubusercontent.com/53133662/170934128-8c345bf4-1695-4298-b475-49ef7ff256b8.gif)

- 저장하고, "Fetch Movies" 버튼을 누르면 버튼 클릭 후 영화에 대한 데이터가 표시된다.

### 정리

- 화면의 결과는 우리가 외부 API에서 fetch 해온 즉, 백엔드 어플리케이션에서 데이터 베이스와 소통한 결과물인 셈이다. 지금까지 리액트 앱을 이용해 데이터베이스와 연결을 한 것으로 보이지만 이것은 이론적으로 정확한 표현이 아니며, 다만 리액트 앱에서 백엔드로 HTTP 요청을 전송을 했을 뿐이라는 사실을 우리는 잊지 말아야 할 것이다.

</br>

## async 와 await 사용하기

### 프로미스는 자바스크립트 언어의 기능 중에 하나이다

- fetch 는 프로미스 객체를 반환하므로 우리는 `then()` 체인 즉, `then()` 호출 뒤에 또 다시 `then()`을 재차 호출할 수 있었다. 하지만 이런 `then()` 체인 대신 간단하게 `async`와 `await`을 이용하여 비동기 작업을 수행할 수도 있다.

### async/await 를 통한 코드 간결화

#### before

```js
function fetchMoviesHandler() {
  fetch("https://swapi.dev/api/films")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    });
}
```

#### after

```js
async function fetchMoviesHandler() {
  const response = await fetch("https://swapi.dev/api/films");
  const data = await response.json();

  const transformedMovies = data.results.map((movieData) => {
    return {
      id: movieData.episode_id,
      title: movieData.title,
      openingText: movieData.opening_crawl,
      releaseDate: movieData.release_date,
    };
  });
  setMovies(transformedMovies);
}
```

- befor와 after 코드를 보면 기존의 `then()` 체이닝을 통해 작성한 비동기 코드보다 `async/await`를 사용해서 작성한 코드가 훨씬 가독성이 높은 걸 확인할 수 있다. 이는 단순한 코드 변환에 가까우며, 백그라운드에서는 `then()` 체이닝을 사용한 것과 동일한 역할을 할 뿐이지만, 코드를 단순화 시키고 직관적으로 작성할 수 있게 되며 가독성 역시 높아진다는 장점이 있다. 겉으로 보기엔 단계적으로 실행되는 즉, 동기적 작업처럼 보이지만 백그라운드에서는 `then()` 체이닝과 같은 비동기적 작업으로 진행되고 있는 것이다.

  </br>

## 로딩 및 데이터 State 처리하기

![ezgif com-gif-maker (68)](https://user-images.githubusercontent.com/53133662/170934128-8c345bf4-1695-4298-b475-49ef7ff256b8.gif)

- 상용되는 서비스에서는 어떤 로딩 과정 중에 로딩 아이콘이나 로딩 텍스트를 통해서 사용자에게 현재 데이터를 불러오고 있다는 신호를 보내기도 한다. 현재 우리는 버튼을 통해서 API 데이터를 fetch 하여 영화 데이터를 화면에 표시하는 것까지 완료했지만 실제로 영화 데이터가 표시되기 까지 약간의 지연 시간이 있다는 걸 알 수 있다. 앞서 거론한 서비스들 처럼 이런 지연 시간을 사용자에게 알릴 수 있는 방법이 있을까? 어떻게 처리해야 할까?

### 상태 관리를 통한 데이터 로딩 처리

- 영화의 상태(state)를 가져오면 영화가 실제로 존재하는지를 알 수 있다. 하지만 사용자에게 영화의 데이터를 받아오기까지 기다리는 중인지를 알리기 위해서는 또 다른 상태(state)가 필요할 것이다.

```js
const [isLoding, setIsLoding] = useState(false);
```

- `isLoding` 이라는 boolean 의 false 초기값을 가지는 상태(state)를 만들었다. 초기 값을 false 로 설정한 이유는 컴포넌트를 로드할 때나 컴포넌트가 화면에 렌더링될 때 영화 데이터가 바로 로드되는 건 아니기 때문이다.

```js
async function fetchMoviesHandler() {
  setIsLoding(true);
  const response = await fetch("https://swapi.dev/api/films");
  const data = await response.json();

  const transformedMovies = data.results.map((movieData) => {
    return {
      id: movieData.episode_id,
      title: movieData.title,
      openingText: movieData.opening_crawl,
      releaseDate: movieData.release_date,
    };
  });
  setMovies(transformedMovies);
  setIsLoding(false);
}
```

- 하지만 사용자가 버튼을 눌러 `fetchMoviesHandler` 함수를 호출했을 때 영화 데이터가 로드되기 때문에 여기에 `setIsLoding` 을 호출하고, true 값으로 업데이트해준다. 이렇게 하면 영화 데이터 로딩을 시작할 때 해당 `isLoding` 상태(state) 변화가 발생하게 되기 때문이다. 또한 데이터를 호출한 뒤에는 `isLoding`의 상태는 false 여야 하기 때문에 `setMovies()`로 데이터를 넘겨준 뒤에는 다시 `isLoding`의 상태를 false로 업데이트 해준다.

```js
<section>
  <MoviesList movies={movies} />
</section>
```

- 그리고 여기에서 `isLoding`의 상태를 이용해서 로딩 아이콘이나 로딩 텍스트를 렌더링 할 수 있게 된다. 가령 로딩 중이 아닐 때에만 `MoviesList` 컴포넌트를 렌더링할 수 있을 것이다.

```js
<section>{!isLoding && <MoviesList movies={movies} />}</section>
```

- 반대로, 로딩 중일 때에는 로딩 중임을 알리는 텍스트를 표시하도록 한다.

```js
<section>
  {!isLoding && <MoviesList movies={movies} />}
  {isLoding && <p>Loding...</p>}
</section>
```

![ezgif com-gif-maker (69)](https://user-images.githubusercontent.com/53133662/170946197-a3334022-dbb0-43b4-aceb-2eaf897e1af5.gif)

- 저장하고 다시 버튼을 누르면, 아주 잠깐이지만 영화 데이터가 표시되기 전까지 우리가 지정한 문구 'Loding...'이 표시 된다. 하지만 우리가 사용할 수 있는 상태(state)가 `isLoding` 이거나 `!isLoding` 만 있는 것은 아니다. 로딩이 완료되었으나, 영화의 데이터가 없는 경우도 분명 예외적으로 존재할 가능성이 있다. 우리가 fetch 로 받아오는 영화 데이터가 없을 때에 혹은 fetch 가 실패해서 `movies`가 빈 배열일 때를 가정해서 이를 사용자에게 알릴 수 있어야 한다.

```js
<section>
  {!isLoding && movies.length > 0 && <MoviesList movies={movies} />}
  {isLoding && <p>Loding...</p>}
</section>
```

- 로딩이 되지 않고 `movies.length` 를 이용한 값이 0 이상일 때(즉, 데이터가 1개 이상으로 담겼을 때)를 `&&` 연산자로 추가하여 `MoviesList` 컴포넌트를 렌더링할 수 있도록 해주고,

```js
<section>
  {!isLoding && movies.length > 0 && <MoviesList movies={movies} />}
  {!isLoding && movies.length === 0 && <p>Found no movies.</p>}
  {isLoding && <p>Loding...</p>}
</section>
```

- 로딩이 되지 않고, `movies.length` 를 이용한 값이 0일 때(`movies`가 빈 배열일 때)를 `&&` 연산자로 추가하여 "Found no movies." 텍스트를 화면에 표시할 수 있도록 해주었다.

![ezgif com-gif-maker (70)](https://user-images.githubusercontent.com/53133662/170947678-68b6eb2e-d44d-4084-ac04-bc1fdd8cbd62.gif)

- 저장하고 어플리케이션을 다시 불러오면 초기에는 로딩이 되지 않았고(`!isLoding`), 영화도 불러오지 않았으니 "Found no movies." 가 표시되고, 버튼을 눌러서 영화 데이터를 가져오는 지연 시간에는 로딩이 되었기에(`isLoding`), "Loding..." 화면에 표시되었으며, 로딩이 끝나고(`!isLoding`) 영화 데이터가 담겼으므로(`movies.length > 0`) 영화 데이터의 목록이 화면에 출력(`MoviesList` 컴포넌트 렌더링)되고 있음을 확인할 수 있다.

### 정리

- 이런 로딩 처리는 사용자 인터페이스 구축 과정에서 매우 중요한 부분이다. 사용자에게 어플리케이션의 현재 상태를 알려야 하기 때문이다. 영화 데이터를 가져오는 도중에 표시되는 로딩 문자나, 영화 데이터를 가져오지 않았을 때의 상태를 사용자에게 알려주는 것은 이 모든 것들이 없을 때와는 사용자 경혐 면에서 큰 차이가 있을 수 밖에 없을 것이다.

  </br>

## HTTP 오류 처리하기

> [MDN 공식문서 참고 : HTTP 상태 코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)

- HTTP 요청을 전송하는 경우에도 무언가 잘못된 것이 있다면 오류가 발생할 수 있다. 네트워크 연결이 없다던가, 또는 네트워크 연결이 완료되고 요청이 전송되었는데 오류 응답 코드를 넘겨받는 등의 기술적인 오류 등을 생각해보자. HTTP Status 코드를 공부했다면 알 수 있지만 404, 500, 401과 같은 응답 들이 바로 그 오류의 예시일 것이다.

### HTTP 상태 코드

- 만약 200 이나, 201 처럼 2xx 으로 시작하는 코드는 정상적인 응답을 뜻한다. 즉 요청이 정상적으로 전송되었고, 서버가 성공적으로 응답했을 때 받는 코드들이다. 하지만 요청을 보낼 때 400 이나 500 같은 응답 코드를 받을 가능성도 있다. 예를 들어, 접근을 허가받지 못한 자원에 대해 요청을 한다고 생각해보자. 요청이 성공적으로 전송 되었고, 심지어 이 과정에서 아무런 기술적인 문제가 없었음에도 서버에서 401, 403 과 같은 응답을 하게 된다면 서버가 요청을 받았으나 우리가 원하는 응답을 주지 않았음을 의미한다. 기술적으로는 성공적으로 응답 받은 것이나 응답에 오류 상태 코드가 포함되어 있기에 이런 코드를 받는 것이다. 그리고 5xx 대의 응답 코드들은 서버에 오류가 있을 때 발생한다. 이것이 웹의방식이다.

### HTTP 오류를 어떻게 처리할까?

```js
const response = await fetch("https://swapi.dev/api/films");
```

- 먼저, 오류에 대한 처리에 대한 예시를 위해서 우리가 정상적으로 받아왔던 URL을 유효하지 않은 주소로 수정해보자.

```js
const response = await fetch("https://swapi.dev/api/film");
```

- 이렇게 유효하지 않은 URL 주소로 수정을 한 뒤 저장을 해보면, 데이터는 들어오지 않는다.

![ezgif com-gif-maker (71)](https://user-images.githubusercontent.com/53133662/170956208-69a59c8e-6c61-4cf3-b906-03cfc489cd88.gif)

- 버튼을 눌러도 계속 로딩 상태에 멈춰있는 걸 알 수 있다. 당연하지만 이는 전혀 좋지 않은 사용자 경험을 제공한다. 이 어플리케이션을 사용하는 사용자에게 오류 메세지 같은 것을 표시해서 문제가 발생했음을 알려주는 게 좋을 것이다.

![스크린샷 2022-05-30 오후 5 57 32](https://user-images.githubusercontent.com/53133662/170956472-9a6b19a0-fa2f-4d1e-a70a-da012d0d8d39.png)

- 개발자 도구를 열어보면 해당 응답 오류 코드 404를 확인할 수 있다. 의도했던 대로 기술적으로는 성공적인 응답이다. 그러나 요청이 서버로 가서 응답을 받았지만 404 코드를 받았고 이는 무언가 문제가 있었음을 나타낸다. 그리고 이 경우는 서버가 준비하지 못한 리소스를 요청했다는 의미이다.

### error의 상태(state) 추가하기

- 이런 오류를 처리하기 위해서는 추가적인 세 번째 상태(state)를 도입해야 한다. 초기에는 오류가 없기 때문에 초기 값은 null 로 처리해준다.

```js
const [error, setError] = useState(null);
```

- 그리고 `fetchMoviesHandler` 함수가 호출되면, 이 `error`를 `null`로 다시 돌려놔야 한다. 이전에 받았을 수도 있는 오류를 초기화해줘야 하기 때문이다.

```js
async function fetchMoviesHandler() {
  setIsLoding(true);
  setError(null);

  const response = await fetch("https://swapi.dev/api/film");
  const data = await response.json();

  const transformedMovies = data.results.map((movieData) => {
    return {
      id: movieData.episode_id,
      title: movieData.title,
      openingText: movieData.opening_crawl,
      releaseDate: movieData.release_date,
    };
  });
  setMovies(transformedMovies);
  setIsLoding(false);
}
```

- 실제로 오류가 발생헀다면, 이는 `error`의 초기 값 null이 아니기 때문에 null 이외의 값을 사용해야 할 것이다.

### try-catch 사용하기

- `async/await` 를 사용하지 않고 `then()` 체이닝을 통해 작업을 한다면, `catch()`를 이어 추가해서 오류를 확인해야 한다. 하지만 `async/await`을 사용한다면 `try-catch`를 사용해야 한다. 코드의 실행을 시도(`try`)해서 잠재적인 오류를 포착(`catch`) 하기 위해서 말이다.

```js
async function fetchMoviesHandler() {
  setIsLoding(true);
  setError(null);

  try {
    const response = await fetch("https://swapi.dev/api/film");
    const data = await response.json();

    const transformedMovies = data.results.map((movieData) => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      };
    });
    setMovies(transformedMovies);
    setIsLoding(false);
  } catch (error) {}
}
```

- `try` 블록 안에 데이터를 요청해서 반환하는 모든 코드들을 넣어주고, 이 `try` 블록 안에서 발생할 수 있는 잠재적인 오류들을 `catch` 블록 안에서 포착하여 처리할 수 있도록 한다. 따라서 `try` 블록 안에서 어떤 오류가 발생했다면 `catch` 블록에서 이를 확인할 수 있게 되는 것이다.

### fetch API 에서 에러 상태 코드는 에러로 취급되지 않는다

- 여기서 우리가 직면해야 하는 문제 중 하나는 fetch API 에서는 에러 상태 코드를 실제 에러로 취급하지 않는다는 사실이다. 실제로 오류 상태 코드를 받더라도 기술적인 오류로써 처리하지 않는다는 의미이다. 따라서 어떤 문제가 발생해도 이를 실제 오류로 처리하지 않게 된다. 가져오지 못한 데이터로 어떤 작업을 하려고 할 때만 오류가 발생하게 된다. 그리고 이는 우리가 원하는 에러 처리 방식이 아니다.

### 에러 상태 코드를 받았을 때 실제 오류를 발생시키는 방법

- fetch API 에서는 에러 상태 코드를 실제 에러로 취급하지 않기 때문에 우리가 에러를 보다 우아한 방식으로 에러를 처리하기 위해서는 오류 상태 코드를 받았을 때 실제 오류가 발생하도록 할 수도 있을 것이다. 물론 axios 같은 서드 파티 패키지 라이브러리 같은 경우 요청 전송에 성공하면 오류 상태 코드에 맞는 오류를 만들어서 전달해주는 기능을 포함하고 있다. 하지만 우리는 axios를 사용하지 않고 fetch API 를 사용하고 있으니 우리가 직접 오류를 만들어야 된다.

```js
try {
  const response = await fetch("https://swapi.dev/api/film");
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Something went wrong!");
  }

  const transformedMovies = data.results.map((movieData) => {
    return {
      id: movieData.episode_id,
      title: movieData.title,
      openingText: movieData.opening_crawl,
      releaseDate: movieData.release_date,
    };
  });
  setMovies(transformedMovies);
  setIsLoding(false);
} catch (error) {}
```

- 우리가 전달받게 되는 `response` 객체에는 `ok` 라는 필드가 존재한다. 이는 요청이 성공적인지 그렇지 않은지를 표시하는 영역이다. 그러니까 이 `ok` 필드를 이용해서 응답이 ok 인지 아닌지를 확인하고 이에 대해 자체적인 오류를 만들어서 표시할 수 있다. 그리고 여기에 적당한 오류 메세지를 `new Error()`로 생성해서 표시하면 된다. 물론 서버에서 돌아오는 오류 응답 코드에 따라서 오류 메세지를 개별적으로 읽어들일 수도 있고, 단지 앞서 우리가 했던 것처럼 우리가 만든 메세지를 추가해서 사용할 수도 있다. 아무튼 이 메세지는 응답(`response`)에 문제가 있을 때에만 표시하도록 할 것이다.

### catch() 사용하기

```js
async function fetchMoviesHandler() {
  setIsLoding(true);
  setError(null);

  try {
    const response = await fetch("https://swapi.dev/api/film");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    ...

  } catch (error) {

  }
}
```

- 여기에서 오류가 발생하면 당연히 그 다음 단계의 코드는 진행이 되지 않을 테니 대신에 `catch()` 블록을 만들어둔 것이다. 그리고 `catch()` 블록 안에서 `setError`를 호출하고 null 값이 아닌 오류 메세지를 넣어둔다.

```js
catch (error) {
  setError(error.message);
}
```

- 이제 `error` 는 null 이 아닌 문자열(`error.message`)이 되었다. 이제 `error` 상태를 관리할 수 있게 되었으니 화면에 표시되는 것들 역시 정해줘야 한다. 오류의 존재 여부에 따라 표시되는 것들도 변화해야 하기 떄문이다.

### error 가 발생했을 때 화면에 표시되는 것

```js
{
  !isLoding && movies.length > 0 && <MoviesList movies={movies} />;
}
{
  !isLoding && movies.length === 0 && <p>Found no movies.</p>;
}
{
  isLoding && <p>Loding...</p>;
}
```

- 위의 코드처럼 조건에 따라서 특정 컨텐츠를 렌더링할 것이다. 먼저 로딩 중이 아닌지를 확인해야 한다. 로딩 중이라면 이에 대한 결과를 기다려야 하기 때문이다.

```js
{
  !isLoding && error && <p>{error}</p>;
}
```

- 하지만 로딩 중이 아니고(`!isLoding`) 오류가 있다면 (`error`가 null이 아니라, 값이 존재한다면) 오류 메시지를 표시할 수 있도록 작성해준다.

```js
async function fetchMoviesHandler() {
  setIsLoding(true);
  setError(null);

  try {
    const response = await fetch("https://swapi.dev/api/film");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    ...
    setMovies(transformedMovies);
    setIsLoding(false);

  } catch (error) {
    setError(error.message);
    setIsLoding(false);
  }
}
```

- 또한, 오류가 발생하게 되면 더이상 로딩이 필요 없다. 이런 경우에는 반드시 로딩을 중단(`setIsLoding(false)`)되게 해야만 한다. 그리고 이 구문(`setIsLoding(false)`)을 `try-catch` 블록 뒤에 설정해서 응답을 성공적으로 받았거나 오류를 받았든 상관없이 `setIsLoding(false)`을 설정하여 로딩이 끝났음을 알리는 것도 괜찮을 것이다.

```js
async function fetchMoviesHandler() {
  setIsLoding(true);
  setError(null);

  try {
    const response = await fetch("https://swapi.dev/api/film");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    ...
    setMovies(transformedMovies);

  } catch (error) {
    setError(error.message);
  }

  setIsLoding(false);
}
```

- 이렇게 작성을 하고 저장한 뒤 버튼을 누르면, 로딩이 끝나고 "Found no movies." 문구와 함께 우리가 설정한 오류 메세지(`error.message`)가 출력되고 있는 걸 확인할 수 있다.

![ezgif com-gif-maker (72)](https://user-images.githubusercontent.com/53133662/170962868-f92192c0-25f4-459f-b715-526e1ab2a9a5.gif)

- "Unexpected token < in JSON at position 1" 는 우리가 코드 안에서 설정한 것이 아니라, JSON에 대한 응답을 호출했음에도 우리가 설정한 에러 메세지를 받아오는데 실패한 것이다. 유효하지 않은 API 엔드 포인트에 대해 요청을 했고, 따라서 JSON 데이터를 받아오지 못했는데도 말이다. 그러니, `response` 바디 부분을 파싱하기 이전에 `response`의 응답이 ok 인지를 먼저 확인해야 한다.

```js
const response = await fetch("https://swapi.dev/api/film");
if (!response.ok) {
  throw new Error("Something went wrong!");
}

const data = await response.json();
```

- 오류 응답을 다루는 좀 더 확실한 방법은 어떤 API와 통신하는지에 달려있다. 몇 몇 API는 요청이 성공적이지 못헀음에도 JSON 데이터를 보낼 때도 있기 때문이다. 하지만 우리가 사용하는 API는 요청이 성공적이지 못하면 JSON 데이터를 보내지 않기 때문에 이에 맞춰서 파싱 전에 처리를 해줘야 한다.

![ezgif com-gif-maker (73)](https://user-images.githubusercontent.com/53133662/170963856-f67da992-fe54-4913-90f4-806da77a6d56.gif)

- 다시 저장하고 이전과 동일한 방법으로 시도하자, 이번엔 우리가 설정한 에러 메시지 "Something went wrong!" 가 출력되고 있음을 알 수 있다.

### 조건에 따른 메세지 문구 출력하기

```js
{
  !isLoding && movies.length > 0 && <MoviesList movies={movies} />;
}
{
  !isLoding && movies.length === 0 && <p>Found no movies.</p>;
}
{
  !isLoding && error && <p>{error}</p>;
}
{
  isLoding && <p>Loding...</p>;
}
```

- "Something went wrong!" 가 출력되는 것은 우리가 의도한 적이지만, "Found no movies." 메세지 역시 동시에 출력되는 건 의도하지 않았다. 이 부분의 조건 처리를 추가해줘야 할 필요성이 있어보인다.

```js
{
  !isLoding && movies.length > 0 && <MoviesList movies={movies} />;
}
{
  !isLoding && movies.length === 0 && !error && <p>Found no movies.</p>;
}
{
  !isLoding && error && <p>{error}</p>;
}
{
  isLoding && <p>Loding...</p>;
}
```

- "Found no movies." 를 출력하는 조건식에 에러가 아닐 때(`!error`)를 `&&` 연산자로 추가해준다.

![ezgif com-gif-maker (74)](https://user-images.githubusercontent.com/53133662/170965084-c90ea50d-c897-43a3-881b-5e72035e9e1d.gif)

- 더이상 "Found no movies." 문구는 출력되지 않는 걸 알 수 있다.

- 이것이 HTTP 요청 전송에서 각각의 서로 다른 상태를 처리하는 방법이다. 어떤 백엔드 어플리케이션과 통신하든 간에 서로 다른 상태(state)를 마주할 수 있으므로 경우에 따른 처리 방법을 아는 것은 중요하다. 항상 응답(response)을 기다리게 되다 보면 오류(error)를 받을 수도 빈 데이터를 받을 수도 있기 때문에 이러한 여러 시나리오에 대응하는 방법을 핸들링할 수 있어야 하기 때문이다.

### 조건에 따른 content 출력하기

```js
{
  !isLoding && movies.length > 0 && <MoviesList movies={movies} />;
}
{
  !isLoding && movies.length === 0 && !error && <p>Found no movies.</p>;
}
{
  !isLoding && error && <p>{error}</p>;
}
{
  isLoding && <p>Loding...</p>;
}
```

- 이처럼 코드 안에서 모든 조건을 확인하는 대신, 다른 방법을 사용할 수도 있다.

```js
let content = "Found no movies.";
```

- 먼저 변수 `content`에 기본 값으로 "Found no movies." 문구를 할당해준다. 그리고 이제 우리가 가지고 있는 상태(state)에 따라서 이 상수(`content`)의 값을 다르게 할당해보자.

```js
let content = "Found no movies.";

if (isLoding) {
  content = <p>Loding...</p>;
}
```

- 예를 들어서, 로딩 중(`isLoding`) 이라면, `content`의 값을 `<p>Loding...</p>`로 할당한다. 해당 if 문 코드는 조건에 해당하는 모든 것들을 덮어쓸 테니 이 조건에 대해서는 마지막에 확인하도록 하고, 다른 조건식들을 추가해보자.

```js
let content = "Found no movies.";

if (error) {
  content = <p>{error}</p>;
}

if (isLoding) {
  content = <p>Loding...</p>;
}
```

- 오류가 있는지(`error`) 확인해서 만약 오류가 있다면(`error`가 null 이 아닐 때) `<p>{error}</p>`를 `content` 의 값으로 할당한다.

```js
let content = "Found no movies.";

if (movies.length > 0) {
  content = <MoviesList movies={movies} />;
}

if (error) {
  content = <p>{error}</p>;
}

if (isLoding) {
  content = <p>Loding...</p>;
}
```

- 물론, 요청을 통해 데이터를 받아올 때도 처리해줘야 한다. 이전에 우리가 조건식에 추가해주었던 방식 대로 if 문에 `movies.length > 0` 일 때를 가정(데이터가 들어왔을 때)해서 `MoviesList` 컴포넌트를 렌더링 할 수 있도록 `content` 의 값으로 할당 한다.

```js
<section>{content}</section>
```

- 마지막으로 먼저 조건식으로 만들어 두었던 JSX 의 모든 코드들을 제거하고 앞서 설정한 변수 `content`만 렌더링 해준다. 이렇게 하면 `content` 변수에 있는 값은 각각의 상태(state)에 따라서 다르게 할당될 것이다.

  </br>

## 요청에 useEffect 사용하기

- 대부분의 어플리케이션에서는 특정 컴포넌트가 로딩되자마자 데이터를 가져온다. 가령 사용자가 페이지를 방문하자마자 데이터를 가져오는 것처럼 말이다. 하지만 우리는 현재 버튼을 누르고 데이터를 fetch 해서 가져오고 있기 있기 때문에 데이터를 즉시 fetch 하기 위해서는 추가적인 작업이 필요하다.

### useEffect 으로 즉시 데이터를 fetch 하는 것이 가능한 이유

- `useEffect` 훅으로 데이터를 즉시 가져오는 게 가능한 이유는 HTTP 요청 전송은 일종의 사이드 이펙트로 컴포넌트의 상태(state)를 바꿔버릴 수 있기 떄문이다. 그리고 이전에 우리가 배웠던 것처럼 이런 사이드 이펙트는 `useEffect`을 사용한다. 함수로 집어넣는 것 역시 상관 없다. 함수 일부분으로 호출하지만 않는다면 말이다. 만약 그렇게 한다면, 함수 호출이 되는 순간 상태(state)의 갱신이 발생하고, 컴포넌트 함수가 재렌더링-재평가 되면서 무한으로 호출되는 무한루프가 발생되기 때문이다. 그리고 이를 피하기 위해서 우리는 `useEffect`를 사용할 수 있다.

- `useEffect`는 컴포넌트가 렌더링되는 주기 안에서 사용되어야 하는 코드가 있을 때 유용하다. 컴포넌트가 재렌더링될 경우는 조금 다르지만 말이다. 따라서 여기에 `useEffect`를 추가하고 화살표 함수를 사용하거나 function 예약어를 이용한 정규 함수를 통해 `effect` 함수를 정의한다.

```js
useEffect(() => {
  fetchMoviesHandler();
});
```

- 이 `useEffect` 함수 안에서 우리가 그동안 데이터를 fetch 해오는 데 사용했던 `fetchMoviesHandler` 트리거 함수를 호출한다.

### 의존성 배열로 무한 루프를 방지하기

- 이제 `fetchMoviesHandler` 함수는 버튼을 클릭하면 호출되지만 동시에 컴포넌트 재평가가 발생할 때에도 호출하게 된다. 이 때문에 우리가 앞서 거론했던 무한 루프 이슈가 발생할 수 있으므로 컴포넌트 재평가가 발생할 때마다 호출하지 않도록 추가해줘야 할 것이 있다.

```js
useEffect(() => {
  fetchMoviesHandler();
}, []);
```

- `useEffect` 의 의존성 배열을 추가한다는 것은 언제 `effect` 함수가 다시 실행되는 지를 정의한다는 뜻이다. 즉, 우리가 추가한 의존성 배열의 목록이 갱신 되거나 변할 때마다 `effect` 함수가 재실행되도록 정의하는 것이다. 현재는, 의존성 배열에 아무 것도 들어있지 않다. 이 상태로 저장한다면 컴포넌트가 최초로 로딩될 때를 제외하고는 절대 재실행되지 않을 것이다. 따라서, 어플리케이션을 새로고침하면 데이터를 즉시 fetch 해오는 것을 확인할 수 있다.

### `effect` 함수에서 사용하는 모든 의존성은 의존성 배열에 추가해야 한다

- 사실 이런 식의 실행은 썩 깔끔한 방식은 아니다. 다만 우리가 여기서 배울 수 있는 건 `effect` 함수 내에서 사용하는 모든 의존성을 이 의존성 배열에 표시해두는 게 가장 좋다는 것이다. 그리고 여기에서는 `fetchMoviesHandler`가 바로 그 대상이다. 이것은 `effect`에 대한 의존성이기 때문이다.

```js
useEffect(() => {
  fetchMoviesHandler();
}, [fetchMoviesHandler]);
```

- `useEffect` 의 두 번째 인자인 의존성 배열에 `fetchMoviesHandler`를 포인터하자. 이 `fetchMoviesHandler` 함수가 변경되면 `effect`는 재실행 될 것이고, 만약 외부 상태(state)를 이용한다면 이 `fetchMoviesHandler` 함수도 바뀔 수 있으니 말이다.

### 함수를 의존성 배열에 추가헀을 때 무한 루프가 발생한다

- `fetchMoviesHandler`는 함수이고, 객체이기 때문에 컴포너트가 재렌더링 될 때마다 이 `fetchMoviesHandler` 함수 역시 바뀌게 된다. 그렇다면 의존성 배열에 이 `fetchMoviesHandler` 함수를 추가하게 되면 무한 루프가 발생될 것이다. 무한 루프를 방지하기 위해서 의존성 배열에 이 `fetchMoviesHandler` 함수를 추가했는데, 또 다시 무한 루프가 발생하다니 매우 의아할 것이다. 하지만 여기서 우리는 새로운 해결책을 통해 무한 루프를 방지할 수 있게 된다.

### `useCallback`을 통한 무한 루프 방지하기

```js
async function fetchMoviesHandler() {
  ...

}
```

- 무한 루프에 대한 해결책 중 하나는 함수를 의존성 배열에서 제거하는 것이다. 사실 의존성 배열에서 제거되어도, 원하는 결과는 나오기 때문이다. 하지만 함수가 외부 상태를 사용하거나 한다면, 의도치 않은 버그가 발생할 가능성이 높다. 때문에 이에 대한 가장 좋은 해결책은 `useCallback` 훅을 사용해서 우리의 함수 `fetchMoviesHandler`를 감싸는 것이다.

```js
const fetchMoviesHandler = useCallback(() => {
  ...
});
```

- 이를 위해서 `fetchMoviesHandler` 함수는 `useCallback`의 결과를 저장하는 상수가 되어야 하기 때문에 상수 형태로 변경하고, 화살표 함수를 통해 이를 감싸준다. 그리고 `useCallback`의 두 번째 인자인 의존성 배열도 추가해준다.

```js
const fetchMoviesHandler = useCallback(() => {
  ...
}, []);
```

- 해당 함수에서 사용하는 모든 의존성을 의존성 배열의 목록 안에 포인터 해줘야하지만 `fetchMoviesHandler` 함수는 외부 의존성이 없기 때문에 빈 상태로 표기한다. `fetchMoviesHandler` 함수 내부에서 사용하는 fetch API 는 글로벌 브라우저 API 이고 이는 의존성이 아니며, 또한 `setMovies`, `setError`, `setIsLoding` 같은 상태(state) 업데이트 함수는 리액트에서 절대 변경이 일어나지 않을 것이라 보장하고 있기 때문에 의존성으로 추가할 필요가 없기 때문이다.

```js
const fetchMoviesHandler = useCallback(async () => {
  ...
}, []);
```

- 이외에 이전에 `async/await`를 사용해서 비동기적으로 작업해왔던 것을 그대로 해주기 위해 `async` 예약어를 익명 함수 앞에 추가해준다.

![ezgif com-gif-maker (75)](https://user-images.githubusercontent.com/53133662/171169455-b3496e4b-6c4a-4e56-8878-59ac6ee1f47f.gif)

- 이제 저장하고 새로고침을 해보면 무한 루프도 방지하면서 즉각적으로 데이터를 fetch 해옴과 동시에, 버튼을 통해서 수동으로 새로고침을 할 수도 있게 되었다.

</br>

## 다음 단계를 위한 프로젝트 준비하기

- 지금까지는 설정해둔 URL 에 fetch 요청(default는 'GET')을 보내고, 데이터를 받아왔다. 하지만 실제 환경에서는 많은 어플리케이션에서 데이터 fetch 만으로 끝나지 않으며 서버로 데이터를 보내는 작업도 필요할 때가 많다. 예를 들어, 새로운 사용자를 만들 때라던가 말이다. 따라서 `App` 컴포넌트 내부에서 새로운 컴포넌트 `AddMovie`를 추가했다.

```js
<AddMovie onAddMovie={addMovieHandler} />
```

- 이 `AddMovie` 컴포넌트에는 movies를 콘솔 로그에 남기는 `addMovieHandler` 함수도 포인터 했다.

```js
function addMovieHandler(movie) {
  console.log(movie);
}
```

- `AddMovie` 컴포넌트를 보면, 사용자 입력 양식을 렌더링하고 사용자 입력을 받고 있는 걸 알수 있다.

```js
function AddMovie(props) {
  const titleRef = useRef('');
  const openingTextRef = useRef('');
  const releaseDateRef = useRef('');

  function submitHandler(event) {
    event.preventDefault();
    // could add validation here...
    const movie = {
      title: titleRef.current.value,
      openingText: openingTextRef.current.value,
      releaseDate: releaseDateRef.current.value,
    };

    props.onAddMovie(movie);
  }

  ...
}
```

- 우리는 `AddMovie`에서 렌더링하는 폼을 통해서 영화를 직접 추가할 수 있도록 한 것이다.

![ezgif com-gif-maker (76)](https://user-images.githubusercontent.com/53133662/171174805-08cf20cc-ccf6-4eef-83b0-c2f28bf7d22c.gif)

- 우리가 사용 중인 URL("https://swapi.dev/api/films/") 은 영화 정보 데이터 수신('GET')을 위한 더미 API 이다. 외부에서 들어오는 데이터를 받지 못하는 것이다. 그렇기에 지금 우리가 `AddMovie` 컴포넌트 폼을 이용해서 새로운 데이터를 저장하고자 하는 'POST' 요청은 아직 불가능한 상태다. 그렇기에 우리가 'POST' 요청을 통해 데이터를 저장하기 위해서 또 다른 더미 API를 사용해야만 한다. 바로 구글이 제공하는 데이터 저장 서비스인 Firebase 이다.

### Firebase 로 백엔드 데이터베이스 구축하기

- Firebase 는 구글에서 제공하는 서비스로, 코드 작성 없이도 사용 가능한 백엔드 서비스이다. Firebase 자체가 데이터 베이스라고 생각할 수도 있지만 그렇지 않다. 데이터 베이스에 딸린 '백엔드' 인 것이다. 즉, 우리가 요청을 주고 받을 수 있는 완전한 REST API 를 제공하는 '풀 백엔드 어플리케이션' 이라고 볼 수 있다.

![스크린샷 2022-05-31 오후 9 42 42](https://user-images.githubusercontent.com/53133662/171175986-f8841f78-f502-4cce-a6fc-0139e0133221.png)

- Firebase 의 서비스의 좋은 점은 무료로 사용이 가능하다는 것에 있다. 더미 백엔드를 이용해서 서버 기반 코드 없이 무료로 실습이 가능하다는 것이다. 그리고 우리는 이 서비스를 이용해서 데이터를 가져오고 저장할 수 있게 되었다.

### Firebase 사용하기

- 먼저 구글 계정으로 로그인하고, Firebase 콘솔로 이동한다.

![스크린샷 2022-05-31 오후 9 46 20](https://user-images.githubusercontent.com/53133662/171177578-ca9f9576-403e-4876-b237-e3df8b4b3ff3.png)

- 새로운 프로젝트의 이름을 정하고 추가 한 뒤,

![스크린샷 2022-05-31 오후 9 46 38](https://user-images.githubusercontent.com/53133662/171177610-9d13737f-f91b-4a81-a0db-53682206cd10.png)

- 구글 통계는 필요하지 않으므로 비활성화 하고, 프로젝트를 생성한다.

![스크린샷 2022-05-31 오후 9 47 31](https://user-images.githubusercontent.com/53133662/171177620-0f7b52e1-9fdd-4fe2-ba91-86bc7b7a4f44.png)

- 몇 분 후에, Firebase 의 새로운 프로젝트가 만들어진다.

> Firebase 는 구글에서 제공하는 서비스이고, 전체 서비스를 구성하고 있는 제품과 서비스가 매우 다양하다. 하지만 우리는 지금 복잡한 어플리케이션을 만들지 않기 때문에 그 중 일부분만을 사용할 것이다.

![스크린샷 2022-05-31 오후 9 48 23](https://user-images.githubusercontent.com/53133662/171177623-b4b876f9-2022-4432-aa32-3275bad85908.png)

- 프로젝트가 만들어지면, Firebase의 콘솔로 돌아와, Realtime Database(실시간 데이터베이스)탭으로 이동한다. 다시 한번 말하지만, Firebase 는 데이터베이스가 아니며, 제공하는 기능 중 일부가 데이터 베이스일 뿐이다. 그리고 Firebase 가 제공하는 데이터 베이스 서비스는 2개가 있는데, 여기서 Firestore Database(이전엔 Cloude Firestore) 가 기능상 조금 더 강력하지만, 간단한 어플리케이션을 위한 더미 백엔드만 필요하기 때문에 Realtime Database 면 충분하기에 Realtime Database 를 사용해보고자 한다.

![스크린샷 2022-05-31 오후 9 49 08](https://user-images.githubusercontent.com/53133662/171177629-c81ce37b-d43c-4430-b89e-685369365702.png)

- 이제 Realtime Database 탭 페이지로 들어와서 새로운 데이터베이스를 생성하고, 데이터 베이스 설정에서 반드시 '테스트 모드'를 선택한다. 그렇지 않으면 요청 전송이 불가능하기 때문이다.

![스크린샷 2022-05-31 오후 9 49 42](https://user-images.githubusercontent.com/53133662/171177640-732023ab-24f6-40fb-856a-107b99f87f16.png)

- 이제 간단한 데이터베이스가 만들어졌다. 그리고 이 데이터 베이스와 통신할 API URL 역시 제공된다.

### 데이터베이스에서 제공하는 URL은 Firebase REST API에 대한 URL 이다.

- 이 말인 즉슨, 프론트엔드 어플리케이션은 데이터 베이스와 직접 통신이 불가능하고, 또 가능하더라도 그렇게 해서는 안된다. (앞서 여러 번 거론한 문제이다.) 아무튼 이 URL은 Firebase REST API에 대한 URL 이며, 이 API 는 들어오는 요청을 받고 백그라운드의 데이터베이스와 통신 할 뿐이다. 우리가 보기엔 데이터 베이스와 직접 소통하는 것처럼 보이지만 실제로는 그렇지 않다는 뜻이다.

### Firebase API의 URL 로 대체하기

- 이제 우리는 Firebase API가 제공하는 URL을 통해서 Firebase 백엔드, 즉 우리의 데이터 베이스로 데이터를 보낼 수 있게 되었다.

```js
const response = await fetch("https://react-http2-xxxxxxx.firebaseio.com/");
```

- 기존의 영화 데이터를 받아오던 URL을 삭제하고, 우리가 제공받은 URL 주소를 가져온다.

```js
const response = await fetch(
  "https://react-http2-xxxxxxx.firebaseio.com/movies.json"
);
```

- 그리고 해당 주소 뒤에 `movies.json` 이라는 세그먼트를 추가한다. 이 `movies` 라는 이름은 우리가 임의로 정할 수 있다. 그리고 이렇게 하면 데이터베이스에 우리가 지정한 이름 `movies`로 노드가 새롭게 만들어지게 된다. 이것은 동적 REST API 로 서로 다른 세그먼트를 사용하여 데이터 베이스의 서로 다른 노드들에 데이터를 저장할 수 있게 설정해주는 것이다. 그러니 이름은 우리가 데이터를 무엇으로 관리할 것인지에 따라 이름을 직관적으로 정해서 설정해준다.

### .json 확장자를 추가해야 하는 이유

- `movies`에 확장자 `.json`을 추가하는 이유가 궁금할 것이다. 이는 Firebase의 요구 사항으로, 요청을 전달하려는 URL 끝에 `.json`을 반드시 추가해야 한다. 만약 이 확장자를 추가하지 않는다면, 요청은 실패하게 되기 때문이다.

</br>

## POST 요청 보내기

- 이제 남은 건 POST 요청을 전송하고 내가 폼에 입력한 데이터를 Firebase 에 저장하는 것이다.

```js
function addMovieHandler(movie) {
  console.log(movie);
}
```

- 우리가 이전에 설정해두었던 `addMovieHandler` 함수를 보자. 버튼을 클릭하면 `addMovieHandler`가 movie 라는 매개변수를 받아 콘솔에 출력하는 로직이다.

```js
function submitHandler(event) {
  event.preventDefault();

  // could add validation here...

  const movie = {
    title: titleRef.current.value,
    openingText: openingTextRef.current.value,
    releaseDate: releaseDateRef.current.value,
  };

  props.onAddMovie(movie);
}
```

- `AddMovie` 컴포넌트에서 props 로 전달받은 `onAddMovie`(addMovieHandler)에 매개변수로 넘겨주는 moive 의 형태는 어떤가? 위의 코드에서 알 수 있듯이 `moive` 라는 이름의 객체 안에는 `title`과 `openingText` 그리고 `releaseDate`를 담겨있다. (`id`는 firebase에서 자동적으로 추가된다.) 그러니, 이 `addMovieHandler` 에서는 ferch API를 이용해서 또 다른 HTTP 요청을 전송해야 한다. 이전에도 거론한 이야기지만 fetch 라고 해도 사실상 데이터를 가져오는 역할만 하는 것이 아니다. 데이터를 전송하는 데에도 fetch 를 사용할 수 있기 때문이다.

```js
function addMovieHandler(movie) {
  console.log(movie);
}
```

- 다시, `addMovieHandler`로 돌아와서, 데이터를 firebase에 요청해서 전송하는 로직을 추가하도록 하자. 우리의 목적은 요청 전송이다. 데이터를 가져오는 URL 에 반대로 요청을 보내는 것이다. 그렇지 않으면 저장 된 데이터를 가져올 수 없을 것이다.

### fetch 로 POST 요청 보내기

```js
function addMovieHandler(movie) {
  fetch("https://react-http2-xxxxxxx.firebaseio.com/movies.json");

  console.log(movie);
}
```

- 먼저 `fetch()` 를 불러와서 firebase 로부터 제공받은 기존의 URL을 추가한다. 하지만 fetch API 는 기본적으로 'GET' 이 default 이기 떄문에 'POST' 메소드를 사용하기 위해서는 fetch API 의 두 번째 인자를 추가해야 한다.

```js
function addMovieHandler(movie) {
  fetch("https://react-http2-xxxxxxx.firebaseio.com/movies.json", {});

  console.log(movie);
}
```

### fetch API 의 두 번째 인자 - method

- fetch API 두 번째 인자를 지용해서 외부로 전송하는 요청을 지정할 수 있게 되는데, 보통은 method 키 같은 것을 지정한다. fetch API의 기본 값은 'GET' 이지만 우리가 원하는 것은 'POST' 이므로, 여기에 'POST'를 추가한다.

```js
function addMovieHandler(movie) {
  fetch("https://react-http2-xxxxxxx.firebaseio.com/movies.json", {
    method: "POST",
  });

  console.log(movie);
}
```

- 이렇게, Firebase 서비스에 'POST' 요청을 보내면 Firebase는 데이터 베이스에 리소스를 만들 것이다. 'POST' 요청을 보냈을 때 정확히 어떤 일이 발생하는지에 대해서는 우리가 사용하는 백엔드에 달려있게 된다. 'POST' 요청을 보내면 리소스가 생성된다는 게 일반적으로는 그런 의미로 통하지만 어떤 법칙 같은 것은 아니다. 다만 모두 API 에 달린 문제인 것이다.

### fetch API 의 두 번째 인자 - body

- Firebase 에서는 'POST' 요청을 보내게 되면 리소스를 만들어 둔다. 이제 저장해야 하는 리소스를 만들어야 한다는 이야기다. 이를 위해서 fetch API 의 두 번째 인자에 `body` 라는 옵션을 추가한다.

```js
function addMovieHandler(movie) {
  fetch("https://react-http2-xxxxxxx.firebaseio.com/movies.json", {
    method: "POST",
    body: movie,
  });

  console.log(movie);
}
```

- `body` 에는 우리가 추가하고자 하는 것을 적는다. 이번에는 movie 라는 매개 변수(객체)를 받아 `body` 에 넘겨줄 것이기 때문에 그 매개변수를 값으로 지정한다.

```js
function addMovieHandler(movie) {
  fetch("https://react-http2-xxxxxxx.firebaseio.com/movies.json", {
    method: "POST",
    body: JSON.stringify(movie),
  });

  console.log(movie);
}
```

- 하지만, `body`는 자바스크립트 객체가 아닌 `JSON` 데이터를 필요로 한다. `JSON`은 데이터 형태로 프론트엔드와 백엔드 간의 데이터 교환에 사용되는 유형이기 때문이다. 이제 매개변수로 넘겨 받은 자바스크립트 객체 movie 를 `JSON`으로 변환하려면 자바스크립트에 있는 내장 메소드인 `JSON.stringify()`를 사용해야 한다. `JSON.stringify()`를 사용하면 자바스크립트 객체나 배열을 JSON 형태로 변환해주기 때문이다.

### fetch API 의 두 번째 인자 - headers

```js
function addMovieHandler(movie) {
  fetch("https://react-http2-xxxxxxx.firebaseio.com/movies.json", {
    method: "POST",
    body: JSON.stringify(movie),
    headers: {},
  });

  console.log(movie);
}
```

- 마지막으로 조금 더 명확하게 하기 위해서 `headers` 키를 추가한다. `headers` 키를 추가할 때는 값으로 객체를 지정해야 한다.

```js
function addMovieHandler(movie) {
  fetch("https://react-http2-xxxxxxx.firebaseio.com/movies.json", {
    method: "POST",
    body: JSON.stringify(movie),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(movie);
}
```

- `headers`의 객체 값 안에 "Content-Type" 을 키로 지정하고, 값으로는 "application/json" 을 넣어준다. Firebase 에는 `headers`가 반드시 필요한 것은 아니다. `headers` 키가 설정되어 있지 않더라도 요청은 정상저긍로 처리해주기 때문이다. 하지만 요청을 받는 또 다른 대다수의 API는 이러한 `headers` 를 필요로 하기 때문에 추가해주었다. 요청을 받는 API에서는 이 `headers`를 통해서 어떤 컨텐츠가 전달되는지를 알 수 있을 것이다.

### `async/await`로 fetch API로 전송되는 데이터를 비동기적으로 처리하기

- fetch API는 비동기 작업이며 프로미스를 돌려받을 것이기 때문에 앞서 영화 데이터를 받아왔을 때와 마찬가지로 `async/await`를 추가해줘야 한다.

```js
async function addMovieHandler(movie) {
  const response = await fetch(
    "https://react-http2-xxxxxxx.firebaseio.com/movies.json",
    {
      method: "POST",
      body: JSON.stringify(movie),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  console.log(data);
}
```

- fetch 하는 로직을 `response` 라는 상수로 await을 붙여 가져온 뒤 await 로 `response.json()`을 통해 JSON 형식으로 변환한 데이터를 `data` 상수에 할당한다. 그리고 마지막으로 데이터를 콘솔 로그에서 확인할 수 있도록 콘솔 로그도 추가해준다.

> 물론 이 모든 과정에서 이전에 학습했던 것처럼 요청(response)에 대한 오류 처리도 추가할 수 있을 것이다.

![ezgif com-gif-maker (78)](https://user-images.githubusercontent.com/53133662/171196695-ef9373f5-0b2d-4d7f-bdff-f11b12107d87.gif)

- 새로 고침 후 영화 제목과 텍스트, 날짜를 적당히 적어서 "Add Movie" 버튼을 눌러보자. 우리가 콘솔에서 `data`를 출력했던 것이 그대로 추가된 것을 확인할 수 있다. 그리고 Firebase 백엔드로 돌아와 실시간 데이터 베이스 항목을 확인해보면 `movies` 라는 새로운 노드가 추가된 것을 알 수 있다. 우리가 이전에 URL 뒤에 `movies.json`을 적어서 전송 했기 때문이다. 그리고 이 `moives` 라는 노드 안에는 방금 Firebase가 자동 생성한 암호화 된 ID가 있고, 이 안을 보면 우리가 폼에 입력한 데이터가 저장된 것을 알 수 있다. 그리고 개발자 도구의 콘솔에서는 Firebase 로부터 받은 `response` 객체가 출력되어 있고, name 필드에 Firebase가 자동 생성된 ID 를 적어서 응답했다.

### Firebase의 실시간 데이터에 저장된 데이터 가져오기

- 지금까지 'POST' 요청을 전달하는 방식에 대해서 학습했다. 이제 우리는 "Fetch Movies" 버튼을 누르면 실시간 데이터에 저장해둔 영화 데이터를 다시 가져와야 한다.

![스크린샷 2022-05-31 오후 11 26 57](https://user-images.githubusercontent.com/53133662/171197932-b963e5c5-b38e-4035-aab9-00a9c17c8567.png)

- 영화 목록이 렌더링 되던 위치에서 출력되고 있는 오류 메세지를 보면, 앞서 만들어두었던 로직이 더이상 작동하지 않는 걸 알 수 있다.

> Cannot read properties of undefined (reading 'map')

```js
const fetchMoviesHandler = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(
      "https://react-http2-xxxxxxx.firebaseio.com/movies.json"
    );
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const data = await response.json();

    console.log(data);

    const transformedMovies = data.results.map((movieData) => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      };
    });
    setMovies(transformedMovies);
  } catch (error) {
    setError(error.message);
  }
  setIsLoading(false);
}, []);
```

- movies 데이터를 "GET" 해오던 로직 `fetchMoviesHandler` 함수로 돌아가보자. 그 전에 우리가 사용한 실습용 영화 데이터에서는 `results` 필드가 있을 것으로 예상했지만, 지금 우리가 사용하는 데이터에서는 해당 필드가 존재하지 않는다. 이 부분의 수정이 필요할 것 같다.

```js
const data = await response.json();
console.log(data);
```

- `data`를 fetch 해오는 부분에 콘솔 로그를 추가해서 새로고침을 해보면,

![ezgif com-gif-maker (79)](https://user-images.githubusercontent.com/53133662/171200199-462853b8-4413-41d6-bdfe-7488dc4d3566.gif)

- `data` 가 객체로 넘어왔고, 이 객체 안에 암호화된 ID 키가 있으며, 실제로 저장된 영화 데이터는 중첩된 객체로 나타나고 있음을 알 수 있다. 즉, 배열로 가져오지 않고 객체로 받아오고 있는 것이다. (`id`가 key 이며, 실제 데이터는 중첩 객체이다.) 이제 이것 `data` 를 다시 변환한 값을 `setMovies`에 담아서 상태(state)를 갱신해줄 것이다.

### 중첩 객체 데이터를 배열로 변환하기

```js
const loadedMovies = [];
```

- 더이상 `map`은 필요하지 않으므로, 빈 배열을 하나 만든 뒤에

```js
const loadedMovies = [];

for (const key in data) {
}
```

- `for` 루프와 `key in`을 이용해서 객체 안의 모든 key를 확인한다.

```js
const loadedMovies = [];

for (const key in data) {
  loadedMovies.push({});
}
```

- 그리고 `loadedMovies` 배열에 `push()`를 이용해서 객체를 푸쉬하는데,

```js
const loadedMovies = [];

for (const key in data) {
  loadedMovies.push({
    id: key,
  });
}
```

- `id`는 기본의 `key` 값으로 설정하고

![스크린샷 2022-05-31 오후 11 45 33](https://user-images.githubusercontent.com/53133662/171202069-126ebf1c-57f0-483a-b0d6-f694d76067b9.png)

- 우리가 전달받은 객체의 key 값들을 모두 확인해서

```js
const loadedMovies = [];

for (const key in data) {
  loadedMovies.push({
    id: key,
    title: data[key].title,
    openingText: data[key].openingText,
    releaseDate: data[key].releaseDate,
  });
}
```

- `title`과 `openingText`, `releaseDate`의 값으로 넣어준다. 이렇게하면 `response` 로 받은 중첩 객체를 타고 들어가게 된다. 이것이 자바스크립트의 속성에 대한 '동적 접근 방법' 이다. 이제 `loadedMovies`는 내부에 객체가 있는 배열이 되며, 각 객체는 우리가 원하는 구조를 그대로 가지고 있다. 따라서 기존의 `map`으로 데이터를 넣어두었던 `transformedMovies`를 삭제하고,

```js
setMovies(loadedMovies);
```

- `setMovies`의 상태 업데이트 값으로 `loadedMovies` 를 포인터 해준다.

![스크린샷 2022-05-31 오후 11 59 57](https://user-images.githubusercontent.com/53133662/171205667-d7421811-9342-4bc9-bdbd-ea39254c4364.png)

- 저장 후 새로고침을 하면, 우리가 저장한 데이터가 `MoviesList`에 정상적으로 로드 된 것을 확인할 수 있다. 두 번째 영화를 또 다른 텍스트를 통해 추가해보고, 다시 "Fetch Movies" 버튼을 누르면

![ezgif com-gif-maker (80)](https://user-images.githubusercontent.com/53133662/171206530-8de0e49c-23ee-4457-8fbe-1d0a4132b0bf.gif)

- 두 번째로 추가한 영화 역시 정상적으로 로드 되는 걸 알 수 있다.

</br>
