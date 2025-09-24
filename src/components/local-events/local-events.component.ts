import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BeerEvent } from '../../models/event.model';
import { LocalEventsService } from '../../services/local-events.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-local-events',
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="p-4 md:p-6 space-y-4">
      <h2 class="text-2xl font-bold text-primary">{{ 'localEvents.title' | translate }}</h2>
      <div class="flex gap-2">
        <input
          type="text"
          [ngModel]="location()" 
          (ngModelChange)="location.set($event)"
          (keyup.enter)="findEvents()"
          [placeholder]="'localEvents.placeholder' | translate"
          class="flex-grow bg-card-dark text-white border border-white/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
          [disabled]="isLoading()"
        >
        <button
          (click)="findEvents()"
          [disabled]="isLoading() || !location().trim()"
          class="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          @if (isLoading()) {
            <div class="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full inline-block"></div>
          } @else {
            <span>{{ 'localEvents.find' | translate }}</span>
          }
        </button>
      </div>

      @if (error()) {
        <div class="text-center text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">{{ error() }}</div>
      }

      <div class="mt-6 space-y-4">
        @if (isLoading()) {
          <div class="text-center p-8">
            <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full inline-block mb-2"></div>
            <p class="text-lg text-primary">{{ 'localEvents.loading' | translate }}</p>
          </div>
        } @else {
            @if (events().length > 0) {
              @for (event of events(); track event.name) {
                <div class="bg-card-dark p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
                  <h3 class="text-xl font-bold text-primary">{{ event.name }}</h3>
                  <p class="text-slate-300 font-semibold">{{ event.date }}</p>
                  <p class="text-slate-400">{{ event.location }}</p>
                  <p class="mt-2 text-slate-300">{{ event.description }}</p>
                  @if (event.url) {
                    <a [href]="event.url" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline inline-block mt-2 font-semibold">
                      {{ 'localEvents.moreInfo' | translate }}
                    </a>
                  }
                </div>
              }
            } @else if (attemptedSearch()) {
              <div class="text-center text-slate-400 bg-card-dark p-8 rounded-xl border border-white/10">
                 <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <p class="mt-4">{{ 'localEvents.notFound' | translate }}</p>
              </div>
            }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalEventsComponent {
  private eventsService = inject(LocalEventsService);
  private translationService = inject(TranslationService);

  location = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);
  events = signal<BeerEvent[]>([]);
  attemptedSearch = signal(false);

  async findEvents(): Promise<void> {
    if (!this.location().trim()) {
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);
    this.events.set([]);
    this.attemptedSearch.set(true);

    try {
      const results = await this.eventsService.findEvents(this.location());
      this.events.set(results);
    } catch (err) {
      this.error.set((err as Error).message || this.translationService.translate('localEvents.error'));
    } finally {
      this.isLoading.set(false);
    }
  }
}
