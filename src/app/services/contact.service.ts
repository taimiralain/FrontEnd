import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiUrl} from '../common/constants';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private controllerUrl = apiUrl + 'contacts';

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:typedef
  getContacts() {
    return this.http.get(this.controllerUrl);
  }
  // tslint:disable-next-line:typedef
  getContact(id: number ) {
    return this.http.get(this.controllerUrl + '/' + id );
  }
  // tslint:disable-next-line:typedef
  postContact(contact) {
    return this.http.post(this.controllerUrl, contact);
  }
  // tslint:disable-next-line:typedef
  updateContact(contact, id: number) {
    return this.http.put(this.controllerUrl + '/' + id, contact);
  }
  // tslint:disable-next-line:typedef
  deleteContact(id: number)
  {
    return this.http.delete( this.controllerUrl + '/' + id);
  }
}
