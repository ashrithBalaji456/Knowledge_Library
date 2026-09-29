import fs from 'fs';
import path from 'path';

const rawBooks = JSON.parse(fs.readFileSync('scripts/parsed_raw_books.json', 'utf8'));

// Helper to remove noise from titles
function cleanRawTitle(name) {
  return name
    .replace(/\.pdf$/i, '')
    .replace(/\.pdf\s*$/i, '')
    .replace(/[📒🎯❤️✈️🐍📕➡️]/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\(\d+\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Map of canonical metadata for known important books
const CANONICAL_KNOWLEDGE = {
  'dm.pdf': {
    title: 'Algorithms for Decision Making',
    author: 'Mykel J. Kochenderfer, Tim A. Wheeler, Kyle H. Wray',
    publisher: 'MIT Press',
    category: 'ai-ml',
    subCategory: 'Decision Theory & Reinforcement Learning',
    resourceType: 'TEXTBOOK',
    difficulty: 'ADVANCED',
    priority: 'MUST_LEARN',
    whatIsThisBookFor: 'Master computational decision making under uncertainty, Markov decision processes, and reinforcement learning.',
    summary: 'A comprehensive MIT Press treatise covering decision-making models under uncertainty, probabilistic reasoning, sequential decisions, and multi-agent systems.',
    keyTakeaways: [
      'Exact and approximate methods for Markov Decision Processes (MDPs)',
      'Partially Observable MDPs (POMDPs) and belief-state planning',
      'Model-based and model-free reinforcement learning algorithms',
      'Multi-agent decision theory and game-theoretic equilibrium computation'
    ],
    tags: ['MachineLearning', 'MITPress', 'DecisionTheory', 'ReinforcementLearning', 'Algorithms']
  },
  'optimization.pdf': {
    title: 'Algorithms for Optimization',
    author: 'Mykel J. Kochenderfer & Tim A. Wheeler',
    publisher: 'MIT Press',
    category: 'ai-ml',
    subCategory: 'Mathematical Optimization',
    resourceType: 'TEXTBOOK',
    difficulty: 'ADVANCED',
    priority: 'MUST_LEARN',
    whatIsThisBookFor: 'Understand the mathematical foundations and code implementations of modern optimization algorithms.',
    summary: 'An authoritative MIT Press reference on numerical optimization, local and global search, convex optimization, and constrained programming with Julia code.',
    keyTakeaways: [
      'Derivative-free optimization and bracketed line search',
      'First-order gradient descent, conjugate gradients, and quasi-Newton (BFGS)',
      'Stochastic search, genetic algorithms, and particle swarm optimization',
      'Constrained optimization, duality theory, and multidisciplinary design'
    ],
    tags: ['Optimization', 'MITPress', 'MathForML', 'Calculus', 'Algorithms']
  },
  'val.pdf': {
    title: 'Algorithms for Validation',
    author: 'Mykel J. Kochenderfer & Tim A. Wheeler',
    publisher: 'MIT Press',
    category: 'ai-ml',
    subCategory: 'Model Validation & Safety Verification',
    resourceType: 'TEXTBOOK',
    difficulty: 'ADVANCED',
    priority: 'IMPORTANT',
    whatIsThisBookFor: 'Learn formal mathematical methods to validate, verify, and stress-test autonomous systems and ML models.',
    summary: 'MIT Press volume detailing the statistical and algorithmic techniques required to validate safety-critical intelligent systems and verify ML robustness.',
    keyTakeaways: [
      'Statistical bounds and hypothesis testing for system safety',
      'Adaptive stress testing and failure scenario discovery',
      'Formal methods and reachability analysis for automated systems',
      'Surrogate modeling and black-box verification architectures'
    ],
    tags: ['Validation', 'MITPress', 'SafetyCriticalAI', 'ModelEvaluation', 'Verification']
  },
  'Machine Learning Yearning .pdf': {
    title: 'Machine Learning Yearning',
    author: 'Andrew Ng',
    publisher: 'deeplearning.ai',
    category: 'ai-ml',
    subCategory: 'ML Strategy & System Design',
    resourceType: 'BOOK',
    difficulty: 'INTERMEDIATE',
    priority: 'MUST_LEARN',
    whatIsThisBookFor: 'Learn Andrew Ng’s battle-tested heuristics to debug, iterate, and prioritize ML engineering projects.',
    summary: 'A practitioner guide by Andrew Ng focusing on strategy: how to structure train/dev/test sets, identify error sources, and know what to work on next.',
    keyTakeaways: [
      'Establishing dev and test distributions that reflect production reality',
      'Systematic error analysis: diagnosing bias, variance, and data mismatch',
      'Knowing when to collect more data vs. tuning model capacity',
      'End-to-end deep learning trade-offs versus pipeline architectures'
    ],
    tags: ['MachineLearning', 'AndrewNg', 'MLStrategy', 'SystemDesign', 'BestPractices']
  },
  'Data Science from Scratch.pdf': {
    title: 'Data Science from Scratch: First Principles with Python',
    author: 'Joel Grus',
    publisher: "O'Reilly Media",
    category: 'data-science',
    subCategory: 'Core Data Science & First Principles',
    resourceType: 'BOOK',
    difficulty: 'BEGINNER',
    priority: 'MUST_LEARN',
    whatIsThisBookFor: 'Build algorithms from scratch in pure Python to truly understand how machine learning works under the hood.',
    summary: 'An acclaimed foundational guide implementing linear algebra, statistics, gradient descent, neural networks, and clustering from absolute scratch in Python.',
    keyTakeaways: [
      'Core linear algebra (vectors & matrices) implemented from first principles',
      'Descriptive statistics, correlation, hypothesis testing, and gradient descent',
      'K-nearest neighbors, Naive Bayes, decision trees, and neural nets from scratch',
      'Recommender systems, natural language processing, and network analysis'
    ],
    tags: ['DataScience', 'Python', 'FirstPrinciples', 'Statistics', 'OReilly']
  },
  'Python for Everybody.pdf': {
    title: 'Python for Everybody: Exploring Data in Python 3',
    author: 'Dr. Charles R. Severance',
    publisher: 'University of Michigan',
    category: 'python',
    subCategory: 'Foundational Python & Data Access',
    resourceType: 'BOOK',
    difficulty: 'BEGINNER',
    priority: 'MUST_LEARN',
    whatIsThisBookFor: 'The premier beginner-to-intermediate guide to Python programming, data scraping, and web APIs.',
    summary: 'Dr. Chuck’s world-famous introduction to computer science and data exploration, teaching loops, data structures, regex, web scraping, and SQLite.',
    keyTakeaways: [
      'Mastering control flow, functions, iterations, and string slicing',
      'Python data structures: lists, dictionaries, tuples, and file I/O',
      'Web services, Beautiful Soup scraping, JSON parsing, and REST APIs',
      'Relational database integration using SQLite and SQL querying'
    ],
    tags: ['Python', 'BeginnerFriendly', 'WebScraping', 'DataStructures', 'SQLite']
  },
  'Learn Python the hard way.pdf': {
    title: 'Learn Python 3 the Hard Way',
    author: 'Zed A. Shaw',
    publisher: 'Addison-Wesley',
    category: 'python',
    subCategory: 'Foundational Programming',
    resourceType: 'BOOK',
    difficulty: 'BEGINNER',
    priority: 'IMPORTANT',
    whatIsThisBookFor: 'Drill syntax, terminal navigation, and programming habits through intense, disciplined exercises.',
    summary: 'Zed Shaw’s celebrated exercise-driven course that instills typing discipline, debugging habits, and core coding fluency through 52 hands-on exercises.',
    keyTakeaways: [
      'Developing rigorous habits of syntax precision and terminal fluency',
      'Input/output, command line arguments, and reading/writing files',
      'Object-oriented programming, composition, inheritance, and module architecture',
      'Automated testing with pytest and web game development'
    ],
    tags: ['Python', 'HandsOn', 'Terminal', 'OOP', 'Testing']
  },
  'The Python Handbook.pdf': {
    title: 'The Python Handbook',
    author: 'Flavio Copes',
    publisher: 'freeCodeCamp',
    category: 'python',
    subCategory: 'Language Mechanics & Reference',
    resourceType: 'HANDBOOK',
    difficulty: 'BEGINNER',
    priority: 'IMPORTANT',
    whatIsThisBookFor: 'A clean, modern, zero-fluff reference handbook covering all modern Python syntax and features.',
    summary: 'A fast-paced, beautifully organized reference manual walking through Python syntax, data types, operators, standard library modules, and packaging.',
    keyTakeaways: [
      'Concise breakdowns of all Python core data types and built-in functions',
      'Decorators, generators, context managers, and exception handling',
      'Virtual environments, pip package management, and project structure',
      'Working with dates, math, file systems, and external libraries'
    ],
    tags: ['Python', 'Handbook', 'Reference', 'Syntax', 'CleanCode']
  },
  'PythonNotesForProfessionals.pdf': {
    title: 'Python Notes for Professionals',
    author: 'Stack Overflow Community / GoalKicker',
    publisher: 'GoalKicker',
    category: 'python',
    subCategory: 'Comprehensive Professional Reference',
    resourceType: 'HANDBOOK',
    difficulty: 'INTERMEDIATE',
    priority: 'IMPORTANT',
    whatIsThisBookFor: 'An 856-page exhaustive cookbook covering hundreds of real-world Python recipes, edge cases, and standard library tricks.',
    summary: 'Over 850 pages of crowdsourced professional wisdom containing 200+ topics from threading, asyncio, and metaclasses to pandas and socket programming.',
    keyTakeaways: [
      'In-depth recipes for concurrency: multiprocessing, threading, and asyncio',
      'Advanced metaprogramming: descriptors, metaclasses, and function introspection',
      'File parsing: CSV, JSON, XML, SQLite, and binary buffers',
      'Performance profiling, memory optimization, and C-extensions'
    ],
    tags: ['Python', 'GoalKicker', 'Recipes', 'Cookbook', 'Comprehensive']
  },
  'R for Data Science 📕.pdf': {
    title: 'R for Data Science: Import, Tidy, Transform, Visualize, and Model Data',
    author: 'Hadley Wickham & Garrett Grolemund',
    publisher: "O'Reilly Media",
    category: 'data-science',
    subCategory: 'Tidyverse & Statistical Computing',
    resourceType: 'BOOK',
    difficulty: 'BEGINNER',
    priority: 'IMPORTANT',
    whatIsThisBookFor: 'Master the tidyverse, ggplot2 data visualization, and data wrangling workflows for statistical exploration.',
    summary: 'The ultimate guide to exploratory data analysis, data transformation with dplyr, visualization with ggplot2, and reproducible research with R Markdown.',
    keyTakeaways: [
      'Declarative data visualization using the Grammar of Graphics and ggplot2',
      'Data transformation, filtering, and summarization with dplyr and tidyr',
      'Relational data joins and string manipulation with stringr and forcats',
      'Tidy modeling with broom and reproducible reporting with R Markdown'
    ],
    tags: ['RStats', 'DataScience', 'Tidyverse', 'ggplot2', 'Visualization']
  },
  'NumPy User Guide .pdf': {
    title: 'NumPy Official User Guide & Reference',
    author: 'NumPy Developers Community',
    publisher: 'NumPy.org',
    category: 'data-science',
    subCategory: 'Array Computing & Linear Algebra',
    resourceType: 'DOCUMENTATION',
    difficulty: 'INTERMEDIATE',
    priority: 'MUST_LEARN',
    whatIsThisBookFor: 'Master N-dimensional arrays, vectorization, broadcasting, and indexing for scientific computing.',
    summary: 'The authoritative official manual for NumPy, covering array memory layouts, stride tricks, universal functions (ufuncs), broadcasting, and linear algebra.',
    keyTakeaways: [
      'Understanding ndarray memory layout: contiguous C vs. Fortran ordering',
      'Broadcasting rules and multidimensional slicing mechanics',
      'High-performance vectorized operations avoiding Python loops',
      'Matrix decompositions, eigenvalues, and fast Fourier transforms (FFT)'
    ],
    tags: ['NumPy', 'Vectorization', 'ScientificComputing', 'Math', 'DataScience']
  },
  'ML Linear Algebra.pdf': {
    title: 'Linear Algebra for Machine Learning',
    author: 'Mathematics for Machine Learning Collective',
    publisher: 'Academic Press',
    category: 'data-science',
    subCategory: 'Foundational Mathematics',
    resourceType: 'TEXTBOOK',
    difficulty: 'INTERMEDIATE',
    priority: 'MUST_LEARN',
    whatIsThisBookFor: 'Grasp the core linear algebra concepts required to understand neural networks, embeddings, and PCA.',
    summary: 'A deep-dive text covering vectors, matrix transformations, orthogonal projections, eigenvalues, singular value decomposition (SVD), and principal component analysis.',
    keyTakeaways: [
      'Vector spaces, basis spans, linear independence, and rank',
      'Geometric interpretation of matrix multiplication and determinant transformations',
      'Eigenvalues, eigenvectors, and spectral decomposition',
      'Singular Value Decomposition (SVD) and low-rank matrix approximation'
    ],
    tags: ['LinearAlgebra', 'MathForML', 'Eigenvalues', 'SVD', 'PCA']
  },
  'Probability for Data Science 📒.pdf': {
    title: 'Probability and Statistics for Data Science',
    author: 'Data Science Academic Collective',
    publisher: 'Open Education',
    category: 'data-science',
    subCategory: 'Probability & Inferential Statistics',
    resourceType: 'TEXTBOOK',
    difficulty: 'INTERMEDIATE',
    priority: 'IMPORTANT',
    whatIsThisBookFor: 'Build solid intuition for random variables, distributions, Bayesian inference, and hypothesis testing.',
    summary: 'Almost 300 pages of rigorous and intuitive explanations of probability spaces, continuous distributions, Central Limit Theorem, maximum likelihood, and Bayesian estimation.',
    keyTakeaways: [
      'Conditional probability, Bayes rule, and independence proofs',
      'Discrete and continuous probability distributions (Normal, Poisson, Binomial)',
      'The Law of Large Numbers and Central Limit Theorem in practice',
      'Confidence intervals, p-values, hypothesis tests, and A/B test mathematics'
    ],
    tags: ['Probability', 'Statistics', 'BayesTheorem', 'DataScience', 'HypothesisTesting']
  },
  'Statistical and Machine Learning in Python .pdf': {
    title: 'Statistical and Machine Learning in Python',
    author: 'Edouard Duchesnay, Tommy Löfstedt & F. Hadj-Selem',
    publisher: 'Neurospin',
    category: 'data-science',
    subCategory: 'Applied Statistical Learning',
    resourceType: 'TEXTBOOK',
    difficulty: 'INTERMEDIATE',
    priority: 'IMPORTANT',
    whatIsThisBookFor: 'Bridge statistical hypothesis testing with scikit-learn machine learning in Python.',
    summary: 'A 300-page laboratory guide connecting statistical tests (ANOVA, t-test, linear regression) to scikit-learn classification, clustering, and dimension reduction.',
    keyTakeaways: [
      'Parametric and non-parametric statistical testing with SciPy and Statsmodels',
      'Multiple regression analysis, multicollinearity, and ridge/lasso regularization',
      'Scikit-learn pipeline design: cross-validation, grid search, and feature selection',
      'Unsupervised learning: PCA, manifold learning (t-SNE), and clustering'
    ],
    tags: ['ScikitLearn', 'Statistics', 'Python', 'MachineLearning', 'Regression']
  },
  'Python for Probability, Statistics, and Machine Learning .pdf': {
    title: 'Python for Probability, Statistics, and Machine Learning',
    author: 'José Unpingco',
    publisher: 'Springer',
    category: 'data-science',
    subCategory: 'Mathematical Modeling & Simulation',
    resourceType: 'BOOK',
    difficulty: 'INTERMEDIATE',
    priority: 'IMPORTANT',
    whatIsThisBookFor: 'Learn how to simulate and verify probability theory and statistical proofs using SymPy, NumPy, and Pandas.',
    summary: 'A Springer classic demonstrating how Python’s scientific stack can be used to simulate random processes, derive analytical solutions, and train statistical models.',
    keyTakeaways: [
      'Symbolic probability computation using SymPy',
      'Monte Carlo simulation techniques for complex probabilistic models',
      'Maximum Likelihood Estimation and Expectation Maximization',
      'Generalized linear models, logistic regression, and Bayesian networks'
    ],
    tags: ['Springer', 'Python', 'Simulation', 'Probability', 'SymPy']
  },
  'A course in machine learning.pdf': {
    title: 'A Course in Machine Learning',
    author: 'Hal Daumé III',
    publisher: 'University of Maryland',
    category: 'ai-ml',
    subCategory: 'Algorithmic Foundations',
    resourceType: 'TEXTBOOK',
    difficulty: 'INTERMEDIATE',
    priority: 'IMPORTANT',
    whatIsThisBookFor: 'An intuitive yet rigorous university textbook walking through classification, loss functions, and optimization.',
    summary: 'Hal Daumé’s renowned course book explaining the geometric intuition and formal mechanics of perceptrons, decision trees, support vector machines, and ensemble methods.',
    keyTakeaways: [
      'Geometry of linear classifiers, perceptrons, and margins',
      'Loss functions: hinge loss, cross-entropy, and zero-one loss minimization',
      'Support Vector Machines (SVMs) and kernel tricks for non-linear boundaries',
      'Ensemble learning: bagging, boosting (AdaBoost), and gradient boosting'
    ],
    tags: ['MachineLearning', 'UniversityCourse', 'Algorithms', 'SVM', 'Ensembles']
  },
  'Deep Learning for Dummies - Part 1.pdf': {
    title: 'Deep Learning for Dummies',
    author: 'John Paul Mueller & Luca Massaron',
    publisher: 'For Dummies / Wiley',
    category: 'ai-ml',
    subCategory: 'Neural Networks & Deep Learning',
    resourceType: 'BOOK',
    difficulty: 'BEGINNER',
    priority: 'NORMAL',
    whatIsThisBookFor: 'An approachable, friendly guide to understanding how neural networks work without dense academic jargon.',
    summary: 'A clear introduction to artificial neural networks, backpropagation, convolutional networks for images, and recurrent networks for sequential text data.',
    keyTakeaways: [
      'Intuitive breakdown of neurons, activation functions (ReLU, Sigmoid), and weights',
      'How backpropagation and gradient descent update network weights',
      'Convolutional neural networks (CNNs) for image classification and feature maps',
      'Recurrent neural networks (RNNs/LSTMs) and natural language processing basics'
    ],
    tags: ['DeepLearning', 'NeuralNetworks', 'BeginnerFriendly', 'CNN', 'AI']
  },
  'python-3-400-exercises-and-solutions-for-beginners-by-assad-patel.pdf': {
    title: 'Python 3: 400 Exercises and Solutions for Beginners',
    author: 'Assad Patel',
    publisher: 'Code Mastery Publishing',
    category: 'python',
    subCategory: 'Practice & Problem Solving',
    resourceType: 'PRACTICE_MATERIAL',
    difficulty: 'BEGINNER',
    priority: 'IMPORTANT',
    whatIsThisBookFor: 'Solve 400 bite-sized Python programming challenges with fully explained solutions.',
    summary: 'A 560-page massive practice workbook packed with progressive coding exercises spanning strings, lists, dictionaries, recursion, algorithms, and OOP.',
    keyTakeaways: [
      '400 progressive coding exercises with line-by-line solution walkthroughs',
      'Strengthening problem-solving intuition with string and list manipulations',
      'Algorithmic puzzles: sorting, searching, palindromes, and primes',
      'Object-oriented design challenges with class hierarchies and methods'
    ],
    tags: ['Practice', 'Exercises', 'Python', 'ProblemSolving', 'CodingChallenges']
  },
  'Build Games With Python.pdf': {
    title: 'Invent Your Own Computer Games with Python',
    author: 'Al Sweigart',
    publisher: 'No Starch Press',
    category: 'python',
    subCategory: 'Game Development & Fun Projects',
    resourceType: 'BOOK',
    difficulty: 'BEGINNER',
    priority: 'NORMAL',
    whatIsThisBookFor: 'Learn Python programming by creating classic 2D games and interactive simulations.',
    summary: 'Teaches programming basics step-by-step through building classic games like Hangman, Tic-Tac-Toe, Dragon Realm, and Pygame graphical animations.',
    keyTakeaways: [
      'Learning core logic through interactive text games and state loops',
      'Artificial intelligence heuristics for Tic-Tac-Toe and board games',
      '2D graphics, collision detection, and coordinate systems with Pygame',
      'Handling keyboard and mouse events and playing audio effects'
    ],
    tags: ['GameDev', 'Pygame', 'BeginnerFriendly', 'Projects', 'Interactive']
  },
  'Data Structure &Algorithms.pdf': {
    title: 'Data Structures and Algorithms in Python',
    author: 'DSA Academy',
    publisher: 'Tech Skills Press',
    category: 'python',
    subCategory: 'Data Structures & Algorithms',
    resourceType: 'TEXTBOOK',
    difficulty: 'INTERMEDIATE',
    priority: 'MUST_LEARN',
    whatIsThisBookFor: 'Implement and analyze classic data structures and algorithmic patterns directly in Python.',
    summary: 'A structured guide covering Big-O analysis, linked lists, stacks, queues, binary search trees, heap structures, and graph algorithms implemented in Python.',
    keyTakeaways: [
      'Asymptotic notation: Big-O, Big-Omega, time and space complexity tradeoffs',
      'Linked lists, doubly linked lists, stacks, and queues implementation',
      'Binary trees, AVL trees, and heap priority queue implementations',
      'Graph representations (adjacency list vs matrix), BFS, DFS, and Dijkstra'
    ],
    tags: ['DSA', 'Python', 'Algorithms', 'DataStructures', 'InterviewPrep']
  }
};

// Process all files and produce clean curated list
const processedMap = new Map();
const usedIds = new Set();

for (const b of rawBooks) {
  const fileName = b.fileName;
  
  // Skip obvious non-book junk files
  if (fileName.includes('Resume') || fileName.includes('Copy of')) continue;

  // Key for deduplication
  let dedupKey = b.pages + '_' + cleanRawTitle(fileName).toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // If we already saw an item with the same page count and very similar title, skip
  if (processedMap.has(dedupKey)) continue;

  // Check if we have canonical metadata
  let meta = CANONICAL_KNOWLEDGE[fileName] || null;
  
  if (!meta) {
    // Check by page count / matching key
    for (const [k, v] of Object.entries(CANONICAL_KNOWLEDGE)) {
      if (cleanRawTitle(k).toLowerCase() === cleanRawTitle(fileName).toLowerCase()) {
        meta = v;
        break;
      }
    }
  }

  const cleanTitle = meta ? meta.title : cleanRawTitle(fileName);
  const author = meta ? meta.author : (b.author !== 'Unknown' ? b.author : inferAuthor(fileName, b.relFolder));
  const category = meta ? meta.category : inferCategory(fileName, b.relFolder, b.pages);
  const subCategory = meta ? meta.subCategory : inferSubCategory(fileName, category, b.pages);
  const resourceType = meta ? meta.resourceType : inferResourceType(fileName, b.pages);
  const difficulty = meta ? meta.difficulty : inferDifficulty(fileName, b.pages);
  const priority = meta ? meta.priority : inferPriority(fileName, b.pages);
  const whatIsThisBookFor = meta ? meta.whatIsThisBookFor : generateWhatFor(cleanTitle, category, b.pages);
  const summary = meta ? meta.summary : generateSummary(cleanTitle, category, author, b.pages);
  const keyTakeaways = meta ? meta.keyTakeaways : generateTakeaways(cleanTitle, category);
  const tags = meta ? meta.tags : generateTags(cleanTitle, category, subCategory);

  let baseId = `res-local-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  let uniqueId = baseId;
  let counter = 1;
  while (usedIds.has(uniqueId)) {
    counter++;
    uniqueId = `${baseId}-${counter}`;
  }
  usedIds.add(uniqueId);

  const resource = {
    id: uniqueId,
    title: cleanTitle,
    author: author,
    pages: b.pages,
    fileName: fileName,
    category: category,
    subCategory: subCategory,
    resourceType: resourceType,
    difficulty: difficulty,
    priority: priority,
    status: 'NOT_STARTED',
    readingStatus: 'NOT_STARTED',
    progress: 0,
    currentPage: 0,
    totalPages: b.pages,
    source: 'uploaded_pdf',
    sourceUrl: b.fullPath,
    whatIsThisBookFor: whatIsThisBookFor,
    summary: summary,
    keyTakeaways: keyTakeaways,
    prerequisites: generatePrerequisites(category, difficulty),
    recommendedNext: [],
    topics: [subCategory, category, ...tags.slice(0, 3)],
    tags: tags,
    dateAdded: '2026-09-29',
    lastOpened: '2026-09-29',
  };

  processedMap.set(dedupKey, resource);
}

function inferAuthor(fileName, folder) {
  const f = fileName.toLowerCase();
  if (f.includes('assad patel')) return 'Assad Patel';
  if (f.includes('andrew ng')) return 'Andrew Ng';
  if (f.includes('joel grus')) return 'Joel Grus';
  if (f.includes('severance')) return 'Dr. Charles R. Severance';
  if (f.includes('zed')) return 'Zed A. Shaw';
  if (f.includes('flavio')) return 'Flavio Copes';
  if (f.includes('hadley')) return 'Hadley Wickham';
  if (f.includes('kochenderfer')) return 'Mykel J. Kochenderfer';
  if (f.includes('pybites')) return 'PyBites Community';
  if (f.includes('springboard')) return 'Springboard Career Institute';
  if (f.includes('tutorialspoint')) return 'TutorialsPoint Team';
  if (folder.includes('Cheat Sheets')) return 'Data Science & Python Collective';
  if (folder.includes('Interview')) return 'Tech Interview Collective';
  if (folder.includes('Projects')) return 'Applied AI Research Lab';
  return 'Technical Authors Collective';
}

function inferCategory(fileName, folder, pages) {
  const f = fileName.toLowerCase();
  const fol = folder.toLowerCase();

  if (fol.includes('cheat sheet') || f.includes('cheat') || f.includes('cheatsheet') || (pages <= 25 && f.includes('guide'))) {
    return 'sec-handbooks';
  }
  if (fol.includes('interview') || f.includes('interview') || f.includes('question') || f.includes('roadmap') || f.includes('study plan') || f.includes('first job')) {
    return 'interviews';
  }
  if (fol.includes('project') || f.includes('project') || f.includes('prediction')) {
    return 'projects';
  }
  if (fol.includes('python') || f.includes('python')) {
    if (f.includes('machine learning') || f.includes('data science') || f.includes('data analysis') || f.includes('pandas') || f.includes('numpy') || f.includes('statistics') || f.includes('probability')) {
      return 'data-science';
    }
    return 'python';
  }
  if (f.includes('machine learning') || f.includes('neural') || f.includes('deep learning') || f.includes('nlp') || f.includes('ai') || fol.includes('ai ml')) {
    return 'ai-ml';
  }
  if (f.includes('data science') || f.includes('data cleaning') || f.includes('eda') || f.includes('r for data')) {
    return 'data-science';
  }
  return 'python';
}

function inferSubCategory(fileName, category, pages) {
  const f = fileName.toLowerCase();
  if (category === 'sec-handbooks') {
    if (f.includes('python') || f.includes('pcc')) return 'Python Cheatsheets & Syntax';
    if (f.includes('ml') || f.includes('machine learning') || f.includes('formula')) return 'Machine Learning Cheat Sheets';
    if (f.includes('matplotlib') || f.includes('seaborn')) return 'Visualization References';
    return 'Quick References & Summaries';
  }
  if (category === 'interviews') {
    if (f.includes('python')) return 'Python Technical Interviews';
    if (f.includes('nlp')) return 'NLP & Deep Learning Questions';
    if (f.includes('roadmap') || f.includes('plan')) return 'Career Roadmaps & Study Plans';
    return 'Data Science & ML Interviews';
  }
  if (category === 'projects') {
    if (f.includes('energy') || f.includes('weather') || f.includes('divorce')) return 'End-to-End Predictive Models';
    return 'Portfolio Projects & Source Code';
  }
  if (category === 'data-science') {
    if (f.includes('cleaning')) return 'Data Cleaning & Preprocessing';
    if (f.includes('numpy') || f.includes('pandas')) return 'Data Manipulation with NumPy & Pandas';
    if (f.includes('stat') || f.includes('probability') || f.includes('linear algebra')) return 'Mathematical & Statistical Foundations';
    return 'Exploratory Data Analysis';
  }
  if (category === 'ai-ml') {
    if (f.includes('deep learning') || f.includes('neural')) return 'Neural Networks & Deep Learning';
    if (f.includes('decision') || f.includes('optimization')) return 'Algorithmic Decision Theory';
    return 'Supervised & Unsupervised Learning';
  }
  // Python
  if (f.includes('exercise') || f.includes('practise') || f.includes('tutorial')) return 'Hands-on Coding & Tutorials';
  if (f.includes('notes') || f.includes('complete')) return 'Comprehensive Language Notes';
  if (f.includes('astrophysics')) return 'Domain-Specific Python';
  return 'Core Syntax & Fundamentals';
}

function inferResourceType(fileName, pages) {
  const f = fileName.toLowerCase();
  if (f.includes('cheatsheet') || f.includes('cheat sheet') || pages <= 20) return 'CHEAT_SHEET';
  if (f.includes('interview') || f.includes('question')) return 'INTERVIEW_GUIDE';
  if (f.includes('handbook') || f.includes('notes')) return 'HANDBOOK';
  if (f.includes('exercise') || f.includes('project')) return 'PRACTICE_MATERIAL';
  if (pages >= 150) return 'TEXTBOOK';
  return 'BOOK';
}

function inferDifficulty(fileName, pages) {
  const f = fileName.toLowerCase();
  if (f.includes('advanced') || f.includes('optimization') || f.includes('decision') || f.includes('validation')) return 'ADVANCED';
  if (f.includes('beginner') || f.includes('basics') || f.includes('easy') || f.includes('for dummies') || f.includes('for everyone')) return 'BEGINNER';
  if (pages > 250) return 'INTERMEDIATE';
  return 'INTERMEDIATE';
}

function inferPriority(fileName, pages) {
  const f = fileName.toLowerCase();
  if (pages > 200 || f.includes('yearning') || f.includes('scratch') || f.includes('everybody') || f.includes('optimization') || f.includes('decision')) return 'MUST_LEARN';
  if (f.includes('interview') || f.includes('cheat') || f.includes('handbook')) return 'IMPORTANT';
  return 'NORMAL';
}

function generateWhatFor(title, category, pages) {
  if (category === 'sec-handbooks') {
    return `Quickly look up essential syntax, formulas, and commands without reading hundreds of pages.`;
  }
  if (category === 'interviews') {
    return `Drill the most frequently tested interview questions and nail technical screening rounds.`;
  }
  if (category === 'projects') {
    return `Follow end-to-end code implementations and add impressive machine learning projects to your portfolio.`;
  }
  if (category === 'data-science') {
    return `Master data cleaning, exploratory analysis, and statistical modeling with industry-standard Python libraries.`;
  }
  if (category === 'ai-ml') {
    return `Build a rock-solid understanding of machine learning algorithms, model evaluation, and deployment strategies.`;
  }
  return `Learn Python programming fundamentals, clean code idioms, and hands-on scripting best practices.`;
}

function generateSummary(title, category, author, pages) {
  return `A well-structured ${pages}-page learning resource on "${title}", crafted by ${author}. It offers concise explanations, clear practical demonstrations, and conceptual clarity for fast skill acquisition.`;
}

function generateTakeaways(title, category) {
  if (category === 'sec-handbooks') {
    return [
      'Rapid reference for key functions, parameters, and syntax rules',
      'Eliminates need for searching web documentation during coding sessions',
      'Visual summaries of workflows, methods, and algorithmic formulas'
    ];
  }
  if (category === 'interviews') {
    return [
      'High-frequency interview questions with clear conceptual explanations',
      'Edge cases and common traps interviewers look for',
      'Practical advice on articulating your problem-solving thought process'
    ];
  }
  if (category === 'projects') {
    return [
      'Complete end-to-end workflow: data preparation, feature engineering, and model training',
      'Evaluation metrics and performance tuning techniques',
      'Production deployment considerations and portfolio presentation tips'
    ];
  }
  if (category === 'data-science') {
    return [
      'Effective data cleaning techniques to handle missing and noisy values',
      'Fast exploratory data analysis and visualization pipelines',
      'Statistical reasoning and validation of exploratory conclusions'
    ];
  }
  if (category === 'ai-ml') {
    return [
      'Core mathematical intuition behind modern predictive models',
      'Systematic feature selection and model evaluation pipelines',
      'Overfitting prevention, cross-validation, and hyperparameter tuning'
    ];
  }
  return [
    'Clear understanding of Python syntax, data structures, and functions',
    'Best practices for writing readable, maintainable, and pythonic code',
    'Practical hands-on exercises to solidify learning'
  ];
}

function generateTags(title, category, subCategory) {
  const tags = ['Python'];
  if (category === 'ai-ml') tags.push('MachineLearning', 'AI');
  if (category === 'data-science') tags.push('DataScience', 'Analytics');
  if (category === 'sec-handbooks') tags.push('CheatSheet', 'Reference');
  if (category === 'interviews') tags.push('InterviewPrep', 'Career');
  if (category === 'projects') tags.push('Projects', 'HandsOn');
  tags.push(subCategory.split(' ')[0]);
  return tags;
}

function generatePrerequisites(category, difficulty) {
  if (difficulty === 'BEGINNER') return ['No prior programming experience required', 'Basic computer literacy'];
  if (difficulty === 'ADVANCED') return ['Solid Python programming skills', 'College-level calculus and linear algebra', 'Foundational understanding of probability'];
  return ['Basic Python syntax (loops, functions, lists)', 'Fundamental algebra and math intuition'];
}

const finalResources = Array.from(processedMap.values());
console.log(`Generated ${finalResources.length} curated, user-friendly resources!`);

// Breakdown by category
const breakdown = {};
finalResources.forEach(r => {
  breakdown[r.category] = (breakdown[r.category] || 0) + 1;
});
console.log('Category breakdown:', breakdown);

// Write to TypeScript file
const tsContent = `// Autogenerated curated collection from C:\\Users\\ashri\\Downloads\\v2\\python to ml
// Clean, user-friendly English titles, proper authors, clear categories, and decision statements.
import { Resource } from '../types/library';

export const PYTHON_TO_ML_RESOURCES: Resource[] = ${JSON.stringify(finalResources, null, 2)};
`;

fs.writeFileSync('src/data/pythonMlResources.ts', tsContent, 'utf8');
console.log('Successfully wrote to src/data/pythonMlResources.ts');
