# Application overview -

-   A backend server api for a Ecommerce website .
-   Distributed microservice architecture for high scalability.
-   Build on five services - _Products_ , _Customer_ , _Shopping_ , _Payments_ , _Notification_.
-   All microserives are highly decoupled.
-   This app follows the Event driven architecture.
-   An event-driven architecture uses events to trigger and communicate between decoupled services
-   **RabbitMq** is used as Message Queue for triggering events.
-   **NGINX** is used as reverse proxy for directing the requests over to the services.

    [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/15798447-f3bb0199-1fa0-4a6f-bd9e-53b9150aa852?action=collection%2Ffork&collection-url=entityId%3D15798447-f3bb0199-1fa0-4a6f-bd9e-53b9150aa852%26entityType%3Dcollection%26workspaceId%3D3700ddd4-1040-4ed4-aa63-2a0d2425cf01)

-   **Postman Collections:** [https://elements.getpostman.com/redirect?entityId=15798447-f3bb0199-1fa0-4a6f-bd9e-53b9150aa852&entityType=collection](https://elements.getpostman.com/redirect?entityId=15798447-f3bb0199-1fa0-4a6f-bd9e-53b9150aa852&entityType=collection)

    **ENV files:** [https://drive.google.com/drive/folders/1DfITAPQVsh9Ty2ZlyioX3NVpkDoZTpgX?usp=sharing](https://drive.google.com/drive/folders/1DfITAPQVsh9Ty2ZlyioX3NVpkDoZTpgX?usp=sharing)

## Setup Instructions

-   S1 Clone the project.
-   S2 Create a file .env in the root folder of all four services.ie ./Payments/.env .
-   S3 Make sure that docker is installed in the system.
-   S4 Open terminal in root folder of the project where docker-compose.yml file is present and run following commands.

```bash

# make sure that port 8080 is free for this application and ports are free as per the docker-compose.yml.
docker compose build --no-cache
docker compose up
```

### To verify that all four services are running properly open the following four links in the browser

-   _http://localhost:8000/customer/status_
-   _http://localhost:8000/products/status_
-   _http://localhost:8000/payments/status_
-   _http://localhost:8000/shopping/status_

Each of them would give a message like : Customer service running properly , Products service running properly , Payments service running properly , Shopping service running properly

```bash

# To close application

docker compose down
```
## Architechture of Microservice
![Untitled Diagram drawio (2)](https://res.cloudinary.com/abhistrike/image/upload/v1678277975/Microservice_Architecture_1.25x_zb0hhg.png)
