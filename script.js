/* 
  AIML Lab - Interactive Scripts
*/

// --- Authentication & Route Protection (Run immediately to prevent flash) ---
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const username = localStorage.getItem('username') || 'User';
const protectedPages = ['learn.html', 'mcq.html', 'coding.html', 'progress.html', 'dashboard.html', 'beginner.html', 'intermediate.html', 'expert.html', 'play.html', 'simulate.html'];
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// Home Page Restriction: If logged in, index.html -> dashboard.html
if (currentPage === 'index.html' && isLoggedIn) {
    window.location.href = 'dashboard.html';
}

// Route Protection
if (protectedPages.includes(currentPage) && !isLoggedIn) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate hamburger
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Logo Behavior: If logged in, logo -> dashboard.html
    const logo = document.querySelector('.logo');
    if (logo && isLoggedIn) {
        logo.href = 'dashboard.html';
    }

    // Navbar Updates (Consistent across all pages)
    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
        const authSection = navLinksContainer.querySelector('.nav-auth');
        
        if (isLoggedIn) {
            // Remove Login/Signup buttons if they exist
            if (authSection) authSection.remove();
            
            // Clear existing links to rebuild for logged-in state
            navLinksContainer.innerHTML = `
                <a href="dashboard.html">Dashboard</a>
                <a href="mcq.html">Quiz</a>
                <a href="simulate.html">Simulate</a>
                <a href="play.html">Play</a>
                <a href="contact.html">Contact</a>
                <a href="#" id="logout-btn" class="btn btn-outline" style="margin-left: 1rem;">Logout</a>
            `;

            // Highlight current page
            const links = navLinksContainer.querySelectorAll('a');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPage) {
                    link.style.color = 'var(--text-main)';
                }
            });

            // Logout Logic
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('isLoggedIn');
                    window.location.href = 'login.html'; // Redirect to login after logout
                });
            }
        }
    }

    // Welcome Message
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg) {
        welcomeMsg.innerText = `Welcome, ${username} 👋`;
    }

    // Simple Form Validation / Feedback (Auth Simulation)
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('login-name');
            const btn = loginForm.querySelector('button');
            
            if (nameInput && nameInput.value) {
                localStorage.setItem('username', nameInput.value);
            }
            
            btn.innerText = 'Logging in...';
            btn.disabled = true;

            setTimeout(() => {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            }, 800);
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('name');
            const btn = signupForm.querySelector('button');
            
            if (nameInput) {
                localStorage.setItem('username', nameInput.value);
            }
            
            btn.innerText = 'Creating account...';
            btn.disabled = true;

            setTimeout(() => {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            }, 800);
        });
    }

    // Generic form handler for others
    const otherForms = document.querySelectorAll('form:not(#loginForm):not(#signupForm)');
    otherForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Processing...';
            btn.disabled = true;

            setTimeout(() => {
                const isContactForm = form.id === 'contactForm';
                const message = isContactForm ? 'Message sent successfully!' : 'Action successful!';
                
                alert(message);
                btn.innerText = originalText;
                btn.disabled = false;
                
                if (isContactForm) {
                    form.reset();
                }
            }, 1000);
        });
    });

    // Progress Tracking Logic
    const getProgress = () => {
        return {
            quizzes: parseInt(localStorage.getItem('quizCount') || '0'),
            coding: parseInt(localStorage.getItem('codingCount') || '0'),
            simulations: parseInt(localStorage.getItem('simCount') || '0')
        };
    };

    const saveProgress = (type) => {
        const progress = getProgress();
        if (type === 'quiz') {
            localStorage.setItem('quizCount', progress.quizzes + 1);
        } else if (type === 'coding') {
            localStorage.setItem('codingCount', progress.coding + 1);
        } else if (type === 'simulation') {
            localStorage.setItem('simCount', progress.simulations + 1);
        }
    };

    const getBadge = (total) => {
        if (total >= 100) return { name: 'Gold', color: '#ffd700', icon: '🏆', next: 100 };
        if (total >= 50) return { name: 'Silver', color: '#c0c0c0', icon: '🥈', next: 100 };
        if (total >= 10) return { name: 'Bronze', color: '#cd7f32', icon: '🥉', next: 50 };
        return { name: 'Beginner', color: '#94a3b8', icon: '🌱', next: 10 };
    };

    // Dashboard & Progress Logic
    const statsQuizzes = document.querySelectorAll('#stats-quizzes');
    const statsCoding = document.querySelectorAll('#stats-coding');
    const statsSims = document.querySelectorAll('#stats-sims');
    const statsBadge = document.querySelectorAll('#stats-badge');
    const progressBar = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-next-text');

    const updateUI = () => {
        const p = getProgress();
        const total = p.quizzes + p.coding + p.simulations;
        const badge = getBadge(total);
        
        statsQuizzes.forEach(el => el.innerText = p.quizzes);
        statsCoding.forEach(el => el.innerText = p.coding);
        statsSims.forEach(el => el.innerText = p.simulations);
        statsBadge.forEach(el => {
            el.innerHTML = `<span style="color: ${badge.color}">${badge.icon} ${badge.name}</span>`;
        });

        if (progressBar && progressText) {
            let prevThreshold = 0;
            if (total >= 100) prevThreshold = 100;
            else if (total >= 50) prevThreshold = 50;
            else if (total >= 10) prevThreshold = 10;

            const nextThreshold = badge.next;
            const diff = nextThreshold - prevThreshold;
            const currentProgress = total - prevThreshold;
            
            let percentage = 0;
            if (total >= 100) {
                percentage = 100;
                progressText.innerText = "Maximum Level Reached!";
            } else {
                percentage = (currentProgress / diff) * 100;
                progressText.innerText = `${nextThreshold - total} more activities until ${getBadge(nextThreshold).name} Badge`;
            }
            
            progressBar.style.width = `${percentage}%`;
        }
    };

    if (statsQuizzes.length > 0 || statsCoding.length > 0 || statsSims.length > 0) {
        updateUI();
    }

    // Simulation Logic (Placeholder)
    const launchSimBtn = document.getElementById('launch-sim');
    if (launchSimBtn) {
        launchSimBtn.addEventListener('click', () => {
            alert('Launching AI Simulation Sandbox...');
            saveProgress('simulation');
            updateUI();
        });
    }

    // Play Logic (Placeholder)
    const playBtns = document.querySelectorAll('.play-game-btn');
    playBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Starting Game: ' + btn.dataset.game);
        });
    });

    // MCQ Quiz Logic
    const quizData = [
        {
            question: "What does AI stand for?",
            options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Analytical Insight"],
            correct: 1
        },
        {
            question: "Which type of ML uses labeled data for training?",
            options: ["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "Deep Learning"],
            correct: 2
        },
        {
            question: "What is a common application of Supervised Learning?",
            options: ["Clustering users", "Spam detection", "Self-driving cars", "Data compression"],
            correct: 1
        },
        {
            question: "Which algorithm is inspired by the human brain?",
            options: ["Decision Trees", "Linear Regression", "Neural Networks", "K-Means Clustering"],
            correct: 2
        },
        {
            question: "What is the goal of Unsupervised Learning?",
            options: ["Predicting a label", "Finding hidden patterns", "Maximizing rewards", "Minimizing error in labels"],
            correct: 1
        },
        {
            question: "What is 'Overfitting' in Machine Learning?",
            options: ["Model is too simple", "Model is too complex and fits noise", "Model is perfectly balanced", "Model has no data"],
            correct: 1
        },
        {
            question: "Which of these is a popular Python library for ML?",
            options: ["Django", "Flask", "Scikit-Learn", "React"],
            correct: 2
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let selectedOption = null;

    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const nextBtn = document.getElementById('next-btn');
    const progressEl = document.getElementById('progress');
    const quizArea = document.getElementById('quiz-area');
    const resultArea = document.getElementById('result-area');
    const scoreDisplay = document.getElementById('score-display');
    const resultMessage = document.getElementById('result-message');

    function loadQuestion() {
        if (!questionEl) return;

        const data = quizData[currentQuestion];
        questionEl.innerText = data.question;
        optionsEl.innerHTML = '';
        selectedOption = null;
        nextBtn.disabled = true;
        progressEl.innerText = `Question ${currentQuestion + 1} of ${quizData.length}`;

        data.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            btn.innerText = option;
            btn.onclick = () => selectOption(index, btn);
            optionsEl.appendChild(btn);
        });
    }

    function selectOption(index, btn) {
        selectedOption = index;
        const allBtns = optionsEl.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        nextBtn.disabled = false;
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            if (selectedOption === quizData[currentQuestion].correct) {
                score++;
            }

            currentQuestion++;

            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                showResults();
            }
        };
    }

    function showResults() {
        quizArea.style.display = 'none';
        resultArea.style.display = 'block';
        scoreDisplay.innerText = `${score}/${quizData.length}`;

        let msg = "";
        if (score <= 3) msg = "Keep learning, you'll get there!";
        else if (score <= 5) msg = "Great job! You have a solid foundation.";
        else msg = "Perfect score! You're an AI master.";

        resultMessage.innerText = msg;
        
        // Save Progress
        saveProgress('quiz');
    }

    if (questionEl) {
        loadQuestion();
    }

    // Coding Practice Logic
    const runBtn = document.getElementById('run-code');
    const codeEditor = document.getElementById('code-editor');
    const codeOutput = document.getElementById('code-output');

    if (runBtn) {
        runBtn.onclick = () => {
            const code = codeEditor.value.trim();
            codeOutput.innerHTML = '<span style="color: var(--text-muted)">Running...</span>';
            
            setTimeout(() => {
                if (code.includes('console.log') && (code.includes('Hello World') || code.includes('hello world'))) {
                    codeOutput.innerHTML = '<span style="color: #22c55e">Hello World</span><br><br><span style="color: #22c55e">✓ Test Passed!</span>';
                    saveProgress('coding');
                } else if (code === '') {
                    codeOutput.innerHTML = '<span style="color: #ef4444">Error: Code cannot be empty.</span>';
                } else {
                    codeOutput.innerHTML = '<span style="color: #ef4444">Output: Error in code execution or incorrect output.</span><br><br><span style="color: var(--text-muted)">Hint: Use console.log("Hello World")</span>';
                }
            }, 800);
        };
    }
});
