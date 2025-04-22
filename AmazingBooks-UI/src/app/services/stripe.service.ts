import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { switchMap } from 'rxjs';
import { Order } from '../model/order';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripe: Stripe | null = null;

  constructor(private http: HttpClient) {
    this.initStripe();
  }

  private async initStripe() {
    this.stripe = await loadStripe(environment.StripePublishKey); //Loads stripe.js library and initialize stipe instance
  }

  public MakePayment(order: Order) {
    console.log(order);
    return this.http.post(environment.StripeApi, order).pipe(
      //switchMap is an RxJS operator used for handling scenarios where a new observable needs to be created based on the emission
      // of a source observable, while ensuring that only the most recent observable is active.
      //  It cancels any ongoing inner observable when a new value is emitted from the source, and subscribes to a new one.
      switchMap(async (response: any) => {
        const stripe = await this.stripe;
        if (!stripe) {
          throw new Error('Stripe failed to initialize');
        }
        console.log('Instripe: ', response);
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.sessionId, // Redirect to Stripe checkout using sessionId from server
        });

        if (error) {
          throw new Error(error.message);
        }
      })
    );
  }
}
