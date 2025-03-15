# Library Management
### How to Run

1. Clone the repository:
  ```sh
  git clone https://github.com/yourusername/library-management.git
  ```
2. Navigate to the project directory:
  ```sh
  cd library-management
  ```
3. Build and start the application using Docker Compose:
  ```sh
  docker-compose up --build
  ```
4. The `docker-compose` command will run the `init-script.sh` file, which will create a PostgreSQL database if it does not already exist and run the migration files.

5. Go to `http://localhost:3000` to see the application running.

6. You can test the application using the provided Postman collection.
