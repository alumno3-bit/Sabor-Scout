import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-education',
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="p-4 md:p-6 space-y-4">
      <h2 class="text-2xl font-bold text-primary">{{ 'education.title' | translate }}</h2>
      <p class="text-slate-400">{{ 'education.description' | translate }}</p>
      
      <div class="flex gap-2">
        <input
          type="text"
          [ngModel]="topic()" 
          (ngModelChange)="topic.set($event)"
          (keyup.enter)="getEducationalContent()"
          [placeholder]="'education.placeholder' | translate"
          class="flex-grow bg-card-dark text-white border border-white/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors"
          [disabled]="isLoading()"
        >
        <button
          (click)="getEducationalContent()"
          [disabled]="isLoading() || !topic().trim()"
          class="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          @if (isLoading()) {
            <div class="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full inline-block"></div>
          } @else {
            <span>{{ 'education.ask' | translate }}</span>
          }
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        @for (preTopicKey of predefinedTopicKeys; track preTopicKey) {
          <button 
            (click)="getEducationalContentWithKey(preTopicKey)" 
            class="px-3 py-1 bg-card-dark text-primary/90 rounded-full hover:bg-background-dark hover:text-primary transition-colors text-sm"
            [disabled]="isLoading()"
          >
            {{ 'education.topics.' + preTopicKey | translate }}
          </button>
        }
      </div>
      
      <div class="mt-6">
        @if (isLoading()) {
          <div class="text-center p-8">
            <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full inline-block mb-2"></div>
            <p class="text-lg text-primary">{{ 'education.loading' | translate }}</p>
          </div>
        }

        @if (error()) {
          <div class="text-center text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">{{ error() }}</div>
        }

        @if (content()) {
          <div class="max-w-none bg-card-dark p-6 rounded-xl text-slate-200 border border-white/10" [innerHTML]="content()"></div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationComponent {
  private geminiService = inject(GeminiService);
  private translationService = inject(TranslationService);

  topic = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);
  content = signal<string | null>(null);

  predefinedTopicKeys = [ "defects", "ibu", "aleLager", "mouthfeel", "hops" ];
  
  async getEducationalContent(topicToFetch?: string) {
    const finalTopic = topicToFetch ?? this.topic();
    if (!finalTopic.trim()) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.content.set(null);
    this.topic.set(finalTopic);

    try {
      const result = await this.geminiService.getEducationalContent(finalTopic);
      this.content.set(this.formatMarkdown(result));
    } catch (err) {
      this.error.set((err as Error).message || this.translationService.translate('education.error'));
    } finally {
      this.isLoading.set(false);
    }
  }

  getEducationalContentWithKey(key: string): void {
    const topic = this.translationService.translate(`education.topics.${key}`);
    this.getEducationalContent(topic);
  }

  private formatMarkdown(text: string): string {
    let html = '';
    let inList = false;

    const lines = text.split('\n');

    for (const line of lines) {
        if (line.startsWith('## ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h2 class="text-2xl font-bold text-primary mt-6 mb-2">${line.substring(3)}</h2>`;
        } else if (line.startsWith('### ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h3 class="text-xl font-semibold text-primary/80 mt-4 mb-1">${line.substring(4)}</h3>`;
        } else if (line.startsWith('* ')) {
            if (!inList) {
                html += '<ul class="list-disc list-inside space-y-1 mt-2">';
                inList = true;
            }
            html += `<li>${line.substring(2)}</li>`;
        } else {
            if (inList) { html += '</ul>'; inList = false; }
            if (line.trim().length > 0) {
              html += `<p class="mt-2 leading-relaxed">${line}</p>`;
            }
        }
    }
    if (inList) { html += '</ul>'; }
    return html;
  }
}