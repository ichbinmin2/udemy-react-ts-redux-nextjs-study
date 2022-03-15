# First Practice Project: React

## 목차

- [Practice | Adding a "User" Component](#사용자-컴포넌트-추가하기)
- [Practice | Adding a re-usable "Card" Component](#재사용-가능한-카드-컴포넌트-추가하기)
- [Practice | Adding a re-usable "Button" Component](#재사용-가능한-버튼-컴포넌트-추가하기)
- [Practice | Managing the User Input State](#사용자-입력-State-관리하기)

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
