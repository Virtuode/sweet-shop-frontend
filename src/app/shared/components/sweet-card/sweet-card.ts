import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sweet } from '../../../core/models/sweet.model';
import { CommonModule, CurrencyPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-sweet-card',
  imports: [CurrencyPipe,NgIf,CommonModule],
  templateUrl: './sweet-card.html',
  styleUrl: './sweet-card.css',
})
export class SweetCard {

  @Input({ required: true }) sweet!: Sweet;
  
  // Determines if Admin controls (Edit/Delete) should be shown
  @Input() isAdmin = false;

  // Events to notify the parent component
  @Output() purchase = new EventEmitter<string>(); // Emits sweet ID [cite: 39]
  @Output() edit = new EventEmitter<Sweet>();      // Emits full sweet object
  @Output() delete = new EventEmitter<string>();   // Emits sweet ID

  // Simple handler to emit the purchase event
  onPurchase() {
    this.purchase.emit(this.sweet.id);
  }

}
