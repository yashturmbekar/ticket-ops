import { useState, useEffect, useCallback } from "react";
import type { ApiResponse, PaginatedResponse } from "../types";

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiState<T> {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();

      if (response.success) {
        setData(response.data);
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        const errorMessage = response.error || "An error occurred";
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

export interface UsePaginatedApiState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
  refetch: () => Promise<void>;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export interface UsePaginatedApiOptions {
  initialPage?: number;
  limit?: number;
  onSuccess?: (data: PaginatedResponse<unknown>) => void;
  onError?: (error: string) => void;
}

export function usePaginatedApi<T>(
  apiCall: (
    page: number,
    limit: number
  ) => Promise<ApiResponse<PaginatedResponse<T>>>,
  options: UsePaginatedApiOptions = {}
): UsePaginatedApiState<T> {
  const { initialPage = 1, limit = 25, onSuccess, onError } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(currentPage, limit);

        if (response.success) {
          setData(response.data.data);
          setTotalPages(response.data.totalPages);
          setTotal(response.data.total);
          if (onSuccess) {
            onSuccess(response.data);
          }
        } else {
          const errorMessage = response.error || "An error occurred";
          setError(errorMessage);
          if (onError) {
            onError(errorMessage);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiCall, limit, onSuccess, onError]
  );

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages]
  );

  const refetch = useCallback(async () => {
    await fetchData(page);
  }, [fetchData, page]);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    total,
    hasMore: page < totalPages,
    refetch,
    nextPage,
    prevPage,
    goToPage,
  };
}

export interface UseMutationState<T> {
  loading: boolean;
  error: string | null;
  mutate: (data?: unknown) => Promise<T | null>;
}

export interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useMutation<T>(
  apiCall: (data?: unknown) => Promise<ApiResponse<T>>,
  options: UseMutationOptions<T> = {}
): UseMutationState<T> {
  const { onSuccess, onError } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (data?: unknown): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiCall(data);

        if (response.success) {
          if (onSuccess) {
            onSuccess(response.data);
          }
          return response.data;
        } else {
          const errorMessage = response.error || "An error occurred";
          setError(errorMessage);
          if (onError) {
            onError(errorMessage);
          }
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiCall, onSuccess, onError]
  );

  return {
    loading,
    error,
    mutate,
  };
}

// Utility hook for handling form submissions
export function useFormSubmission<T>(
  submitHandler: (data: T) => Promise<ApiResponse<unknown>>,
  options: UseMutationOptions<unknown> = {}
) {
  const { onSuccess, onError } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (data: T): Promise<unknown | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await submitHandler(data);

        if (response.success) {
          if (onSuccess) {
            onSuccess(response.data);
          }
          return response.data;
        } else {
          const errorMessage = response.error || "An error occurred";
          setError(errorMessage);
          if (onError) {
            onError(errorMessage);
          }
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [submitHandler, onSuccess, onError]
  );

  return {
    loading,
    error,
    mutate,
  };
}

// Utility hook for handling multiple API calls
export function useMultipleApi<T extends Record<string, unknown>>(
  apiCalls: { [K in keyof T]: () => Promise<ApiResponse<T[K]>> },
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<Partial<T>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const promises = Object.entries(apiCalls).map(async ([key, apiCall]) => {
        const response = await (
          apiCall as () => Promise<ApiResponse<unknown>>
        )();
        return { key, response };
      });

      const results = await Promise.all(promises);
      const newData: Partial<T> = {};

      for (const { key, response } of results) {
        if (response.success) {
          newData[key as keyof T] = response.data as T[keyof T];
        } else {
          throw new Error(response.error || `Failed to fetch ${key}`);
        }
      }

      setData(newData);
      if (options.onSuccess) {
        options.onSuccess(newData);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      if (options.onError) {
        options.onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [apiCalls, options]);

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
  }, [fetchData, options.immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
