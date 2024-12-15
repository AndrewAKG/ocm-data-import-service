# OCM Data Import Service

## Service Goal

The service focuses on developing a scalable backend to process electric vehicle (EV) charging points data efficiently. Its primary goals are to enable seamless data ingestion, transformation, and storage. This service aims to enhance the organization’s ability to handle growing datasets, and support strategic decision-making in EV infrastructure management.

## Service High Level Architecture Overview

![System Architecture Diagram](docs/assets/architecture-overview.jpeg)

## Service Code Heirarchy

```
src/
├── __tests__/                   # E2E test cases for the service
├── common/                      # Shared functionality used across Producer and Consumer
│   ├── __tests__/               # Unit tests for common utilities and services
│   ├── config/                  # Configuration files and constants
│   ├── models/                  # Shared Mongoose models
│   ├── services/                # Shared services (e.g., RabbitMQ, OCM API)
│   ├── transformers/            # Data transformation utilities
│   ├── types/                   # Shared TypeScript interfaces and types
│   ├── utils/                   # Utility functions (e.g., helpers, error handlers)
├── consumer/                    # Consumer Service
│   ├── services/                # Consumer-specific business logic and services
│   ├── types/                   # Consumer-specific TypeScript interfaces and types
│   ├── index.ts                 # Entry point for the Consumer Service
├── mocks/                       # Mock data for testing
│   ├── poi.json                 # Mock POI data
│   ├── reference-data.json      # Mock reference data
├── producer/                    # Producer Service
│   ├── __tests__/               # Unit tests for Producer-specific services
│   ├── models/                  # Producer-specific Mongoose models
│   ├── services/                # Producer-specific business logic and services
│   ├── types/                   # Producer-specific TypeScript interfaces and types
│   ├── utils/                   # Utility functions specific to the Producer
│   ├── index.ts                 # Entry point for the Producer Service
```

## OCM API Documentation

https://openchargemap.org/site/develop/api#/

## Database Structure

Database schemas are under src/common/models for all collections except data partition collection under src/producer/models

### Existing Relations

- POIs has direct relations with all reference data using the following fields (already existing in the ocm data)

```
  DataProviderID: number; // data provider for the poi
  OperatorID: number; // operator for the poi
  UsageTypeID: number; // usage type for the poi (payAtLocation, membership required, etc..)
  StatusTypeID: number; // is the poi operational or not yet
  SubmissionStatusTypeID: number; // is the poi live or not yet
```

### Introduced Relations (during import process)

- separating comments from inside poi data and put it in separate collection (add reference in comment document using PoiID)
- separating media items from inside poi data and put it in separate collection (add reference in media item document using PoiID)
- separating connections (equipments) from inside poi data and put it in separate collection (add reference in connection document using PoiID)

### Indices (what fields and why)

1. AddressInfo
   Fields: Town, StateOrProvince, CountryID, latitude, longitude
   Purpose:
   To enable filtering POI data based on commonly used location-based fields such as town, state, country, and geographic coordinates.
2. ChargerType
   Fields: IsFastChargeCapable
   Purpose:
   To allow filtering POI data by fast charging capability, which is a key requirement for users seeking high-speed charging stations.
3. Comment
   Fields: PoiID
   Purpose:
   To link user comments to a specific POI, enabling retrieval of reviews or feedback related to that POI.
4. Connection
   Fields: PoiID
   Purpose:
   To fetch connection details (e.g., charging specifications) related to a specific POI.
5. MediaItem
   Fields: PoiID
   Purpose:
   To associate media items (e.g., images, videos) with a specific POI, enhancing data with visual or informational content.
6. Country
   Fields: ISOCode
   Purpose:
   To facilitate filtering of POI data by country ISO code, supporting country-specific queries.
7. SubmissionStatus
   Fields: IsLive
   Purpose:
   To enable retrieval of only live and active POIs, ensuring the returned data is up-to-date.
8. UsageType
   Fields: IsPayAtLocation, IsMembershipRequired, IsAccessKeyRequired
   Purpose:
   To allow filtering of POIs based on usage types, such as whether payment, membership, or access keys are required.

## Local Development Guide

## Deployment Instructions

## GraphQL Integration Support (Not Implemented Just Elaboration)

1. Schema Definition
   A GraphQL schema is defined to represent the structure of the imported POI data.
   Types for POI, AddressInfo, Connection, MediaItem, and other related reference data (e.g., ChargerTypes, StatusTypes) are created to reflect the relationships within the data.

2. Data Fetching
   The GraphQL resolvers are implemented to fetch the POI data from MongoDB. The data can be queried either partially or fully based on the client’s request.
   Resolvers utilize the existing Mongoose models for POI and its related entities (e.g., AddressInfo, Connections).
   Filters and arguments such as limit, country, or id allow clients to retrieve relevant data dynamically.

3. Query Flexibility
   Clients can fetch only the required fields to minimize payload size

4. Integration with Existing Services
   The GraphQL layer integrates seamlessly with the existing Ingestion Service and MongoDB.
   Cached results and efficient querying ensure high performance when serving data.

5. Endpoint Exposure
   The GraphQL server runs alongside the existing services (e.g., Producer, and Consumer) in the application.
   The endpoint is exposed as /graphql within the service infrastructure.

## Scalability

Scalability (horizontal scaling) can be acheived by increasing number of consumers which is responsible for data fetching/ingesting for specific data partition. To acheive that we need to partition data that OCM API has. Since OCM API doesn't support
pagination, we could acheive that using a different technique. In this service we used boundingbox param to divide the world map
by bounding boxes with max threshold for data retrieved using a bounding box. A producer service will be responsible for this and
pushing the data partitions to a queue, which in returns is consumed by any number of consumers for concurrent and reliable import process.

## Monitoring and Logging

## How API calls are minimized and payloads are optimized?

API calls are minimized by experimenting how many results we can get in a single api call without our system crashing or exceeding
maximum payload size. We choose 50000 results (could be increased when monitoring memory and according to deployment instance CPU and RAM) as a good average without exceeding max payload size and not overloading service memory.

Payloads and network costs are optimized by using `compact=true` param which doesn't return expanded objects, where we fetch those
reference objects one time only in the producer service and saving only their reference IDs in POI data. By doing this we are decreasing the payload size and then can increase the max number of results we can get in single api call.

## Future Work and Improvements
