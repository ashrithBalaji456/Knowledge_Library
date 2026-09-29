import { Relationship, LearningPath } from '../types/library';

export const INITIAL_RELATIONSHIPS: Relationship[] = [
  // Java Progression
  {
    id: 'rel-1',
    sourceId: 'res-java-1', // Effective Java
    targetId: 'res-java-3', // Java Generics and Collections
    type: 'BUILDS_ON',
    reason: 'Effective Java assumes a solid grasp of generics and the collections framework hierarchy.'
  },
  {
    id: 'rel-2',
    sourceId: 'res-java-3', // Java Generics and Collections
    targetId: 'res-java-5', // Modern Java in Action (Streams)
    type: 'NEXT',
    reason: 'Once collections and generics are mastered, functional streams and declarative pipelines are the natural progression.'
  },
  {
    id: 'rel-3',
    sourceId: 'res-java-1', // Effective Java
    targetId: 'res-java-2', // Java Concurrency in Practice
    type: 'NEXT',
    reason: 'Follows item-level clean code with rigorous thread safety, lock-free idioms, and memory barriers.'
  },
  {
    id: 'rel-4',
    sourceId: 'res-java-2', // Java Concurrency
    targetId: 'res-java-4', // Optimizing Java JVM
    type: 'ADVANCED',
    reason: 'Concurrency mechanics directly lead into JVM JIT compilation, mechanical sympathy, and GC memory allocation.'
  },
  {
    id: 'rel-5',
    sourceId: 'res-java-1', // Effective Java
    targetId: 'res-sp-1',   // Spring in Action
    type: 'PREREQUISITE',
    reason: 'Spring Boot dependency injection and design patterns build heavily on core Java OOP best practices.'
  },

  // Spring Ecosystem
  {
    id: 'rel-6',
    sourceId: 'res-sp-1', // Spring in Action
    targetId: 'res-sp-2', // Spring Security in Action
    type: 'NEXT',
    reason: 'After configuring Spring REST controllers and data access, securing services with OAuth2 filter chains is required.'
  },
  {
    id: 'rel-7',
    sourceId: 'res-sp-2', // Spring Security in Action
    targetId: 'res-sec-1', // OAuth 2.0 in Action
    type: 'BUILDS_ON',
    reason: 'Deeply explains the underlying RFC 6749 protocols that Spring Security filters implement under the hood.'
  },
  {
    id: 'rel-8',
    sourceId: 'res-sp-1', // Spring in Action
    targetId: 'res-sp-3', // Spring Microservices in Action
    type: 'NEXT',
    reason: 'Deploys Spring Boot monolithic applications into distributed, resilient microservices.'
  },

  // DSA Progression
  {
    id: 'rel-9',
    sourceId: 'res-dsa-1', // CLRS
    targetId: 'res-dsa-2', // Graph Theory
    type: 'NEXT',
    reason: 'Builds upon asymptotic complexity to explore BFS, DFS, Dijkstra, and DAG topologies.'
  },
  {
    id: 'rel-10',
    sourceId: 'res-dsa-2', // Graph Theory
    targetId: 'res-dsa-3', // Dynamic Programming
    type: 'ADVANCED',
    reason: 'Graph DAG traversals provide the mental framework for understanding dynamic programming state transitions.'
  },
  {
    id: 'rel-11',
    sourceId: 'res-dsa-2', // Graph Theory
    targetId: 'res-dsa-4', // Cracking Coding Interview
    type: 'PRACTICAL',
    reason: 'Applies theoretical algorithms directly to interview problem sets and coding tests.'
  },
  {
    id: 'rel-12',
    sourceId: 'res-dsa-4', // Cracking Coding Interview
    targetId: 'res-ext-3', // Personal Notes
    type: 'COMPLEMENTS',
    reason: 'Personal revision notes summarizing edge cases and pitfalls from LeetCode practice.'
  },

  // System Design & Databases
  {
    id: 'rel-13',
    sourceId: 'res-sys-1', // Designing Data-Intensive Applications
    targetId: 'res-sys-2', // System Design Interview
    type: 'PRACTICAL',
    reason: 'DDIA provides the theoretical foundations which Alex Xu\'s blueprints apply to concrete architectures.'
  },
  {
    id: 'rel-14',
    sourceId: 'res-sys-1', // DDIA
    targetId: 'res-db-1', // Database Internals
    type: 'DEEPER_DIVE',
    reason: 'Investigates the B-Tree vs LSM-Tree engine physics behind the distributed databases discussed in DDIA.'
  },
  {
    id: 'rel-15',
    sourceId: 'res-db-1', // Database Internals
    targetId: 'res-db-3', // Redis in Action
    type: 'RELATED',
    reason: 'Compares disk-based persistent storage engines with in-memory caching and Redis data structures.'
  },
  {
    id: 'rel-16',
    sourceId: 'res-sys-1', // DDIA
    targetId: 'res-sys-4', // Kafka Guide
    type: 'NEXT',
    reason: 'Extends stream processing and event sourcing chapters into enterprise Kafka log clusters.'
  },
  {
    id: 'rel-17',
    sourceId: 'res-sys-2', // System Design Interview
    targetId: 'res-ext-1', // Cheatsheets & Architecture Diagrams
    type: 'COMPLEMENTS',
    reason: 'Google Drive diagrams and back-of-the-envelope calculation tables for interview preparation.'
  },

  // DevOps & Cloud
  {
    id: 'rel-18',
    sourceId: 'res-dev-2', // Docker Deep Dive
    targetId: 'res-dev-1', // Kubernetes in Action
    type: 'PREREQUISITE',
    reason: 'Understanding Linux container namespaces and cgroups is essential before orchestrating with Kubernetes.'
  },
  {
    id: 'rel-19',
    sourceId: 'res-dev-1', // Kubernetes in Action
    targetId: 'res-dev-3', // SRE Google
    type: 'NEXT',
    reason: 'Orchestrating containers in production requires Google SRE observability, SLOs, and incident workflows.'
  },
  {
    id: 'rel-20',
    sourceId: 'res-cloud-1', // AWS CSA
    targetId: 'res-cloud-3', // Terraform
    type: 'PRACTICAL',
    reason: 'Automates AWS cloud topologies declaratively through infrastructure-as-code modules.'
  },

  // AI / ML
  {
    id: 'rel-21',
    sourceId: 'res-ai-1', // Deep Learning (Goodfellow)
    targetId: 'res-ai-2', // Attention Is All You Need
    type: 'NEXT',
    reason: 'Mastering backpropagation and deep feedforward networks is required to appreciate transformer self-attention.'
  },
  {
    id: 'rel-22',
    sourceId: 'res-ai-2', // Attention Paper
    targetId: 'res-ai-3', // Building LLM Applications
    type: 'PRACTICAL',
    reason: 'Takes raw transformer model concepts and applies them into production RAG pipelines and AI agents.'
  }
];

export const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-python-to-ml',
    title: 'Python to Machine Learning & AI Specialist',
    description: 'A complete guided journey from core Python programming and 400 exercises to linear algebra, NumPy/Pandas, statistical learning, and advanced decision making.',
    icon: '🐍',
    targetRole: 'Machine Learning Engineer / Data Scientist',
    resourceIds: [
      'res-local-python-for-everybody-exploring-data-in-python-3',
      'res-local-python-3-400-exercises-and-solutions-for-beginners',
      'res-local-data-science-from-scratch-first-principles-with-python',
      'res-local-numpy-official-user-guide-reference',
      'res-local-linear-algebra-for-machine-learning',
      'res-local-statistical-and-machine-learning-in-python',
      'res-local-a-course-in-machine-learning',
      'res-local-machine-learning-yearning',
      'res-local-algorithms-for-optimization',
      'res-local-algorithms-for-decision-making'
    ]
  },
  {
    id: 'path-java-backend',
    title: 'Staff Java Backend Engineer',
    description: 'From core JVM mechanics, clean code patterns, and concurrency to production Spring Boot microservices and OAuth2 security.',
    icon: '☕',
    targetRole: 'Senior / Staff Backend Engineer',
    resourceIds: [
      'res-java-1',
      'res-java-3',
      'res-java-5',
      'res-java-2',
      'res-java-4',
      'res-sp-1',
      'res-sp-2',
      'res-sec-1',
      'res-sp-3'
    ]
  },
  {
    id: 'path-system-design',
    title: 'High-Scale Distributed Systems Architect',
    description: 'Master data storage engines, consensus protocols, caching layers, real-time Kafka streaming, and end-to-end system design.',
    icon: '🏗️',
    targetRole: 'Distributed Systems Architect',
    resourceIds: [
      'res-sys-1',
      'res-db-1',
      'res-db-3',
      'res-sys-4',
      'res-sys-2',
      'res-ext-1',
      'res-ext-2',
      'res-sys-3'
    ]
  },
  {
    id: 'path-dsa-mastery',
    title: 'FAANG Algorithmic Mastery',
    description: 'Asymptotic complexity, graph theory, shortest path traversals, dynamic programming patterns, and coding interview readiness.',
    icon: '🧠',
    targetRole: 'Algorithmic Problem Solver',
    resourceIds: [
      'res-dsa-1',
      'res-dsa-2',
      'res-dsa-3',
      'res-dsa-4',
      'res-ext-3',
      'res-dsa-5'
    ]
  },
  {
    id: 'path-cloud-devops',
    title: 'Cloud Native & SRE Specialist',
    description: 'Containers, Kubernetes clusters, infrastructure-as-code with Terraform, AWS architecture, and Google SRE reliability engineering.',
    icon: '☁️',
    targetRole: 'DevOps / Cloud Architect',
    resourceIds: [
      'res-dev-2',
      'res-dev-1',
      'res-cloud-1',
      'res-cloud-3',
      'res-dev-3'
    ]
  },
  {
    id: 'path-modern-ai',
    title: 'Generative AI & LLM Systems Engineer',
    description: 'Deep learning foundations, transformer attention architecture, vector databases, RAG systems, and AI agent frameworks.',
    icon: '🤖',
    targetRole: 'AI Application Engineer',
    resourceIds: [
      'res-ai-1',
      'res-ai-2',
      'res-ai-3',
      'res-ai-4'
    ]
  }
];
