import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../services/gemini.service';
import { Beer } from '../../models/beer.model';
import { BeerDetailsComponent } from '../beer-details/beer-details.component';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-scanner',
  imports: [CommonModule, BeerDetailsComponent, FormsModule, TranslatePipe],
  template: `
    @if (!imagePreview()) {
      <div class="flex-grow flex flex-col items-center justify-center p-4">
        <label for="file-upload" class="w-full max-w-sm rounded-lg bg-primary py-4 px-5 text-center text-white shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 active:scale-100 cursor-pointer">
          <div class="flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><circle cx="12" cy="13" r="3"></circle></svg>
            <span class="text-lg font-bold">{{ 'scanner.scanBeer' | translate }}</span>
          </div>
        </label>
        <input id="file-upload" type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*" />
      </div>
    } @else {
      <div class="p-4 md:p-6 space-y-6 w-full">
      <div class="flex flex-col items-center">
        <img
          [src]="imagePreview()"
          alt="Beer label preview"
          class="max-w-xs max-h-96 rounded-lg shadow-2xl mb-6 border-4 border-card-dark"
        />

        @if (isLoading()) {
        <div class="text-center p-4">
          <div
            class="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full inline-block mb-2"
          ></div>
          <p class="text-lg text-primary">
            {{ (showContributionForm() ? 'scanner.submitting' : 'scanner.scanning') | translate }}
          </p>
        </div>
        } @if (error() && !submissionMessage()) {
        <div class="w-full max-w-lg text-center text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
          {{ error() }}
        </div>
        } @if (submissionMessage()) {
        <div
          class="w-full max-w-lg text-center text-green-300 bg-green-500/10 border border-green-500/30 p-3 rounded-lg"
        >
          {{ submissionMessage() }}
        </div>
        }
      </div>

      @if (identifiedBeer(); as beer) {
      <div class="mt-6">
        <app-beer-details [beer]="beer"></app-beer-details>
        <div class="text-center mt-6">
          <button
            (click)="reset()"
            class="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
          >
            {{ 'scanner.scanAnother' | translate }}
          </button>
        </div>
      </div>
      }

      @if (showContributionForm() && !identifiedBeer() && !submissionMessage()) {
      <div class="mt-6 w-full max-w-lg mx-auto bg-card-dark/70 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
        <h3 class="text-xl font-bold text-primary mb-4">
          {{ 'scanner.form.title' | translate }}
        </h3>
        <form (ngSubmit)="submitContribution()" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-slate-300"
              >{{ 'scanner.form.name' | translate }} <span class="text-red-400">{{ 'scanner.form.required' | translate }}</span></label
            >
            <input
              type="text"
              id="name"
              [(ngModel)]="newBeer().name"
              name="name"
              required
              class="mt-1 w-full bg-background-dark text-white border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label for="brewery" class="block text-sm font-medium text-slate-300"
              >{{ 'scanner.form.brewery' | translate }} <span class="text-red-400">{{ 'scanner.form.required' | translate }}</span></label
            >
            <input
              type="text"
              id="brewery"
              [(ngModel)]="newBeer().brewery"
              name="brewery"
              required
              class="mt-1 w-full bg-background-dark text-white border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label for="style" class="block text-sm font-medium text-slate-300"
                >{{ 'scanner.form.style' | translate }}</label
              >
              <input
                type="text"
                id="style"
                [(ngModel)]="newBeer().style"
                name="style"
                class="mt-1 w-full bg-background-dark text-white border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label for="abv" class="block text-sm font-medium text-slate-300"
                >{{ 'scanner.form.abv' | translate }}</label
              >
              <input
                type="number"
                id="abv"
                [(ngModel)]="newBeer().abv"
                name="abv"
                step="0.1"
                class="mt-1 w-full bg-background-dark text-white border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label for="ibu" class="block text-sm font-medium text-slate-300"
                >{{ 'scanner.form.ibu' | translate }}</label
              >
              <input
                type="number"
                id="ibu"
                [(ngModel)]="newBeer().ibu"
                name="ibu"
                class="mt-1 w-full bg-background-dark text-white border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-slate-300"
              >{{ 'scanner.form.description' | translate }}</label
            >
            <textarea
              id="description"
              [(ngModel)]="newBeer().description"
              name="description"
              rows="3"
              class="mt-1 w-full bg-background-dark text-white border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
            ></textarea>
          </div>
          <div>
            <label for="tastingNotes" class="block text-sm font-medium text-slate-300"
              >{{ 'scanner.form.tastingNotes' | translate }}</label
            >
            <input
              type="text"
              id="tastingNotes"
              [(ngModel)]="newBeer().tastingNotes"
              name="tastingNotes"
              [placeholder]="'scanner.form.tastingNotesPlaceholder' | translate"
              class="mt-1 w-full bg-background-dark text-white border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div class="flex justify-end gap-4 pt-4">
            <button
              type="button"
              (click)="reset()"
              [disabled]="isLoading()"
              class="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 disabled:bg-slate-500 transition-colors"
            >
              {{ 'scanner.form.cancel' | translate }}
            </button>
            <button
              type="submit"
              [disabled]="isLoading() || !newBeer().name || !newBeer().brewery"
              class="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-amber-400 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              @if (isLoading()) {
              <span>{{ 'scanner.form.submitting' | translate }}</span>
              } @else {
              <span>{{ 'scanner.form.submit' | translate }}</span>
              }
            </button>
          </div>
        </form>
      </div>
      }
      </div>
    }
  `,
  styles: [`
    :host {
      display: flex;
      width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerComponent {
  private geminiService = inject(GeminiService);
  private translationService = inject(TranslationService);

  imagePreview = signal<string | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  identifiedBeer = signal<Beer | null>(null);
  showContributionForm = signal(false);
  submissionMessage = signal<string | null>(null);
  newBeer = signal<{
    name: string;
    brewery: string;
    style: string;
    abv: number | null;
    ibu: number | null;
    description: string;
    tastingNotes: string; // Keep as a single string for textarea
  }>({
    name: '',
    brewery: '',
    style: '',
    abv: null,
    ibu: null,
    description: '',
    tastingNotes: '',
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
        this.identifiedBeer.set(null);
        this.error.set(null);
        this.scanImage(file);
      };
      reader.readAsDataURL(file);
    }
  }
  
  private scanImage(file: File): void {
    this.isLoading.set(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const base64Image = (e.target?.result as string)?.split(',')[1];
            if (!base64Image) {
                throw new Error(this.translationService.translate('scanner.errorReadFile'));
            }
            const result = await this.geminiService.identifyBeerFromImage(base64Image);
            if (result.name === 'Unknown Beer') {
                this.error.set(this.translationService.translate('scanner.errorUnknown'));
                this.identifiedBeer.set(null);
                this.showContributionForm.set(true);
            } else {
                result.imageUrl = this.imagePreview() ?? undefined;
                this.identifiedBeer.set(result);
                this.error.set(null);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = (err as Error).message || this.translationService.translate('scanner.errorUnknownScan');
            this.error.set(errorMessage);
            this.identifiedBeer.set(null);
        } finally {
            this.isLoading.set(false);
        }
    };
    reader.readAsDataURL(file);
  }

  async submitContribution(): Promise<void> {
    if (!this.newBeer().name || !this.newBeer().brewery) {
        this.error.set(this.translationService.translate('scanner.errorMissingData'));
        return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.submissionMessage.set(null);
    this.showContributionForm.set(false);

    try {
        const base64Image = this.imagePreview()?.split(',')[1];
        if (!base64Image) {
            throw new Error(this.translationService.translate('scanner.errorMissingImage'));
        }

        const beerData: Beer = {
            name: this.newBeer().name,
            brewery: this.newBeer().brewery,
            style: this.newBeer().style,
            abv: this.newBeer().abv ?? 0,
            ibu: this.newBeer().ibu ?? undefined,
            description: this.newBeer().description,
            tastingNotes: this.newBeer().tastingNotes.split(',').map(note => note.trim()).filter(note => note),
        };

        await this.geminiService.submitBeerContribution(beerData, base64Image);
        this.submissionMessage.set(this.translationService.translate('scanner.successSubmission'));
        // Reset after a short delay to show the message
        setTimeout(() => this.reset(), 3000);

    } catch (err) {
        this.error.set((err as Error).message || this.translationService.translate('scanner.errorSubmission'));
    } finally {
        this.isLoading.set(false);
    }
  }

  reset(): void {
    this.imagePreview.set(null);
    this.identifiedBeer.set(null);
    this.error.set(null);
    this.isLoading.set(false);
    this.showContributionForm.set(false);
    this.submissionMessage.set(null);
    this.newBeer.set({
      name: '',
      brewery: '',
      style: '',
      abv: null,
      ibu: null,
      description: '',
      tastingNotes: '',
    });
  }
}