import { Component, OnInit } from '@angular/core';
import { Sweet } from '../../../../../core/models/sweet.model';
import { SweetService } from '../../../../../core/services/sweet';
import { CommonModule, CurrencyPipe, NgFor } from '@angular/common';
import { SweetForm } from '../../../components/sweet-form/sweet-form';

@Component({
  selector: 'app-admin-dashboard',
  imports: [NgFor,SweetForm,CurrencyPipe,CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
sweets: Sweet[] = [];
  
  // State for the Modal
  showForm = false;
  selectedSweet: Sweet | null = null; 

  constructor(private sweetService: SweetService) {}

  ngOnInit() {
    this.loadSweets();
  }

  loadSweets() {
    this.sweetService.getAllSweets().subscribe(data => this.sweets = data);
  }

  // --- Actions ---

  // Opens Modal in "Add" mode
  onAddNew() {
    this.selectedSweet = null; // Clear selection
    this.showForm = true;      // Show modal
  }

  // Opens Modal in "Edit" mode with data pre-filled
  onEdit(sweet: Sweet) {
    this.selectedSweet = sweet; 
    this.showForm = true;
  }

  // Handles Delete with confirmation 
  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this sweet? This cannot be undone.')) {
      this.sweetService.deleteSweet(id).subscribe({
        next: () => {
          this.loadSweets(); // Refresh list
        },
        error: (err) => alert('Failed to delete sweet.')
      });
    }
  }

  // --- Modal Events ---

  // Called when the child component successfully saves data
  onFormSubmit() {
    this.showForm = false; // Close modal
    this.loadSweets();     // Refresh list to show new/updated item
  }

  // Called when user clicks "Cancel" or backdrop
  onCancel() {
    this.showForm = false;
  }
}
