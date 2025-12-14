import { Component, OnInit } from '@angular/core';
import { Sweet } from '../../../core/models/sweet.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';
import { SweetCard } from '../../../shared/components/sweet-card/sweet-card';
import { NgFor, NgIf } from '@angular/common';
import { Loader } from '../../../shared/components/loader/loader';
import { SweetService } from '../../../core/services/sweet';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, SweetCard, NgIf, NgFor, Loader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  sweets: Sweet[] = [];
  // searchControl removed - we use filterForm.controls['name'] instead
  filterForm: FormGroup;
  loading = false;

  categories = ['Milk Sweets', 'Dry Fruit', 'Traditional', 'Syrup Based', 'Ghee Sweets'];

  constructor(
    private sweetService: SweetService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      name: [''],      
      category: [''], 
      minPrice: [''], 
      maxPrice: ['']  
    });
  }

  ngOnInit() {
    this.setupSearchStream();
  }

  setupSearchStream() {
    this.loading = true;

    // 👇 KEY FIX: Listen to the whole form, not just one control
    this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value), // Start with initial values (empty strings)
      debounceTime(400),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)), 
      switchMap(filters => {
        this.loading = true;
        // 'filters' contains {name, category, minPrice, maxPrice}
        return this.sweetService.searchSweets(filters);
      }),
      catchError(err => {
        console.error('Search Error:', err);
        this.loading = false;
        return of([]);
      })
    ).subscribe(data => {
      this.sweets = data;
      this.loading = false;
    });
  }

  handlePurchase(id: string) {
    this.sweetService.purchaseSweet(id).subscribe({
      next: () => {
        // Refresh grid using current filter state
        this.sweetService.searchSweets(this.filterForm.value).subscribe(data => this.sweets = data);
        alert('Purchase Successful! 🍬');
      },
      error: (err) => alert('Purchase Failed: ' + err.message)
    });
  }
}