import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../../services/gemini.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-marketing-assist',
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="p-4 md:p-6 space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-primary">{{ 'marketingAssist.title' | translate }}</h2>
        <p class="text-slate-400">{{ 'marketingAssist.description' | translate }}</p>
      </div>

      <form (ngSubmit)="generateCopy()" class="space-y-4 max-w-2xl bg-card-dark/70 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="beerName" class="block text-sm font-medium text-slate-300">{{ 'marketingAssist.beerName' | translate }}</label>
            <input type="text" id="beerName" [(ngModel)]="params.beerName" name="beerName" required class="mt-1 w-full bg-background-dark text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors" [placeholder]="'marketingAssist.beerNamePlaceholder' | translate">
          </div>
          <div>
            <label for="style" class="block text-sm font-medium text-slate-300">{{ 'marketingAssist.style' | translate }}</label>
            <input type="text" id="style" [(ngModel)]="params.style" name="style" required class="mt-1 w-full bg-background-dark text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors" [placeholder]="'marketingAssist.stylePlaceholder' | translate">
          </div>
        </div>
        <div>
          <label for="tastingNotes" class="block text-sm font-medium text-slate-300">{{ 'marketingAssist.tastingNotes' | translate }}</label>
          <input type="text" id="tastingNotes" [(ngModel)]="params.tastingNotes" name="tastingNotes" required class="mt-1 w-full bg-background-dark text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors" [placeholder]="'marketingAssist.tastingNotesPlaceholder' | translate">
        </div>
        <div>
          <label for="targetAudience" class="block text-sm font-medium text-slate-300">{{ 'marketingAssist.targetAudience' | translate }}</label>
          <input type="text" id="targetAudience" [(ngModel)]="params.targetAudience" name="targetAudience" required class="mt-1 w-full bg-background-dark text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors" [placeholder]="'marketingAssist.targetAudiencePlaceholder' | translate">
        </div>
        <div class="text-right">
          <button type="submit" [disabled]="isLoading()" class="px-8 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors shadow-md">
            @if (isLoading()) {
              <div class="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full inline-block"></div>
            } @else {
              <span>{{ 'marketingAssist.generate' | translate }}</span>
            }
          </button>
        </div>
      </form>

      @if (error()) {
        <div class="text-center text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">{{ error() }}</div>
      }

      @if (marketingCopy()) {
        <div class="mt-6 bg-card-dark border border-white/10 p-6 rounded-xl max-w-4xl">
          <h3 class="text-2xl font-bold text-primary mb-4">{{ 'marketingAssist.results.title' | translate }}</h3>
          <div class="prose prose-invert max-w-none text-slate-200 whitespace-pre-line" [innerHTML]="marketingCopy()"></div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingAssistComponent {
  private geminiService = inject(GeminiService);
  private translationService = inject(TranslationService);

  params = {
    beerName: '',
    style: '',
    tastingNotes: '',
    targetAudience: ''
  };

  isLoading = signal(false);
  error = signal<string | null>(null);
  marketingCopy = signal<string | null>(null);

  async generateCopy(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    this.marketingCopy.set(null);

    try {
      const result = await this.geminiService.generateMarketingCopy(this.params);
      this.marketingCopy.set(result);
    } catch (err) {
      this.error.set((err as Error).message || this.translationService.translate('marketingAssist.error'));
    } finally {
      this.isLoading.set(false);
    }
  }
}
