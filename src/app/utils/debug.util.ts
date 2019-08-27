import {pipe} from 'rxjs/index';
import {environment} from '../../environments/environment';
import {tap} from 'rxjs/internal/operators';

export const debug = (message: string) => pipe(
  tap(
    (next) => {
      if (!environment.production) {
        console.log(message, next);
      }
    },
    (err) => {
      if (!environment.production) {
        console.error('ERROR >>', message, err);
      }
    },
    () => {
      if (!environment.production) {
        console.log('Completed - ');
      }
    }
  )
);
