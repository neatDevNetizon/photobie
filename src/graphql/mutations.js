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
      user
      status
      image
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
      user
      status
      image
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
      user
      status
      image
      createdAt
      updatedAt
    }
  }
`;
export const createUsers = /* GraphQL */ `
  mutation CreateUsers(
    $input: CreateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    createUsers(input: $input, condition: $condition) {
      id
      email
      type
      name
      address
      age
      photo
      payment
      verified
      createdAt
      updatedAt
    }
  }
`;
export const updateUsers = /* GraphQL */ `
  mutation UpdateUsers(
    $input: UpdateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    updateUsers(input: $input, condition: $condition) {
      id
      email
      type
      name
      address
      age
      photo
      payment
      verified
      createdAt
      updatedAt
    }
  }
`;
export const deleteUsers = /* GraphQL */ `
  mutation DeleteUsers(
    $input: DeleteUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    deleteUsers(input: $input, condition: $condition) {
      id
      email
      type
      name
      address
      age
      photo
      payment
      verified
      createdAt
      updatedAt
    }
  }
`;
export const createProviders = /* GraphQL */ `
  mutation CreateProviders(
    $input: CreateProvidersInput!
    $condition: ModelProvidersConditionInput
  ) {
    createProviders(input: $input, condition: $condition) {
      id
      provider
      eventid
      description
      token
      location
      images
      clients
      createdAt
      updatedAt
    }
  }
`;
export const updateProviders = /* GraphQL */ `
  mutation UpdateProviders(
    $input: UpdateProvidersInput!
    $condition: ModelProvidersConditionInput
  ) {
    updateProviders(input: $input, condition: $condition) {
      id
      provider
      eventid
      description
      token
      location
      images
      clients
      createdAt
      updatedAt
    }
  }
`;
export const deleteProviders = /* GraphQL */ `
  mutation DeleteProviders(
    $input: DeleteProvidersInput!
    $condition: ModelProvidersConditionInput
  ) {
    deleteProviders(input: $input, condition: $condition) {
      id
      provider
      eventid
      description
      token
      location
      images
      clients
      createdAt
      updatedAt
    }
  }
`;
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      id
      channelID
      author
      receiver
      body
      status
      createdAt
      updatedAt
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      id
      channelID
      author
      receiver
      body
      status
      createdAt
      updatedAt
    }
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
      id
      channelID
      author
      receiver
      body
      status
      createdAt
      updatedAt
    }
  }
`;
export const createUserA = /* GraphQL */ `
  mutation CreateUserA(
    $input: CreateUserAInput!
    $condition: ModelUserAConditionInput
  ) {
    createUserA(input: $input, condition: $condition) {
      id
      token
      having
      email
      eventid
      createdAt
      updatedAt
    }
  }
`;
export const updateUserA = /* GraphQL */ `
  mutation UpdateUserA(
    $input: UpdateUserAInput!
    $condition: ModelUserAConditionInput
  ) {
    updateUserA(input: $input, condition: $condition) {
      id
      token
      having
      email
      eventid
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserA = /* GraphQL */ `
  mutation DeleteUserA(
    $input: DeleteUserAInput!
    $condition: ModelUserAConditionInput
  ) {
    deleteUserA(input: $input, condition: $condition) {
      id
      token
      having
      email
      eventid
      createdAt
      updatedAt
    }
  }
`;
export const createUserB = /* GraphQL */ `
  mutation CreateUserB(
    $input: CreateUserBInput!
    $condition: ModelUserBConditionInput
  ) {
    createUserB(input: $input, condition: $condition) {
      id
      likes
      token
      email
      createdAt
      updatedAt
    }
  }
`;
export const updateUserB = /* GraphQL */ `
  mutation UpdateUserB(
    $input: UpdateUserBInput!
    $condition: ModelUserBConditionInput
  ) {
    updateUserB(input: $input, condition: $condition) {
      id
      likes
      token
      email
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserB = /* GraphQL */ `
  mutation DeleteUserB(
    $input: DeleteUserBInput!
    $condition: ModelUserBConditionInput
  ) {
    deleteUserB(input: $input, condition: $condition) {
      id
      likes
      token
      email
      createdAt
      updatedAt
    }
  }
`;
export const createUserC = /* GraphQL */ `
  mutation CreateUserC(
    $input: CreateUserCInput!
    $condition: ModelUserCConditionInput
  ) {
    createUserC(input: $input, condition: $condition) {
      id
      email
      createdAt
      updatedAt
    }
  }
`;
export const updateUserC = /* GraphQL */ `
  mutation UpdateUserC(
    $input: UpdateUserCInput!
    $condition: ModelUserCConditionInput
  ) {
    updateUserC(input: $input, condition: $condition) {
      id
      email
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserC = /* GraphQL */ `
  mutation DeleteUserC(
    $input: DeleteUserCInput!
    $condition: ModelUserCConditionInput
  ) {
    deleteUserC(input: $input, condition: $condition) {
      id
      email
      createdAt
      updatedAt
    }
  }
`;
