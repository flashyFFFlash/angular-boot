import { Injectable } from '@angular/core';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  constructor(
    private restService: RestService
  ) { }

  load() {
    this.restService.get('/system/csrf').then((r: any) => {
      if (r.code !== 1) {
        console.error(r.description);
      } else {
        this.restService.setCsrfToken(r.result);
      }
    });
  }
}

export function startupServiceFactory(loader: StartupService) {
  return () => loader.load();
}
