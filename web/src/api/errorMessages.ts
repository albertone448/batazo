import { ApiError } from './client';

export type ErrorMessage = {
  title: string;
  description: string;
};

const GENERIC_ERROR: ErrorMessage = {
  title: 'Algo salió mal',
  description: 'Inténtalo de nuevo en un momento.',
};

export function getErrorMessage(error: unknown): ErrorMessage {
  if (!(error instanceof ApiError)) {
    return GENERIC_ERROR;
  }

  switch (error.status) {
    case 401:
      return {
        title: 'Tu sesión terminó',
        description: 'Inicia sesión de nuevo para continuar.',
      };
    case 403:
      return {
        title: 'No tienes acceso',
        description: 'Tu cuenta no tiene permiso para ver esto.',
      };
    case 404:
      return {
        title: 'No encontramos lo que buscas',
        description: 'Puede que ya no exista o que el enlace esté mal.',
      };
    case 429:
      return {
        title: 'Demasiados intentos',
        description: 'Espera un momento antes de volver a intentarlo.',
      };
    case 502:
    case 503:
    case 504:
      return {
        title: 'No pudimos conectar con Batazo',
        description: 'El servidor no responde. Inténtalo de nuevo en un momento.',
      };
    default:
      return GENERIC_ERROR;
  }
}
