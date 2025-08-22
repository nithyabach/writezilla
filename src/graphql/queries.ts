/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getStory = /* GraphQL */ `query GetStory($id: ID!) {
  getStory(id: $id) {
    id
    title
    color
    userId
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetStoryQueryVariables, APITypes.GetStoryQuery>;
export const listStories = /* GraphQL */ `query ListStories(
  $filter: ModelStoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listStories(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      color
      userId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListStoriesQueryVariables,
  APITypes.ListStoriesQuery
>;
export const syncStories = /* GraphQL */ `query SyncStories(
  $filter: ModelStoryFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncStories(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      id
      title
      color
      userId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncStoriesQueryVariables,
  APITypes.SyncStoriesQuery
>;
