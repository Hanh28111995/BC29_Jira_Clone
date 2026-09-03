import { useContext, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingContext } from "../contexts/loading.context";

const normalizeResult = (result) => result?.data?.content ?? result?.content ?? result;

const normalizeQueryKey = (service, dependencies = []) => [
  typeof service === "string" ? service : service?.name || "useAsync",
  ...dependencies,
];

const ensureArray = (value) => {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
};

export const useAsync = ({ dependencies = [], service, condition = true, queryKey, enabled = true, ...options }) => {
  const [, setLoadingState] = useContext(LoadingContext);
  const finalEnabled = Boolean(condition && enabled && service);
  const key = useMemo(() => queryKey || normalizeQueryKey(service, dependencies), [queryKey, service, dependencies]);
  const query = useQuery({
    queryKey: key,
    queryFn: () => service(),
    enabled: finalEnabled,
    refetchOnWindowFocus: false,
    retry: false,
    select: normalizeResult,
    ...options,
  });

  useEffect(() => {
    setLoadingState({ isLoading: query.isFetching || query.isLoading });
  }, [query.isFetching, query.isLoading, setLoadingState]);

  return {
    state: query.data,
    data: query.data,
    loading: query.isFetching || query.isLoading,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isSuccess: query.isSuccess,
    status: query.status,
    failureCount: query.failureCount,
    fetchStatus: query.fetchStatus,
    isIdle: query.status === "pending" && !query.isFetching,
  };
};

export const useAsyncMutation = ({ service, onSuccess, onError, onSettled, invalidateQueries, updateQueries, onMutate, raw = false, ...options }) => {
  const [, setLoadingState] = useContext(LoadingContext);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (variables) => {
      const result = await service(variables);
      return raw ? result : normalizeResult(result);
    },
    onMutate,
    onSuccess: async (data, variables, context) => {
      ensureArray(updateQueries).forEach(({ queryKey, updater }) => {
        if (queryKey && typeof updater === "function") {
          queryClient.setQueryData(queryKey, (oldData) => updater(oldData, data, variables));
        }
      });
      ensureArray(invalidateQueries).forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
      await onSuccess?.(data, variables, context);
    },
    onError,
    onSettled,
    ...options,
  });

  useEffect(() => {
    setLoadingState({ isLoading: mutation.isPending });
  }, [mutation.isPending, setLoadingState]);

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    error: mutation.error,
    isError: mutation.isError,
    isLoading: mutation.isPending,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isIdle: mutation.status === "idle",
    reset: mutation.reset,
    status: mutation.status,
    failureCount: mutation.failureCount,
    variables: mutation.variables,
  };
};

export const safeArray = (value) => (Array.isArray(value) ? value : []);
