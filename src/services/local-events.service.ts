import { Injectable, inject } from '@angular/core';
import { GeminiService } from './gemini.service';
import { BeerEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class LocalEventsService {
  private geminiService = inject(GeminiService);

  findEvents(location: string): Promise<BeerEvent[]> {
    if (!location || !location.trim()) {
      return Promise.resolve([]);
    }
    return this.geminiService.findLocalBeerEvents(location);
  }
}
