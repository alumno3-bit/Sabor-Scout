import { Component, ChangeDetectionStrategy, input, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Beer } from '../../models/beer.model';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { GeminiService } from '../../services/gemini.service';
import { RatingService } from '../../services/rating.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-beer-details',
  imports: [CommonModule, TranslatePipe],
  template: `
    @if (beer(); as beerData) {
      <div class="text-white">
        @if (beerData.imageUrl) {
          <div class="h-56 bg-cover bg-center" [style.background-image]="'url(' + beerData.imageUrl + ')'"></div>
        }
        <main class="p-6 space-y-8">
          <div>
            <div class="flex justify-between items-start gap-4">
              <div class="flex-1">
                <h2 class="text-3xl font-bold text-white">{{ beerData.name }}</h2>
                <p class="text-lg text-primary/80">{{ beerData.brewery }}</p>
              </div>
              <button 
                (click)="toggleFavorite()"
                [attr.aria-label]="(isFavorite() ? 'beerDetails.removeFavorite' : 'beerDetails.addFavorite') | translate"
                class="p-2 -mr-2 rounded-full text-primary transition-all duration-200 hover:bg-primary/20 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                @if (isFavorite()) {
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
                    <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.597 2.917c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clip-rule="evenodd" />
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.612.049.868.85.42 1.285l-4.091 3.732a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-3.002a.563.563 0 00-.586 0l-4.725 3.002a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.091-3.732c-.448-.434-.192-1.236.42-1.285l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                }
              </button>
            </div>
            <p class="text-slate-300 leading-relaxed mt-4">{{ beerData.description }}</p>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-center border-b border-primary/20 py-3">
              <span class="text-primary/80">{{ 'beerDetails.style' | translate }}</span>
              <span class="font-medium text-white">{{ beerData.style }}</span>
            </div>
            @if(beerData.ibu && beerData.ibu > 0) {
              <div class="flex justify-between items-center border-b border-primary/20 py-3">
                <span class="text-primary/80">IBUs</span>
                <span class="font-medium text-white">{{ beerData.ibu }}</span>
              </div>
            }
            <div class="flex justify-between items-center border-b border-primary/20 py-3">
              <span class="text-primary/80">ABV</span>
              <span class="font-medium text-white">{{ beerData.abv }}%</span>
            </div>
          </div>

          @if (beerData.tastingNotes && beerData.tastingNotes.length > 0) {
            <div class="space-y-4">
              <h3 class="text-2xl font-bold text-white">{{ 'beerDetails.sensoryAnalysis' | translate }}</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center border-b border-primary/20 py-3">
                  <span class="text-primary/80">{{ 'beerDetails.flavorAroma' | translate }}</span>
                  <span class="text-right text-white">{{ beerData.tastingNotes.join(', ') }}</span>
                </div>
              </div>
            </div>
          }

          <div class="p-4 rounded-lg bg-primary/20 space-y-2">
            <h3 class="text-xl font-bold text-white">{{ 'beerDetails.commonDefects.title' | translate }}</h3>
            <p class="text-sm text-white/70">
              {{ 'beerDetails.commonDefects.description' | translate }}
            </p>
          </div>

          <div class="space-y-3 text-center">
            <h3 class="text-xl font-bold text-white">{{ 'beerDetails.rate.title' | translate }}</h3>
            <div class="flex items-center justify-center space-x-1">
              @for (star of [1, 2, 3, 4, 5]; track star) {
                <button 
                    (click)="setRating(star)"
                    (mouseenter)="hoverRating.set(star)"
                    (mouseleave)="hoverRating.set(0)"
                    class="text-primary p-1 rounded-full transition-transform duration-150 ease-in-out hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    [attr.aria-label]="'beerDetails.rate.setRating' | translate: { stars: star }"
                >
                  @if ((hoverRating() || currentRating()) >= star) {
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.597 2.917c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clip-rule="evenodd" /></svg>
                  } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.612.049.868.85.42 1.285l-4.091 3.732a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-3.002a.563.563 0 00-.586 0l-4.725 3.002a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557l-4.091-3.732c-.448-.434-.192-1.236.42-1.285l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                  }
                </button>
              }
            </div>
             @if(ratingConfirmation()) {
              <p class="text-sm text-green-400/80 transition-opacity duration-300 h-5">{{ ratingConfirmation() }}</p>
            } @else {
              <div class="h-5"></div>
            }
          </div>
          
          <div class="space-y-4">
            <button 
                (click)="fetchFoodPairings()"
                [disabled]="pairingsLoading()"
                class="w-full py-3 px-4 rounded-lg bg-primary text-white font-bold text-center transition-all hover:scale-105 active:scale-100 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                @if(pairingsLoading()) {
                    <div class="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                    <span>{{ 'beerDetails.pairings.loading' | translate }}</span>
                } @else {
                     <span>{{ 'beerDetails.pair' | translate }}</span>
                }
            </button>
            @if (foodPairings(); as pairings) {
                <div>
                    <h3 class="text-2xl font-bold text-white">{{ 'beerDetails.pairings.title' | translate }}</h3>
                    <ul class="space-y-3 mt-4">
                        @for(pairing of pairings; track pairing) {
                            <li class="flex items-start gap-3 p-3 bg-card-dark rounded-lg border border-white/10">
                                <span class="text-primary pt-1 text-xl">🍽️</span>
                                <span class="text-slate-200">{{ pairing }}</span>
                            </li>
                        }
                    </ul>
                </div>
            }

            @if(pairingsError()) {
                <div class="text-center text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                    {{ pairingsError() }}
                </div>
            }
          </div>
          
          <button (click)="copyShareText()" class="w-full flex items-center justify-center space-x-2 py-3 rounded-lg border border-primary/40 text-primary font-bold transition-colors hover:bg-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
            <span>{{ (shareTextCopied() ? 'beerDetails.copied' : 'beerDetails.share') | translate }}</span>
          </button>
        </main>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeerDetailsComponent {
  beer = input.required<Beer>();
  private translationService = inject(TranslationService);
  private geminiService = inject(GeminiService);
  private ratingService = inject(RatingService);
  private favoritesService = inject(FavoritesService);
  shareTextCopied = signal(false);
  ratingConfirmation = signal<string | null>(null);

  foodPairings = signal<string[] | null>(null);
  pairingsLoading = signal(false);
  pairingsError = signal<string | null>(null);

  hoverRating = signal(0);
  currentRating = computed(() => this.ratingService.getRating(this.beer()));
  isFavorite = computed(() => this.favoritesService.isFavorite(this.beer()));

  setRating(rating: number): void {
    this.ratingService.setRating(this.beer(), rating);
    this.ratingConfirmation.set(this.translationService.translate('beerDetails.rate.saved'));
    setTimeout(() => {
      this.ratingConfirmation.set(null);
    }, 2500);
  }

  toggleFavorite(): void {
    if (this.isFavorite()) {
      this.favoritesService.removeFavorite(this.beer());
    } else {
      this.favoritesService.addFavorite(this.beer());
    }
  }

  getShareText(): string {
    const beer = this.beer();
    return this.translationService.translate('beerDetails.shareText', { name: beer.name, brewery: beer.brewery });
  }

  copyShareText(): void {
    navigator.clipboard.writeText(this.getShareText()).then(() => {
      this.shareTextCopied.set(true);
      setTimeout(() => {
        this.shareTextCopied.set(false);
      }, 2000);
    });
  }

  async fetchFoodPairings(): Promise<void> {
    if (this.pairingsLoading()) return;

    this.pairingsLoading.set(true);
    this.pairingsError.set(null);
    this.foodPairings.set(null);

    try {
      const pairings = await this.geminiService.getFoodPairings(this.beer());
      this.foodPairings.set(pairings);
    } catch (err) {
      this.pairingsError.set(this.translationService.translate('beerDetails.pairings.error'));
      console.error(err);
    } finally {
      this.pairingsLoading.set(false);
    }
  }
}