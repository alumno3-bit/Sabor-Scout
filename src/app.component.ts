import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScannerComponent } from './components/scanner/scanner.component';
import { BeerSearchComponent } from './components/beer-search/beer-search.component';
import { EducationComponent } from './components/education/education.component';
import { LocalEventsComponent } from './components/local-events/local-events.component';
import { RecipeOptimizerComponent } from './components/producer-tools/recipe-optimizer/recipe-optimizer.component';
import { QualityControlComponent } from './components/producer-tools/quality-control/quality-control.component';
import { MarketingAssistComponent } from './components/producer-tools/marketing-assist/marketing-assist.component';
import { ProducerDashboardComponent } from './components/producer-dashboard/producer-dashboard.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { TranslationService } from './services/translation.service';
import { PredictiveAnalyticsComponent } from './components/producer-tools/predictive-analytics/predictive-analytics.component';
import { IntegrationsComponent } from './components/producer-tools/integrations/integrations.component';

type ConsumerTab = 'scan' | 'search' | 'favorites' | 'education' | 'events';
type ProducerTab = 'optimize' | 'qc' | 'marketing' | 'predictive' | 'integrations';
type ProducerTool = 'dashboard' | ProducerTab;
type Mode = 'consumer' | 'producer';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ScannerComponent,
    BeerSearchComponent,
    EducationComponent,
    LocalEventsComponent,
    RecipeOptimizerComponent,
    QualityControlComponent,
    MarketingAssistComponent,
    ProducerDashboardComponent,
    PredictiveAnalyticsComponent,
    FavoritesComponent,
    TranslatePipe,
    IntegrationsComponent,
  ],
  template: `
    <div class="relative flex h-[100dvh] w-full flex-col">
      @if (mode() === 'consumer') {
        <header class="flex-shrink-0">
           <div class="flex items-center p-4 justify-between text-slate-100">
              <div class="w-16">
                 <div class="flex items-center rounded-full bg-card-dark p-1 text-xs">
                    <button (click)="setLanguage('en')" [class]="'px-2 py-0.5 rounded-full font-bold transition-colors ' + (translationService.language() === 'en' ? 'bg-primary text-white' : 'text-slate-300')">EN</button>
                    <button (click)="setLanguage('es')" [class]="'px-2 py-0.5 rounded-full font-bold transition-colors ' + (translationService.language() === 'es' ? 'bg-primary text-white' : 'text-slate-300')">ES</button>
                 </div>
              </div>
              <h1 class="text-xl font-bold text-center flex-1 text-primary flex items-center justify-center gap-2">
                <span class="text-2xl">🍺</span>
                <span>{{ 'header.title' | translate }}</span>
              </h1>
              <div class="flex w-16 items-center justify-end">
                <button 
                  (click)="setMode('producer')"
                  class="p-2 rounded-full text-slate-300 hover:bg-card-dark transition-colors"
                  [title]="'header.producer' | translate"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13.33V6a2 2 0 0 0-2-2H9.33a2 2 0 0 0-1.41.59l-5.33 5.33a2 2 0 0 0 0 2.82l5.33 5.33a2 2 0 0 0 1.41.59H13a2 2 0 0 0 2-2v-1.33"/><path d="m13.33 20 6.67-6.67"/><path d="m16 13.33 4-4"/></svg>
                </button>
              </div>
            </div>
        </header>
        <main class="flex-grow overflow-y-auto" [class.flex]="activeConsumerTab() === 'scan'">
            @switch (activeConsumerTab()) {
              @case ('scan') { <app-scanner /> }
              @case ('search') { <app-beer-search /> }
              @case ('favorites') { <app-favorites /> }
              @case ('education') { <app-education /> }
              @case ('events') { <app-local-events /> }
            }
        </main>
        <footer class="flex-shrink-0 border-t border-white/10 bg-background-dark">
          <nav class="flex justify-around items-center px-2 sm:px-4 pt-3 pb-safe-bottom">
            @for(tab of consumerTabs; track tab.id) {
              <button (click)="activeConsumerTab.set(tab.id)" class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors" [class]="activeConsumerTab() === tab.id ? 'text-primary' : 'text-slate-100/60 hover:text-primary'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="tab.iconPath" />
                </svg>
                <span class="text-xs font-medium">{{ 'tabs.' + tab.id | translate }}</span>
              </button>
            }
          </nav>
        </footer>
      } @else {
         <header class="sticky top-0 z-10 flex-shrink-0 bg-background-dark/80 backdrop-blur-sm">
            <div class="flex items-center justify-between p-4 border-b border-white/10">
              <div class="w-10">
                @if (activeProducerTool() !== 'dashboard') {
                  <button (click)="activeProducerTool.set('dashboard')" class="p-2 -ml-2 text-slate-100 hover:bg-white/10 rounded-full">
                    <span class="material-symbols-outlined">arrow_back</span>
                  </button>
                } @else {
                  <img alt="User Avatar" class="w-10 h-10 rounded-full" src="https://picsum.photos/seed/producer/40"/>
                }
              </div>
              <h1 class="text-xl font-bold">{{ getProducerTitle() | translate }}</h1>
              <div class="w-10">
                <button class="p-2 text-slate-100 hover:bg-white/10 rounded-full">
                  <span class="material-symbols-outlined">settings</span>
                </button>
              </div>
            </div>
        </header>
        <main class="flex-grow overflow-y-auto">
           @switch (activeProducerTool()) {
            @case('dashboard') {
              <app-producer-dashboard (toolSelected)="activeProducerTool.set($event)" />
            }
            @case ('optimize') { <app-recipe-optimizer /> }
            @case ('qc') { <app-quality-control /> }
            @case ('marketing') { <app-marketing-assist /> }
            @case ('predictive') { <app-predictive-analytics /> }
            @case ('integrations') { <app-integrations /> }
          }
        </main>
        <footer class="sticky bottom-0 z-10 flex-shrink-0 bg-background-dark/80 backdrop-blur-sm border-t border-white/10">
            <nav class="flex justify-around items-center p-2 pb-safe-bottom">
              <button (click)="activeProducerTool.set('dashboard')" class="flex flex-col items-center gap-1 p-2 rounded-lg" [class]="activeProducerTool() === 'dashboard' ? 'text-primary' : 'text-slate-100/70 hover:text-primary'">
                <span class="material-symbols-outlined" [class.fill]="activeProducerTool() === 'dashboard'">home</span>
                <span class="text-xs font-medium">{{ 'producerDashboard.nav.home' | translate }}</span>
              </button>
              <button (click)="setMode('consumer')" class="flex flex-col items-center gap-1 p-2 rounded-lg text-slate-100/70 hover:text-primary">
                <span class="material-symbols-outlined">switch_account</span>
                <span class="text-xs font-medium">{{ 'producerDashboard.nav.consumer' | translate }}</span>
              </button>
              <button class="flex flex-col items-center gap-1 p-2 rounded-lg text-slate-100/70 hover:text-primary">
                <span class="material-symbols-outlined">person</span>
                <span class="text-xs font-medium">{{ 'producerDashboard.nav.profile' | translate }}</span>
              </button>
            </nav>
        </footer>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.lang]': 'translationService.language()',
  },
})
export class AppComponent {
  translationService = inject(TranslationService);
  mode = signal<Mode>('consumer');
  activeConsumerTab = signal<ConsumerTab>('scan');
  activeProducerTool = signal<ProducerTool>('dashboard');

  consumerTabs: {id: ConsumerTab, iconPath: string}[] = [
    { id: 'scan', iconPath: 'M6.828 6.828a4 4 0 015.656 0L18 12.172a4 4 0 010 5.656l-5.657 5.657a4 4 0 01-5.656-5.656L12 12.172 6.828 6.828z' }, // A placeholder, better use camera icon.
    { id: 'search', iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: 'favorites', iconPath: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { id: 'education', iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'events', iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  constructor() {
    // A better camera icon path
    this.consumerTabs[0].iconPath = 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z; M15 13a3 3 0 11-6 0 3 3 0 016 0z';
  }

  setMode(newMode: Mode): void {
    this.mode.set(newMode);
    if (newMode === 'consumer') {
      this.activeConsumerTab.set('scan');
    } else {
      this.activeProducerTool.set('dashboard');
    }
  }

  setLanguage(lang: 'en' | 'es'): void {
    this.translationService.setLanguage(lang);
  }

  getProducerTitle(): string {
    const tool = this.activeProducerTool();
    if (tool === 'dashboard') {
      return 'header.title';
    }
    return `tabs.${tool}`;
  }
}