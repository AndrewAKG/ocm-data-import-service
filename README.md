# OCM Data Import Service

## Service Goal

The service focuses on developing a scalable backend to process electric vehicle (EV) charging points data efficiently. Its primary goals are to enable seamless data ingestion, transformation, and storage. This service aims to enhance the organization’s ability to handle growing datasets, and support strategic decision-making in EV infrastructure management.

## Service High Level Architecture Overview

![System Architecture Diagram](assets/Architecture_Overview.jpeg)

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

## API Documentation

## Database Structure

## Local Development Guide

## Deployment Instructions

## GrapghQL Integration Support

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
