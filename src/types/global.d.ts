// This file provides global TypeScript type declarations

// Add Symbol.iterator method to array-like types that are causing problems
interface IterableWithLength<T> {
  length: number;
  [index: number]: T;
  [Symbol.iterator](): IterableIterator<T>;
}

// Augment the useState return type 
declare module 'react' {
  interface Dispatch<A> {
    [Symbol.iterator](): IterableIterator<Dispatch<A>>;
  }
}

export {}; 