// Check authentication first
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize only if authenticated
if (checkAuth()) {
    // Initialize charts when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize all components
        initializeCharts();
        initializeDashboardDragDrop();
        loadRecentActivities();
        initializeRecognitionCarousel();
        initializeForumPosts();
        initializeEventListeners();
        updateUserInfo();
        initializeRecognition();
        
        // Initialize tooltips and popovers
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Initialize Bootstrap popovers
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    });
}

// Initialize Charts with animation
function initializeCharts() {
    // Innovation Metrics Chart
    const innovationMetricsCtx = document.getElementById('innovationMetrics').getContext('2d');
    new Chart(innovationMetricsCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Innovations',
                data: [12, 19, 15, 25, 22, 30],
                backgroundColor: '#6366f1',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Department Performance Chart
    const departmentPerformanceCtx = document.getElementById('departmentPerformance').getContext('2d');
    new Chart(departmentPerformanceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Engineering', 'Design', 'Research', 'Marketing'],
            datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: ['#6366f1', '#818cf8', '#4f46e5', '#c7d2fe']
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000,
                animateRotate: true
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Initialize Dashboard Drag and Drop
function initializeDashboardDragDrop() {
    const widgets = document.querySelectorAll('.widget');
    const dashboard = document.getElementById('draggable-dashboard');
    let draggedWidget = null;

    widgets.forEach(widget => {
        widget.addEventListener('dragstart', (e) => {
            draggedWidget = widget;
            widget.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        widget.addEventListener('dragend', () => {
            widget.classList.remove('dragging');
            draggedWidget = null;
            saveWidgetPositions();
        });

        widget.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggedWidget && widget !== draggedWidget) {
                const rect = widget.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                if (e.clientY < midpoint) {
                    widget.parentNode.insertBefore(draggedWidget, widget);
                } else {
                    widget.parentNode.insertBefore(draggedWidget, widget.nextSibling);
                }
            }
        });
    });
}

// Load Recent Activities with animation
function loadRecentActivities() {
    const activities = [
        { user: 'John Doe', action: 'submitted new innovation', time: '2 hours ago' },
        { user: 'Jane Smith', action: 'earned innovation badge', time: '4 hours ago' },
        { user: 'Mike Johnson', action: 'commented on project', time: '1 day ago' }
    ];

    const activityFeed = document.getElementById('activityFeed');
    activities.forEach((activity, index) => {
        setTimeout(() => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item p-3 border-bottom animate__animated animate__fadeInRight';
            activityElement.innerHTML = `
                <strong>${activity.user}</strong> ${activity.action}
                <small class="text-muted d-block">${activity.time}</small>
            `;
            activityFeed.appendChild(activityElement);
        }, index * 200);
    });
}

// Initialize Recognition Carousel with animation
function initializeRecognitionCarousel() {
    const recognitions = [
        { name: 'John Doe', achievement: 'Innovation of the Month', department: 'Engineering' },
        { name: 'Jane Smith', achievement: 'Best Collaboration', department: 'Design' },
        { name: 'Mike Johnson', achievement: 'Top Contributor', department: 'Research' }
    ];

    const carousel = document.querySelector('.recognition-carousel');
    recognitions.forEach((recognition, index) => {
        setTimeout(() => {
            const card = document.createElement('div');
            card.className = 'recognition-card animate__animated animate__fadeInUp';
            card.innerHTML = `
                <div class="text-center mb-3">
                    <div class="badge bg-primary mb-2">${recognition.achievement}</div>
                    <h4>${recognition.name}</h4>
                    <p class="text-muted">${recognition.department}</p>
                </div>
            `;
            carousel.appendChild(card);
        }, index * 200);
    });
}

// Initialize Forum Posts with interaction
function initializeForumPosts() {
    const posts = [
        { title: 'New Innovation Framework', author: 'John Doe', comments: 5 },
        { title: 'Collaboration Best Practices', author: 'Jane Smith', comments: 3 },
        { title: 'Innovation Metrics Discussion', author: 'Mike Johnson', comments: 7 }
    ];

    const forumPosts = document.getElementById('forumPosts');
    posts.forEach((post, index) => {
        setTimeout(() => {
            const postElement = document.createElement('div');
            postElement.className = 'forum-post p-3 border-bottom animate__animated animate__fadeInLeft';
            postElement.innerHTML = `
                <h5 class="mb-1">${post.title}</h5>
                <small class="text-muted">Posted by ${post.author}</small>
                <span class="badge bg-secondary float-end">${post.comments} comments</span>
            `;
            postElement.addEventListener('click', () => showPostDetails(post));
            forumPosts.appendChild(postElement);
        }, index * 200);
    });
}

// Initialize Event Listeners
function initializeEventListeners() {
    // New Post Button
    document.getElementById('newPostButton')?.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('newPostModal'));
        modal.show();
    });

    // Nominate Button
    document.getElementById('nominateButton')?.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('nominationModal'));
        modal.show();
    });

    // Submit Post
    document.getElementById('submitPost')?.addEventListener('click', function() {
        const form = document.getElementById('newPostForm');
        if (form.checkValidity()) {
            // Add post submission logic here
            showToast('Post submitted successfully!');
            bootstrap.Modal.getInstance(document.getElementById('newPostModal')).hide();
        } else {
            form.classList.add('was-validated');
        }
    });

    // Submit Nomination
    document.getElementById('submitNomination')?.addEventListener('click', function() {
        const form = document.getElementById('nominationForm');
        if (form.checkValidity()) {
            // Add nomination submission logic here
            showToast('Nomination submitted successfully!');
            bootstrap.Modal.getInstance(document.getElementById('nominationModal')).hide();
        } else {
            form.classList.add('was-validated');
        }
    });

    // Innovation Form
    document.getElementById('innovationForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        if (this.checkValidity()) {
            // Add innovation submission logic here
            showToast('Innovation submitted successfully!');
            this.reset();
        }
        this.classList.add('was-validated');
    });
}

// Update User Information
function updateUserInfo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.isLoggedIn) {
        // Update navbar profile
        document.getElementById('userName').textContent = user.name || 'User';
        
        // Update dropdown profile details
        document.getElementById('userFullName').textContent = user.name || 'User';
        document.getElementById('userEmail').textContent = user.email || 'No email';
        document.getElementById('userDepartment').textContent = user.department || 'No department';
        
        // Show dropdown items
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.style.display = 'flex';
        });
    } else {
        window.location.href = 'login.html';
    }
}

// Show Post Details
function showPostDetails(post) {
    // Add post detail view logic here
    console.log('Showing details for post:', post);
}

// Save Widget Positions
function saveWidgetPositions() {
    const widgets = document.querySelectorAll('.widget');
    const positions = Array.from(widgets).map(widget => widget.id);
    localStorage.setItem('widgetPositions', JSON.stringify(positions));
}

// Show Toast Notification
function showToast(message) {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '1050';
    
    toastContainer.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header">
                <strong class="me-auto">Notification</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    setTimeout(() => {
        toastContainer.remove();
    }, 3000);
}

// Profile Settings Functions
function loadProfileSettings() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Split full name into first and last name
    const nameParts = (user.name || '').split(' ');
    document.getElementById('firstName').value = nameParts[0] || '';
    document.getElementById('lastName').value = nameParts[1] || '';
    
    // Set other fields
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('department').value = user.department || '';
    document.getElementById('bio').value = user.bio || '';
}

function saveProfileSettings() {
    const form = document.getElementById('profileSettingsForm');
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('profileEmail').value;
    const department = document.getElementById('department').value;
    const bio = document.getElementById('bio').value;
    
    // Show loading state
    const saveButton = document.querySelector('#profileSettingsModal .btn-primary');
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
    saveButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Get existing user data
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Update user data
        const updatedUser = {
            ...user,
            name: `${firstName} ${lastName}`.trim(),
            email: email,
            department: department,
            bio: bio,
            updatedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update UI
        updateUserInfo();
        
        // Show success message
        showToast('Profile updated successfully!', 'success');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('profileSettingsModal'));
        modal.hide();
        
        // Reset button state
        saveButton.innerHTML = originalText;
        saveButton.disabled = false;
    }, 1000);
}

// Initialize profile modal events
document.addEventListener('DOMContentLoaded', function() {
    const profileModal = document.getElementById('profileSettingsModal');
    if (profileModal) {
        profileModal.addEventListener('show.bs.modal', loadProfileSettings);
    }
});

// Recognition Section Functions
function initializeRecognition() {
    loadTopContributors();
    loadLeaderboard();
    loadRecentAchievements();
    initializeNominationForm();
}

function loadTopContributors() {
    // Sample data - replace with actual API call
    const contributors = [
        {
            name: 'Sarah Johnson',
            department: 'Engineering',
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            innovations: 12,
            collaborations: 25,
            impact: 89
        },
        {
            name: 'Michael Chen',
            department: 'Product',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            innovations: 15,
            collaborations: 18,
            impact: 92
        },
        {
            name: 'Emma Davis',
            department: 'Marketing',
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            innovations: 10,
            collaborations: 30,
            impact: 85
        }
    ];

    const carousel = document.querySelector('.contributor-carousel');
    if (!carousel) return;

    contributors.forEach(contributor => {
        const card = document.createElement('div');
        card.className = 'contributor-card mx-2';
        card.innerHTML = `
            <div class="contributor-avatar">
                <img src="${contributor.avatar}" alt="${contributor.name}">
            </div>
            <h4 class="mb-1">${contributor.name}</h4>
            <p class="text-muted mb-3">${contributor.department}</p>
            <div class="contributor-stats">
                <div class="stat-item">
                    <div class="stat-value">${contributor.innovations}</div>
                    <div class="stat-label">Innovations</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${contributor.collaborations}</div>
                    <div class="stat-label">Collaborations</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${contributor.impact}</div>
                    <div class="stat-label">Impact Score</div>
                </div>
            </div>
        `;
        carousel.appendChild(card);
    });

    // Initialize Owl Carousel
    $(carousel).owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
        },
        navText: [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ]
    });
}

function loadLeaderboard() {
    // Sample data - replace with actual API call
    const leaderboard = [
        { rank: 1, name: 'Sarah Johnson', department: 'Engineering', points: 2500, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { rank: 2, name: 'Michael Chen', department: 'Product', points: 2350, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
        { rank: 3, name: 'Emma Davis', department: 'Marketing', points: 2200, avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
        { rank: 4, name: 'James Wilson', department: 'Sales', points: 2100, avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
        { rank: 5, name: 'Lisa Anderson', department: 'HR', points: 2000, avatar: 'https://randomuser.me/api/portraits/women/5.jpg' }
    ];

    const leaderboardList = document.querySelector('.leaderboard-list');
    if (!leaderboardList) return;

    leaderboardList.innerHTML = leaderboard.map(entry => `
        <div class="leaderboard-item">
            <div class="leaderboard-rank">#${entry.rank}</div>
            <img src="${entry.avatar}" alt="${entry.name}" class="leaderboard-avatar">
            <div class="leaderboard-info">
                <div class="leaderboard-name">${entry.name}</div>
                <div class="leaderboard-dept">${entry.department}</div>
            </div>
            <div class="leaderboard-points">${entry.points} pts</div>
        </div>
    `).join('');
}

function loadRecentAchievements() {
    // Sample data - replace with actual API call
    const achievements = [
        {
            title: 'Process Automation Innovation',
            recipient: 'Sarah Johnson',
            description: 'Developed an AI-powered workflow automation system that reduced processing time by 60%',
            category: 'technical',
            date: '2023-12-01'
        },
        {
            title: 'Sustainable Packaging Initiative',
            recipient: 'Michael Chen',
            description: 'Led the development of eco-friendly packaging solutions, reducing plastic waste by 75%',
            category: 'sustainability',
            date: '2023-11-28'
        },
        {
            title: 'Customer Experience Revolution',
            recipient: 'Emma Davis',
            description: 'Implemented an innovative customer feedback system that increased satisfaction by 40%',
            category: 'product',
            date: '2023-11-25'
        }
    ];

    const achievementsGrid = document.querySelector('.achievements-grid');
    if (!achievementsGrid) return;

    achievementsGrid.innerHTML = achievements.map(achievement => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100">
                <div class="card-body">
                    <div class="achievement-badge">
                        <i class="fas ${getCategoryIcon(achievement.category)}"></i>
                    </div>
                    <h5 class="card-title">${achievement.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${achievement.recipient}</h6>
                    <p class="card-text">${achievement.description}</p>
                    <div class="text-muted small">
                        <i class="fas fa-calendar-alt me-1"></i>
                        ${new Date(achievement.date).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getCategoryIcon(category) {
    const icons = {
        technical: 'fa-microchip',
        process: 'fa-cogs',
        product: 'fa-cube',
        sustainability: 'fa-leaf',
        collaboration: 'fa-users'
    };
    return icons[category] || 'fa-star';
}

function initializeNominationForm() {
    // Sample data - replace with actual API call
    const colleagues = [
        { id: 1, name: 'Sarah Johnson', department: 'Engineering' },
        { id: 2, name: 'Michael Chen', department: 'Product' },
        { id: 3, name: 'Emma Davis', department: 'Marketing' },
        { id: 4, name: 'James Wilson', department: 'Sales' },
        { id: 5, name: 'Lisa Anderson', department: 'HR' }
    ];

    const nomineeSelect = document.getElementById('nomineeSelect');
    if (!nomineeSelect) return;

    colleagues.forEach(colleague => {
        const option = document.createElement('option');
        option.value = colleague.id;
        option.textContent = `${colleague.name} (${colleague.department})`;
        nomineeSelect.appendChild(option);
    });
}

function submitNomination() {
    const form = document.getElementById('nominationForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const nomination = {
        nominee: document.getElementById('nomineeSelect').value,
        category: document.getElementById('categorySelect').value,
        description: document.getElementById('achievementDescription').value,
        impact: document.getElementById('achievementImpact').value,
        timestamp: new Date().toISOString()
    };

    // Show loading state
    const submitBtn = document.querySelector('#nominateModal .btn-primary');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Store nomination in localStorage for demo
        const nominations = JSON.parse(localStorage.getItem('nominations') || '[]');
        nominations.push(nomination);
        localStorage.setItem('nominations', JSON.stringify(nominations));

        // Show success message
        showToast('Nomination submitted successfully!', 'success');

        // Reset form and close modal
        form.reset();
        form.classList.remove('was-validated');
        const modal = bootstrap.Modal.getInstance(document.getElementById('nominateModal'));
        modal.hide();

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Refresh recognition section
        loadRecentAchievements();
    }, 1000);
}

// Initialize recognition section when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeRecognition();
});

// Collaborative Tools Functions
const collaborativeTools = {
    // Department data structure
    departments: ['Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'],
    
    // Initialize collaborative features
    init() {
        this.initializeDepartmentDashboard();
        this.initializeCollaborationForms();
        this.initializeFeedbackSystem();
        this.setupRealTimeUpdates();
        this.initializeDataSharing();
    },

    // Department Dashboard
    initializeDepartmentDashboard() {
        const dashboard = document.querySelector('.department-dashboard');
        if (!dashboard) return;

        // Load department metrics
        this.loadDepartmentMetrics();
        
        // Setup metric update intervals
        setInterval(() => this.loadDepartmentMetrics(), 300000); // Update every 5 minutes
    },

    loadDepartmentMetrics() {
        // Simulated department metrics - replace with actual API call
        const metrics = this.getDepartmentMetrics();
        this.updateDepartmentDashboard(metrics);
    },

    getDepartmentMetrics() {
        // Sample metrics data - replace with actual data source
        return {
            activeProjects: 15,
            collaborations: 8,
            pendingFeedback: 3,
            recentUpdates: [
                { type: 'project', title: 'AI Integration', status: 'in-progress' },
                { type: 'feedback', title: 'UX Improvements', status: 'pending' },
                { type: 'milestone', title: 'Q4 Goals', status: 'completed' }
            ]
        };
    },

    updateDepartmentDashboard(metrics) {
        const dashboard = document.querySelector('.department-dashboard');
        if (!dashboard) return;

        dashboard.innerHTML = `
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${metrics.activeProjects}</div>
                    <div class="metric-label">Active Projects</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${metrics.collaborations}</div>
                    <div class="metric-label">Active Collaborations</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${metrics.pendingFeedback}</div>
                    <div class="metric-label">Pending Feedback</div>
                </div>
            </div>
            <div class="updates-list">
                ${metrics.recentUpdates.map(update => `
                    <div class="update-item ${update.status}">
                        <i class="fas ${this.getUpdateIcon(update.type)}"></i>
                        <span>${update.title}</span>
                        <span class="status-badge">${update.status}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    getUpdateIcon(type) {
        const icons = {
            project: 'fa-project-diagram',
            feedback: 'fa-comments',
            milestone: 'fa-flag'
        };
        return icons[type] || 'fa-info-circle';
    },

    // Collaboration Forms
    initializeCollaborationForms() {
        this.setupProjectForm();
        this.setupFeedbackForm();
        this.setupDataInputForm();
    },

    setupProjectForm() {
        const form = document.getElementById('projectCollaborationForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProjectSubmission(form);
        });
    },

    handleProjectSubmission(form) {
        const projectData = {
            title: form.querySelector('#projectTitle').value,
            description: form.querySelector('#projectDescription').value,
            departments: Array.from(form.querySelector('#departmentSelect').selectedOptions).map(opt => opt.value),
            timeline: form.querySelector('#projectTimeline').value,
            goals: form.querySelector('#projectGoals').value,
            timestamp: new Date().toISOString()
        };

        // Store project data
        this.saveCollaborationData('projects', projectData);
        
        // Show success message
        showToast('Project collaboration created successfully!', 'success');
        
        // Reset form
        form.reset();
    },

    // Data Sharing System
    initializeDataSharing() {
        this.setupDataSharingHub();
        this.initializeDataFilters();
    },

    setupDataSharingHub() {
        const hub = document.querySelector('.data-sharing-hub');
        if (!hub) return;

        // Load shared data
        this.loadSharedData();
        
        // Setup real-time updates
        this.setupDataUpdateListeners();
    },

    loadSharedData() {
        // Load data from localStorage for demo
        const sharedData = JSON.parse(localStorage.getItem('sharedData') || '[]');
        this.updateDataHub(sharedData);
    },

    updateDataHub(data) {
        const hub = document.querySelector('.data-sharing-hub');
        if (!hub) return;

        hub.innerHTML = data.map(item => `
            <div class="shared-data-card">
                <div class="data-header">
                    <h5>${item.title}</h5>
                    <span class="department-tag">${item.department}</span>
                </div>
                <div class="data-content">
                    <p>${item.description}</p>
                    <div class="data-meta">
                        <span><i class="fas fa-clock"></i> ${new Date(item.timestamp).toLocaleDateString()}</span>
                        <span><i class="fas fa-user"></i> ${item.author}</span>
                    </div>
                </div>
                <div class="data-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="collaborativeTools.handleDataAction('comment', ${item.id})">
                        <i class="fas fa-comment"></i> Comment
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="collaborativeTools.handleDataAction('share', ${item.id})">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>
        `).join('');
    },

    // Feedback System
    initializeFeedbackSystem() {
        this.setupFeedbackChannels();
        this.initializeFeedbackNotifications();
    },

    setupFeedbackChannels() {
        const channels = document.querySelector('.feedback-channels');
        if (!channels) return;

        this.departments.forEach(dept => {
            const channel = document.createElement('div');
            channel.className = 'feedback-channel';
            channel.innerHTML = `
                <h5>${dept}</h5>
                <div class="feedback-thread" id="feedback-${dept.toLowerCase()}"></div>
                <div class="feedback-input">
                    <textarea placeholder="Provide feedback..."></textarea>
                    <button onclick="collaborativeTools.submitFeedback('${dept}')" class="btn btn-primary btn-sm">
                        Send Feedback
                    </button>
                </div>
            `;
            channels.appendChild(channel);
        });
    },

    submitFeedback(department) {
        const thread = document.querySelector(`#feedback-${department.toLowerCase()}`);
        const input = thread.parentElement.querySelector('textarea');
        
        if (!input.value.trim()) return;

        const feedback = {
            department,
            content: input.value,
            author: this.getCurrentUser(),
            timestamp: new Date().toISOString()
        };

        // Store feedback
        this.saveFeedbackData(feedback);
        
        // Update UI
        this.addFeedbackToThread(thread, feedback);
        
        // Clear input
        input.value = '';
        
        // Show success message
        showToast('Feedback submitted successfully!', 'success');
    },

    addFeedbackToThread(thread, feedback) {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'feedback-item';
        feedbackElement.innerHTML = `
            <div class="feedback-header">
                <span class="author">${feedback.author}</span>
                <span class="timestamp">${new Date(feedback.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="feedback-content">${feedback.content}</div>
        `;
        thread.appendChild(feedbackElement);
        thread.scrollTop = thread.scrollHeight;
    },

    // Data Storage
    saveCollaborationData(type, data) {
        const storageKey = `${type}Data`;
        const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        existingData.push({ ...data, id: Date.now() });
        localStorage.setItem(storageKey, JSON.stringify(existingData));
    },

    saveFeedbackData(feedback) {
        const feedbackData = JSON.parse(localStorage.getItem('feedbackData') || '[]');
        feedbackData.push({ ...feedback, id: Date.now() });
        localStorage.setItem('feedbackData', JSON.stringify(feedbackData));
    },

    // Utility Functions
    getCurrentUser() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return userData.name || 'Anonymous User';
    },

    setupRealTimeUpdates() {
        // Simulate real-time updates for demo
        setInterval(() => {
            this.checkForUpdates();
        }, 30000); // Check every 30 seconds
    },

    checkForUpdates() {
        // Check for new data
        this.loadSharedData();
        this.loadDepartmentMetrics();
    },

    handleShareData() {
        const form = document.getElementById('shareDataForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const sharedData = {
            title: document.getElementById('updateTitle').value,
            description: document.getElementById('updateDescription').value,
            department: document.getElementById('updateDepartment').value,
            author: this.getCurrentUser(),
            timestamp: new Date().toISOString(),
            id: Date.now()
        };

        // Store shared data
        const existingData = JSON.parse(localStorage.getItem('sharedData') || '[]');
        existingData.push(sharedData);
        localStorage.setItem('sharedData', JSON.stringify(existingData));

        // Update UI
        this.loadSharedData();

        // Show success message
        showToast('Update shared successfully!', 'success');

        // Reset form and close modal
        form.reset();
        form.classList.remove('was-validated');
        const modal = bootstrap.Modal.getInstance(document.getElementById('shareDataModal'));
        modal.hide();

        // Reset button
        const submitBtn = document.querySelector('#shareDataModal .btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    },

    handleDataAction(action, itemId) {
        switch (action) {
            case 'comment':
                // Implement comment functionality
                const comment = prompt('Add your comment:');
                if (comment) {
                    const sharedData = JSON.parse(localStorage.getItem('sharedData') || '[]');
                    const item = sharedData.find(d => d.id === itemId);
                    if (item) {
                        if (!item.comments) item.comments = [];
                        item.comments.push({
                            content: comment,
                            author: this.getCurrentUser(),
                            timestamp: new Date().toISOString()
                        });
                        localStorage.setItem('sharedData', JSON.stringify(sharedData));
                        this.loadSharedData();
                        showToast('Comment added successfully!', 'success');
                    }
                }
                break;
            case 'share':
                // Implement share functionality
                const departments = this.departments.filter(d => d !== this.getCurrentDepartment());
                const shareWith = prompt(`Share with department(s):\n${departments.join(', ')}`);
                if (shareWith) {
                    showToast('Update shared with ' + shareWith, 'success');
                }
                break;
        }
    },

    getCurrentDepartment() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        return userData.department || 'Unknown Department';
    }
};

// Innovation Storage and Display in Collaborative Tools
function submitInnovation(event) {
    event.preventDefault();
    
    const form = event.target;
    const title = form.querySelector('#innovationTitle').value.trim();
    const description = form.querySelector('#innovationDescription').value.trim();
    const category = form.querySelector('#innovationCategory').value;
    const impact = form.querySelector('#innovationImpact').value.trim();
    const content = form.querySelector('#innovationContent').value.trim();

    // Validate all required fields including content
    if (!title || !description || !category || !impact || !content) {
        this.showAlert('Please fill in all fields including content before submitting.', 'error');
        return;
    }

    // Additional content validation
    if (content.length < 50) {
        this.showAlert('Content must be at least 50 characters long to provide sufficient detail.', 'error');
        return;
    }

    const innovation = {
        id: Date.now(),
        title,
        description,
        category,
        impact,
        content,
        department: collaborativeTools.getCurrentDepartment(),
        author: collaborativeTools.getCurrentUser(),
        timestamp: new Date().toISOString(),
        status: 'pending',
        metrics: {
            views: 0,
            likes: 0,
            shares: 0,
            comments: 0
        },
        collaborators: [],
        feedback: []
    };

    // Get existing innovations
    const innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
    
    // Add new innovation
    innovations.push(innovation);
    
    // Save back to localStorage
    localStorage.setItem('innovations', JSON.stringify(innovations));

    // Reset form and close modal
    form.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('innovationModal'));
    modal.hide();

    // Show success message
    this.showAlert('Innovation submitted successfully!', 'success');

    // Refresh the innovation display
    this.loadInnovations();
    
    // Update analytics
    analyticsInsights.loadInsights();
}

function loadInnovations() {
    const innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
    const innovationHub = document.querySelector('.innovation-hub');
    if (!innovationHub) return;

    innovationHub.innerHTML = innovations.map(innovation => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${innovation.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${innovation.department}</h6>
                    <p class="card-text">${innovation.description}</p>
                    <div class="content-preview mb-3">
                        <strong>Content:</strong>
                        <p>${innovation.content.substring(0, 100)}${innovation.content.length > 100 ? '...' : ''}</p>
                    </div>
                    <div class="innovation-meta">
                        <span class="badge bg-primary">${innovation.category}</span>
                        <span class="badge bg-secondary">${innovation.status}</span>
                    </div>
                    <div class="metrics mt-3">
                        <span><i class="fas fa-eye"></i> ${innovation.metrics.views}</span>
                        <span><i class="fas fa-heart"></i> ${innovation.metrics.likes}</span>
                        <span><i class="fas fa-share"></i> ${innovation.metrics.shares}</span>
                        <span><i class="fas fa-comment"></i> ${innovation.metrics.comments}</span>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-sm btn-outline-primary" onclick="collaborativeTools.handleCollaboration(${innovation.id})">
                            <i class="fas fa-users"></i> Collaborate
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="collaborativeTools.handleFeedback(${innovation.id})">
                            <i class="fas fa-comment"></i> Feedback
                        </button>
                    </div>
                </div>
                <div class="card-footer text-muted">
                    Submitted by ${innovation.author} on ${new Date(innovation.timestamp).toLocaleDateString()}
                </div>
            </div>
        </div>
    `).join('');
}

// Extend collaborativeTools object with innovation-specific methods
Object.assign(collaborativeTools, {
    initializeInnovations() {
        this.loadInnovations();
        this.setupInnovationFilters();
        this.initializeInnovationMetrics();
    },

    loadInnovations() {
        const innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
        const innovationHub = document.querySelector('.innovation-hub');
        if (!innovationHub) return;

        innovationHub.innerHTML = innovations.map(innovation => this.createInnovationCard(innovation)).join('');
    },

    createInnovationCard(innovation) {
        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${innovation.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${innovation.department}</h6>
                        <p class="card-text">${innovation.description}</p>
                        <div class="content-preview mb-3">
                            <strong>Content:</strong>
                            <p>${innovation.content.substring(0, 100)}${innovation.content.length > 100 ? '...' : ''}</p>
                        </div>
                        <div class="innovation-meta">
                            <span class="badge bg-primary">${innovation.category}</span>
                            <span class="badge bg-secondary">${innovation.status}</span>
                        </div>
                        <div class="metrics mt-3">
                            <span><i class="fas fa-eye"></i> ${innovation.metrics.views}</span>
                            <span><i class="fas fa-heart"></i> ${innovation.metrics.likes}</span>
                            <span><i class="fas fa-share"></i> ${innovation.metrics.shares}</span>
                            <span><i class="fas fa-comment"></i> ${innovation.metrics.comments}</span>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-outline-primary" onclick="collaborativeTools.handleCollaboration(${innovation.id})">
                                <i class="fas fa-users"></i> Collaborate
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="collaborativeTools.handleFeedback(${innovation.id})">
                                <i class="fas fa-comment"></i> Feedback
                            </button>
                        </div>
                    </div>
                    <div class="card-footer text-muted">
                        Submitted by ${innovation.author} on ${new Date(innovation.timestamp).toLocaleDateString()}
                    </div>
                </div>
            </div>
        `;
    },

    handleInnovationSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const title = form.querySelector('#innovationTitle').value.trim();
        const description = form.querySelector('#innovationDescription').value.trim();
        const category = form.querySelector('#innovationCategory').value;
        const impact = form.querySelector('#innovationImpact').value.trim();
        const content = form.querySelector('#innovationContent').value.trim();

        // Validate all required fields including content
        if (!title || !description || !category || !impact || !content) {
            this.showAlert('Please fill in all fields including content before submitting.', 'error');
            return;
        }

        // Additional content validation
        if (content.length < 50) {
            this.showAlert('Content must be at least 50 characters long to provide sufficient detail.', 'error');
            return;
        }

        const innovation = {
            id: Date.now(),
            title,
            description,
            category,
            impact,
            content,
            department: this.userDepartment,
            author: this.userName,
            timestamp: new Date().toISOString(),
            status: 'pending',
            metrics: {
                views: 0,
                likes: 0,
                shares: 0,
                comments: 0
            },
            collaborators: [],
            feedback: []
        };

        // Get existing innovations
        const innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
        
        // Add new innovation
        innovations.push(innovation);
        
        // Save back to localStorage
        localStorage.setItem('innovations', JSON.stringify(innovations));

        // Reset form and close modal
        form.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('innovationModal'));
        modal.hide();

        // Show success message
        this.showAlert('Innovation submitted successfully!', 'success');

        // Refresh the innovation display
        this.loadInnovations();
        
        // Update analytics
        analyticsInsights.loadInsights();
    },

    setupInnovationFilters() {
        const filterContainer = document.querySelector('.innovation-filters');
        if (!filterContainer) return;

        const categories = [...new Set(JSON.parse(localStorage.getItem('innovations') || '[]').map(i => i.category))];
        const departments = collaborativeTools.departments;

        filterContainer.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Filter by Category</label>
                <select class="form-select" onchange="collaborativeTools.filterInnovations()">
                    <option value="">All Categories</option>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Filter by Department</label>
                <select class="form-select" onchange="collaborativeTools.filterInnovations()">
                    <option value="">All Departments</option>
                    ${departments.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
                </select>
            </div>
        `;
    },

    filterInnovations() {
        const categoryFilter = document.querySelector('.innovation-filters select:first-child').value;
        const departmentFilter = document.querySelector('.innovation-filters select:last-child').value;
        
        let innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
        
        if (categoryFilter) {
            innovations = innovations.filter(i => i.category === categoryFilter);
        }
        if (departmentFilter) {
            innovations = innovations.filter(i => i.department === departmentFilter);
        }

        const innovationHub = document.querySelector('.innovation-hub');
        if (innovationHub) {
            innovationHub.innerHTML = innovations.map(innovation => this.createInnovationCard(innovation)).join('');
        }
    }
});

// Initialize innovations in collaborative tools
document.addEventListener('DOMContentLoaded', function() {
    collaborativeTools.initializeInnovations();
});

// Initialize collaborative tools when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    collaborativeTools.init();
});

// Analytics and Insights Module
const analyticsInsights = {
    init() {
        this.initializeCharts();
        this.setupAnalyticsRefresh();
        this.loadInsights();
    },

    initializeCharts() {
        this.createInnovationTrendsChart();
        this.createDepartmentPerformanceChart();
        this.createImpactAnalysisChart();
        this.createCollaborationNetworkChart();
    },

    createInnovationTrendsChart() {
        const ctx = document.getElementById('innovationTrendsChart');
        if (!ctx) return;

        const data = this.getInnovationTrendsData();
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Innovations',
                    data: data.innovations,
                    borderColor: '#4C51BF',
                    tension: 0.4
                }, {
                    label: 'Collaborations',
                    data: data.collaborations,
                    borderColor: '#48BB78',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Innovation & Collaboration Trends'
                    }
                }
            }
        });
    },

    createDepartmentPerformanceChart() {
        const ctx = document.getElementById('departmentPerformanceChart');
        if (!ctx) return;

        const data = this.getDepartmentPerformanceData();
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.departments,
                datasets: [{
                    label: 'Innovation Score',
                    data: data.scores,
                    backgroundColor: 'rgba(76, 81, 191, 0.2)',
                    borderColor: '#4C51BF'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    },

    createImpactAnalysisChart() {
        const ctx = document.getElementById('impactAnalysisChart');
        if (!ctx) return;

        const data = this.getImpactAnalysisData();
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.categories,
                datasets: [{
                    label: 'Impact Score',
                    data: data.scores,
                    backgroundColor: [
                        '#4C51BF',
                        '#48BB78',
                        '#ECC94B',
                        '#ED64A6',
                        '#9F7AEA'
                    ]
                }]
            },
            options: {
                indexAxis: 'y'
            }
        });
    },

    createCollaborationNetworkChart() {
        const ctx = document.getElementById('collaborationNetworkChart');
        if (!ctx) return;

        const data = this.getCollaborationNetworkData();
        new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: data.map(dept => ({
                    label: dept.name,
                    data: [{
                        x: dept.collaborations,
                        y: dept.innovations,
                        r: dept.impact / 2
                    }],
                    backgroundColor: this.getRandomColor()
                }))
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Collaborations'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Innovations'
                        }
                    }
                }
            }
        });
    },

    // Data Processing Methods
    getInnovationTrendsData() {
        const innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
        const months = this.getLast6Months();
        
        const data = {
            labels: months.map(m => m.format('MMM YYYY')),
            innovations: new Array(6).fill(0),
            collaborations: new Array(6).fill(0)
        };

        innovations.forEach(innovation => {
            const date = new Date(innovation.timestamp);
            const monthIndex = months.findIndex(m => 
                m.month() === date.getMonth() && 
                m.year() === date.getFullYear()
            );
            
            if (monthIndex !== -1) {
                data.innovations[monthIndex]++;
                if (innovation.collaborators) {
                    data.collaborations[monthIndex] += innovation.collaborators.length;
                }
            }
        });

        return data;
    },

    getDepartmentPerformanceData() {
        const innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
        const departments = [...new Set(innovations.map(i => i.department))];
        
        return {
            departments,
            scores: departments.map(dept => {
                const deptInnovations = innovations.filter(i => i.department === dept);
                return this.calculateDepartmentScore(deptInnovations);
            })
        };
    },

    getImpactAnalysisData() {
        const innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
        const categories = [...new Set(innovations.map(i => i.category))];
        
        return {
            categories,
            scores: categories.map(cat => {
                const catInnovations = innovations.filter(i => i.category === cat);
                return this.calculateImpactScore(catInnovations);
            })
        };
    },

    getCollaborationNetworkData() {
        const innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
        return collaborativeTools.departments.map(dept => ({
            name: dept,
            innovations: innovations.filter(i => i.department === dept).length,
            collaborations: innovations.reduce((acc, i) => 
                acc + (i.collaborators?.filter(c => c.department === dept).length || 0), 0),
            impact: this.calculateDepartmentImpact(dept, innovations)
        }));
    },

    // Helper Methods
    calculateDepartmentScore(innovations) {
        if (!innovations.length) return 0;
        
        const metrics = {
            innovationCount: innovations.length * 10,
            collaborationCount: innovations.reduce((acc, i) => acc + (i.collaborators?.length || 0), 0) * 5,
            feedbackCount: innovations.reduce((acc, i) => acc + (i.feedback?.length || 0), 0) * 2,
            completedCount: innovations.filter(i => i.status === 'completed').length * 15
        };

        return Math.min(100, Object.values(metrics).reduce((a, b) => a + b, 0));
    },

    calculateImpactScore(innovations) {
        if (!innovations.length) return 0;
        
        return innovations.reduce((acc, i) => {
            const metrics = {
                collaborators: (i.collaborators?.length || 0) * 5,
                feedback: (i.feedback?.length || 0) * 2,
                views: (i.metrics?.views || 0) * 0.1,
                likes: (i.metrics?.likes || 0) * 0.5
            };
            return acc + Object.values(metrics).reduce((a, b) => a + b, 0);
        }, 0) / innovations.length;
    },

    calculateDepartmentImpact(department, innovations) {
        const deptInnovations = innovations.filter(i => 
            i.department === department || 
            i.collaborators?.some(c => c.department === department)
        );
        
        return this.calculateImpactScore(deptInnovations);
    },

    getLast6Months() {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            months.push(moment().subtract(i, 'months').startOf('month'));
        }
        return months;
    },

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    // Insights Generation
    loadInsights() {
        const insights = this.generateInsights();
        this.displayInsights(insights);
    },

    generateInsights() {
        const innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
        const insights = [];

        // Trend Analysis
        const trendData = this.getInnovationTrendsData();
        const currentMonth = trendData.innovations[5];
        const previousMonth = trendData.innovations[4];
        const growthRate = ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1);

        insights.push({
            type: 'trend',
            title: 'Innovation Growth',
            description: `Innovation submissions ${growthRate > 0 ? 'increased' : 'decreased'} by ${Math.abs(growthRate)}% compared to last month.`,
            impact: growthRate > 0 ? 'positive' : 'negative'
        });

        // Department Performance
        const departmentData = this.getDepartmentPerformanceData();
        const topDepartment = departmentData.departments[
            departmentData.scores.indexOf(Math.max(...departmentData.scores))
        ];

        insights.push({
            type: 'performance',
            title: 'Top Performing Department',
            description: `${topDepartment} leads in innovation performance with a score of ${Math.max(...departmentData.scores).toFixed(1)}.`,
            impact: 'positive'
        });

        // Collaboration Analysis
        const collaborationData = this.getCollaborationNetworkData();
        const avgCollaborations = collaborationData.reduce((acc, dept) => 
            acc + dept.collaborations, 0) / collaborationData.length;

        insights.push({
            type: 'collaboration',
            title: 'Collaboration Metrics',
            description: `Average collaborations per department: ${avgCollaborations.toFixed(1)}. ${
                avgCollaborations > 5 ? 'Strong collaborative culture!' : 'Room for improved collaboration.'
            }`,
            impact: avgCollaborations > 5 ? 'positive' : 'warning'
        });

        // Impact Analysis
        const impactData = this.getImpactAnalysisData();
        const highestImpactCategory = impactData.categories[
            impactData.scores.indexOf(Math.max(...impactData.scores))
        ];

        insights.push({
            type: 'impact',
            title: 'Impact Leaders',
            description: `${highestImpactCategory} innovations show the highest impact score of ${Math.max(...impactData.scores).toFixed(1)}.`,
            impact: 'positive'
        });

        return insights;
    },

    displayInsights(insights) {
        const container = document.querySelector('.analytics-insights');
        if (!container) return;

        container.innerHTML = insights.map(insight => `
            <div class="insight-card ${insight.impact}">
                <div class="insight-icon">
                    <i class="fas ${this.getInsightIcon(insight.type)}"></i>
                </div>
                <div class="insight-content">
                    <h6>${insight.title}</h6>
                    <p>${insight.description}</p>
                </div>
            </div>
        `).join('');
    },

    getInsightIcon(type) {
        const icons = {
            trend: 'fa-chart-line',
            performance: 'fa-trophy',
            collaboration: 'fa-users',
            impact: 'fa-bullseye'
        };
        return icons[type] || 'fa-info-circle';
    },

    setupAnalyticsRefresh() {
        // Refresh analytics every 5 minutes
        setInterval(() => {
            this.loadInsights();
            this.initializeCharts();
        }, 300000);
    }
};

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    analyticsInsights.init();
});

// Dashboard Update Functionality
const dashboardUpdate = {
    updateDashboard() {
        const innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
        
        // Update metrics
        this.updateDashboardMetrics(innovations);
        
        // Update recent innovations list
        this.updateRecentInnovations(innovations);
        
        // Update department stats
        this.updateDepartmentStats(innovations);
        
        // Update charts
        this.updateDashboardCharts(innovations);
    },

    updateDashboardMetrics(innovations) {
        const metrics = {
            total: innovations.length,
            active: innovations.filter(i => i.status === 'in-progress').length,
            completed: innovations.filter(i => i.status === 'completed').length,
            collaborations: innovations.reduce((acc, i) => acc + (i.collaborators?.length || 0), 0)
        };

        // Update metrics display
        document.getElementById('totalInnovations').textContent = metrics.total;
        document.getElementById('activeInnovations').textContent = metrics.active;
        document.getElementById('completedInnovations').textContent = metrics.completed;
        document.getElementById('totalCollaborations').textContent = metrics.collaborations;
    },

    updateRecentInnovations(innovations) {
        const recentInnovationsList = document.querySelector('.recent-innovations');
        if (!recentInnovationsList) return;

        // Get 5 most recent innovations
        const recentInnovations = [...innovations]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);

        recentInnovationsList.innerHTML = recentInnovations.map(innovation => `
            <div class="recent-innovation-item">
                <div class="innovation-header">
                    <h6>${innovation.title}</h6>
                    <span class="badge bg-${this.getStatusColor(innovation.status)}">${innovation.status}</span>
                </div>
                <p class="innovation-desc">${innovation.description}</p>
                <div class="innovation-footer">
                    <span class="department">${innovation.department}</span>
                    <span class="timestamp">${this.formatTimestamp(innovation.timestamp)}</span>
                </div>
            </div>
        `).join('');
    },

    updateDepartmentStats(innovations) {
        const departmentStats = {};
        
        // Calculate department statistics
        innovations.forEach(innovation => {
            if (!departmentStats[innovation.department]) {
                departmentStats[innovation.department] = {
                    innovations: 0,
                    collaborations: 0,
                    completed: 0
                };
            }
            
            departmentStats[innovation.department].innovations++;
            departmentStats[innovation.department].collaborations += innovation.collaborators?.length || 0;
            if (innovation.status === 'completed') {
                departmentStats[innovation.department].completed++;
            }
        });

        // Update department stats display
        const departmentStatsList = document.querySelector('.department-stats');
        if (!departmentStatsList) return;

        departmentStatsList.innerHTML = Object.entries(departmentStats)
            .map(([dept, stats]) => `
                <div class="department-stat-item">
                    <h6>${dept}</h6>
                    <div class="stat-grid">
                        <div class="stat">
                            <span class="stat-value">${stats.innovations}</span>
                            <span class="stat-label">Innovations</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${stats.collaborations}</span>
                            <span class="stat-label">Collaborations</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${stats.completed}</span>
                            <span class="stat-label">Completed</span>
                        </div>
                    </div>
                </div>
            `).join('');
    },

    updateDashboardCharts(innovations) {
        // Update category distribution chart
        this.updateCategoryChart(innovations);
        
        // Update status distribution chart
        this.updateStatusChart(innovations);
        
        // Update timeline chart
        this.updateTimelineChart(innovations);
    },

    updateCategoryChart(innovations) {
        const categoryData = {};
        innovations.forEach(innovation => {
            categoryData[innovation.category] = (categoryData[innovation.category] || 0) + 1;
        });

        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: this.getChartColors(Object.keys(categoryData).length)
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    },

    updateStatusChart(innovations) {
        const statusData = {
            'pending': 0,
            'in-progress': 0,
            'completed': 0,
            'rejected': 0
        };
        
        innovations.forEach(innovation => {
            statusData[innovation.status]++;
        });

        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(statusData),
                datasets: [{
                    data: Object.values(statusData),
                    backgroundColor: [
                        '#FCD34D', // pending
                        '#60A5FA', // in-progress
                        '#34D399', // completed
                        '#F87171'  // rejected
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    },

    updateTimelineChart(innovations) {
        const timelineData = {};
        const last6Months = this.getLast6Months();
        
        last6Months.forEach(month => {
            timelineData[month] = 0;
        });

        innovations.forEach(innovation => {
            const month = new Date(innovation.timestamp).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (timelineData.hasOwnProperty(month)) {
                timelineData[month]++;
            }
        });

        const ctx = document.getElementById('timelineChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(timelineData),
                datasets: [{
                    label: 'Innovations',
                    data: Object.values(timelineData),
                    borderColor: '#4F46E5',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    },

    getLast6Months() {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
        }
        return months;
    },

    getChartColors(count) {
        const colors = [
            '#4F46E5', '#10B981', '#F59E0B', '#EC4899', 
            '#8B5CF6', '#06B6D4', '#EF4444', '#14B8A6'
        ];
        return colors.slice(0, count);
    },

    getStatusColor(status) {
        const colors = {
            'pending': 'warning',
            'in-progress': 'primary',
            'completed': 'success',
            'rejected': 'danger'
        };
        return colors[status] || 'secondary';
    },

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('default', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },

    // Call this after innovation submission
    handleInnovationSubmit(event) {
        event.preventDefault();
        
        // ... existing submission code ...

        // After successful submission
        this.updateDashboard();
    }
};

// Call updateDashboard after innovation submission
function submitInnovation(event) {
    event.preventDefault();
    
    const form = event.target;
    const title = form.querySelector('#innovationTitle').value.trim();
    const description = form.querySelector('#innovationDescription').value.trim();
    const category = form.querySelector('#innovationCategory').value;
    const impact = form.querySelector('#innovationImpact').value.trim();
    const content = form.querySelector('#innovationContent').value.trim();

    // Validate all required fields including content
    if (!title || !description || !category || !impact || !content) {
        this.showAlert('Please fill in all fields including content before submitting.', 'error');
        return;
    }

    // Additional content validation
    if (content.length < 50) {
        this.showAlert('Content must be at least 50 characters long to provide sufficient detail.', 'error');
        return;
    }

    const innovation = {
        id: Date.now(),
        title,
        description,
        category,
        impact,
        content,
        department: collaborativeTools.getCurrentDepartment(),
        author: collaborativeTools.getCurrentUser(),
        timestamp: new Date().toISOString(),
        status: 'pending',
        metrics: {
            views: 0,
            likes: 0,
            shares: 0,
            comments: 0
        },
        collaborators: [],
        feedback: []
    };

    // Get existing innovations
    const innovations = JSON.parse(localStorage.getItem('innovations') || '[]');
    
    // Add new innovation
    innovations.push(innovation);
    
    // Save back to localStorage
    localStorage.setItem('innovations', JSON.stringify(innovations));

    // Reset form and close modal
    form.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('innovationModal'));
    modal.hide();

    // Show success message
    this.showAlert('Innovation submitted successfully!', 'success');

    // Refresh the innovation display
    this.loadInnovations();
    
    // Update analytics
    analyticsInsights.loadInsights();

    // Update dashboard
    dashboardUpdate.updateDashboard();
}
