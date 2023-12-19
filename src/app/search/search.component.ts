import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTerm: string = '';

  @Output() search = new EventEmitter<string>();

  onSearch(): void {
    this.search.emit(this.searchTerm);
  }

  cancelSearch(): void {
    this.searchTerm = '';
    this.search.emit(this.searchTerm);
  }
  
}