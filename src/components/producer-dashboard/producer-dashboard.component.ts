import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

type ProducerTab = 'optimize' | 'qc' | 'marketing' | 'predictive' | 'integrations';

@Component({
  selector: 'app-producer-dashboard',
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="p-4 space-y-6">
      <section>
        <h2 class="text-2xl font-bold mb-4">{{ 'producerDashboard.summaryTitle' | translate }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-card-dark/50 border border-white/10 rounded-lg p-4 flex flex-col gap-2 shadow-sm">
            <p class="text-sm font-medium text-slate-100/80">{{ 'producerDashboard.productionStatus' | translate }}</p>
            <p class="text-3xl font-bold">{{ 'producerDashboard.inProgress' | translate }}</p>
            <p class="text-sm font-medium text-success">+5%</p>
          </div>
          <div class="bg-card-dark/50 border border-white/10 rounded-lg p-4 flex flex-col gap-2 shadow-sm">
            <p class="text-sm font-medium text-slate-100/80">{{ 'producerDashboard.qualityAlerts' | translate }}</p>
            <p class="text-3xl font-bold">2</p>
            <p class="text-sm font-medium text-danger">-1%</p>
          </div>
          <div class="bg-card-dark/50 border border-white/10 rounded-lg p-4 flex flex-col gap-2 shadow-sm">
            <p class="text-sm font-medium text-slate-100/80">{{ 'producerDashboard.recipePerformance' | translate }}</p>
            <p class="text-3xl font-bold">95%</p>
            <p class="text-sm font-medium text-success">+2%</p>
          </div>
        </div>
      </section>
      <section>
        <h2 class="text-2xl font-bold mb-4">{{ 'producerDashboard.quickAccessTitle' | translate }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <button (click)="selectTool('optimize')" class="flex items-center gap-4 p-4 bg-card-dark/50 border border-white/10 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 hover:border-primary/50">
            <span class="material-symbols-outlined text-primary text-3xl">science</span>
            <h3 class="font-bold text-base text-left">{{ 'tabs.optimize' | translate }}</h3>
          </button>
          <button (click)="selectTool('qc')" class="flex items-center gap-4 p-4 bg-card-dark/50 border border-white/10 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 hover:border-primary/50">
            <span class="material-symbols-outlined text-primary text-3xl">search</span>
            <h3 class="font-bold text-base text-left">{{ 'tabs.qc' | translate }}</h3>
          </button>
          <button (click)="selectTool('marketing')" class="flex items-center gap-4 p-4 bg-card-dark/50 border border-white/10 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 hover:border-primary/50">
            <span class="material-symbols-outlined text-primary text-3xl">campaign</span>
            <h3 class="font-bold text-base text-left">{{ 'tabs.marketing' | translate }}</h3>
          </button>
           <button (click)="selectTool('predictive')" class="flex items-center gap-4 p-4 bg-card-dark/50 border border-white/10 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 hover:border-primary/50">
            <span class="material-symbols-outlined text-primary text-3xl">analytics</span>
            <h3 class="font-bold text-base text-left">{{ 'tabs.predictive' | translate }}</h3>
          </button>
          <button (click)="selectTool('integrations')" class="flex items-center gap-4 p-4 bg-card-dark/50 border border-white/10 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 hover:border-primary/50">
            <span class="material-symbols-outlined text-primary text-3xl">hub</span>
            <h3 class="font-bold text-base text-left">{{ 'tabs.integrations' | translate }}</h3>
          </button>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProducerDashboardComponent {
  toolSelected = output<ProducerTab>();

  selectTool(tool: ProducerTab): void {
    this.toolSelected.emit(tool);
  }
}
