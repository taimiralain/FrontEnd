import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Reservation} from '../common/reservation';


@Component({
  selector: 'app-reservation-item',
  templateUrl: './reservation-item.component.html',
  styleUrls: ['./reservation-item.component.css']
})
export class ReservationItemComponent{
  @Output() deleteReservation = new EventEmitter<Reservation>();
  @Output() rateReservation = new EventEmitter<Reservation>();
  @Output() favoriteReservation = new EventEmitter<Reservation>();
  @Input () reservation: Reservation;

  onDeleteReservation(data: Reservation): void{
    this.deleteReservation.emit(data);
  }

  onFavoriteReservation(data: Reservation): void{
    this.favoriteReservation.emit(data);
  }

  onRateReservation(data: Reservation): void{
    this.rateReservation.emit(data);
  }
}
