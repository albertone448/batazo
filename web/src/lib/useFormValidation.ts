import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from 'react';
import type { FieldErrors } from '../api/fieldErrors';

function withoutField(errors: FieldErrors, field: string): FieldErrors {
  if (!(field in errors)) {
    return errors;
  }
  const rest = { ...errors };
  delete rest[field];
  return rest;
}

/**
 * Form state with the validation timing every Batazo form follows:
 * - A field shows its browser-side error once the user leaves it with
 *   something typed, or when the form is submitted.
 * - From then on it is checked on every keystroke, so the error goes away as
 *   soon as the value is fixed and comes back if it breaks again.
 * - A server error stays until the user edits that field.
 */
export function useFormValidation<TValues extends Record<string, string>>(
  initialValues: TValues,
  validate: (values: TValues) => FieldErrors,
) {
  const [values, setValues] = useState(initialValues);
  const [shownFields, setShownFields] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [serverErrors, setServerErrorsState] = useState<FieldErrors>({});
  const [focusRequest, setFocusRequest] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const clientErrors = validate(values);
  const errors: FieldErrors = { ...serverErrors };
  for (const field of shownFields) {
    const message = clientErrors[field];
    if (message) {
      errors[field] = message;
    }
  }

  // Runs after the errors are rendered, so the focused field already has its
  // aria-describedby and screen readers read the label together with the error.
  useEffect(() => {
    if (focusRequest === 0) {
      return;
    }
    formRef.current
      ?.querySelector<HTMLInputElement>('[aria-invalid="true"]')
      ?.focus();
  }, [focusRequest]);

  function showField(field: string) {
    setShownFields((current) =>
      current.has(field) ? current : new Set(current).add(field),
    );
  }

  function field(name: keyof TValues & string) {
    return {
      name,
      value: values[name],
      error: errors[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValues((current) => ({ ...current, [name]: value }));
        setServerErrorsState((current) => withoutField(current, name));
      },
      onBlur: (event: FocusEvent<HTMLInputElement>) => {
        if (event.target.value !== '') {
          showField(name);
        }
      },
    };
  }

  // Marks every field as shown and moves focus to the first error, if any.
  // Returns whether the browser-side checks passed.
  function validateAll(): boolean {
    setShownFields(new Set(Object.keys(values)));
    setServerErrorsState({});
    const isValid = Object.keys(clientErrors).length === 0;
    if (!isValid) {
      setFocusRequest((count) => count + 1);
    }
    return isValid;
  }

  function setServerErrors(fieldErrors: FieldErrors) {
    setServerErrorsState(fieldErrors);
    setFocusRequest((count) => count + 1);
  }

  return { values, errors, field, validateAll, setServerErrors, formRef };
}
