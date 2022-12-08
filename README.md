## Application overview -

- A backend server api for a Ecommerce website .
- Distributed microservice architecture for high scalability.
- Build on four services - *Products* , *Customer* , *Shopping* , *Payments*.
- All microserives are highly decoupled.
- This app follows the Event driven architecture.
- An event-driven architecture uses events to trigger and communicate between decoupled services
- **RabbitMq** is used as Message Queue for triggering events.
- **NGINX** is used as reverse proxy for directing the requests over to the services.

  [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/15798447-f3bb0199-1fa0-4a6f-bd9e-53b9150aa852?action=collection%2Ffork&collection-url=entityId%3D15798447-f3bb0199-1fa0-4a6f-bd9e-53b9150aa852%26entityType%3Dcollection%26workspaceId%3D3700ddd4-1040-4ed4-aa63-2a0d2425cf01)
- **Postman Collections:** [https://elements.getpostman.com/redirect?entityId=15798447-f3bb0199-1fa0-4a6f-bd9e-53b9150aa852&entityType=collection](https://elements.getpostman.com/redirect?entityId=15798447-f3bb0199-1fa0-4a6f-bd9e-53b9150aa852&entityType=collection)

## Setup Instructions

- S1 Clone the project.
- S2 Create a file .env in the root folder of all four services.ie ./Payments/.env .
- S3 Make sure that docker is installed in the system.
- S4 Open terminal in root folder of the project where docker-compose.yml file is present and run following commands.

```bash

# make sure that port 8080 is free for this application.

docker compose up
```
# To verify that all four services are running properly open the following four links in the browser

- *http://localhost:8000/customer/status*
- *http://localhost:8000/products/status*
- *http://localhost:8000/payments/status*
- *http://localhost:8000/shopping/status*

Each of them would give a message like : Customer service running properly , Products service running properly , Payments service running properly , Shopping service running properly

```bash

# To close application

docker compose up
```
