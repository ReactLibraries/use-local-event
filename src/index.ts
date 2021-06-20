import { useEffect, useRef } from 'react';

/**
 * Type for event control
 *
 * @export
 * @interface LocalEvent
 * @template T
 */
export interface LocalEvent<T> {
  callbacks: ((action: T) => void)[];
}

/**
 * Create a event
 *
 * @template T
 * @return {*}
 */
export const useLocalEventCreate = <T>() => {
  return useRef<LocalEvent<T>>({
    callbacks: [],
  }).current;
};

/**
 * Interpreting events
 *
 * @template T
 * @param {LocalEvent<T>} event
 * @param {LocalEvent<T>['callbacks'][0]} callback
 */
export const useLocalEvent = <T>(event: LocalEvent<T>, callback: LocalEvent<T>['callbacks'][0]) => {
  useEffect(() => {
    event.callbacks = [...event.callbacks, callback];
    return () => {
      event.callbacks = event.callbacks.filter((a) => a !== callback);
    };
  }, [event, callback]);
};

/**
 * Trigger an event.
 *
 * @template T
 * @param {LocalEvent<T>} event
 * @param {T} action
 */
export const dispatchLocalEvent = <T>(event: LocalEvent<T>, action: T) => {
  event.callbacks.forEach((callback) => callback(action));
};
