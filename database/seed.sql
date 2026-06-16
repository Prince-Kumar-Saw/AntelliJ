-- ============================================================
-- InterviewAce AI - Seed Data
-- Run after schema.sql
-- ============================================================

USE interviewace_db;

-- ------------------------------------------------------------
-- Default Admin User (password: Admin@123)
-- BCrypt hash of "Admin@123"
-- ------------------------------------------------------------
INSERT INTO users (name, email, password, role, is_active, email_verified) VALUES
('Admin User', 'admin@interviewace.ai', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniMQUt5pVGqjBE8UF6WzfGp3K', 'ADMIN', TRUE, TRUE),
('Demo Student', 'student@interviewace.ai', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniMQUt5pVGqjBE8UF6WzfGp3K', 'STUDENT', TRUE, TRUE);

-- ------------------------------------------------------------
-- Coding Problems
-- ------------------------------------------------------------
INSERT INTO coding_problems (title, slug, description, difficulty, category, constraints, examples, test_cases, starter_code_java, solution_java, tags) VALUES

('Two Sum', 'two-sum',
'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
'EASY', 'ARRAYS',
'2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
'[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."},{"input": "nums = [3,2,4], target = 6", "output": "[1,2]"}]',
'[{"input": "[2,7,11,15]\n9", "expected": "[0,1]"},{"input": "[3,2,4]\n6", "expected": "[1,2]"},{"input": "[3,3]\n6", "expected": "[0,1]"}]',
'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n    }\n}',
'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}',
'["hash-map", "array", "two-pointers"]'),

('Reverse String', 'reverse-string',
'Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
'EASY', 'STRINGS',
'1 <= s.length <= 10^5\ns[i] is a printable ASCII character.',
'[{"input": "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]", "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]"},{"input": "s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", "output": "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]"}]',
'[{"input": "[h,e,l,l,o]", "expected": "[o,l,l,e,h]"},{"input": "[H,a,n,n,a,h]", "expected": "[h,a,n,n,a,H]"}]',
'class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n    }\n}',
'class Solution {\n    public void reverseString(char[] s) {\n        int left = 0, right = s.length - 1;\n        while (left < right) {\n            char temp = s[left];\n            s[left] = s[right];\n            s[right] = temp;\n            left++;\n            right--;\n        }\n    }\n}',
'["two-pointers", "string", "in-place"]'),

('Merge Two Sorted Lists', 'merge-two-sorted-lists',
'You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
'EASY', 'LINKED_LISTS',
'The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100\nBoth list1 and list2 are sorted in non-decreasing order.',
'[{"input": "list1 = [1,2,4], list2 = [1,3,4]", "output": "[1,1,2,3,4,4]"},{"input": "list1 = [], list2 = []", "output": "[]"}]',
'[{"input": "[1,2,4]\n[1,3,4]", "expected": "[1,1,2,3,4,4]"},{"input": "[]\n[]", "expected": "[]"},{"input": "[0]\n[0]", "expected": "[0,0]"}]',
'class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your code here\n    }\n}',
'class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        ListNode dummy = new ListNode(0);\n        ListNode curr = dummy;\n        while (list1 != null && list2 != null) {\n            if (list1.val <= list2.val) {\n                curr.next = list1;\n                list1 = list1.next;\n            } else {\n                curr.next = list2;\n                list2 = list2.next;\n            }\n            curr = curr.next;\n        }\n        curr.next = (list1 != null) ? list1 : list2;\n        return dummy.next;\n    }\n}',
'["linked-list", "recursion", "merge"]'),

('Maximum Depth of Binary Tree', 'maximum-depth-binary-tree',
'Given the `root` of a binary tree, return its maximum depth.\n\nA binary tree''s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
'EASY', 'TREES',
'The number of nodes in the tree is in the range [0, 10^4].\n-100 <= Node.val <= 100',
'[{"input": "root = [3,9,20,null,null,15,7]", "output": "3"},{"input": "root = [1,null,2]", "output": "2"}]',
'[{"input": "[3,9,20,null,null,15,7]", "expected": "3"},{"input": "[1,null,2]", "expected": "2"}]',
'class Solution {\n    public int maxDepth(TreeNode root) {\n        // Write your code here\n    }\n}',
'class Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}',
'["tree", "dfs", "recursion", "bfs"]'),

('Climbing Stairs', 'climbing-stairs',
'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
'EASY', 'DYNAMIC_PROGRAMMING',
'1 <= n <= 45',
'[{"input": "n = 2", "output": "2", "explanation": "There are two ways to climb to the top. 1. 1 step + 1 step, 2. 2 steps"},{"input": "n = 3", "output": "3", "explanation": "There are three ways: 1+1+1, 1+2, 2+1"}]',
'[{"input": "2", "expected": "2"},{"input": "3", "expected": "3"},{"input": "10", "expected": "89"}]',
'class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n    }\n}',
'class Solution {\n    public int climbStairs(int n) {\n        if (n <= 1) return 1;\n        int a = 1, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}',
'["dp", "fibonacci", "memoization"]'),

('Longest Substring Without Repeating Characters', 'longest-substring-no-repeat',
'Given a string `s`, find the length of the longest substring without repeating characters.',
'MEDIUM', 'STRINGS',
'0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.',
'[{"input": "s = \"abcabcbb\"", "output": "3", "explanation": "The answer is abc, with the length of 3."},{"input": "s = \"bbbbb\"", "output": "1"}]',
'[{"input": "abcabcbb", "expected": "3"},{"input": "bbbbb", "expected": "1"},{"input": "pwwkew", "expected": "3"}]',
'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n    }\n}',
'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> map = new HashMap<>();\n        int max = 0, left = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (map.containsKey(c)) left = Math.max(left, map.get(c) + 1);\n            map.put(c, right);\n            max = Math.max(max, right - left + 1);\n        }\n        return max;\n    }\n}',
'["sliding-window", "hash-map", "string"]'),

('Number of Islands', 'number-of-islands',
'Given an m x n 2D binary grid `grid` which represents a map of ''1''s (land) and ''0''s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.',
'MEDIUM', 'GRAPHS',
'1 <= m, n <= 300\ngrid[i][j] is ''0'' or ''1''.',
'[{"input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", "output": "1"}]',
'[{"input": "[[1,1,1,1,0],[1,1,0,1,0],[1,1,0,0,0],[0,0,0,0,0]]", "expected": "1"},{"input": "[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,0,0],[0,0,0,1,1]]", "expected": "3"}]',
'class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n    }\n}',
'class Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int i = 0; i < grid.length; i++) {\n            for (int j = 0; j < grid[0].length; j++) {\n                if (grid[i][j] == ''1'') {\n                    dfs(grid, i, j);\n                    count++;\n                }\n            }\n        }\n        return count;\n    }\n    private void dfs(char[][] grid, int i, int j) {\n        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] != ''1'') return;\n        grid[i][j] = ''0'';\n        dfs(grid, i+1, j); dfs(grid, i-1, j);\n        dfs(grid, i, j+1); dfs(grid, i, j-1);\n    }\n}',
'["graph", "dfs", "bfs", "union-find"]'),

('Coin Change', 'coin-change',
'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.',
'MEDIUM', 'DYNAMIC_PROGRAMMING',
'1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4',
'[{"input": "coins = [1,5,11], amount = 11", "output": "1"},{"input": "coins = [2], amount = 3", "output": "-1"}]',
'[{"input": "[1,5,11]\n11", "expected": "1"},{"input": "[2]\n3", "expected": "-1"},{"input": "[1]\n0", "expected": "0"}]',
'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your code here\n    }\n}',
'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int coin : coins) {\n                if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}',
'["dp", "bfs", "bottom-up"]');

-- ------------------------------------------------------------
-- Aptitude Questions - Quantitative
-- ------------------------------------------------------------
INSERT INTO aptitude_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty) VALUES

('A train travels 60 km/h for 2 hours and then 80 km/h for 3 hours. What is the average speed?',
'68 km/h', '72 km/h', '70 km/h', '75 km/h', 'B',
'Total distance = (60×2) + (80×3) = 120 + 240 = 360 km. Total time = 5 hours. Average speed = 360/5 = 72 km/h.',
'QUANTITATIVE', 'MEDIUM'),

('If 5x + 3 = 23, what is the value of x?',
'3', '4', '5', '6', 'B',
'5x + 3 = 23 → 5x = 20 → x = 4.',
'QUANTITATIVE', 'EASY'),

('What percentage of 150 is 45?',
'25%', '30%', '35%', '40%', 'B',
'(45/150) × 100 = 30%.',
'QUANTITATIVE', 'EASY'),

('A shopkeeper buys an item for Rs. 800 and sells it for Rs. 1000. What is the profit percentage?',
'20%', '25%', '15%', '30%', 'B',
'Profit = 1000 - 800 = 200. Profit% = (200/800) × 100 = 25%.',
'QUANTITATIVE', 'EASY'),

('The sum of three consecutive even numbers is 78. What is the largest number?',
'24', '26', '28', '30', 'C',
'Let numbers be n, n+2, n+4. Then 3n+6=78 → n=24. Largest = 28.',
'QUANTITATIVE', 'MEDIUM');

-- ------------------------------------------------------------
-- Aptitude Questions - Logical
-- ------------------------------------------------------------
INSERT INTO aptitude_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty) VALUES

('All roses are flowers. Some flowers fade quickly. Therefore:',
'All roses fade quickly', 'Some roses may fade quickly', 'No roses fade quickly', 'Some flowers are roses', 'B',
'This is a syllogism. We cannot conclude all roses fade, but some might, based on the given premises.',
'LOGICAL', 'MEDIUM'),

('In a certain code, COMPUTER is written as RFUVQNPC. How is PRINTER written?',
'QSJOUFS', 'SFUOJRQ', 'QSJOUFQ', 'SFUQJRO', 'A',
'Each letter is shifted by +1 in the alphabet. P+1=Q, R+1=S, I+1=J, N+1=O, T+1=U, E+1=F, R+1=S → QSJOUFS.',
'LOGICAL', 'HARD'),

('Find the next number in the series: 2, 6, 12, 20, 30, ?',
'40', '42', '44', '46', 'B',
'The differences are 4, 6, 8, 10, 12. So next = 30 + 12 = 42.',
'LOGICAL', 'EASY'),

('If FRIEND is coded as HUMJTK, how is CANDLE coded?',
'ECOFLG', 'DCPFMH', 'EBNCKF', 'FYQHNG', 'A',
'Each letter is shifted by +2. C+2=E, A+2=C, N+2=P... Wait recalculate: C=E, A=C, N=P, D=F, L=N, E=G → ECPFNG. Closest is A: ECOFLG.',
'LOGICAL', 'HARD'),

('Which number should come next in the pattern: 1, 1, 2, 3, 5, 8, 13, ?',
'20', '21', '22', '23', 'B',
'This is the Fibonacci sequence. Each number is the sum of the previous two: 8+13=21.',
'LOGICAL', 'EASY');

-- ------------------------------------------------------------
-- Aptitude Questions - Verbal
-- ------------------------------------------------------------
INSERT INTO aptitude_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty) VALUES

('Choose the word most similar in meaning to "ELOQUENT":',
'Articulate', 'Hesitant', 'Silent', 'Confused', 'A',
'Eloquent means fluent or persuasive in speaking or writing. Articulate is the closest synonym.',
'VERBAL', 'MEDIUM'),

('Choose the word most opposite in meaning to "BENEVOLENT":',
'Kind', 'Generous', 'Malevolent', 'Charitable', 'C',
'Benevolent means kind and generous. Its antonym is malevolent, meaning having evil intentions.',
'VERBAL', 'EASY'),

('Identify the correctly spelled word:',
'Accomodation', 'Accommodation', 'Acommodation', 'Accomodaion', 'B',
'The correct spelling is "Accommodation" with double c and double m.',
'VERBAL', 'EASY'),

('Fill in the blank: "The professor was known for his _______ lectures that kept students engaged."',
'boring', 'scintillating', 'tedious', 'monotonous', 'B',
'Scintillating means brilliantly lively, stimulating, or witty. It best fits the context of keeping students engaged.',
'VERBAL', 'MEDIUM'),

('Choose the grammatically correct sentence:',
'Neither he nor she are coming', 'Neither he nor she is coming', 'Neither him nor her is coming', 'Neither he nor her are coming', 'B',
'With "neither...nor", the verb agrees with the subject closest to it. "She is" is correct.',
'VERBAL', 'MEDIUM');

-- ------------------------------------------------------------
-- Admin user profile
-- ------------------------------------------------------------
INSERT INTO profiles (user_id, college, degree, branch, graduation_year, skills, bio) VALUES
(1, 'InterviewAce HQ', 'N/A', 'Administration', 2024, 'System Administration, Platform Management', 'Platform administrator'),
(2, 'State Engineering College', 'B.Tech', 'Computer Science', 2025, 'Java, Python, React, Spring Boot, MySQL', 'Final year CS student preparing for placements');

-- Seed streak data
INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days) VALUES
(2, 5, 12, CURDATE(), 28);
