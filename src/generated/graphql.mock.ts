// @ts-nocheck
import * as Types from './generated';

import { graphql, type GraphQLResponseResolver, type RequestHandlerOptions } from 'msw'

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUsersQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { users }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUsersQuery = (resolver: GraphQLResponseResolver<Types.UsersQuery, Types.UsersQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.UsersQuery, Types.UsersQueryVariables>(
    'Users',
    resolver,
    options
  )
