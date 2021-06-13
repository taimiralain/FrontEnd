import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {InputItemsValidator} from '../common/Inputs.validator';
import {ContactService} from '../services/contact.service';
import {ReservationService} from '../services/reservation.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as Editor from '../../ckeditor5-custom-build/build/ckeditor';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular';


@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})

export class ReservationFormComponent implements OnInit {
  constructor(
    private service: ContactService,
    private serviceR: ReservationService,
    private route: ActivatedRoute,
    private  router: Router
  ) { }

  private parameter: number;
  public Editor = Editor;
  public config =
    {
      toolbar: {
        items: [
          'heading', '|',
          'fontfamily', 'fontsize', '|',
          'alignment', '|',
          'fontColor', 'fontBackgroundColor', '|',
          'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
          'link', '|',
          'outdent', 'indent', '|',
          'bulletedList', 'numberedList', 'todoList', '|',
          'code', 'codeBlock', '|',
          'insertTable', '|',
          'uploadImage', 'blockQuote', '|',
          'undo', 'redo']
      },
      language: 'en',
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells'
        ]
      },
      licenseKey: '',
  };
  public model = {
    editorData: '',
    config:
      {
        toolbar: {
          items: [
            'heading', '|',
            'fontfamily', 'fontsize', '|',
            'alignment', '|',
            'fontColor', 'fontBackgroundColor', '|',
            'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
            'link', '|',
            'outdent', 'indent', '|',
            'bulletedList', 'numberedList', 'todoList', '|',
            'code', 'codeBlock', '|',
            'insertTable', '|',
            'uploadImage', 'blockQuote', '|',
            'undo', 'redo']
        },
        language: 'en',
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
          ]
        },
        licenseKey: '',
      }
  };
  form = new FormGroup( {
    name: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required, InputItemsValidator.isAPhoneNumber,
                                                            Validators.minLength(7), Validators.maxLength(12)]),
    reservationDate: new FormControl(null, [Validators.required, InputItemsValidator.isDateAfterToday])
  });

  public onChange( { editor }: ChangeEvent ): void{
    this.model.editorData = editor.getData();
  }
  onSubmit(): void {
    // Get All Contacts and verify if the pair Name and PhoneNumber exist in the database, and if it is a valid pair,
    //  get the corresponding contactId. Once it be available contactId, build the Reservation Object and make the POST request.
      this.service.getContacts()
        .subscribe(
          contactsResponse => {
            const ContactId = this.GetContactIdByPairNameAndPhone(contactsResponse);
            if (ContactId > 0)
            {
              const reservation = this.MappingFormsToRequestReservation(ContactId);
              if (this.parameter === 0)
              {
                this.serviceR.postReservation(reservation)
                  .subscribe(
                    () => this.RedirectTo('/') ,
                    error => this.HandleError(error));
              }
              else
              {
                this.serviceR.updateReservation(reservation, this.parameter)
                  .subscribe(
                    () => this.RedirectTo('/'),
                    error => this.HandleError(error));
              }
            }
            else
            {
              // tslint:disable-next-line:max-line-length
              alert('This pair Contact Name and Contact Number doesn\'t exist in the system. Please add the current Contact and try again.');
            }
          }
        );
  }
  ngOnInit(): void {
    this.UpdateParameterWithGetRouteParam();
    if (this.parameter !== 0)
    {
      // Get Reservation by ID, then with ContactId get the contact data (name, phoneNumber) and set into the forms
      this.serviceR.getReservation(this.parameter)
        .subscribe(
          reservationResponse => {
            this.service.getContact(reservationResponse['contactId'])
              .subscribe(
                contactResponse => this.MappingResponseToFormFields(contactResponse, reservationResponse) ,
                (error) => this.HandleError(error));
          },
          error => {
            this.HandleError(error);
            this.RedirectTo('/');
          }
        );
    }
  }
  RedirectTo(url: string): void{
    this.router.navigateByUrl(url);
  }
  UpdateParameterWithGetRouteParam(): void{
    this.parameter = this.route.snapshot.paramMap.get('reservationId') === 'new' ? 0 : Number(this.route.snapshot.paramMap.get('reservationId'));
  }
  MappingResponseToFormFields(contact, reservation): void{
    this.form.setValue(
      {
        name : contact['name'],
        phoneNumber : contact['phoneNumber'],
        reservationDate : reservation['reservationDate']
      });
    this.model.editorData = reservation.description;
  }
  MappingFormsToRequestReservation(ContactId: number): any{
    return {
      contactId: ContactId,
      reservationDate: this.form.get('reservationDate').value,
      description: this.model.editorData
    };
  }
  GetContactIdByPairNameAndPhone(Contacts): number{
    let contactId = 0;
    Object.keys(Contacts).some(
      (key) => {
        const item = Contacts[key];
        if (item.name === this.form.get('name').value && item.phoneNumber === Number(this.form.get('phoneNumber').value))
        {
          contactId = item.contactId;
          return true;
        }
      });
    return contactId;
  }
  HandleError(error): void{
    if (error.status === 404) { alert('This reservation doesn\'t exist in the System.'); }
    else if (error.status === 400 ){ alert('An error has occurred, please check the contact name and the phone number'); }
    else { alert('An unexpected error occurred.'); }
  }
}

