import { useMutation } from '@tanstack/react-query';
import { apiFetchNoContent } from '../api/client';

export type RegisterInput = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      apiFetchNoContent('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  });
}
