import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContactsListComponent} from './contacts-list/contacts-list.component';
import {ReservationListComponent} from './reservation-list/reservation-list.component';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {ContactFormComponent} from './contact-form/contact-form.component';
import {ReservationFormComponent} from './reservation-form/reservation-form.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
