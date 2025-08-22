/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createStory = /* GraphQL */ `mutation CreateStory(
  $input: CreateStoryInput!
  $condition: ModelStoryConditionInput
) {
  createStory(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateStoryMutationVariables,
  APITypes.CreateStoryMutation
>;
export const updateStory = /* GraphQL */ `mutation UpdateStory(
  $input: UpdateStoryInput!
  $condition: ModelStoryConditionInput
) {
  updateStory(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateStoryMutationVariables,
  APITypes.UpdateStoryMutation
>;
export const deleteStory = /* GraphQL */ `mutation DeleteStory(
  $input: DeleteStoryInput!
  $condition: ModelStoryConditionInput
) {
  deleteStory(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteStoryMutationVariables,
  APITypes.DeleteStoryMutation
>;
