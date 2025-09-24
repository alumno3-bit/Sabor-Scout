import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../pipes/translate.pipe';

interface Integration {
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-integrations',
  // standalone: true, // Removed per Angular v20+ best practices
  imports: [CommonModule, TranslatePipe],
  template: `
    <main class="flex-1 px-4 pt-6 pb-8">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-slate-100">{{ 'integrations.title' | translate }}</h2>
        <p class="mt-2 text-slate-400">
          {{ 'integrations.description' | translate }}
        </p>
      </div>
      <div class="space-y-3">
        @for (integration of integrations; track integration.name) {
          <div class="flex items-center gap-4 p-3 rounded-lg bg-card-dark border border-white/10">
            <div class="flex-shrink-0 w-14 h-14 rounded-lg bg-cover bg-center bg-white" [style.background-image]="'url(' + integration.imageUrl + ')'"></div>
            <div class="flex-1">
              <p class="font-bold text-slate-100">{{ integration.name }}</p>
              <p class="text-sm text-slate-400">{{ 'integrations.managementSoftware' | translate }}</p>
            </div>
            <button class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/30 hover:bg-primary/50 transition-colors">
              <span class="material-symbols-outlined text-sm text-primary">add</span>
            </button>
          </div>
        }
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationsComponent {
  integrations: Integration[] = [
    {
      name: 'BrewMan',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp-AOnuLvyCBBRlwVVoxk5dq_zdXcKS6ZYp-MHMh-zKJVlFE8NJ9qeajOWXVqEJ13Swj78U6LlNe-6IuH3n-K7KIbfLLLuWmezK1mfX678NaEVUW-XwlKbm1cLBhMPk5WN0UCVHQxWbs7bhnF9-MdO_TjvDD6N0w2LIkdc7eX8o7WtyB0homAviLhirg7IaQ0kU4ui36q94JhOYv_Mi8HJcV4-whUXkRoqCDCLwGKc8Ko0rCPjbZ7KS4ZrG-11_Ji92rlTPIxNhME',
    },
    {
      name: 'Ekos Brewmaster',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJWyqawRTa48TfxBVbHLIHjzKGiFuZ0ZMLltkNHyAnAfdk5Z8PWm86tmaEpEi_GcmFIP1xtzg3zYwbBLr8la7UET_ohTV2BakxeuQWJ3VBe-w8ltZaV9Z5yw-4BriGpanqo8KVcohtuMzCVjwGhHFuL7TSDzTZCAXwwc0j3Eopm3b99HLrkvjyzhlbbpfHCk-pGHM7GeK1RNdhIKxDPXiR3_kpJV2BMfcxQ4eWkwGN2xLvoxsXH6cmAX5qyy0HJthK0mNAjdo5IWE',
    },
    {
      name: 'Ollie',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkMg1LsMX_YGRD6gFrvnPnQ0--JIFjD_xlDtSAIftOUYGA1qkd4rpKeQWEXRH-slHoTQpQq7qP_VPgZRIi9V94X1-rwC3symwxAGwfYMdFV6vWhc5ULtHbUCkxLuzh3Hd_MrTYtVpRafM0ugjW9BNGZj50jkyob5rg7QgwFb2Orhu9hzHu9qLUNxVd9d8jojgPQH8IwtypHvxnBe1pc8vL_rEGMcxUkKpVBaLF3hLlVQC3vtuWvqu7yjAQJVIvJBTAMZENTZo-TY8',
    },
    {
      name: 'Beer30',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhk5bW1bMWnv_dGT4Oaq84N_8dQNbxFNejXj6A6KgQ0nzA_s9NZCbhiUtCMrW3iOjZ4yXmigDEDcc7jWmuNc8mHfk5ZQsz4vRoDOrGay-ImMNN3bPxaXCpD1RrPO-MTqrQ4EnQW1qcNQpgfYxTRIhWcQFpisyR0DGtQlMMEddQMiqBxp00ZCKQPDc13k9pfiNLM18xwfSELguuyH5DKtWnax1IHfGkBbg9HkGsAbIDO0zpvr-D3LmCgqflF9EByApzsEHUSHMXtBA',
    },
  ];
}
