/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateStory = /* GraphQL */ `subscription OnCreateStory($filter: ModelSubscriptionStoryFilterInput) {
  onCreateStory(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateStorySubscriptionVariables,
  APITypes.OnCreateStorySubscription
>;
export const onUpdateStory = /* GraphQL */ `subscription OnUpdateStory($filter: ModelSubscriptionStoryFilterInput) {
  onUpdateStory(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateStorySubscriptionVariables,
  APITypes.OnUpdateStorySubscription
>;
export const onDeleteStory = /* GraphQL */ `subscription OnDeleteStory($filter: ModelSubscriptionStoryFilterInput) {
  onDeleteStory(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteStorySubscriptionVariables,
  APITypes.OnDeleteStorySubscription
>;
