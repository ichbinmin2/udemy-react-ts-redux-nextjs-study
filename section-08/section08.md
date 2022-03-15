# First Practice Project: React

## 목차

- [Practice | Adding a "User" Component](#사용자-컴포넌트-추가하기)
- [Practice | Adding a re-usable "Card" Component](#재사용-가능한-카드-컴포넌트-추가하기)
- [Practice | Adding a re-usable "Button" Component](#재사용-가능한-버튼-컴포넌트-추가하기)
- [Practice | Managing the User Input State](#사용자-입력-State-관리하기)
- [Practice | Adding Validation & Resetting Logic](#검증-추가-및-로직-재설정하기)
- [Practice | Adding a Users List Component](#사용자-목록-컴포넌트-추가하기)
- [Practice | Managing a List Of Users via State](#State를-통해-사용자-목록-관리하기)
- [Practice | Adding The "ErrorModal" Component](#ErrorModal-컴포넌트-추가하기)
- [Practice | Managing the Error State](#오류-State-관리하기)

## 재사용 가능한 버튼 컴포넌트 추가하기

### AddUser.js

```js
<Button type="submit">Add User</Button>
```

### Button.js

```js
const Button = (props) => {
  return (
    <button
      type={props.type || "button"}
      className={styles.button}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
```

- `type`을 외부에서 받아와 설정할 경우 `||(or)`를 지정하여, 외부로부터 `type`을 받지 않았을 때에도 이를 보장할 수 있도록 default `type`을 "button" 으로 할당해야 한다.

</br>

## 검증 추가 및 로직 재설정하기

```js
if (userNameLength <= 0 && userAgeLength <= 0) {
  ...
} else if (user.age < 0) {
 ...
} else {
  ...
}
```

- 앞서, `01-react-practice-project` 에서 기존의 조건식을 `if || else`로 작성하였는데, 그럴 필요 없이 모든 조건식을 `if`로 설정하면 `if`에 맞는 모든 조건식을 모두 고려할 수 있게 된다.

```js
if (userName.trim().length === 0 || userAge.trim().length === 0) {
  return; // 함수 중지
}

if (userAge < 1) {
  return; // 함수 중지
}

console.log(userName, userAge);
```

- 또한, `userAge` 상태는 문자열이기 때문에 숫자로 변환을 해야 안전하게 1과 비교할 수 있기 때문에 `userAge` 앞에 `+`를 붙여줌으로써 숫자 타입으로 강제 변환하여 사용해야 한다.

```js
if (+userAge < 1) {
  return; // 함수 중지
}
```

- 이로써, `form`을 제출하는 버튼을 누르면 유효성 검사가 실시될 것이다. 이제 `userName` 또는 `userAge`의 값이 비워져있거나 `userAge`가 0보다 작으면(음성이면) 함수를 중지시키고, 그렇지 않으면(유효성 검사가 통과되면) `console.log`에 `userName`과 `userAge`가 출력된다.

</br>

## 오류 State 관리하기

### 1. Error State 생성하고 props로 내려주기

#### AddUser.js

```js
const [error, setError] = useState();
```

- `error` 상태(state) 생성하고 기본 값은 없게 함.

```js
const addUserHandler = (event) => {
  event.preventDefault(); // form submit 리로딩 방지

  if (userName.trim().length === 0 || userAge.trim().length === 0) {
    setError({
      title: "Invalid input",
      message: "Please enter a valid name and age (non-empty values).",
    });
    return;
  }

  if (+userAge < 1) {
    setError({
      title: "Invalid age",
      message: "Please enter a valid age (> 0).",
    });
    return;
  }

  props.onAddUser(userName, userAge);
  setUserName("");
  setUserAge("");
};
```

- 유효성 검사 내부에 `error`의 상태(state) 업데이트 함수인 `setError`에 객체로 해당 조건에 해당하는 `title`과 `message` 각각 전달.

```js
{
  error && <ErrorModal title={error.title} message={error.message} />;
}
```

- `error`가 있으면(`&&`) `<ErrorModal>` 컴포넌트를 렌더링할 수 있도록 함.

### 2. Error State를 이용하여 ErrorModal 닫기(없애기)

#### AddUser.js

```js
const errorHandler = () => {
  setError(null); // false value
};
```

- `ErrorModal` 컴포넌트를 렌더링하는 `error` 상태(state)를 `null` 값으로 비워주는 함수 작성.

```js
{
  error && (
    <ErrorModal
      title={error.title}
      message={error.message}
      onConfirm={errorHandler}
    />
  );
}
```

- `ErrorModal` 컴포넌트에 `errorHandler` 함수를 `onConfirm`라는 prop 이름으로 전달

#### ErrorModal.js

```js
const ErrorModal = (props) => {
  return (
    <div>
      <div className={styles.backdrop} onClick={props.onConfirm} />
      <Card classNameProps={styles.modal}>
        <header className={styles.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={styles.content}>
          <p>{props.message}</p>
        </div>
        <footer className={styles.actions}>
          <Button onClick={props.onConfirm}>Okay</Button>
        </footer>
      </Card>
    </div>
  );
};
```

- `Button` 컴포넌트와 backdrop에 해당하는 `<div>`를 클릭하면 `onClick` 이벤트로 `props.onConfirm` 함수 실행.

### 정리

- 유효성 검사를 통해 해당하는 error 내용(객체)을 담은 Modal이 error 내용이 빈 값(`null`)이 아닐 때만 렌더링되고, Modal의 backdrop에 해당하는 `<div>`와 `Button`을 클릭하면 error 내용이 빈 값(`null`)이 되며, 더이상 Modal이 렌더링되지 않는다.

</br>
