import { queryOptions } from "@tanstack/react-query";

import { useUsersQuery } from "@/generated/graphql";

import type { UsersQueryVariables } from "@/generated/graphql";

const usersOptions = (variables: UsersQueryVariables = {}) =>
  queryOptions({
    queryKey: useUsersQuery.getKey(variables),
    queryFn: useUsersQuery.fetcher(variables),
  });

export default usersOptions;
