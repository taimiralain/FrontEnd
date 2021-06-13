import {Component, OnInit} from '@angular/core';
import {Reservation} from '../common/reservation';
import {FormControl, FormGroup} from '@angular/forms';
import {ReservationService} from '../services/reservation.service';
import {ContactService} from '../services/contact.service';
import {ArrayManipulations} from '../common/listsManipulations';


@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

  constructor(private service: ReservationService, private serviceC: ContactService) {
    this.numberOfItemsInAPage = 5;
    this.currentPage = 1;
  }

  public numberOfItemsInAPage: number;
  public currentPage: number ;
  public reservations: Reservation[];
  public reservationsToPage: Reservation[];
  public form: FormGroup;
  public SortCategory = [
    {value: 'contactName',   label: 'By Name Ascending'},
    {value: 'contactName r', label: 'By Name Descending'},
    {value: 'reservationDate',   label: 'By Date Ascending'},
    {value: 'reservationDate r', label: 'By Date Descending'},
    {value: 'rate', label: 'By Rate Ascending'},
    {value: 'rate r', label: 'By Rate Descending'}
  ];

  onDeleteReservation(reservation): void {
    this.service.deleteReservation(reservation.reservationId)
      .subscribe(
        () => {
          const index = this.reservations.indexOf(reservation);
          this.reservations.splice(index, 1);
          this.Paginate(); },
        error => this.HandleError(error));
  }
  onPaginateTo(nextPage: number): void{
    this.currentPage = nextPage;
    this.Paginate();
  }
  onFavoriteReservation(reservation): void{
    reservation.isFavorite = !reservation.isFavorite;
    this.service.updateReservation(reservation, reservation.reservationId)
      .subscribe(
        () => {},
        (error) => {
          reservation.isFavorite = !reservation.isFavorite;
          this.HandleError(error);
        });
  }
  onRateReservation(reservation): void{
    const oldRate = reservation.rate;
    reservation.rate = (oldRate + 1) % 5;
    this.service.updateReservation(reservation, reservation.reservationId)
      .subscribe(
        () => {},
        (error) => {
          reservation.rate = oldRate;
          this.HandleError(error);
        });
  }
  ngOnInit(): void {
    // First of all, Get all Reservations, then for each reservation get the associate Contact Data
    // Then, in the last iteration inside the second observable we charge and update the ReservationsList.
    this.service.getReservations()
      .subscribe(
        reservationsResponse => this.SetAllMappedReservations(reservationsResponse),
        (error) => this.HandleError(error));
    this.form = new FormGroup({sortOrder: new FormControl()});
    this.form.controls['sortOrder'].valueChanges.subscribe(val => {
      this.reservations = ArrayManipulations.sortItemsBy(this.reservations, val);
      this.Paginate();
    });
  }
  SetAllMappedReservations(reservationsResponse): void{
    let stopCounter = Object.keys(reservationsResponse).length;
    const newReservations = [];
    Object.keys(reservationsResponse).map(
      key => {
        const reservationItem = reservationsResponse[key];
        this.serviceC.getContact(reservationItem.contactId)
          .subscribe(
            contactItem => {
              newReservations.push(this.MapperResponsesToReservations(contactItem, reservationItem));
              stopCounter--;
              if (stopCounter === 0) {
                this.reservations = newReservations;
                this.Paginate();
              }},
            (error) => this.HandleError(error));
      });
  }
  HandleError(error): void {
    if (error.status === 404) {alert('The element doesn\'t exist in the system'); }
    else { alert('An unexpected error occurred'); }
  }
  Paginate(): void{
    this.reservationsToPage = ArrayManipulations.selectItemsFromPage(this.reservations, this.numberOfItemsInAPage, this.currentPage);
  }
  MapperResponsesToReservations(ContactResponse, ReservationResponse): Reservation{
    return {
      reservationId: ReservationResponse.reservationId,
      cratedDate: ReservationResponse.cratedDate,
      reservationDate : ReservationResponse.reservationDate,
      isFavorite: ReservationResponse.isFavorite,
      rate: ReservationResponse.rate,
      description: ReservationResponse.description,
      contactId: ReservationResponse.contactId,
      contactName: ContactResponse.name};
  }
}
