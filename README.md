# 🎓 Microservice School Management Project

A scalable, production-ready microservices system for school management, built with **Node.js**, **Express**, **MongoDB**, **Kafka**, **Docker**, **Kubernetes**, and secured via **JWT**. All services are unified behind a single **GraphQL endpoint**.

---

## 🚀 Stack Summary

| Component     | Tech Used                 |
|---------------|--------------------------|
| Language      | Node.js                  |
| Framework     | Express.js               |
| API Gateway   | GraphQL + Nginx          |
| Security      | JWT                      |
| Messaging     | Apache Kafka             |
| Database      | MongoDB                  |
| Container     | Docker                   |
| Orchestration | Kubernetes (K8s)         |

---

## 🧱 Microservices

| Microservice   | Description                    | CRUD | Port   |
|----------------|-------------------------------|------|--------|
| student-service| Manages student records        | ✅   | `3001` |
| teacher-service| Handles teacher data           | ✅   | `3002` |
| course-service | Manages course catalog         | ✅   | `3003` |
| result-service | Stores results/grades          | ✅   | `3004` |
| graphql-gateway| Gateway combining all services | ✅   | `4000` |
| Kafka          | Event bus for async messages   | —    | `9092` |

---

## 🗂️ Project Structure

```bash
Microservice-Project/
│
├── student-service/
├── teacher-service/
├── course-service/
├── result-service/
├── graphql-gateway/         # Combines all services via GraphQL
├── shared/                  # Shared Kafka producer/consumer
├── nginx/                   # Nginx reverse proxy config
├── k8s/base/                # K8s YAML files for deployment
├── docker-compose.yml
├── .env
├── README.md
└── LICENSE
```

---

## 🔒 JWT Authentication

- Users must login to receive a JWT token.
- Each protected route requires a valid JWT.

---

## 📨 Kafka Topics (Examples)

| Event Type           | Kafka Topic      |
|----------------------|-----------------|
| Validate Teacher ID  | teacherid.check |
| Validate Student ID  | studentid.check |
| Course ID Validation | courseid.check  |

---

## 🚦 GraphQL Endpoint

- **URL:** [http://localhost:4000/graphql](http://localhost:4000/graphql)

**Example Query:**
```graphql
query {
  students {
    _id
    name
    age
  }
}
```

**Example Mutation:**
```graphql
mutation {
  addTeacher(name: "John", subject: "Math") {
    _id
    name
  }
}
```

---

## ⚙️ Environment Variables

Each service uses its own `.env` file. Example:

```
PORT=3001
MONGO_URI=mongodb://mongo:27017/studentdb
JWT_SECRET=your_jwt_secret
KAFKA_BROKER=kafka:9092
```

---

## 🐳 Running with Docker Compose

```sh
# Clone the repo
git clone https://github.com/GavinHemsada/Microservice-Project.git
cd Microservice-Project

# Start all services
docker-compose up --build
```

- Student: [http://localhost:3001](http://localhost:3001)
- GraphQL Gateway: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- Kafka: internal only
- MongoDB: internal (`localhost:27017` if exposed)

---

## ☸️ Kubernetes Setup

Start your cluster (Minikube or others):

```sh
minikube start
```

Apply all manifests:

```sh
kubectl apply -f k8s/base/
```

Check pods/services:

```sh
kubectl get pods
kubectl get svc
```

---

## 🧪 Testing

Each service contains its own test suite.

```sh
cd student-service
npm test
```

---

## 📄 License

See [LICENSE](LICENSE).

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

**Maintainers:**  
- [Your Name](mailto:your.email@example.com)
Event Type	Kafka Topic
Validate Teacher ID	teacherid.check
Validate Student ID	studentid.check
Course ID Validation	courseid.check

GraphQL Endpoint
📍 http://localhost:4000/graphql

query {
  students {
    _id
    name
    age
  }
}

mutation {
  addTeacher(name: "John", subject: "Math") {
    _id
    name
  }
}

Environment Variables
Each service uses its own .env file.

PORT=3001
MONGO_URI=mongodb://mongo:27017/studentdb
JWT_SECRET=your_jwt_secret
KAFKA_BROKER=kafka:9092

🐳 Running with Docker Compose

# Clone the repo
git clone https://github.com/GavinHemsada/Microservice-Project.git
cd Microservice-Project

# Start all services
docker-compose up --build

Student: http://localhost:3001

GraphQL Gateway: http://localhost:4000/graphql

Kafka: internal only

MongoDB: internal (localhost:27017 if exposed)

☸️ Kubernetes Setup
Start your cluster (Minikube or others):

bash
Copy
Edit
minikube start
Apply all manifests:

bash
Copy
Edit
kubectl apply -f k8s/base/
Check pods/services:

bash
Copy
Edit
kubectl get pods
kubectl get svc
🧪 Testing
Each service contains its own test suite.

bash
Copy
Edit
cd student-service
npm test