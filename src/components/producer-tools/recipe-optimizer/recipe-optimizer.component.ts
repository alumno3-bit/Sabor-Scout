import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../../services/gemini.service';
import { Recipe } from '../../../models/producer.model';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-recipe-optimizer',
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="p-4 md:p-6 space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-primary">{{ 'recipeOptimizer.title' | translate }}</h2>
        <p class="text-slate-400">{{ 'recipeOptimizer.description' | translate }}</p>
      </div>

      <form (ngSubmit)="generateRecipe()" class="space-y-4 max-w-2xl bg-card-dark/70 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="style" class="block text-sm font-medium text-slate-300">{{ 'recipeOptimizer.style' | translate }}</label>
            <input type="text" id="style" [(ngModel)]="params.style" name="style" required class="mt-1 w-full bg-background-dark text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors" [placeholder]="'recipeOptimizer.stylePlaceholder' | translate">
          </div>
          <div>
            <label for="abv" class="block text-sm font-medium text-slate-300">{{ 'recipeOptimizer.abv' | translate }}</label>
            <input type="number" id="abv" [(ngModel)]="params.abv" name="abv" required class="mt-1 w-full bg-background-dark text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors" [placeholder]="'recipeOptimizer.abvPlaceholder' | translate">
          </div>
          <div>
            <label for="ibu" class="block text-sm font-medium text-slate-300">{{ 'recipeOptimizer.ibu' | translate }}</label>
            <input type="number" id="ibu" [(ngModel)]="params.ibu" name="ibu" required class="mt-1 w-full bg-background-dark text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors" [placeholder]="'recipeOptimizer.ibuPlaceholder' | translate">
          </div>
        </div>
        <div>
          <label for="flavorProfile" class="block text-sm font-medium text-slate-300">{{ 'recipeOptimizer.flavor' | translate }}</label>
          <textarea id="flavorProfile" [(ngModel)]="params.flavorProfile" name="flavorProfile" required rows="3" class="mt-1 w-full bg-background-dark text-white border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors" [placeholder]="'recipeOptimizer.flavorPlaceholder' | translate"></textarea>
        </div>
        <div class="text-right">
          <button type="submit" [disabled]="isLoading()" class="px-8 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors shadow-md">
             @if (isLoading()) {
              <div class="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full inline-block"></div>
            } @else {
              <span>{{ 'recipeOptimizer.generate' | translate }}</span>
            }
          </button>
        </div>
      </form>

      @if (error()) {
        <div class="text-center text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">{{ error() }}</div>
      }

      @if (recipeResult(); as recipe) {
        <div class="mt-6 bg-card-dark border border-white/10 p-6 rounded-xl max-w-4xl">
           <h3 class="text-2xl font-bold text-primary mb-4">{{ recipe.recipeName }}</h3>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-lg font-semibold text-primary/80 mb-2">{{ 'recipeOptimizer.results.maltBill' | translate }}</h4>
                <ul class="list-disc list-inside text-slate-300 space-y-1">
                  @for (item of recipe.maltBill; track item) { <li>{{ item }}</li> }
                </ul>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-primary/80 mb-2">{{ 'recipeOptimizer.results.hopSchedule' | translate }}</h4>
                <ul class="list-disc list-inside text-slate-300 space-y-1">
                  @for (item of recipe.hopSchedule; track item) { <li>{{ item }}</li> }
                </ul>
              </div>
           </div>
           <div class="mt-4">
              <h4 class="text-lg font-semibold text-primary/80 mb-2">{{ 'recipeOptimizer.results.yeast' | translate }}</h4>
              <p class="text-slate-300">{{ recipe.yeast }}</p>
           </div>
           <div class="mt-4">
              <h4 class="text-lg font-semibold text-primary/80 mb-2">{{ 'recipeOptimizer.results.instructions' | translate }}</h4>
              <p class="text-slate-300 whitespace-pre-line">{{ recipe.instructions }}</p>
           </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeOptimizerComponent {
  private geminiService = inject(GeminiService);
  private translationService = inject(TranslationService);

  params = {
    style: '',
    abv: 6.8,
    ibu: 60,
    flavorProfile: ''
  };

  isLoading = signal(false);
  error = signal<string | null>(null);
  recipeResult = signal<Recipe | null>(null);

  async generateRecipe(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    this.recipeResult.set(null);

    try {
      const result = await this.geminiService.optimizeRecipe(this.params);
      this.recipeResult.set(result);
    } catch (err) {
      this.error.set((err as Error).message || this.translationService.translate('recipeOptimizer.error'));
    } finally {
      this.isLoading.set(false);
    }
  }
}