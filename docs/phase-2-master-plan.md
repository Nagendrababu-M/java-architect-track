# Phase 2 — DSA & Problem Solving (Weeks 4–7, Days 22–48)

> **Goal:** Build pattern recognition over volume. By Day 48 you should look at a problem and identify which technique fits in under 60 seconds.
>
> **Philosophy:** This phase is the lightest in calendar weight because architect interviews are 30% DSA / 70% design. We're building enough fluency to not get screened out, not to compete with grinders.

---

## Week 4 — Arrays, Strings, Two Pointers, Sliding Window (Days 22–27)

### Day 22 — Two Pointers Foundations
- **Core concepts:** Opposite-end pointers, same-direction pointers, when to apply, complexity reasoning
- **Patterns:** Reverse array, palindrome check, sum problems
- **Problems:** Two Sum II (sorted), Valid Palindrome, Container With Most Water
- **Interview signal:** Recognize "sorted array" → two pointers in seconds
- **Resources:**
  - NeetCode YouTube playlist "Two Pointers"
  - LeetCode pattern: leetcode.com/explore/learn/card/array-and-string/

### Day 23 — Sliding Window (Fixed & Variable Size)
- **Core concepts:**
  - Fixed: window of size K, sum/max/avg over window, sliding by 1
  - Variable: expand/shrink window based on condition, character frequency tracking with HashMap
- **Problems:** Max sum subarray of size K; Longest substring without repeating chars; Longest substring with K distinct; Min window substring
- **Architect lens:** Sliding window = stream processing intuition (Kafka windows, Flink)
- **Interview signal:** Variable sliding window is a top-5 most asked pattern at FAANG
- **Resources:**
  - Educative.io "Grokking the Coding Interview" — sliding window chapter
  - NeetCode "Sliding Window" playlist (essential)

### Day 24 — Prefix Sums & Difference Arrays
- **Core concepts:** Cumulative sum array, range sum queries in O(1), 2D prefix sums
- **Problems:** Subarray sum equals K, Range sum query immutable
- **Architect lens:** Same pattern powers OLAP cube precomputation
- **Resources:**
  - LeetCode prefix sum study plan

### Day 25 — String Manipulation Patterns
- **Core concepts:** Char frequency, anagrams, string matching (KMP intuition, not implementation)
- **Problems:** Valid Anagram, Group Anagrams, Longest Palindromic Substring
- **Resources:**
  - "Pattern Matching" — Coursera Algorithms specialization

### Day 26 — Array Manipulation: Rotations, Sorts, Merges
- **Core concepts:** In-place rotation, Dutch national flag, merge two sorted arrays in-place
- **Problems:** Rotate array, Sort colors, Merge sorted arrays
- **Resources:**
  - "Programming Pearls" by Jon Bentley — Chapter on rotations

### Day 27 — Week 4 Synthesis: Mixed Pattern Drill
- **Format:** 5 problems from this week mixed, time-boxed
- **Goal:** Pattern recognition speed test
- **Architect lens:** Most interviewers will tell you "you don't need to solve this, just talk through the approach"

---

## Week 5 — Trees, Graphs, BFS/DFS (Days 28–34)

### Day 28 — Binary Trees: Traversals
- **Core concepts:** Preorder, inorder, postorder (recursive + iterative with stack), level-order (BFS)
- **Problems:** Binary tree traversals, Same tree, Symmetric tree
- **Architect lens:** Tree traversal = AST processing, file system walking
- **Resources:**
  - NeetCode tree playlist

### Day 29 — Binary Search Trees
- **Core concepts:** BST property, insert/delete/search, validate BST, BST iterator
- **Problems:** Validate BST, Lowest common ancestor of BST, Kth smallest in BST
- **Interview signal:** "Convert BST to sorted DLL" is a classic
- **Resources:**
  - *Cracking the Coding Interview* — Trees chapter

### Day 30 — Binary Tree DFS Patterns
- **Core concepts:** Top-down DFS (passing info down), bottom-up DFS (returning info up), path tracking
- **Problems:** Max depth, Diameter, Path sum, Lowest common ancestor (general tree)
- **Challenge:** Identify whether each problem needs top-down or bottom-up DFS
- **Resources:**
  - LeetCode "DFS on tree" study plan
  - YouTube "Tree DFS Patterns" — Aditya Verma, Striver

### Day 31 — Graph Representations & BFS
- **Core concepts:** Adjacency list vs matrix, BFS with queue, visited set, shortest path in unweighted graph, level tracking
- **Problems:** Number of islands, Rotting oranges, Word ladder
- **Architect lens:** BFS = service dependency analysis, social network "degrees of separation"
- **Resources:**
  - William Fiset graph theory series (YouTube) — gold standard

### Day 32 — Graph DFS, Cycle Detection, Connected Components
- **Core concepts:** DFS recursive vs iterative, cycle detection in undirected (parent tracking) and directed (3-color)
- **Problems:** Course Schedule (cycle in directed graph), Number of provinces, Clone graph
- **Resources:**
  - William Fiset DFS playlist

### Day 33 — Topological Sort & Union-Find
- **Core concepts:**
  - Topo sort: Kahn's algorithm (BFS-based) + DFS-based
  - Union-Find (Disjoint Set Union) with path compression + union by rank
- **Problems:** Course schedule II, Alien dictionary, Number of connected components
- **Architect lens:** Topo sort = build dependency resolution (Maven, Gradle); Union-Find = Kruskal's MST, network connectivity
- **Resources:**
  - "Union Find" by Tushar Roy (YouTube)
  - MIT OCW 6.006 graphs lecture

### Day 34 — Week 5 Synthesis: Graph Problem Drill
- **Format:** 4 mixed graph problems
- **Architect lens:** Graphs appear constantly in system design (service mesh, data lineage)

---

## Week 6 — Dynamic Programming (Days 35–41)

### Day 35 — DP Foundations: Memoization vs Tabulation
- **Core concepts:** Overlapping subproblems, optimal substructure, recursion + memoization, conversion to bottom-up tabulation
- **Problems:** Fibonacci variants, Climbing stairs, Min cost climbing stairs
- **Resources:**
  - Aditya Verma DP playlist (YouTube — gold standard for Indian audience)
  - "DP for Beginners" — LeetCode discussion thread (canonical)

### Day 36 — 1D DP Patterns
- **Core concepts:** State = single index, transitions from previous indices
- **Problems:** House Robber, House Robber II, Longest Increasing Subsequence
- **Interview signal:** LIS is a top-5 DP problem

### Day 37 — 2D DP: Grid Problems
- **Core concepts:** State = (row, col), transitions from neighbors, in-place vs separate DP table
- **Problems:** Unique Paths, Min Path Sum, Edit Distance
- **Resources:**
  - "Edit Distance" walkthrough — Tushar Roy

### Day 38 — Knapsack Family
- **Core concepts:** 0/1 knapsack, unbounded knapsack, subset sum variants
- **Problems:** Coin Change, Coin Change II, Partition Equal Subset Sum, Target Sum
- **Architect lens:** Resource allocation problems (capacity planning) reduce to knapsack variants
- **Challenge:** Pick the right knapsack variant for 3 disguised problems
- **Resources:**
  - Aditya Verma knapsack playlist (essential)

### Day 39 — String DP
- **Core concepts:** LCS family, palindromic substring DP
- **Problems:** Longest Common Subsequence, Longest Palindromic Subsequence, Palindrome partitioning
- **Resources:**
  - Aditya Verma LCS playlist

### Day 40 — Interval DP & Stocks Family
- **Core concepts:** Buy/sell stock with constraints, interval merging DP, matrix chain multiplication intuition
- **Problems:** Best Time to Buy and Sell Stock (I-IV), Burst Balloons
- **Architect lens:** Trading-strategy backtesting often becomes DP under the hood
- **Resources:**
  - LeetCode stock problems study plan

### Day 41 — Week 6 Synthesis: DP Pattern Identification
- **Format:** Given 6 problem descriptions, classify which DP pattern fits
- **Goal:** Recognize DP type in under 1 minute

---

## Week 7 — Heaps, Tries, Advanced Patterns (Days 42–48)

### Day 42 — Heaps & Priority Queues
- **Core concepts:** Min-heap / max-heap, `PriorityQueue` in Java, heap operations (O(log N))
- **Problems:** Kth largest element, Top K frequent elements, Merge K sorted lists
- **Architect lens:** Priority queues in scheduling (OS, Kubernetes), event loops
- **Resources:**
  - LeetCode heap study plan

### Day 43 — Two Heaps Pattern
- **Core concepts:** Min-heap + max-heap to track median
- **Problems:** Find Median from Data Stream, Sliding Window Median
- **Interview signal:** "Median in a stream" is a top 10 streaming question

### Day 44 — Tries
- **Core concepts:** Trie node structure, insert/search/startsWith, applications (autocomplete, spell check)
- **Problems:** Implement Trie, Word Search II, Replace Words
- **Architect lens:** Tries power search-as-you-type, DNS routing, IP prefix matching
- **Challenge:** Implement an autocomplete system
- **Resources:**
  - "Trie data structure" — Tushar Roy (YouTube)

### Day 45 — Backtracking
- **Core concepts:** Recursion with state, choose/explore/unchoose pattern, pruning
- **Problems:** Subsets, Permutations, Combinations, N-Queens (intuition)
- **Resources:**
  - "Backtracking" by Aditya Verma

### Day 46 — Binary Search Mastery
- **Core concepts:** Search in sorted array, search insert position, binary search on answer space (finding boundary)
- **Problems:** Search in rotated sorted array, Find peak element, Capacity to ship packages in D days
- **Interview signal:** "Binary search on answer" is a separator pattern at higher levels
- **Resources:**
  - "Binary Search Templates" — LeetCode discussion (canonical)

### Day 47 — Greedy Patterns
- **Core concepts:** Local optimal → global optimal, interval scheduling, when greedy fails
- **Problems:** Jump Game, Gas Station, Task Scheduler
- **Architect lens:** Greedy underlies most scheduler designs

### Day 48 — Phase 2 Synthesis: Mock Coding Interview
- **Format:** 60-min mock with 2 problems (1 medium, 1 medium-hard) from mixed patterns
- **Self-assessment:** Did you identify the pattern in <2 min? Did you reason through complexity?
- **Architect lens:** This is the bar; you don't need to be NeetCode-fast, just confident
- **Resources:**
  - Pramp / Interviewing.io for actual mock interviews

---

## Phase 2 Exit Criteria

By Day 48 you should:

- Identify the right pattern (sliding window vs DP vs DFS) within 2 minutes of reading a problem
- Code a medium problem in 25-30 minutes without significant debugging
- Reason about time/space complexity confidently
- Explain trade-offs (recursion vs iteration, memoization vs tabulation) on demand

**You will NOT be:**
- A LeetCode top 0.1% solver (not the goal)
- Fast on hard problems without prep (not the goal)
- Memorizing solutions (counter-productive)

---

## Key Resources for Phase 2

**YouTube channels (sorted by relevance):**
- NeetCode — pattern-focused, English
- Aditya Verma — DP/recursion patterns, mix of Hindi/English
- Striver (takeUforward) — comprehensive sheets
- William Fiset — graphs deep dive
- Tushar Roy — classical algorithms

**Books:**
- *Cracking the Coding Interview* — Gayle Laakmann McDowell (still relevant for patterns)
- *Algorithm Design Manual* — Steven Skiena (when you want depth)

**Problem sets:**
- NeetCode 150 (free curated list)
- Striver's SDE Sheet
- Blind 75 (legendary minimum bar)
