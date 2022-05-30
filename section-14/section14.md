# Sending Http Requests (e.g Connecting to a Database)

## 목차

- [How To (Not) Connect To A Database](#데이터베이스에-연결하지-않는-방법)
- [Our Starting App & Backend](#시작-앱-및-백엔드)
- [Sending a GET Request](#GET-요청-보내기)

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

- reponse 객체에 있는 내장 메소드인 `json()`를 사용해서 자동으로 변환해줄 수 있도록 한다. 그리고 이 `json()` 메소드 역시, 프로미스 객체를 반환하므로 추가적인 `then()` 구역을 생성해야할 필요성이 있다.

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
