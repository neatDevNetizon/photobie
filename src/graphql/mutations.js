/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEvents = /* GraphQL */ `
  mutation CreateEvents(
    $input: CreateEventsInput!
    $condition: ModelEventsConditionInput
  ) {
    createEvents(input: $input, condition: $condition) {
      id
      title
      secure
      capacity
      token
      location
      description
      type
      createdAt
      updatedAt
    }
  }
`;
export const updateEvents = /* GraphQL */ `
  mutation UpdateEvents(
    $input: UpdateEventsInput!
    $condition: ModelEventsConditionInput
  ) {
    updateEvents(input: $input, condition: $condition) {
      id
      title
      secure
      capacity
      token
      location
      description
      type
      createdAt
      updatedAt
    }
  }
`;
export const deleteEvents = /* GraphQL */ `
  mutation DeleteEvents(
    $input: DeleteEventsInput!
    $condition: ModelEventsConditionInput
  ) {
    deleteEvents(input: $input, condition: $condition) {
      id
      title
      secure
      capacity
      token
      location
      description
      type
      createdAt
      updatedAt
    }
  }
`;
