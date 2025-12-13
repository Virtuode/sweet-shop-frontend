import { Component, OnInit } from '@angular/core';
import { Sweet } from '../../../core/models/sweet.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SweetService } from '../../../core/services/sweet';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';
import { SweetCard } from '../../../shared/components/sweet-card/sweet-card';
import { NgFor, NgIf } from '@angular/common';
import { Loader } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule,SweetCard,NgIf,NgFor,Loader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  sweets: Sweet[] = [];
  searchControl = new FormControl('');
  loading = false;

  constructor(private sweetService: SweetService) {}

  ngOnInit() {
    this.setupSearchStream();
  }

  // Reactive Search Logic using RxJS
  setupSearchStream() {
    this.loading = true; // Start loading initially

    this.searchControl.valueChanges.pipe(
      startWith(''),          // Load all sweets on startup
      debounceTime(400),      // Wait 400ms after user stops typing
      distinctUntilChanged(), // Ignore if query is same as previous
      switchMap(query => {
        this.loading = true;  // Show loader while fetching
        // If empty, get all; otherwise search
        return (!query || query.trim() === '') 
          ? this.sweetService.getAllSweets() 
          : this.sweetService.searchSweets(query); // 
      }),
      catchError(err => {
        console.error('Search Error:', err);
        this.loading = false;
        return of([]); // Return empty array on error to keep stream alive
      })
    ).subscribe(data => {
      this.sweets = data;
      this.loading = false; // Hide loader
    });
  }

  // Handles the "Purchase" button click [cite: 39]
  handlePurchase(id: string) {
    this.sweetService.purchaseSweet(id).subscribe({
      next: () => {
        // Optimistic update or refresh? Let's refresh to be safe and get new quantity
        this.refreshData(); 
        alert('Purchase Successful! 🍬');
      },
      error: (err) => alert('Purchase Failed: ' + err.message)
    });
  }

  // Helper to re-fetch data without resetting search logic
  private refreshData() {
    const currentQuery = this.searchControl.value || '';
    if (currentQuery) {
      this.sweetService.searchSweets(currentQuery).subscribe(data => this.sweets = data);
    } else {
      this.sweetService.getAllSweets().subscribe(data => this.sweets = data);
    }
  }


}