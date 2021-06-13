import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiUrl} from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private controllerUrl = apiUrl + 'reservations';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:typedef
  getReservations() {
    return this.http.get(this.controllerUrl);
  }
  // tslint:disable-next-line:typedef
  getReservation(id: number ) {
    return this.http.get(this.controllerUrl + '/' + id );
  }
  // tslint:disable-next-line:typedef
  postReservation(reservation) {
    return this.http.post(this.controllerUrl, reservation);
  }
  // tslint:disable-next-line:typedef
  updateReservation(reservation, id: number) {
    return this.http.put(this.controllerUrl + '/' + id, reservation);
  }
  // tslint:disable-next-line:typedef
  deleteReservation(id: number)
  {
    return this.http.delete( this.controllerUrl + '/' + id);
  }
}
