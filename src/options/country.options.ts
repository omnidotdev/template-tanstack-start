import { queryOptions } from "@tanstack/react-query";

import { useCountryQuery } from "@/generated/graphql";

import type { CountryQueryVariables } from "@/generated/graphql";

export const countryOptions = (variables: CountryQueryVariables) =>
  queryOptions({
    queryKey: useCountryQuery.getKey(variables),
    queryFn: useCountryQuery.fetcher(variables),
  });
