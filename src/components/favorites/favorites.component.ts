import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { Beer } from '../../models/beer.model';
import { BeerDetailsComponent } from '../beer-details/beer-details.component';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, BeerDetailsComponent, TranslatePipe],
  template: `
    <div class="p-4 md:p-6 space-y-4">
      <h2 class="text-2xl font-bold text-primary">{{ 'favorites.title' | translate }}</h2>

      @if (favorites().length === 0) {
        <div class="text-center text-slate-400 bg-card-dark p-8 rounded-xl border border-white/10">
           <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          <p class="mt-4 text-lg">{{ 'favorites.empty.title' | translate }}</p>
          <p>{{ 'favorites.empty.description' | translate }}</p>
        </div>
      } @else {
        @if (selectedBeer(); as beer) {
          <div class="mt-6">
            <button (click)="selectedBeer.set(null)" class="mb-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
               <span>{{ 'favorites.back' | translate }}</span>
            </button>
            <app-beer-details [beer]="beer"></app-beer-details>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            @for (beer of favorites(); track beer.name + beer.brewery) {
              <div 
                (click)="selectBeer(beer)"
                class="bg-card-dark p-4 rounded-xl cursor-pointer border border-white/10 hover:border-primary/70 hover:bg-card-dark/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <h3 class="text-xl font-bold text-primary">{{ beer.name }}</h3>
                <p class="text-slate-300">{{ beer.brewery }}</p>
                <p class="text-sm text-slate-400">
                  {{ beer.style }} &bull; {{ beer.abv }}% ABV
                  @if(beer.ibu && beer.ibu > 0) {
                    <span class="mx-1">&bull;</span> {{ beer.ibu }} IBU
                  }
                </p>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);
  favorites = this.favoritesService.favorites;
  selectedBeer = signal<Beer | null>(null);

  selectBeer(beer: Beer): void {
    this.selectedBeer.set(beer);
  }
}