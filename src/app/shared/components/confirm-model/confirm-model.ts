import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-model',
  imports: [],
  templateUrl: './confirm-model.html',
  styleUrl: './confirm-model.css',
})
export class ConfirmModel {

  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

}
