import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { Beer } from '../models/beer.model';
import { BeerEvent } from '../models/event.model';
import { Recipe } from '../models/producer.model';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  private translationService = inject(TranslationService);

  constructor() {
    // As per instructions, the API key must be obtained exclusively from process.env.API_KEY.
    // It's assumed to be pre-configured and accessible.
    if (!process.env.API_KEY) {
      console.error('API_KEY environment variable not set.');
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  }
  
  private async generateWithSchema<T>(prompt: string, schema: any): Promise<T> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });
    // The response.text is a string, which needs to be parsed.
    try {
        return JSON.parse(response.text) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error("Received an invalid response from the AI model.");
    }
  }
  
  async identifyBeerFromImage(base64Image: string): Promise<Beer> {
    const beerSchema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        brewery: { type: Type.STRING },
        style: { type: Type.STRING },
        abv: { type: Type.NUMBER },
        ibu: { type: Type.NUMBER, nullable: true },
        tastingNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
        description: { type: Type.STRING }
      },
      required: ['name', 'brewery', 'style', 'abv', 'tastingNotes', 'description']
    };

    const prompt = 'Analyze the beer label in the image and provide details about the beer. If you cannot identify it, return "Unknown Beer" for the name and empty strings for other fields.';
    
    const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: beerSchema
        }
    });

    return JSON.parse(response.text) as Beer;
  }

  async submitBeerContribution(beerData: Beer, base64Image: string): Promise<void> {
    // In a real application, this would send data to a backend to be stored.
    // For this example, we'll simulate a successful submission.
    console.log('Submitting beer contribution:', { beerData, image: '...base64...' });
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Promise.resolve();
  }

  async getFoodPairings(beer: Beer): Promise<string[]> {
    const pairingsSchema = {
        type: Type.OBJECT,
        properties: {
            pairings: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ['pairings']
    };
    
    const prompt = `Provide 3-5 food pairing suggestions for a ${beer.style} called "${beer.name}" from ${beer.brewery}. It has tasting notes of: ${beer.tastingNotes.join(', ')}.`;
    
    const result = await this.generateWithSchema<{pairings: string[]}>(prompt, pairingsSchema);
    return result.pairings;
  }

  async searchBeers(query: string): Promise<Beer[]> {
    const searchSchema = {
        type: Type.OBJECT,
        properties: {
            beers: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        brewery: { type: Type.STRING },
                        style: { type: Type.STRING },
                        abv: { type: Type.NUMBER },
                        ibu: { type: Type.NUMBER, nullable: true },
                        tastingNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        description: { type: Type.STRING }
                    },
                    required: ['name', 'brewery', 'style', 'abv', 'description', 'tastingNotes']
                }
            }
        },
        required: ['beers']
    };

    const prompt = `Find beers matching the query: "${query}". Return up to 10 results. Provide fictional but realistic data for each beer.`;

    const result = await this.generateWithSchema<{ beers: Beer[] }>(prompt, searchSchema);
    return result.beers;
  }

  async getEducationalContent(topic: string): Promise<string> {
    const prompt = `Explain the topic "${topic}" in a clear and concise way for a beer enthusiast. Use markdown for formatting, including headers (##) and bullet points (*).`;
    const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  }

  async findLocalBeerEvents(location: string): Promise<BeerEvent[]> {
    const eventsSchema = {
        type: Type.OBJECT,
        properties: {
            events: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        date: { type: Type.STRING },
                        location: { type: Type.STRING },
                        description: { type: Type.STRING },
                        url: { type: Type.STRING, nullable: true }
                    },
                    required: ['name', 'date', 'location', 'description']
                }
            }
        },
        required: ['events']
    };

    const prompt = `Find upcoming (fictional) beer-related events near ${location}. Return up to 5 events.`;
    const result = await this.generateWithSchema<{ events: BeerEvent[] }>(prompt, eventsSchema);
    return result.events;
  }

  async optimizeRecipe(params: { style: string; abv: number; ibu: number; flavorProfile: string }): Promise<Recipe> {
    const recipeSchema = {
        type: Type.OBJECT,
        properties: {
            recipeName: { type: Type.STRING },
            maltBill: { type: Type.ARRAY, items: { type: Type.STRING } },
            hopSchedule: { type: Type.ARRAY, items: { type: Type.STRING } },
            yeast: { type: Type.STRING },
            instructions: { type: Type.STRING }
        },
        required: ['recipeName', 'maltBill', 'hopSchedule', 'yeast', 'instructions']
    };

    const prompt = `Generate a 5-gallon all-grain beer recipe for a ${params.style} with a target ABV of ${params.abv}%, IBU of ${params.ibu}, and a flavor profile described as "${params.flavorProfile}". Provide a creative name for the recipe.`;

    return this.generateWithSchema<Recipe>(prompt, recipeSchema);
  }

  async analyzeQualityControlImage(base64Image: string, analysisType: 'turbidity' | 'visual_defects'): Promise<string> {
    const prompt = analysisType === 'turbidity' 
      ? 'Analyze the provided beer sample image for turbidity and clarity. Provide a report in markdown format. Comment on haze, clarity, and any visible particles.'
      : 'Analyze the provided beer sample image for visual defects. Look for floaters, sediment, or other issues. Provide a report in markdown format.';
    
    const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: prompt },
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
            ]
        }
    });

    return response.text;
  }

  async generateMarketingCopy(params: { beerName: string; style: string; tastingNotes: string; targetAudience: string }): Promise<string> {
    const prompt = `Generate engaging marketing copy for a new beer.
    - Name: ${params.beerName}
    - Style: ${params.style}
    - Tasting Notes: ${params.tastingNotes}
    - Target Audience: ${params.targetAudience}
    
    Provide a short description and a longer, more evocative one. Format the response as markdown.`;

    const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
  }
}
