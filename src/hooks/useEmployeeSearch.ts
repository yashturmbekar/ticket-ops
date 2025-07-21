import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef } from "react";
import api from "../services/api";

export type EmployeeSearchResult = {
  id: number;
  employeeName: string;
  employeeId: string;
  departmentName: string;
  designation: string;
  profilePic?: string;
  profilePicContentType?: string;
};

interface EmployeeSearchApiResponse {
  items: EmployeeSearchResult[];
  meta?: Record<string, unknown>;
  links?: Record<string, string | null>;
}

function isApiError(error: unknown): error is { response?: { data?: { message?: string } } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object"
  );
}

// Debounce utility
function debounceString(fn: (query: string) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (query: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(query);
    }, delay);
  };
}

export function useEmployeeSearch({
  endpoint = "/searchemployees?page=0&size=10&sort=lastModifiedDate,desc",
  debounceMs = 300,
  params = { isactive: true } as Record<string, unknown>,
}: {
  endpoint?: string;
  debounceMs?: number;
  params?: Record<string, unknown>;
} = {}) {
  const queryClient = useQueryClient();
  const input = useRef<string>("");

  const fetchEmployees = async (query: string) => {
    if (!query) return { items: [] };
    // api.post returns { data: EmployeeSearchApiResponse }
    return api.post<EmployeeSearchApiResponse>(endpoint, { ...params, name: query });
  };

  const {
    data,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["employee-search", endpoint, params, input.current],
    queryFn: async () => {
      if (!input.current) return { items: [] };
      const res = await fetchEmployees(input.current);
      // If api.post returns { data }, extract .data, else fallback
      return (res && 'data' in res) ? (res as { data: EmployeeSearchApiResponse }).data : res;
    },
    enabled: !!input.current,
    staleTime: 1000 * 60,
    retry: false,
  });

  // Debounced search setter
  const debouncedSearch = useRef(
    debounceString((query: string) => {
      input.current = query;
      queryClient.invalidateQueries({ queryKey: ["employee-search", endpoint, params] });
    }, debounceMs)
  ).current;

  return {
    results: data?.items || [],
    loading: isFetching,
    error: error ? (isApiError(error) ? error.response?.data?.message || "Search failed" : (error as Error).message) : null,
    search: debouncedSearch,
  };
}

