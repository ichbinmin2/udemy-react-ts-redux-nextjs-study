# First Practice Project: React

## 목차

- [Practice | Adding a "User" Component](#사용자-컴포넌트-추가하기)
- [Practice | Adding a re-usable "Card" Component](#재사용-가능한-카드-컴포넌트-추가하기)
- [Practice | Adding a re-usable "Button" Component](#재사용-가능한-버튼-컴포넌트-추가하기)
- [Practice | Managing the User Input State](#사용자-입력-State-관리하기)
- [Practice | Adding Validation & Resetting Logic](#검증-추가-및-로직-재설정하기)
- [Practice | Adding a Users List Component](#사용자-목록-컴포넌트-추가하기)

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
