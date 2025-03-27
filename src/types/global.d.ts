// This file provides global TypeScript type declarations

declare module 'react' {
  interface Dispatch<A> {
    [Symbol.iterator](): IterableIterator<Dispatch<A>>;
  }
  
  interface SetStateAction<T> {
    [Symbol.iterator](): IterableIterator<SetStateAction<T>>;
  }

  interface UseStateReturn<T> {
    [Symbol.iterator](): IterableIterator<[T, Dispatch<SetStateAction<T>>]>;
  }

  function useState<T>(initialState: T | (() => T)): UseStateReturn<T>;
}

export {}; 