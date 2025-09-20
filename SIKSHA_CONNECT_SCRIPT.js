/* ======================================================================= */
/* ============================ script.js ================================ */
/* ======================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- Theme (Dark/Light Mode) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Apply saved theme on load
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    // Toggle theme on change
    themeToggle.addEventListener('change', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        }
    });


    // --- Animated Counters (Homepage) ---
    const counters = document.querySelectorAll('.counter h3');
    const speed = 200; // The lower the #, the faster the count

    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = Math.ceil(target / speed);

                if (count < target) {
                    counter.innerText = count + inc;
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Use Intersection Observer to trigger counter animation on scroll
    const impactSection = document.querySelector('.impact');
    if (impactSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounters();
                observer.disconnect(); // Animate only once
            }
        }, { threshold: 0.5 });
        observer.observe(impactSection);
    }
    
    
    // --- Auto-rotating Slider (Homepage) ---
    const slidesContainer = document.querySelector(".slides");
    if (slidesContainer) {
        const slides = document.querySelectorAll(".slide");
        let currentIndex = 0;
        const slideInterval = 5000; // 5 seconds

        const showNextSlide = () => {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            slides[currentIndex].classList.add('active');
        };

        setInterval(showNextSlide, slideInterval);
    }
    

    // --- Live Filtering (Courses Page) ---
    const searchBar = document.getElementById('search-bar');
    const subjectFilter = document.getElementById('filter-subject');
    const difficultyFilter = document.getElementById('filter-difficulty');
    const courseCards = document.querySelectorAll('.course-card');
    const noResultsMessage = document.getElementById('no-results-message');

    function filterCourses() {
        const searchTerm = searchBar ? searchBar.value.toLowerCase() : '';
        const subject = subjectFilter ? subjectFilter.value : 'all';
        const difficulty = difficultyFilter ? difficultyFilter.value : 'all';
        let visibleCourses = 0;

        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const cardSubject = card.dataset.subject;
            const cardDifficulty = card.dataset.difficulty;

            const matchesSearch = title.includes(searchTerm);
            const matchesSubject = subject === 'all' || cardSubject === subject;
            const matchesDifficulty = difficulty === 'all' || cardDifficulty === difficulty;

            if (matchesSearch && matchesSubject && matchesDifficulty) {
                card.style.display = 'flex';
                visibleCourses++;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (noResultsMessage) {
            noResultsMessage.style.display = visibleCourses === 0 ? 'block' : 'none';
        }
    }
    
    if (searchBar) searchBar.addEventListener('keyup', filterCourses);
    if (subjectFilter) subjectFilter.addEventListener('change', filterCourses);
    if (difficultyFilter) difficultyFilter.addEventListener('change', filterCourses);


    // --- Client-Side Form Validation (Contact Page) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const successMessage = document.getElementById('form-success-message');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm()) {
                // Here you would normally send the data to a server
                console.log('Form is valid! Submitting...');
                successMessage.style.display = 'block';
                contactForm.reset();
                setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
            }
        });

        const validateForm = () => {
            let isValid = true;
            isValid &= validateField(name, name.value.trim() !== '', 'Name cannot be empty.');
            isValid &= validateField(email, isValidEmail(email.value.trim()), 'Please enter a valid email address.');
            isValid &= validateField(message, message.value.trim() !== '', 'Message cannot be empty.');
            return isValid;
        };

        const validateField = (field, condition, errorMessage) => {
            const formGroup = field.parentElement;
            const errorElement = formGroup.querySelector('.error-message');
            if (condition) {
                formGroup.classList.remove('error');
                errorElement.textContent = '';
                return true;
            } else {
                formGroup.classList.add('error');
                errorElement.textContent = errorMessage;
                return false;
            }
        };
        
        const isValidEmail = (email) => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };
    }
    
    // --- Chatbot ---
    const chatIcon = document.getElementById('chat-icon');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const chatBody = document.getElementById('chat-body');

    if (chatIcon) {
        chatIcon.addEventListener('click', () => chatWindow.classList.toggle('open'));
        closeChat.addEventListener('click', () => chatWindow.classList.remove('open'));

        const handleChat = () => {
            const userMessage = chatInput.value.trim();
            if (userMessage === '') return;

            // Add user message to chat
            addMessage(userMessage, 'user');
            chatInput.value = '';

            // Get bot response
            setTimeout(() => {
                const botResponse = getBotResponse(userMessage);
                addMessage(botResponse, 'bot');
            }, 500);
        };
        
        sendChat.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleChat();
            }
        });

        const addMessage = (text, sender) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', sender);
            messageDiv.textContent = text;
            chatBody.appendChild(messageDiv);
            chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll to latest message
        };

        const getBotResponse = (userInput) => {
            const lcInput = userInput.toLowerCase();
            if (lcInput.includes('hello') || lcInput.includes('hi')) {
                return "Hello! How can I help you today?";
            } else if (lcInput.includes('course')) {
                return "We offer a wide range of courses in Web Development, Data Science, and Design. You can see them all on our Courses page.";
            } else if (lcInput.includes('price') || lcInput.includes('pricing') || lcInput.includes('cost')) {
                return "All our courses are currently free as part of our mission for quality education for all!";
            } else if (lcInput.includes('contact') || lcInput.includes('email')) {
                return "You can contact us via the form on our Contact page or by emailing contact@sikshaconnect.org.";
            } else if (lcInput.includes('bye') || lcInput.includes('goodbye')) {
                return "Goodbye! Have a great day.";
            } else {
                return "I'm sorry, I didn't understand that. You can ask me about our courses, pricing, or how to contact us.";
            }
        };
    }
});