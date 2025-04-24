import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'languageCode',
})
export class LanguagePipe implements PipeTransform {
  private languageMap: { [key: string]: string } = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ar: 'Arabic',
    fi: 'Finnish',
    he: 'Hebrew',
    hi: 'Hindi',
    it: 'Italian',
    ja: 'Japanese',
    id: 'Indonesian',
    // Add more languages and their codes as needed
  };
  transform(code: string): string {
    return this.languageMap[code] || code;
  }
}
