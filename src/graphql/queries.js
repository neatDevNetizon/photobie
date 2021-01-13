/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEvents = /* GraphQL */ `
  query GetEvents($id: ID!) {
    getEvents(id: $id) {
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
export const listEventss = /* GraphQL */ `
  query ListEventss(
    $filter: ModelEventsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEventss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getUsers = /* GraphQL */ `
  query GetUsers($id: ID!) {
    getUsers(id: $id) {
      id
      email
      type
      name
      address
      age
      photo
      payment
      createdAt
      updatedAt
    }
  }
`;
export const listUserss = /* GraphQL */ `
  query ListUserss(
    $filter: ModelUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        type
        name
        address
        age
        photo
        payment
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProviders = /* GraphQL */ `
  query GetProviders($id: ID!) {
    getProviders(id: $id) {
      id
      provider
      eventid
      description
      capacity
      token
      location
      images
      createdAt
      updatedAt
    }
  }
`;
export const listProviderss = /* GraphQL */ `
  query ListProviderss(
    $filter: ModelProvidersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProviderss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        provider
        eventid
        description
        capacity
        token
        location
        images
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        channelID
        author
        receiver
        body
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const messagesByChannelId = /* GraphQL */ `
  query MessagesByChannelId(
    $channelID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByChannelID(
      channelID: $channelID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        channelID
        author
        receiver
        body
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
