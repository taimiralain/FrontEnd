import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  constructor() { }

  @Input() numberOfItems: number;
  @Input() numberOfItemsPerPage: number;
  @Input() activePage: number;
  @Output() paginateTo = new EventEmitter<number>();
  public numberOfPages: number;
  public pagesList: any[];

  onPaginateTo(nextPage: number): void {
    this.paginateTo.emit(nextPage);
  }

  isActivePage(value: number): boolean{
    return (value === this.activePage);
  }

  ngOnInit(): void {
    this.numberOfPages = Math.ceil(this.numberOfItems / this.numberOfItemsPerPage);
    this.pagesList = [ ...Array(this.numberOfPages).keys() ].map( i => i + 1);
  }

}
