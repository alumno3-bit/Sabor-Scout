import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Make it impure to re-evaluate when language changes
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(key: string, params?: Record<string, string | number>): string {
    // This is a trick to make the pipe reactive to language changes.
    // Accessing the signal here creates a dependency.
    this.translationService.language(); 
    
    return this.translationService.translate(key, params);
  }
}
