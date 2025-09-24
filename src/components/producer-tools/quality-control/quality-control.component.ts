import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../../services/gemini.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TranslationService } from '../../../services/translation.service';

type AnalysisType = 'turbidity' | 'visual_defects';

@Component({
  selector: 'app-quality-control',
  imports: [CommonModule, TranslatePipe],
  template: `
    @if (!activeAnalysis()) {
      <div class="p-4 md:p-6 space-y-8">
        <section>
          <h2 class="mb-4 text-xl font-bold text-slate-300">{{ 'qualityControl.rawMaterialsTitle' | translate }}</h2>
          <div class="space-y-3">
            <div class="flex items-center gap-4 rounded-lg bg-card-dark p-4 shadow-sm opacity-50 cursor-not-allowed">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M223.45,40.07a8,8,0,0,0-7.52-7.52C139.8,28.08,78.82,51,52.82,94a87.09,87.09,0,0,0-12.76,49c.57,15.92,5.21,32,13.79,47.85l-19.51,19.5a8,8,0,0,0,11.32,11.32l19.5-19.51C81,210.73,97.09,215.37,113,215.94q1.67.06,3.33.06A86.93,86.93,0,0,0,162,203.18C205,177.18,227.93,116.21,223.45,40.07ZM153.75,189.5c-22.75,13.78-49.68,14-76.71.77l88.63-88.62a8,8,0,0,0-11.32-11.32L65.73,179c-13.19-27-13-54,.77-76.71,22.09-36.47,74.6-56.44,141.31-54.06C210.2,114.89,190.22,167.41,153.75,189.5Z"></path></svg>
              </div>
              <div class="flex-1 text-left">
                <p class="font-semibold text-slate-100">{{ 'qualityControl.analysisTypes.hops.title' | translate }}</p>
                <p class="text-sm text-slate-400">{{ 'qualityControl.analysisTypes.hops.description' | translate }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 rounded-lg bg-card-dark p-4 shadow-sm opacity-50 cursor-not-allowed">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M208,56a87.53,87.53,0,0,0-31.85,6c-14.32-29.7-43.25-44.46-44.57-45.12a8,8,0,0,0-7.16,0c-1.33.66-30.25,15.42-44.57,45.12A87.53,87.53,0,0,0,48,56a8,8,0,0,0-8,8v80a88,88,0,0,0,176,0V64A8,8,0,0,0,208,56ZM120,215.56A72.1,72.1,0,0,1,56,144V128.44A72.1,72.1,0,0,1,120,200Zm0-66.1a88,88,0,0,0-64-37.09V72.44A72.1,72.1,0,0,1,120,144ZM94.15,69.11c9.22-19.21,26.41-31.33,33.85-35.9,7.44,4.58,24.63,16.7,33.84,35.9A88.61,88.61,0,0,0,128,107.36,88.57,88.57,0,0,0,94.15,69.11ZM200,144a72.1,72.1,0,0,1-64,71.56V200a72.1,72.1,0,0,1,64-71.56Zm0-31.63a88,88,0,0,0-64,37.09V144a72.1,72.1,0,0,1,64-71.56Z"></path></svg>
              </div>
              <div class="flex-1 text-left">
                <p class="font-semibold text-slate-100">{{ 'qualityControl.analysisTypes.malt.title' | translate }}</p>
                <p class="text-sm text-slate-400">{{ 'qualityControl.analysisTypes.malt.description' | translate }}</p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 class="mb-4 text-xl font-bold text-slate-300">{{ 'qualityControl.finalProductTitle' | translate }}</h2>
          <div class="space-y-3">
            <button (click)="selectAnalysis('turbidity')" class="w-full flex items-center gap-4 rounded-lg bg-card-dark p-4 shadow-sm hover:bg-white/5 transition-colors">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M160,40A88.09,88.09,0,0,0,81.29,88.67,64,64,0,1,0,72,216h88a88,88,0,0,0,0-176Zm0,160H72a48,48,0,0,1,0-96c1.1,0,2.2,0,3.29.11A88,88,0,0,0,72,128a8,8,0,0,0,16,0,72,72,0,1,1,72,72Z"></path></svg>
              </div>
              <div class="flex-1 text-left">
                <p class="font-semibold text-slate-100">{{ 'qualityControl.analysisTypes.turbidity.title' | translate }}</p>
                <p class="text-sm text-slate-400">{{ 'qualityControl.analysisTypes.turbidity.description' | translate }}</p>
              </div>
              <svg class="text-slate-600" fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>
            </button>
            <button (click)="selectAnalysis('visual_defects')" class="w-full flex items-center gap-4 rounded-lg bg-card-dark p-4 shadow-sm hover:bg-white/5 transition-colors">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
              </div>
              <div class="flex-1 text-left">
                <p class="font-semibold text-slate-100">{{ 'qualityControl.analysisTypes.visual_defects.title' | translate }}</p>
                <p class="text-sm text-slate-400">{{ 'qualityControl.analysisTypes.visual_defects.description' | translate }}</p>
              </div>
              <svg class="text-slate-600" fill="currentColor" height="20" viewBox="0 0 256 256" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>
            </button>
          </div>
        </section>
      </div>
    } @else {
      <div class="flex flex-col h-full">
         <header class="flex items-center p-4 border-b border-white/10 flex-shrink-0">
            <button (click)="reset()" class="p-2 -ml-2 text-slate-100 hover:bg-white/10 rounded-full">
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
            </button>
            <h1 class="text-lg font-bold flex-1 text-center pr-10">{{ getAnalysisTitle() | translate }}</h1>
        </header>

        <main class="p-4 md:p-6 space-y-6 flex-grow overflow-y-auto">
          @if (!imagePreview()) {
            <div class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl text-center bg-card-dark/50 hover:border-primary transition-colors max-w-md mx-auto">
              <label for="qc-file-upload" class="cursor-pointer px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg">
                {{ 'qualityControl.upload' | translate }}
              </label>
              <input id="qc-file-upload" type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*" />
            </div>
          } @else {
            <div class="flex flex-col md:flex-row gap-6 items-start">
                <div class="md:w-1/3 flex flex-col items-center">
                    <img [src]="imagePreview()" alt="Beer sample preview" class="max-w-xs max-h-96 rounded-lg shadow-lg mb-4 border-4 border-card-dark">
                     <button (click)="reset(true)" class="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20">
                        {{ 'qualityControl.uploadNew' | translate }}
                     </button>
                </div>
                <div class="md:w-2/3">
                  @if (isLoading()) {
                    <div class="text-center p-8">
                      <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full inline-block mb-2"></div>
                      <p class="text-lg text-primary">{{ 'qualityControl.loading' | translate }}</p>
                    </div>
                  }
                  @if (error()) {
                    <div class="text-center text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">{{ error() }}</div>
                  }
                  @if(analysisResult()) {
                    <div class="bg-card-dark p-6 rounded-xl border border-white/10">
                       <h3 class="text-xl font-bold text-primary/90 mb-4">{{ 'qualityControl.report' | translate }}</h3>
                       <div class="prose prose-invert max-w-none prose-headings:text-primary prose-strong:text-white" [innerHTML]="analysisResult()"></div>
                    </div>
                  }
                </div>
            </div>
          }
        </main>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QualityControlComponent {
  private geminiService = inject(GeminiService);
  private translationService = inject(TranslationService);
  
  activeAnalysis = signal<AnalysisType | null>(null);
  imagePreview = signal<string | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  analysisResult = signal<string | null>(null);

  selectAnalysis(type: AnalysisType): void {
    this.activeAnalysis.set(type);
    this.reset(true);
  }

  getAnalysisTitle(): string {
    const type = this.activeAnalysis();
    if (!type) return '';
    return `qualityControl.analysisTypes.${type}.title`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
        this.analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  }

  private analyzeImage(file: File): void {
    const analysisType = this.activeAnalysis();
    if (!analysisType) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.analysisResult.set(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Image = (e.target?.result as string)?.split(',')[1];
        if (!base64Image) throw new Error("Could not read image file.");
        
        const result = await this.geminiService.analyzeQualityControlImage(base64Image, analysisType);
        this.analysisResult.set(this.formatMarkdown(result));

      } catch (err) {
        this.error.set((err as Error).message || this.translationService.translate('qualityControl.error'));
      } finally {
        this.isLoading.set(false);
      }
    };
    reader.readAsDataURL(file);
  }
  
  reset(keepAnalysisType: boolean = false): void {
    if (!keepAnalysisType) {
        this.activeAnalysis.set(null);
    }
    this.imagePreview.set(null);
    this.isLoading.set(false);
    this.error.set(null);
    this.analysisResult.set(null);
  }

  private formatMarkdown(text: string): string {
    let html = '';
    let inList = false;

    // Process bold syntax first
    const processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const lines = processedText.split('\n');

    for (const line of lines) {
        if (line.startsWith('## ')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h2 class="text-xl font-bold text-primary mt-4 mb-2">${line.substring(3)}</h2>`;
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