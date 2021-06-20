import React, { useState } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { dispatchLocalEvent, LocalEvent, useLocalEvent, useLocalEventCreate } from './../src/index';

let container: HTMLElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
});

type Action =
  | { readonly type: 'add_a'; payload: number }
  | { readonly type: 'add_b'; payload: number };
// Event Sending Component
const Sender = ({ event }: { event: LocalEvent<Action> }) => {
  return (
    <div>
      <button id="a" onClick={() => dispatchLocalEvent(event, { type: 'add_a', payload: 100 })}>
        A
      </button>
      <button id="b" onClick={() => dispatchLocalEvent(event, { type: 'add_b', payload: 100 })}>
        B
      </button>
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
          <input
            id="a"
            type="radio"
            name="group"
            checked={group === 'a'}
            onChange={() => setGroup('a')}
          />
          A
        </label>
        <label>
          <input
            id="b"
            type="radio"
            name="group"
            checked={group === 'b'}
            onChange={() => setGroup('b')}
          />
          B
        </label>
        <div id="value">{value}</div>
      </form>
    </div>
  );
};
// Parent component
const Parent = () => {
  const event = useLocalEventCreate<Action>();
  return (
    <>
      <div id="recv1">
        <Recv event={event} />
      </div>
      <div id="recv2">
        <Recv event={event} />
      </div>

      <Sender event={event} />
    </>
  );
};

it('Group dispatch', () => {
  act(() => {
    render(<Parent />, container);
  });
  const click = new MouseEvent('click', { bubbles: true });
  const recv1A = container.querySelector('#recv1 #a');
  const recv1B = container.querySelector('#recv1 #b');
  const recv2B = container.querySelector('#recv2 #b');
  const buttonA = container.querySelector('button#a');
  const buttonB = container.querySelector('button#b');

  act(() => {
    recv1B?.dispatchEvent(click);
  });
  act(() => {
    buttonA?.dispatchEvent(click);
  });
  act(() => {
    recv1A?.dispatchEvent(click);
  });
  act(() => {
    buttonA?.dispatchEvent(click);
  });
  act(() => {
    recv2B?.dispatchEvent(click);
  });
  act(() => {
    buttonB?.dispatchEvent(click);
    buttonB?.dispatchEvent(click);
    buttonB?.dispatchEvent(click);
  });
  const recv1Value = container.querySelector<HTMLDivElement>('#recv1 #value');
  const recv2Value = container.querySelector<HTMLDivElement>('#recv2 #value');
  expect({ value1: recv1Value?.textContent, value2: recv2Value?.textContent }).toMatchSnapshot();
});
