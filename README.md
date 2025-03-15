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
3. Install the dependencies:
  ```sh
  npm install
  ```
4. Build and start the application using Docker Compose:
  ```sh
  docker compose up
  ```
5. The `docker compose` command will:
   - Run the `init-script.sh` file, which will create a PostgreSQL database if it does not already exist and run the migration files.
   - Pull Redis (for caching) and pgAdmin (for database management) images.

6. App will be ready once you see:
  ```sh
  ✅ Database connected successfully! | 🚀 Server is running on port 3000
  ```
   - ✅ Database connected successfully!
   - 🚀 Server is running on port 3000

7. You can test the application using the provided Postman collection.
