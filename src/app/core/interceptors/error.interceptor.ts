import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const msg = inject(MessageService);

  return next(req).pipe(
    catchError(err => {
      msg.add({
        severity: 'error',
        summary: '¡Comunicación Interrumpida!',
        detail: 'La comunicación con el planeta Namek ha fallado.',
        life: 5000
      });
      return throwError(() => err);
    })
  );
};
