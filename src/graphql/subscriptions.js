/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEvents = /* GraphQL */ `
  subscription OnCreateEvents {
    onCreateEvents {
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
      final
      upticktoken
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateEvents = /* GraphQL */ `
  subscription OnUpdateEvents {
    onUpdateEvents {
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
      final
      upticktoken
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteEvents = /* GraphQL */ `
  subscription OnDeleteEvents {
    onDeleteEvents {
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
      final
      upticktoken
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUsers = /* GraphQL */ `
  subscription OnCreateUsers {
    onCreateUsers {
      id
      email
      type
      name
      city
      zipcode
      country
      age
      photo
      payment
      verified
      favortype
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUsers = /* GraphQL */ `
  subscription OnUpdateUsers {
    onUpdateUsers {
      id
      email
      type
      name
      city
      zipcode
      country
      age
      photo
      payment
      verified
      favortype
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUsers = /* GraphQL */ `
  subscription OnDeleteUsers {
    onDeleteUsers {
      id
      email
      type
      name
      city
      zipcode
      country
      age
      photo
      payment
      verified
      favortype
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProviders = /* GraphQL */ `
  subscription OnCreateProviders {
    onCreateProviders {
      id
      provider
      eventid
      description
      token
      images
      clients
      capacity
      status
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateProviders = /* GraphQL */ `
  subscription OnUpdateProviders {
    onUpdateProviders {
      id
      provider
      eventid
      description
      token
      images
      clients
      capacity
      status
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteProviders = /* GraphQL */ `
  subscription OnDeleteProviders {
    onDeleteProviders {
      id
      provider
      eventid
      description
      token
      images
      clients
      capacity
      status
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage {
    onCreateMessage {
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
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage {
    onUpdateMessage {
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
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage {
    onDeleteMessage {
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
export const onCreateUserA = /* GraphQL */ `
  subscription OnCreateUserA {
    onCreateUserA {
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
export const onUpdateUserA = /* GraphQL */ `
  subscription OnUpdateUserA {
    onUpdateUserA {
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
export const onDeleteUserA = /* GraphQL */ `
  subscription OnDeleteUserA {
    onDeleteUserA {
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
export const onCreateUserB = /* GraphQL */ `
  subscription OnCreateUserB {
    onCreateUserB {
      id
      likes
      token
      email
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUserB = /* GraphQL */ `
  subscription OnUpdateUserB {
    onUpdateUserB {
      id
      likes
      token
      email
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUserB = /* GraphQL */ `
  subscription OnDeleteUserB {
    onDeleteUserB {
      id
      likes
      token
      email
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUserC = /* GraphQL */ `
  subscription OnCreateUserC {
    onCreateUserC {
      id
      email
      token
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUserC = /* GraphQL */ `
  subscription OnUpdateUserC {
    onUpdateUserC {
      id
      email
      token
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUserC = /* GraphQL */ `
  subscription OnDeleteUserC {
    onDeleteUserC {
      id
      email
      token
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTransaction = /* GraphQL */ `
  subscription OnCreateTransaction {
    onCreateTransaction {
      id
      userid
      eventid
      amount
      date
      status
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTransaction = /* GraphQL */ `
  subscription OnUpdateTransaction {
    onUpdateTransaction {
      id
      userid
      eventid
      amount
      date
      status
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTransaction = /* GraphQL */ `
  subscription OnDeleteTransaction {
    onDeleteTransaction {
      id
      userid
      eventid
      amount
      date
      status
      createdAt
      updatedAt
    }
  }
`;
