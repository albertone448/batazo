export type ProblemDetails = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
  code?: string;
};

function isProblemDetails(value: unknown): value is ProblemDetails {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readProblemDetails(
  response: Response,
): Promise<ProblemDetails | null> {
  const contentType = response.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/problem+json')) {
    return null;
  }

  try {
    const body: unknown = await response.json();
    return isProblemDetails(body) ? body : null;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly problem: ProblemDetails | null;

  constructor(status: number, problem: ProblemDetails | null) {
    super(problem?.title ?? `HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.problem = problem;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, { ...init, headers });

  if (!response.ok) {
    throw new ApiError(response.status, await readProblemDetails(response));
  }

  return (await response.json()) as T;
}
