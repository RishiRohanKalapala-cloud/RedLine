import type { Guest } from './guests';

let currentGuest: Guest | null = null;

export function setCurrentGuest(guest: Guest) {
  currentGuest = guest;
}

export function getCurrentGuest(): Guest | null {
  return currentGuest;
}

export function clearCurrentGuest() {
  currentGuest = null;
}


