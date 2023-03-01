
declare module 'react-native/Libraries/vendor/emitter/EventEmitter' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type EventListenerCallback = (...args: any[]) => void;

  interface EventListenerSubscription {
    remove: () => void;
  };

  export default class EventEmitter<EventType> {
    addListener: (
      key: EventType,
      cb: EventListenerCallback,
    ) => EventListenerSubscription;

    emit: (
      key: EventType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...args: any[],
    ) => void;
  };
}
