import { animate, style, transition, trigger } from '@angular/animations';

export const initialAnimation = trigger('initialAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
    }),
    animate('.4s 0s ease-in-out', style({
      opacity: 1,
    }))
  ])
]);
