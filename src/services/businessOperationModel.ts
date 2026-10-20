export function canManageOperation(role: string | undefined): boolean {
  return role === 'owner' || role === 'manager';
}

/** A request can commit only while it is the newest request for the mounted scope. */
export function createOperationRequestGate() {
  let generation = 0;
  return {
    start: () => ++generation,
    current: (ticket: number) => ticket === generation,
    invalidate: () => { generation++; },
  };
}
