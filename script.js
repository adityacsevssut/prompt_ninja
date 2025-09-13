document.addEventListener('DOMContentLoaded', () => {

    // ======================= MOCK DATA & IN-MEMORY STORAGE =======================
    let registeredUsers = []; // Array to store registered user objects
    let pendingRegistrationData = null; // To hold user data during OTP verification

    // Data for department contacts, to be shown on successful location tracking
    const departmentContacts = {
        "Sanitation Department": [
            { name: "Aarav Sharma", phone: "9812345670", email: "a.sharma@dept.gov.in" },
            { name: "Priya Singh", phone: "9987654321", email: "p.singh@dept.gov.in" },
            { name: "Rohan Gupta", phone: "9712312345", email: "r.gupta@dept.gov.in" },
            { name: "Sneha Patel", phone: "9654321098", email: "s.patel@dept.gov.in" }
        ],
        "PWD (Public Works Department)": [
            { name: "Vikram Reddy", phone: "8912345678", email: "v.reddy@dept.gov.in" },
            { name: "Anjali Mehta", phone: "8876543210", email: "a.mehta@dept.gov.in" },
            { name: "Suresh Iyer", phone: "8712345678", email: "s.iyer@dept.gov.in" }
        ],
        "Water Board": [
            { name: "Deepika Rao", phone: "7912345678", email: "d.rao@dept.gov.in" },
            { name: "Amit Kumar", phone: "7812345678", email: "a.kumar@dept.gov.in" },
            { name: "Neha Joshi", phone: "7765432109", email: "n.joshi@dept.gov.in" },
            { name: "Karan Malhotra", phone: "7612345678", email: "k.malhotra@dept.gov.in" }
        ],
        "Electricity Board": [
            { name: "Manoj Tiwari", phone: "9512345678", email: "m.tiwari@dept.gov.in" },
            { name: "Pooja Verma", phone: "9487654321", email: "p.verma@dept.gov.in" }
        ],
        "Traffic Police": [
            { name: "Inspector Arjun Singh", phone: "9312345678", email: "a.singh@police.gov.in" },
            { name: "Sub-Inspector Meera Desai", phone: "9287654321", email: "m.desai@police.gov.in" }
        ],
        "Municipal Corporation": [
            { name: "Commissioner Alok Nath", phone: "9112345678", email: "c.aloknath@mc.gov.in" },
            { name: "Geeta Biswas", phone: "9087654321", email: "g.biswas@mc.gov.in" },
            { name: "Ravi Chandran", phone: "8912312345", email: "r.chandran@mc.gov.in" }
        ]
    };

    // Updated civic data with department names for the dashboard chart
    const civicData = {
        national: {
            total: 125432, resolved: 98765, cleanliness: 8.2,
            categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [35000, 22000, 18000, 15000, 28000, 7432] }
        },
        states: {
            "Odisha": {
                total: 8500, resolved: 7200, cleanliness: 8.8,
                categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [2200, 1500, 1100, 900, 1800, 1000] },
                cities: {
                    "Bhubaneswar": { total: 4200, resolved: 3800, cleanliness: 9.1, categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [1100, 800, 500, 400, 900, 500] } },
                    "Cuttack": { total: 2800, resolved: 2100, cleanliness: 8.5, categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [800, 500, 400, 350, 600, 150] } },
                    "Puri": { total: 1500, resolved: 1300, cleanliness: 8.9, categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [300, 200, 200, 150, 300, 350] } }
                }
            },
            "Maharashtra": {
                total: 15200, resolved: 12500, cleanliness: 9.2,
                categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [4500, 3000, 2500, 1800, 2400, 1000] },
                cities: {
                    "Mumbai": { total: 7500, resolved: 6000, cleanliness: 9.0, categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [2500, 1500, 1200, 800, 1000, 500] } },
                    "Pune": { total: 5200, resolved: 4500, cleanliness: 9.4, categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [1500, 1000, 900, 600, 900, 300] } },
                    "Navi Mumbai": { total: 2500, resolved: 2320, cleanliness: 9.7, categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [500, 500, 400, 400, 500, 200] } }
                }
            },
            "Gujarat": {
                total: 9800, resolved: 8900, cleanliness: 9.5,
                categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [2800, 1800, 1500, 1200, 1900, 600] },
                cities: {
                    "Ahmedabad": { total: 4500, resolved: 4000, cleanliness: 9.3, categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [1300, 900, 700, 600, 800, 200] } },
                    "Surat": { total: 5300, resolved: 4900, cleanliness: 9.8, categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [1500, 900, 800, 600, 1100, 400] } }
                }
            }
        },
        pincodes: {
            "751001": { state: "Odisha", city: "Bhubaneswar", total: 150, resolved: 142, cleanliness: 9.5, categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [40, 30, 20, 10, 35, 17] }},
            "400001": { state: "Maharashtra", city: "Mumbai", total: 210, resolved: 180, cleanliness: 8.9, categories: { labels: ['Sanitation', 'PWD', 'Water', 'Electricity', 'Traffic', 'Municipal'], values: [60, 45, 30, 20, 40, 15] }}
        }
    };
    
    const municipalities = { ...civicData.states.Odisha.cities, ...civicData.states.Maharashtra.cities, ...civicData.states.Gujarat.cities };


    // ======================= PAGE NAVIGATION (SPA-LIKE BEHAVIOR) =======================
    const navLinks = document.querySelectorAll('.nav-link, .page-switcher');
    const pages = document.querySelectorAll('.page');
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    let impactMapInitialized = false;
    
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const navChatbotLink = document.getElementById('nav-chatbot-link');

    const showPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        } else {
            document.getElementById('home').classList.add('active');
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });

        if (mainNav.classList.contains('open')) {
            mainNav.classList.remove('open');
            navToggle.classList.remove('active'); // Also deactivate toggle button
        }
        window.scrollTo(0, 0);

        if (pageId === 'dashboard') updateDashboardDisplay(civicData.national, 'National');
        if (pageId === 'leaderboard') renderLeaderboard('city');
        if (pageId === 'credit') renderCreditPage('state');
        if (pageId === 'impact-map' && !impactMapInitialized) {
            initializeImpactMap();
            impactMapInitialized = true;
        }
    };

    navLinks.forEach(link => {
        if (link.id !== 'nav-chatbot-link') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.target.getAttribute('href').substring(1);
                showPage(pageId);
            });
        }
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            navToggle.classList.toggle('active');
        });
    }

    document.addEventListener('click', (e) => {
        // --- Logic to close the Navigation Menu ---
        const isClickInsideNav = mainNav.contains(e.target);
        const isClickOnNavToggle = navToggle.contains(e.target);
        if (mainNav.classList.contains('open') && !isClickInsideNav && !isClickOnNavToggle) {
            mainNav.classList.remove('open');
            navToggle.classList.remove('active');
        }

        // --- Logic to close the Chatbot Window ---
        const isClickInsideChatbot = chatbotWindow.contains(e.target);
        const isClickOnChatbotToggler = chatbotToggler.contains(e.target);
        const isClickOnChatbotNavLink = (e.target === navChatbotLink); // The nav link is also a trigger
        if (chatbotWindow.classList.contains('open') && !isClickInsideChatbot && !isClickOnChatbotToggler && !isClickOnChatbotNavLink) {
            chatbotWindow.classList.remove('open');
        }
    });


    // ======================= REPORT ISSUE FORM =======================
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedDepartment = document.getElementById('department').value;
            alert(`Issue reported successfully to the ${selectedDepartment}! Thank you for your contribution.`);
            reportForm.reset();
            document.getElementById('location-display').innerHTML = '<p>Location will be auto-detected.</p>';
            document.getElementById('department-contacts-container').classList.add('hidden');
        });
    }

    // ======================= REPORT ISSUE ENHANCEMENTS (VOICE, GPS, CONTACTS) =======================
    const voiceInputBtn = document.getElementById('voice-input-btn');
    const issueDescription = document.getElementById('issue-description');
    const trackLocationBtn = document.getElementById('track-location-btn');
    const locationDisplay = document.getElementById('location-display');
    const departmentSelect = document.getElementById('department');
    const contactsContainer = document.getElementById('department-contacts-container');
    const contactsList = document.getElementById('department-contacts-list');

    function renderContactCards(departmentKey) {
        const contacts = departmentContacts[departmentKey];
        contactsList.innerHTML = ''; 

        if (contacts && contacts.length > 0) {
            contacts.forEach(contact => {
                const card = document.createElement('div');
                card.className = 'contact-card';
                card.innerHTML = `
                    <p><strong>${contact.name}</strong></p>
                    <p><i class="fas fa-phone"></i> ${contact.phone}</p>
                    <p><i class="fas fa-envelope"></i> ${contact.email}</p>
                `;
                contactsList.appendChild(card);
            });
            contactsContainer.classList.remove('hidden');
        } else {
            contactsContainer.classList.add('hidden');
        }
    }

    if (departmentSelect) {
        departmentSelect.addEventListener('change', (e) => {
            if (!contactsContainer.classList.contains('hidden')) {
                renderContactCards(e.target.value);
            }
        });
    }

    if (voiceInputBtn && issueDescription) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-IN';
            recognition.interimResults = false;

            voiceInputBtn.addEventListener('click', () => recognition.start());
            recognition.onstart = () => { voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i> Listening...'; voiceInputBtn.disabled = true; };
            recognition.onresult = (event) => { issueDescription.value = event.results[0][0].transcript; };
            recognition.onerror = (event) => { alert(`Error occurred in speech recognition: ${event.error}.`); };
            recognition.onend = () => { voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i> Use Voice Input'; voiceInputBtn.disabled = false; };
        } else {
            voiceInputBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Not Supported';
            voiceInputBtn.disabled = true;
        }
    }

    if (trackLocationBtn && locationDisplay) {
        trackLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                locationDisplay.innerHTML = '<p>Tracking your location...</p>';
                navigator.geolocation.getCurrentPosition(
                    // ========== START: MODIFIED CODE ==========
                    // This function now calls a reverse geocoding API to get the address.
                    (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        locationDisplay.innerHTML = `<p>Fetching address for your coordinates...</p>`;

                        // Using OpenStreetMap's free Nominatim service
                        const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

                        fetch(geocodeUrl)
                            .then(response => response.json())
                            .then(data => {
                                // Extract the full address and pincode from the API response
                                const address = data.display_name || "Could not determine address.";
                                const pincode = data.address?.postcode || "N/A";
                                
                                locationDisplay.innerHTML = `
                                    <p style="margin-bottom: 0.5rem;"><b>Location Acquired:</b></p>
                                    <p style="font-size: 0.9rem;">${address}</p>
                                    <p style="margin-top: 0.5rem;"><b>Pincode:</b> ${pincode}</p>
                                `;

                                // Show department contacts after finding the location
                                const selectedDepartment = departmentSelect.value;
                                if (selectedDepartment) {
                                    renderContactCards(selectedDepartment);
                                } else {
                                    contactsList.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">Please select a department to see relevant contacts.</p>`;
                                    contactsContainer.classList.remove('hidden');
                                }
                            })
                            .catch(err => {
                                console.error("Reverse geocoding failed:", err);
                                locationDisplay.innerHTML = `<p style="color: #e53935;">Error: Could not fetch address details. Using coordinates instead.<br>Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}</p>`;
                            });
                    },
                    // ========== END: MODIFIED CODE ==========
                    (error) => {
                         locationDisplay.innerHTML = `<p style="color: #e53935;">Error: ${error.message}</p>`;
                    },
                    { enableHighAccuracy: true }
                );
            } else {
                locationDisplay.innerHTML = '<p style="color: #e53935;">Geolocation is not supported by this browser.</p>';
            }
        });
    }

    // ======================= LOGIN PAGE TABS =======================
    const tabLinks = document.querySelectorAll('.login-tabs .tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.dataset.tab;
            tabLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) content.classList.add('active');
            });
        });
    });
    
    // ======================= GOV/CORP LOGIN FORM (GENERIC) =======================
    const otherLoginForms = document.querySelectorAll('#gov-login-form, #corp-login-form');
    otherLoginForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login successful! (Prototype for Gov/Corp)');
            form.reset();
        });
    });

    // ======================= DASHBOARD LOGIC =======================
    const dashboardTitle = document.getElementById('dashboard-title');
    const stateSelect = document.getElementById('dashboard-state-select');
    const citySelect = document.getElementById('dashboard-city-select');
    const pincodeInput = document.getElementById('dashboard-pincode-input');
    const filterBtn = document.getElementById('dashboard-filter-btn');

    for (const state in civicData.states) {
        stateSelect.add(new Option(state, state));
    }
    
    stateSelect.addEventListener('change', () => {
        citySelect.innerHTML = '<option value="">-- Select City --</option>';
        const selectedState = stateSelect.value;
        if (selectedState && civicData.states[selectedState].cities) {
            for (const city in civicData.states[selectedState].cities) {
                citySelect.add(new Option(city, city));
            }
        }
    });
    
    filterBtn.addEventListener('click', () => {
        const pincode = pincodeInput.value;
        const city = citySelect.value;
        const state = stateSelect.value;
        if (pincode && civicData.pincodes[pincode]) {
            updateDashboardDisplay(civicData.pincodes[pincode], `Pincode ${pincode}`);
        } else if (city && state && civicData.states[state].cities[city]) {
            updateDashboardDisplay(civicData.states[state].cities[city], city);
        } else if (state && civicData.states[state]) {
            updateDashboardDisplay( civicData.states[state], state);
        } else {
            updateDashboardDisplay(civicData.national, 'National');
        }
    });

    function updateDashboardDisplay(data, locationName) {
        dashboardTitle.textContent = `Dashboard Overview - ${locationName}`;
        document.getElementById('total-complaints').textContent = data.total.toLocaleString('en-IN');
        document.getElementById('complaints-resolved').textContent = data.resolved.toLocaleString('en-IN');
        const resolutionPercentage = data.total > 0 ? ((data.resolved / data.total) * 100).toFixed(2) + '%' : 'N/A';
        document.getElementById('resolution-percentage').textContent = resolutionPercentage;
        document.getElementById('cleanliness-index').textContent = `${data.cleanliness} / 10`;
        drawDashboardChart(data.categories);
    }

    const drawDashboardChart = (data) => {
        const chart = document.getElementById('complaintsChart');
        if (!chart || !data) return;
        const canvas = chart.getContext('2d');
        
        const chartPadding = { top: 20, right: 20, bottom: 40, left: 80 };
        const chartWidth = chart.width - chartPadding.left - chartPadding.right;
        const chartHeight = chart.height - chartPadding.top - chartPadding.bottom;
        const barHeight = chartHeight / data.labels.length * 0.7;
        const barSpacing = chartHeight / data.labels.length * 0.3;
        const maxValue = Math.max(...data.values);

        canvas.clearRect(0, 0, chart.width, chart.height);

        canvas.font = "12px Poppins";
        canvas.fillStyle = "#666";
        canvas.textAlign = 'right';
        canvas.textBaseline = 'middle';
        
        data.labels.forEach((label, i) => {
            const y = chartPadding.top + i * (barHeight + barSpacing) + (barHeight / 2);
            canvas.fillText(label, chartPadding.left - 10, y);
        });

        canvas.textAlign = 'center';
        canvas.textBaseline = 'top';
        const numGridLines = 5;
        for (let i = 0; i <= numGridLines; i++) {
            const value = Math.round((maxValue / numGridLines) * i);
            const x = chartPadding.left + (i / numGridLines) * chartWidth;

            canvas.fillText(value, x, chartPadding.top + chartHeight + 10);
            canvas.beginPath();
            canvas.moveTo(x, chartPadding.top);
            canvas.lineTo(x, chartPadding.top + chartHeight);
            canvas.strokeStyle = '#e0e0e0';
            canvas.stroke();
        }

        data.values.forEach((value, i) => {
            const barWidth = maxValue > 0 ? (value / maxValue) * chartWidth : 0;
            const y = chartPadding.top + i * (barHeight + barSpacing);
            
            canvas.fillStyle = '#0d47a1';
            canvas.fillRect(chartPadding.left, y, barWidth, barHeight);
        });
    };
    
    // ======================= LEADERBOARD LOGIC =======================
    const sortSelect = document.getElementById('sort-leaderboard');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const viewTabs = document.querySelectorAll('.leaderboard-view-tabs .tab-link');
    const regionHeader = document.getElementById('leaderboard-region-header');
    
    function renderLeaderboard(view) {
        leaderboardBody.innerHTML = '';
        regionHeader.textContent = view.charAt(0).toUpperCase() + view.slice(1);
        let dataToRender = {};
        if (view === 'state') {
            dataToRender = civicData.states;
        } else if (view === 'city') {
             Object.values(civicData.states).forEach(state => Object.assign(dataToRender, state.cities));
        } else if (view === 'municipality') {
            Object.assign(dataToRender, municipalities);
        }
        for (const name in dataToRender) {
            const item = dataToRender[name];
            const resolved = item.total > 0 ? ((item.resolved / item.total) * 100).toFixed(1) : 0;
            const cleanliness = (item.cleanliness * 10).toFixed(1);
            const row = document.createElement('tr');
            row.innerHTML = `<td>--</td><td>${name}</td><td data-resolved="${resolved}">${resolved}%</td><td data-cleanliness="${cleanliness}">${cleanliness}%</td>`;
            leaderboardBody.appendChild(row);
        }
        sortLeaderboard();
    }
    
    viewTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            viewTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderLeaderboard(tab.dataset.view);
        });
    });

    function sortLeaderboard() {
        if (!leaderboardBody) return;
        const sortBy = sortSelect.value;
        const rows = Array.from(leaderboardBody.querySelectorAll('tr'));
        const sortedRows = rows.sort((a, b) => {
            let valA = (sortBy === 'resolved') ? parseFloat(a.querySelector('td[data-resolved]').dataset.resolved) : parseFloat(a.querySelector('td[data-cleanliness]').dataset.cleanliness);
            let valB = (sortBy === 'resolved') ? parseFloat(b.querySelector('td[data-resolved]').dataset.resolved) : parseFloat(b.querySelector('td[data-cleanliness]').dataset.cleanliness);
            return valB - valA;
        });
        leaderboardBody.innerHTML = '';
        sortedRows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
            leaderboardBody.appendChild(row);
        });
    }

    if(sortSelect) sortSelect.addEventListener('change', sortLeaderboard);

    // ======================= CREDIT PAGE LOGIC =======================
    const creditBody = document.getElementById('credit-body');
    const creditViewTabs = document.querySelectorAll('#credit-view-tabs .tab-link');

    function renderCreditPage(view) {
        if (!creditBody) return;
        creditBody.innerHTML = '';

        let dataToProcess = {};
        if (view === 'state') {
            dataToProcess = civicData.states;
        } else if (view === 'city') {
            Object.values(civicData.states).forEach(state => Object.assign(dataToProcess, state.cities));
        } else if (view === 'municipality') {
            Object.assign(dataToProcess, municipalities);
        }

        const calculatedData = Object.entries(dataToProcess).map(([name, item]) => {
            const resolutionPercentage = item.total > 0 ? (item.resolved / item.total) * 100 : 0;
            const cleanliness = item.cleanliness;
            const creditPoints = Math.round((resolutionPercentage * 5) + (cleanliness * 50));
            return { name, resolutionPercentage, cleanliness, creditPoints };
        });
        
        calculatedData.sort((a, b) => b.creditPoints - a.creditPoints);

        calculatedData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.resolutionPercentage.toFixed(1)}%</td>
                <td>${item.cleanliness.toFixed(1)} / 10</td>
                <td><strong>${item.creditPoints}</strong></td>
            `;
            creditBody.appendChild(row);
        });
    }

    creditViewTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            creditViewTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderCreditPage(tab.dataset.view);
        });
    });

    // ======================= CHATBOT WIDGET =======================
    const chatBody = document.querySelector('.chat-body');
    const chatInput = document.querySelector('.chat-footer input');
    const chatSendBtn = document.querySelector('.chat-footer button');

    const toggleChatbot = (e) => {
        if (e) e.preventDefault();
        chatbotWindow.classList.toggle('open');
    };
    
    if (chatbotToggler) chatbotToggler.addEventListener('click', toggleChatbot);
    if (navChatbotLink) navChatbotLink.addEventListener('click', toggleChatbot);

    const appendMessage = (message, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', sender);
        msgDiv.textContent = message;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    };
    
    const getBotResponse = (userInput) => {
        const lowerInput = userInput.toLowerCase();
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) return 'Hello! How can I assist you with civic issues today?';
        if (lowerInput.includes('report') || lowerInput.includes('issue')) return 'To report an issue, please navigate to the "Report Issue" page from the main menu.';
        if (lowerInput.includes('status') || lowerInput.includes('track')) return 'You can track the status of your reported issues from your personal dashboard after logging in.';
        if (lowerInput.includes('login') || lowerInput.includes('signup')) return 'Please visit the "Login" page to access your account or to register as a new user.';
        if (lowerInput.includes('dashboard')) return 'The dashboard provides an overview of all civic complaints. You can access it from the main menu.';
        if (lowerInput.includes('bye') || lowerInput.includes('thank')) return 'You\'re welcome! Have a great day.';
        return "I'm sorry, I don't understand that. You can ask me about how to 'report' an issue, check the 'status', or how to 'login'.";
    };

    const handleChat = () => {
        const userInput = chatInput.value.trim();
        if (userInput === '') return;
        appendMessage(userInput, 'user');
        chatInput.value = '';
        setTimeout(() => appendMessage(getBotResponse(userInput), 'bot'), 500);
    };
    
    if (chatSendBtn) chatSendBtn.addEventListener('click', handleChat);
    if (chatInput) chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); handleChat(); }
    });

    // ======================= CITIZEN REGISTRATION AND LOGIN FLOW =======================
    const citizenTab = document.getElementById('citizen');
    if (citizenTab) {
        const loginForm = document.getElementById('citizen-login-form');
        const registerForm = document.getElementById('citizen-register-form');
        const otpForm = document.getElementById('otp-verify-form');
        const showRegisterLink = document.getElementById('show-register-link');
        const showLoginLink = document.getElementById('show-login-link');

        if(showRegisterLink) {
            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            });
        }

        if(showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newUser = {
                    firstName: document.getElementById('reg-fname').value,
                    lastName: document.getElementById('reg-lname').value,
                    aadhaar: document.getElementById('reg-aadhaar').value,
                    email: document.getElementById('reg-email').value,
                    phone: document.getElementById('reg-phone').value,
                };
                
                const userExists = registeredUsers.some(user => user.email === newUser.email || user.phone === newUser.phone);
                if (userExists) {
                    alert('A user with this email or phone number already exists.');
                    return;
                }
                
                pendingRegistrationData = newUser;
                alert("A one-time password (OTP) has been sent to your registered email and phone number for verification.");
                registerForm.classList.add('hidden');
                otpForm.classList.remove('hidden');
            });
        }

        if (otpForm) {
            otpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const otpInput = document.getElementById('otp-input');
                if (otpInput.value.trim() === '123456') { 
                    if(pendingRegistrationData) {
                        registeredUsers.push(pendingRegistrationData);
                        console.log('Registered Users:', registeredUsers);
                        pendingRegistrationData = null;
                    }
                    alert('Verification successful! Your registration is complete. You can now log in.');
                    otpForm.classList.add('hidden');
                    loginForm.classList.remove('hidden');
                    registerForm.reset(); 
                    otpInput.value = '';
                } else {
                    alert('The OTP you entered is incorrect. Please try again.');
                }
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', e => {
                e.preventDefault();
                const identifier = document.getElementById('citizen-email').value;
                const otp = document.getElementById('citizen-password').value;
                const user = registeredUsers.find(u => u.email === identifier || u.phone === identifier);

                if (user && otp === '123456') {
                    alert(`Welcome back, ${user.firstName}! Login successful.`);
                    loginForm.reset();
                } else {
                    alert('Invalid credentials or user not found. Please register first or check your details.');
                }
            });
        }
    }
    
    // ======================= IMPACT MAP LOGIC ==========================
    function initializeImpactMap() {
        const map = L.map('impact-map-container').setView([20.2961, 85.8245], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const mapIssues = [
            { lat: 20.2706, lng: 85.8213, title: 'Uncollected Garbage', status: 'Reported' },
            { lat: 20.3120, lng: 85.8335, title: 'Broken Streetlight', status: 'In Progress' },
            { lat: 20.2541, lng: 85.8011, title: 'Pothole Repair', status: 'Resolved' },
            { lat: 20.3030, lng: 85.8500, title: 'Sewage Overflow', in: 'In Progress' },
            { lat: 20.2625, lng: 85.8450, title: 'Illegal Parking', status: 'Reported' },
            { lat: 20.3344, lng: 85.8099, title: 'Water Pipe Leakage', status: 'Resolved' }
        ];

        const createIcon = (iconUrl) => new L.Icon({
            iconUrl: iconUrl,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        const icons = {
            'Reported': createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'),
            'In Progress': createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png'),
            'Resolved': createIcon('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png')
        };
        
        mapIssues.forEach(issue => {
            const markerIcon = icons[issue.status] || icons['Reported'];
            L.marker([issue.lat, issue.lng], { icon: markerIcon })
             .addTo(map)
             .bindPopup(`<b>${issue.title}</b><br>Status: ${issue.status}`);
        });

        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
    
    // Initial page load setup
    showPage('home');
});