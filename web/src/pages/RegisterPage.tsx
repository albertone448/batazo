import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { getErrorMessage } from '../api/errorMessages';
import { getFieldErrors, type FieldErrors } from '../api/fieldErrors';
import logoInverseUrl from '../assets/brand/batazo-logo-horizontal-inverse.svg';
import logoUrl from '../assets/brand/batazo-logo-horizontal.svg';
import {
  getPasswordProblems,
  isValidEmail,
  isValidUsername,
  USERNAME_FORMAT_MESSAGE,
} from '../auth/accountRules';
import { useRegister, type RegisterInput } from '../auth/useRegister';
import { Alert } from '../components/Alert';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TextField } from '../components/TextField';
import { useFormValidation } from '../lib/useFormValidation';
import styles from './RegisterPage.module.css';

const INITIAL_VALUES: RegisterInput = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
};

function validate(values: RegisterInput): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.email.trim()) {
    errors.email = 'El correo es obligatorio.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'El correo no tiene un formato válido.';
  }

  if (!values.username.trim()) {
    errors.username = 'El nombre de usuario es obligatorio.';
  } else if (!isValidUsername(values.username)) {
    errors.username = USERNAME_FORMAT_MESSAGE;
  }

  const passwordProblems = getPasswordProblems(values.password);
  if (!values.password.trim()) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (passwordProblems.length > 0) {
    errors.password = passwordProblems.join(' ');
  }

  if (!values.confirmPassword.trim()) {
    errors.confirmPassword = 'Confirma la contraseña.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  return errors;
}

export function RegisterPage() {
  const register = useRegister();
  const { values, errors, field, validateAll, setServerErrors, formRef } =
    useFormValidation(INITIAL_VALUES, validate);

  const isFieldError =
    register.isError && Object.keys(getFieldErrors(register.error)).length > 0;
  const formError = errors['']
    ? { title: 'No pudimos crear tu cuenta', description: errors[''] }
    : register.isError && !isFieldError
      ? getErrorMessage(register.error)
      : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    register.reset();

    if (!validateAll()) {
      return;
    }

    register.mutate(values, {
      onError: (error) => setServerErrors(getFieldErrors(error)),
    });
  }

  return (
    <div className={styles.page}>
      <picture>
        <source srcSet={logoInverseUrl} media="(prefers-color-scheme: dark)" />
        <img src={logoUrl} alt="" height={40} className={styles.logo} />
      </picture>

      <Card as="section" className={styles.card} aria-labelledby="registro">
        <h1 id="registro" className={styles.title}>
          Crea tu cuenta
        </h1>

        {register.isSuccess ? (
          // Provisional hasta F1-12: con la sesión real, redirigir a "/".
          <Alert tone="success" title="Tu cuenta está lista">
            Ya iniciaste sesión con tu cuenta nueva.
          </Alert>
        ) : (
          <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            className={styles.form}
          >
            {formError && (
              <Alert tone="danger" title={formError.title}>
                {formError.description}
              </Alert>
            )}

            <TextField
              label="Correo"
              type="email"
              autoComplete="email"
              {...field('email')}
            />
            <TextField
              label="Nombre de usuario"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              {...field('username')}
            />
            <TextField
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              {...field('password')}
            />
            <TextField
              label="Confirma la contraseña"
              type="password"
              autoComplete="new-password"
              {...field('confirmPassword')}
            />

            <Button type="submit" isLoading={register.isPending}>
              Crear cuenta
            </Button>
          </form>
        )}

        <p className={styles.footer}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </Card>
    </div>
  );
}
