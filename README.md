# @react-libraries/use-local-event

## What is this

Handling events between components in React

***

## Table of contents

### Interfaces link

- [LocalEvent](#localevent)

### Functions link

- [useLocalEventCreate](#uselocaleventcreate)
- [useLocalEvent](#useLocalEvent)
- [dispatchLocalEvent](#dispatchLocalEvent)

### Samples link

- [Sample](#sample)

***

## Interface

### LocalEvent

Type for event control

```ts
export interface LocalEvent<T> {
  callbacks: ((action: T) => void)[];
}
```

## Functions

### useLocalEventCreate

```ts
useLocalEventCreate<T>()
```

- `<T>` Event action type

Create a event

___

### useLocalEvent

```ts
useLocalEvent<T>(event: LocalEvent<T>, callback: (action:T)=>void)
```

- `<T>` Event action type
- `event` Event Instance
- `callback` Event processing details

Interpreting events
___

### dispatchLocalEvent

```ts
dispatchLocalEvent<T>(event: LocalEvent<T>, action: T)
```

- `<T>` Event action type
- `event` Event Instance
- `action` Operation

Trigger an event

___

## Sample

```tsx
import React, { useState } from 'react';
import {
  LocalEvent,
  dispatchLocalEvent,
  useLocalEventCreate,
  useLocalEvent,
} from '@react-libraries/use-local-event';

type Action =
  | { readonly type: 'add_a'; payload: number }
  | { readonly type: 'add_b'; payload: number };

// Event Sending Component
const Sender = ({ event }: { event: LocalEvent<Action> }) => {
  return (
    <div>
      <button onClick={() => dispatchLocalEvent(event, { type: 'add_a', payload: 100 })}>A</button>
      <button onClick={() => dispatchLocalEvent(event, { type: 'add_b', payload: 100 })}>B</button>
    </div>
  );
};

// Event Reception Component
const Recv = ({ event }: { event: LocalEvent<Action> }) => {
  const [group, setGroup] = useState('a');
  const [value, setValue] = useState(0);
  useLocalEvent(event, ({ type, payload }) => {
    type === 'add_a' && group === 'a' && setValue((v) => v + payload);
    type === 'add_b' && group === 'b' && setValue((v) => v + payload);
  });
  return (
    <div>
      <form>
        <label>
          <input type="radio" name="group" checked={group === 'a'} onChange={() => setGroup('a')} />
          A
        </label>
        <label>
          <input type="radio" name="group" checked={group === 'b'} onChange={() => setGroup('b')} />
          B
        </label>
        <div>{value}</div>
      </form>
    </div>
  );
};

// Parent component
const App = () => {
  const event = useLocalEventCreate<Action>();
  return (
    <>
      <Recv event={event} />
      <hr />
      <Recv event={event} />
      <hr />
      <Sender event={event} />
    </>
  );
};

export default App;
```
