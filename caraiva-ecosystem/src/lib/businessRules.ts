export type PaymentState = 'simulated' | 'pending' | 'paid';

export function paymentLabel(status?: PaymentState): string {
  return status === 'paid' ? 'Pago' : status === 'simulated' ? 'Simulação · sem cobrança' : 'Aguardando pagamento';
}

export function canCheckIn(
  booking: { kind: string; refId: string; checkedIn?: boolean; paymentStatus?: PaymentState },
  scope: { kind: string; refIds: readonly string[]; allowSimulation?: boolean },
): boolean {
  return booking.kind === scope.kind && scope.refIds.includes(booking.refId) && !booking.checkedIn &&
    (booking.paymentStatus === 'paid' || (scope.allowSimulation === true && booking.paymentStatus === 'simulated'));
}

export function bookedSeats(tourId: string, bookings: readonly { kind: string; refId: string; seats?: number }[]): number {
  return bookings.filter(b => b.kind === 'passeio' && b.refId === tourId)
    .reduce((total, b) => total + (b.seats ?? 0), 0);
}
