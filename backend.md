## **Database Design**

### **Tables**

#### Users Table

| Field     | Type         | Description                   |
| --------- | ------------ | ----------------------------- |
| id        | INT          | Primary key                   |
| name      | VARCHAR(100) | User's full name              |
| email     | VARCHAR(100) | User's email                  |
| password  | VARCHAR(255) | Encrypted password            |
| balance   | DECIMAL      | User's total balance          |
| createdAt | TIMESTAMP    | Timestamp of account creation |
| updatedAt | TIMESTAMP    | Timestamp of last update      |

#### Invests Table

| Field          | Type      | Description                                |
| -------------- | --------- | ------------------------------------------ |
| id             | INT       | Primary key                                |
| userId         | INT       | Foreign key referencing Users(id)          |
| amount         | DECIMAL   | Investment amount                          |
| interestRateId | INT       | Foreign key referencing InterestRates(id)  |
| status         | VARCHAR   | Status ("pending", "approved", "rejected") |
| createdAt      | TIMESTAMP | Timestamp of investment creation           |

#### Transactions Table

| Field     | Type      | Description                                |
| --------- | --------- | ------------------------------------------ |
| id        | INT       | Primary key                                |
| userId    | INT       | Foreign key referencing Users(id)          |
| amount    | DECIMAL   | Amount deposited or withdrawn              |
| type      | VARCHAR   | Transaction type ("deposit", "withdraw")   |
| status    | VARCHAR   | Status ("pending", "approved", "rejected") |
| createdAt | TIMESTAMP | Timestamp of transaction creation          |

#### Table

| Field     | Type      | Description                        |
| --------- | --------- | ---------------------------------- |
| id        | INT       | Primary key                        |
| minAmount | DECIMAL   | Minimum balance for the rate       |
| maxAmount | DECIMAL   | Maximum balance for the rate       |
| rate      | FLOAT     | Interest rate (e.g., 0.10 for 10%) |
| createdAt | TIMESTAMP | Timestamp of rate creation         |

---
