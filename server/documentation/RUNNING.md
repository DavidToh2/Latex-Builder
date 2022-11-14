## Installing Docker
- Install docker by following docker-desktop by following [this](https://docs.docker.com/desktop/install/linux-install/)

## Environmental Variables
Write the following in `.env` in the application's root directory.
`
MONGO_INITDB_ROOT_USERNAME=admin_user
MONGO_INITDB_ROOT_PASSWORD=admin_password
`

## Running the Application
- Run using `docker compose up`

## Exploring the Database
- We can use [MongoDB Compass](https://www.mongodb.com/products/compass)
- Connect using the string `mongodb://admin_user:admin_password@localhost:27017`
