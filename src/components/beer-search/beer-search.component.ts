import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Beer } from '../../models/beer.model';
import { GeminiService } from '../../services/gemini.service';
import { BeerDetailsComponent } from '../beer-details/beer-details.component';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-beer-search',
  imports: [CommonModule, FormsModule, BeerDetailsComponent, TranslatePipe],
  template: `
    <div class="p-4 md:p-6 space-y-4">
      <div class="flex gap-2">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (keyup.enter)="search()"
          [placeholder]="'beerSearch.placeholder' | translate"
          class="flex-grow bg-card-dark text-white border border-white/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
          [disabled]="isLoading()"
        />
        <button
          (click)="search()"
          [disabled]="isLoading() || !searchQuery.trim()"
          class="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          @if (isLoading()) {
            <div class="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full inline-block"></div>
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="m21 21-4.35-4.35"/></svg>
          }
        </button>
      </div>

      <!-- Filters -->
      <details class="bg-card-dark/50 border border-white/10 rounded-lg">
        <summary class="p-3 cursor-pointer font-semibold text-primary/90 list-none flex justify-between items-center">
          <span>{{ 'beerSearch.filters.title' | translate }}</span>
          <svg class="w-5 h-5 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </summary>
        <div class="p-4 border-t border-white/10 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">{{ 'beerSearch.filters.ratingTitle' | translate }}</label>
              <div class="flex items-center space-x-2">
                @for (star of [1,2,3,4,5]; track star) {
                    <button (click)="filters.minRating.set(star)" class="text-2xl" [class]="filters.minRating() >= star ? 'text-primary' : 'text-slate-500'">★</button>
                }
              </div>
            </div>
             <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">{{ 'beerSearch.filters.abvTitle' | translate }}</label>
              <div class="flex items-center gap-4">
                <input type="number" [(ngModel)]="filters.abvMin" [placeholder]="'beerSearch.filters.abvMin' | translate" class="w-full bg-background-dark text-white border-white/20 rounded-lg px-3 py-2">
                <span class="text-slate-400">-</span>
                <input type="number" [(ngModel)]="filters.abvMax" [placeholder]="'beerSearch.filters.abvMax' | translate" class="w-full bg-background-dark text-white border-white/20 rounded-lg px-3 py-2">
              </div>
            </div>
            <div class="text-right">
                <button (click)="clearFilters()" class="text-sm text-primary/80 hover:underline">{{ 'beerSearch.filters.clear' | translate }}</button>
            </div>
        </div>
      </details>

      <div class="mt-6">
        @if (selectedBeer(); as beer) {
            <div class="mt-6">
                <button (click)="selectedBeer.set(null)" class="mb-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                    <span>{{ 'favorites.back' | translate }}</span>
                </button>
                <app-beer-details [beer]="beer"></app-beer-details>
            </div>
        } @else {
            @if (isLoading()) {
              <div class="text-center p-8">
                <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full inline-block mb-2"></div>
                <p class="text-lg text-primary">{{ 'scanner.scanning' | translate }}</p>
              </div>
            } @else if (error()) {
              <div class="text-center text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">{{ error() }}</div>
            } @else if (filteredBeers().length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                @for (beer of filteredBeers(); track beer.name + beer.brewery) {
                  <div 
                    (click)="selectBeer(beer)"
                    class="bg-card-dark p-4 rounded-xl cursor-pointer border border-white/10 hover:border-primary/70 hover:bg-card-dark/50 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <h3 class="text-xl font-bold text-primary">{{ beer.name }}</h3>
                    <p class="text-slate-300">{{ beer.brewery }}</p>
                    <p class="text-sm text-slate-400">
                      {{ beer.style }} &bull; {{ beer.abv }}% ABV
                    </p>
                  </div>
                }
              </div>
            } @else if (searched() && searchResults().length === 0) {
                <div class="text-center text-slate-400 bg-card-dark p-8 rounded-xl border border-white/10">
                    <p>{{ 'beerSearch.errorNotFound' | translate }}</p>
                </div>
            } @else if (searched() && filteredBeers().length === 0) {
                 <div class="text-center text-slate-400 bg-card-dark p-8 rounded-xl border border-white/10">
                    <p>{{ 'beerSearch.noResultsWithFilters' | translate }}</p>
                </div>
            }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeerSearchComponent {
  private geminiService = inject(GeminiService);
  private ratingService = inject(RatingService);

  searchQuery = '';
  isLoading = signal(false);
  error = signal<string | null>(null);
  searchResults = signal<Beer[]>([]);
  selectedBeer = signal<Beer | null>(null);
  searched = signal(false);

  filters = {
    minRating: signal(0),
    abvMin: signal<number | null>(null),
    abvMax: signal<number | null>(null),
  }

  filteredBeers = computed(() => {
    const minRating = this.filters.minRating();
    const abvMin = this.filters.abvMin() ?? 0;
    const abvMax = this.filters.abvMax() ?? 100;
    
    return this.searchResults().filter(beer => {
        const rating = this.ratingService.getRating(beer);
        const ratingMatch = minRating === 0 || rating >= minRating;
        const abvMatch = beer.abv >= abvMin && beer.abv <= abvMax;
        return ratingMatch && abvMatch;
    });
  });

  async search(): Promise<void> {
    if (!this.searchQuery.trim()) {
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);
    this.searchResults.set([]);
    this.selectedBeer.set(null);
    this.searched.set(true);

    try {
      const results = await this.geminiService.searchBeers(this.searchQuery);
      this.searchResults.set(results);
    } catch (err) {
      this.error.set((err as Error).message || 'An error occurred while searching.');
    } finally {
      this.isLoading.set(false);
    }
  }

  selectBeer(beer: Beer): void {
    this.selectedBeer.set(beer);
  }

  clearFilters(): void {
    this.filters.minRating.set(0);
    this.filters.abvMin.set(null);
    this.filters.abvMax.set(null);
  }
}
