// Copies of the API rules so forms can give feedback before submitting. The
// API is still the authority. Keep them in sync with:
// - Email: .NET EmailAddressAttribute (used by RegisterRequest).
// - Username: UsernameRules in Batazo.Domain.
// - Password: Identity options in Batazo.Infrastructure/DependencyInjection.cs.

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const USERNAME_CHARACTERS = /^[A-Za-z0-9_]+$/;
const PASSWORD_MIN_LENGTH = 8;

export function isValidEmail(value: string): boolean {
  if (/[\r\n]/.test(value)) {
    return false;
  }

  const atIndex = value.indexOf('@');
  return (
    atIndex > 0 &&
    atIndex !== value.length - 1 &&
    atIndex === value.lastIndexOf('@')
  );
}

export function isValidUsername(value: string): boolean {
  return (
    value.length >= USERNAME_MIN_LENGTH &&
    value.length <= USERNAME_MAX_LENGTH &&
    USERNAME_CHARACTERS.test(value)
  );
}

export const USERNAME_FORMAT_MESSAGE = `El nombre de usuario debe tener entre ${USERNAME_MIN_LENGTH} y ${USERNAME_MAX_LENGTH} caracteres, solo letras sin tilde, números o guion bajo.`;

// Same order and wording as the API, so both sides show the same text.
// Identity only counts ASCII letters and digits as alphanumeric: "ñ" or "á"
// count as symbols there, and here too.
export function getPasswordProblems(value: string): string[] {
  const problems: string[] = [];

  if (value.length < PASSWORD_MIN_LENGTH) {
    problems.push(
      `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`,
    );
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    problems.push('La contraseña debe tener al menos un símbolo, como # o !.');
  }
  if (!/[a-z]/.test(value)) {
    problems.push('La contraseña debe tener al menos una letra minúscula.');
  }
  if (!/[A-Z]/.test(value)) {
    problems.push('La contraseña debe tener al menos una letra mayúscula.');
  }

  return problems;
}
