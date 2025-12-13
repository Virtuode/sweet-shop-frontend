import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sweet } from '../../../../core/models/sweet.model';
import { SweetService } from '../../../../core/services/sweet';

@Component({
  selector: 'app-sweet-form',
  imports: [ReactiveFormsModule],
  templateUrl: './sweet-form.html',
  styleUrl: './sweet-form.css',
})
export class SweetForm implements OnChanges {

  @Input() sweetData: Sweet | null = null;
  
  // Outputs: Notify parent to close modal or refresh data
  @Output() formSubmit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  sweetForm: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder, private sweetService: SweetService) {
    // Initialize Form with Validators 
    this.sweetForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.1)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''] // Optional
    });
  }

  // Lifecycle Hook: Runs whenever the Parent changes the @Input
  ngOnChanges(changes: SimpleChanges) {
    if (this.sweetData) {
      this.isEditMode = true;
      this.sweetForm.patchValue(this.sweetData); // Fill form with existing data
    } else {
      this.isEditMode = false;
      this.sweetForm.reset(); // Clear form for new entry
    }
  }

  submit() {
    if (this.sweetForm.invalid) {
      this.sweetForm.markAllAsTouched(); // Show validation errors
      return;
    }

    const formData = this.sweetForm.value;

    if (this.isEditMode && this.sweetData) {
      // Logic: Update existing sweet 
      this.sweetService.updateSweet(this.sweetData.id, formData).subscribe({
        next: () => this.formSubmit.emit(), // Success!
        error: (err) => alert('Update failed')
      });
    } else {
      // Logic: Create new sweet 
      this.sweetService.createSweet(formData).subscribe({
        next: () => this.formSubmit.emit(), // Success!
        error: (err) => alert('Creation failed')
      });
    }
  }

}