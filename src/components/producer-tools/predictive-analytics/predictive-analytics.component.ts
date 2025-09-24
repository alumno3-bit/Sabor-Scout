import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../services/translation.service';

interface AnalyticsData {
  flavor: { score: string; trend: string; positive: boolean };
  shelfLife: { days: number; trend: string; positive: boolean };
  risk: { level: string; trend: string; positive: boolean };
}

@Component({
  selector: 'app-predictive-analytics',
  imports: [CommonModule, TranslatePipe, FormsModule],
  template: `
    <div class="p-4 space-y-6">
      <div>
        <label for="lote-select" class="sr-only">{{ 'predictiveAnalytics.selectBatch' | translate }}</label>
        <div class="relative">
          <select 
            id="lote-select"
            [ngModel]="selectedBatch()"
            (ngModelChange)="onBatchChange($event)"
            class="w-full h-12 pl-4 pr-10 text-base border-white/10 rounded-lg appearance-none bg-card-dark text-slate-100 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            >
            <option value="1a">Lote #1A - IPA</option>
            <option value="2b">Lote #2B - Stout</option>
            <option value="3c">Lote #3C - Lager</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span class="material-symbols-outlined text-slate-400">unfold_more</span>
          </div>
        </div>
      </div>
      
      @if(isLoading()) {
        <div class="text-center p-8">
            <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full inline-block mb-2"></div>
            <p class="text-lg text-primary">{{ 'predictiveAnalytics.loading' | translate }}</p>
        </div>
      } @else if(analyticsData(); as data) {
        <div class="space-y-4">
          <!-- Flavor Evolution Card -->
          <div class="p-5 border border-white/10 rounded-xl bg-card-dark">
            <div class="space-y-2">
              <p class="text-base font-medium text-slate-400">{{ 'predictiveAnalytics.flavorEvolution.title' | translate }}</p>
              <p class="text-3xl font-bold text-slate-100">{{ data.flavor.score }}</p>
              <div class="flex items-center gap-2 text-sm">
                <p class="text-slate-400">{{ 'predictiveAnalytics.flavorEvolution.timeframe' | translate }}</p>
                <p class="font-medium" [class]="data.flavor.positive ? 'text-success' : 'text-danger'">{{ data.flavor.trend }}</p>
              </div>
            </div>
            <div class="mt-4">
              <svg fill="none" height="150" preserveAspectRatio="none" viewBox="0 0 472 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="flavor-gradient" x1="0" x2="0" y1="0" y2="150">
                    <stop stop-color="#ec7f13" stop-opacity="0.3"></stop>
                    <stop offset="1" stop-color="#ec7f13" stop-opacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0 109C18.15 109 18.15 21 36.31 21C54.46 21 54.46 41 72.62 41C90.77 41 90.77 93 108.92 93C127.08 93 127.08 33 145.23 33C163.38 33 163.38 101 181.54 101C199.69 101 199.69 61 217.85 61C236.00 61 236.00 45 254.15 45C272.31 45 272.31 121 290.46 121C308.62 121 308.62 149 326.77 149C344.92 149 344.92 1 363.08 1C381.23 1 381.23 81 399.38 81C417.54 81 417.54 129 435.69 129C453.85 129 453.85 25 472.00 25" stroke="#ec7f13" stroke-linecap="round" stroke-width="2"></path>
                <path d="M0 109C18.15 109 18.15 21 36.31 21C54.46 21 54.46 41 72.62 41C90.77 41 90.77 93 108.92 93C127.08 93 127.08 33 145.23 33C163.38 33 163.38 101 181.54 101C199.69 101 199.69 61 217.85 61C236.00 61 236.00 45 254.15 45C272.31 45 272.31 121 290.46 121C308.62 121 308.62 149 326.77 149C344.92 149 344.92 1 363.08 1C381.23 1 381.23 81 399.38 81C417.54 81 417.54 129 435.69 129C453.85 129 453.85 25 472.00 25V150H0V109Z" fill="url(#flavor-gradient)"></path>
              </svg>
              <div class="flex justify-between mt-2 text-xs font-medium text-slate-400">
                <span>{{ 'predictiveAnalytics.charts.day' | translate }} 1</span>
                <span>{{ 'predictiveAnalytics.charts.day' | translate }} 7</span>
                <span>{{ 'predictiveAnalytics.charts.day' | translate }} 14</span>
                <span>{{ 'predictiveAnalytics.charts.day' | translate }} 21</span>
                <span>{{ 'predictiveAnalytics.charts.day' | translate }} 28</span>
              </div>
            </div>
          </div>
          <!-- Shelf Life Card -->
          <div class="p-5 border border-white/10 rounded-xl bg-card-dark">
            <div class="space-y-2">
              <p class="text-base font-medium text-slate-400">{{ 'predictiveAnalytics.shelfLife.title' | translate }}</p>
              <p class="text-3xl font-bold text-slate-100">{{ data.shelfLife.days }} days</p>
              <div class="flex items-center gap-2 text-sm">
                <p class="text-slate-400">{{ 'predictiveAnalytics.shelfLife.timeframe' | translate }}</p>
                <p class="font-medium" [class]="data.shelfLife.positive ? 'text-success' : 'text-danger'">{{ data.shelfLife.trend }}</p>
              </div>
            </div>
            <div class="mt-4">
              <svg fill="none" height="150" preserveAspectRatio="none" viewBox="0 0 472 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 25C18.15 25 18.15 129 36.31 129C54.46 129 54.46 81 72.62 81C90.77 81 90.77 1 108.92 1C127.08 1 127.08 149 145.23 149C163.38 149 163.38 121 181.54 121C199.69 121 199.69 45 217.85 45C236.00 45 236.00 61 254.15 61C272.31 61 272.31 101 290.46 101C308.62 101 308.62 33 326.77 33C344.92 33 344.92 93 363.08 93C381.23 93 381.23 41 399.38 41C417.54 41 417.54 21 435.69 21C453.85 21 453.85 109 472.00 109" stroke="#ec7f13" stroke-linecap="round" stroke-width="2"></path>
              </svg>
              <div class="flex justify-between mt-2 text-xs font-medium text-slate-400">
                <span>{{ 'predictiveAnalytics.charts.week' | translate }} 1</span>
                <span>{{ 'predictiveAnalytics.charts.week' | translate }} 4</span>
                <span>{{ 'predictiveAnalytics.charts.week' | translate }} 8</span>
                <span>{{ 'predictiveAnalytics.charts.week' | translate }} 12</span>
              </div>
            </div>
          </div>
          <!-- Microbiological Risks Card -->
          <div class="p-5 border border-white/10 rounded-xl bg-card-dark">
            <div class="space-y-2">
              <p class="text-base font-medium text-slate-400">{{ 'predictiveAnalytics.microbiologicalRisks.title' | translate }}</p>
              <p class="text-3xl font-bold text-slate-100">{{ data.risk.level }}</p>
              <div class="flex items-center gap-2 text-sm">
                <p class="text-slate-400">{{ 'predictiveAnalytics.microbiologicalRisks.timeframe' | translate }}</p>
                <p class="font-medium" [class]="data.risk.positive ? 'text-success' : 'text-danger'">{{ data.risk.trend }}</p>
              </div>
            </div>
            <div class="mt-4">
              <svg fill="none" height="150" preserveAspectRatio="none" viewBox="0 0 472 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 140C18.15 140 18.15 130 36.31 130C54.46 130 54.46 110 72.62 110C90.77 110 90.77 125 108.92 125C127.08 125 127.08 90 145.23 90C163.38 90 163.38 70 181.54 70C199.69 70 199.69 50 217.85 50C236.00 50 236.00 40 254.15 40C272.31 40 272.31 20 290.46 20C308.62 20 308.62 10 326.77 10C344.92 10 344.92 25 363.08 25C381.23 25 381.23 15 399.38 15C417.54 15 417.54 5 435.69 5C453.85 5 453.85 1 472.00 1" stroke="#ec7f13" stroke-linecap="round" stroke-width="2"></path>
              </svg>
              <div class="flex justify-between mt-2 text-xs font-medium text-slate-400">
                <span>{{ 'predictiveAnalytics.charts.day' | translate }} 1</span>
                <span>{{ 'predictiveAnalytics.charts.day' | translate }} 7</span>
                <span>{{ 'predictiveAnalytics.charts.day' | translate }} 14</span>
                <span>{{ 'predictiveAnalytics.charts.day' | translate }} 21</span>
                <span>{{ 'predictiveAnalytics.charts.day' | translate }} 28</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredictiveAnalyticsComponent implements OnInit {
  translationService = inject(TranslationService);
  isLoading = signal(true);
  selectedBatch = signal('1a');
  analyticsData = signal<AnalyticsData | null>(null);
  
  private mockData: Record<string, AnalyticsData> = {
    '1a': {
      flavor: { score: '8.5/10', trend: '+1.2%', positive: true },
      shelfLife: { days: 60, trend: '-5%', positive: false },
      risk: { level: 'Low', trend: '+2%', positive: true }
    },
    '2b': {
      flavor: { score: '9.1/10', trend: '-0.5%', positive: false },
      shelfLife: { days: 120, trend: '-2%', positive: false },
      risk: { level: 'Very Low', trend: '+0.5%', positive: true }
    },
    '3c': {
      flavor: { score: '7.8/10', trend: '+2.5%', positive: true },
      shelfLife: { days: 90, trend: '-8%', positive: false },
      risk: { level: 'Low', trend: '+1%', positive: true }
    }
  };

  ngOnInit(): void {
    this.fetchAnalytics(this.selectedBatch());
  }
  
  onBatchChange(batchId: string): void {
    this.selectedBatch.set(batchId);
    this.fetchAnalytics(batchId);
  }

  fetchAnalytics(batchId: string): void {
    this.isLoading.set(true);
    this.analyticsData.set(null);
    // Simulate API call
    setTimeout(() => {
      this.analyticsData.set(this.mockData[batchId] || this.mockData['1a']);
      this.isLoading.set(false);
    }, 800);
  }
}