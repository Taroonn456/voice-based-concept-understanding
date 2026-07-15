import { Concept } from "../types";

export const PREDEFINED_CONCEPTS: Concept[] = [
  {
    id: "ml",
    name: "Machine Learning",
    category: "Artificial Intelligence",
    description: "The science of getting computers to learn from data without explicit programming.",
    referenceText: "Machine learning is a subset of artificial intelligence where algorithms learn patterns from data to make predictions or decisions without being explicitly programmed. It includes supervised learning (using labeled training data), unsupervised learning (finding hidden structures in unlabeled data), and reinforcement learning (learning from feedback, rewards, and punishments).",
    keyPoints: [
      "Subset of Artificial Intelligence (AI)",
      "Learning from data patterns without explicit programming",
      "Supervised learning with labeled datasets",
      "Unsupervised learning for hidden structures in unlabeled data",
      "Reinforcement learning through trial, feedback, or rewards"
    ]
  },
  {
    id: "cc",
    name: "Cloud Computing",
    category: "Infrastructure",
    description: "On-demand delivery of computing services over the internet.",
    referenceText: "Cloud computing is the on-demand delivery of computing services—including servers, storage, databases, networking, software, and analytics—over the internet. Instead of buying and maintaining physical data centers, businesses rent access to these resources from cloud providers like AWS, Azure, or GCP, paying only for what they use. It features high scalability, resource elasticity, and global accessibility.",
    keyPoints: [
      "On-demand delivery of IT services (compute, storage, databases) over the internet",
      "Pay-as-you-go pricing model (pay only for used resources)",
      "Elimination of physical data center ownership and maintenance",
      "High scalability and resource elasticity (scaling up or down dynamically)",
      "Major cloud providers (such as AWS, Microsoft Azure, Google Cloud)"
    ]
  },
  {
    id: "bigo",
    name: "Big O Notation",
    category: "Computer Science Theory",
    description: "A mathematical notation used to describe algorithm time and space complexity.",
    referenceText: "Big O notation is a mathematical notation used to describe the limiting behavior of a function when the argument tends towards a particular value or infinity. In computer science, it is used to analyze and classify the time complexity (execution speed) and space complexity (memory usage) of algorithms relative to the size of the input (N). Common classes include O(1), O(log N), O(N), O(N log N), and O(N^2).",
    keyPoints: [
      "Mathematical notation for limiting behavior / worst-case execution bounds",
      "Used to classify time complexity (execution growth) and space complexity (memory growth)",
      "Relative to the input size (commonly denoted as N)",
      "Allows comparison of algorithms independent of hardware performance",
      "Common growth classes (e.g., Constant O(1), Logarithmic O(log N), Linear O(N), Quadratic O(N^2))"
    ]
  },
  {
    id: "rest",
    name: "REST API",
    category: "Web Development",
    description: "An architectural style for designing stateful and scalable networked APIs.",
    referenceText: "A REST API (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server communication protocol, almost always HTTP. It uses standard HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations on resources identified by URIs, representing resource state as JSON or XML.",
    keyPoints: [
      "Architectural style for web services based on Representational State Transfer",
      "Stateless client-server communication using standard HTTP protocol",
      "Identification of resources using Uniform Resource Identifiers (URIs)",
      "Standard HTTP verbs/methods (GET for reading, POST for creating, PUT for updating, DELETE for deleting)",
      "Data representation typically transferred in standard formats (JSON or XML)"
    ]
  },
  {
    id: "db_norm",
    name: "Database Normalization",
    category: "Databases",
    description: "The process of organizing relational database fields to reduce redundancy.",
    referenceText: "Database normalization is the process of structuring a relational database in accordance with a series of normal forms (such as 1NF, 2NF, 3NF, and BCNF) to reduce data redundancy and improve data integrity. It involves dividing large tables into smaller tables and defining relationships between them, ensuring that data dependencies make logical sense and avoiding insertion, update, or deletion anomalies.",
    keyPoints: [
      "Process of organizing columns and tables in a relational database",
      "Primary goals: reduce data redundancy and eliminate duplicate storage",
      "Improve data integrity and prevent anomalies (insert, update, delete anomalies)",
      "Progressing through structured normal forms (First 1NF, Second 2NF, Third 3NF)",
      "Dividing tables and establishing clear primary/foreign key relationships"
    ]
  }
];
