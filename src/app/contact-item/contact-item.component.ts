import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Contact} from '../common/contact';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.css']
})

export class ContactItemComponent {
  @Output() deleteContact = new EventEmitter<Contact>();
  @Input() contact: Contact;
  public contactType = { 0: 'Contact Type 1', 1: 'Contact Type 2', 2: 'Contact Type 3'};

  onDeleteContact(contact: Contact): void {
    this.deleteContact.emit(contact);
  }

}
