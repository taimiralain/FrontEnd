export interface Reservation {
  reservationId: number;
  cratedDate: Date;
  reservationDate: Date;
  isFavorite: boolean;
  rate: number;
  contactId: number;
  contactName: string;
  description: string;
}
