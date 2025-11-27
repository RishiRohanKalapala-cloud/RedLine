export type Guest = {
  id: number;
  name: string;
  passcode: string;
};

// Central list of allowed guests. Add new entries here in the future.
export const GUESTS: Guest[] = [
  { id: 1, name: 'Shubhang', passcode: '123456' },
  { id: 2, name: 'Prabhav', passcode: '305-B' },
  { id: 3, name: 'Rishi', passcode: '654321' },
  { id: 4, name: 'Karthik', passcode: '111111' },
  { id: 5, name: 'Teja', passcode: '222222' },
  { id: 6, name: 'Anu', passcode: '333333' },
  { id: 7, name: 'Swaroop', passcode: '444444' },
  { id: 8, name: 'Varun', passcode: '555555' },
  { id: 9, name: 'Chaitu', passcode: '777777' },
  { id: 10, name: 'Shiva Kumar', passcode: '888888' },
];

export function findGuest(name: string, passcode: string): Guest | undefined {
  const normalizedName = name.trim().toLowerCase();
  const normalizedPass = passcode.trim();

  return GUESTS.find(
    (guest) =>
      guest.name.trim().toLowerCase() === normalizedName && guest.passcode === normalizedPass,
  );
}


