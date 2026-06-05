// ============================================
// DATA MANAGEMENT & LOCAL STORAGE
// ============================================

const StorageKeys = {
    TODOS: 'dashboard-todos',
    LINKS: 'dashboard-links',
    THEME: 'dashboard-theme',
    USER_NAME: 'dashboard-user-name',
    TIMER_DURATION: 'dashboard-timer-duration',
};

class DataManager {
    static getTodos() {
        const data = localStorage.getItem(StorageKeys.TODOS);
        return data ? JSON.parse(data) : [];
    }

    static saveTodos(todos) {
        localStorage.setItem(StorageKeys.TODOS, JSON.stringify(todos));
    }

    static getLinks() {
        const data = localStorage.getItem(StorageKeys.LINKS);
        return data ? JSON.parse(data) : [];
    }

    static saveLinks(links) {
        localStorage.setItem(StorageKeys.LINKS, JSON.stringify(links));
    }

    static getTheme() {
        return localStorage.getItem(StorageKeys.THEME) || 'light';
    }

    static saveTheme(theme) {
        localStorage.setItem(StorageKeys.THEME, theme);
    }

    static getUserName() {
        return localStorage.getItem(StorageKeys.USER_NAME) || 'Guest';
    }

    static saveUserName(name) {
        localStorage.setItem(StorageKeys.USER_NAME, name);
    }

    static getTimerDuration() {
        return parseInt(localStorage.getItem(StorageKeys.TIMER_DURATION) || '25');
    }

    static saveTimerDuration(minutes) {
        localStorage.setItem(StorageKeys.TIMER_DURATION, minutes.toString());
    }
}

// ============================================
// DOM ELEMENTS
// ============================================

const DOM = {
    // Header
    themeToggle: document.querySelector('.theme-toggle'),

    // Greeting Section
    greetingText: document.querySelector('.greeting-text'),
    currentTime: document.querySelector('.current-time'),
    currentDate: document.querySelector('.current-date'),
    userNameDisplay: document.querySelector('.user-name-display'),
    editNameBtn: document.querySelector('.edit-name-btn'),

    // Name Modal
    nameEditModal: document.querySelector('.name-edit-modal'),
    nameInput: document.querySelector('.name-input'),
    saveNameBtn: document.getElementById('save-name-btn'),
    cancelNameBtn: document.getElementById('cancel-name-btn'),

    // To-Do Section
    todoInput: document.querySelector('.todo-input'),
    todoAddBtn: document.querySelector('.todo-input-container .btn-add'),
    todoList: document.querySelector('.todo-list'),
    todoEmptyState: document.querySelectorAll('.empty-state')[0],

    // Task Edit Modal
    taskEditModal: document.querySelector('.task-edit-modal'),
    editTaskInput: document.querySelector('.edit-task-input'),
    saveTaskBtn: document.getElementById('save-task-btn'),
    cancelTaskBtn: document.getElementById('cancel-task-btn'),

    // Timer Section
    timerTime: document.querySelector('.timer-time'),
    timerDurationInput: document.getElementById('timer-duration'),
    startTimerBtn: document.getElementById('start-timer-btn'),
    stopTimerBtn: document.getElementById('stop-timer-btn'),
    resetTimerBtn: document.getElementById('reset-timer-btn'),
    focusOverlay: document.querySelector('.focus-overlay'),
    focusTimer: document.querySelector('.focus-timer'),
    exitFocusBtn: document.querySelector('.exit-focus-btn'),

    // Quick Links Section
    linkNameInput: document.querySelector('.link-name-input'),
    linkUrlInput: document.querySelector('.link-url-input'),
    addLinkBtn: document.getElementById('add-link-btn'),
    quickLinksContainer: document.querySelector('.quick-links'),
    linksEmptyState: document.querySelectorAll('.empty-state')[1],

    // Link Edit Modal
    linkEditModal: document.querySelector('.link-edit-modal'),
    editLinkName: document.querySelector('.edit-link-name'),
    editLinkUrl: document.querySelector('.edit-link-url'),
    saveLinkBtn: document.getElementById('save-link-btn'),
    cancelLinkBtn: document.getElementById('cancel-link-btn'),
};

// ============================================
// APP STATE
// ============================================

const AppState = {
    todos: DataManager.getTodos(),
    links: DataManager.getLinks(),
    theme: DataManager.getTheme(),
    userName: DataManager.getUserName(),
    timerDuration: DataManager.getTimerDuration(),
    timerInterval: null,
    timeRemaining: DataManager.getTimerDuration() * 60,
    isTimerRunning: false,
    editingTaskId: null,
    editingLinkId: null,
};

// ============================================
// THEME MANAGEMENT
// ============================================

class ThemeManager {
    static init() {
        this.applyTheme(AppState.theme);
    }

    static applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        AppState.theme = theme;
        DataManager.saveTheme(theme);
        this.updateThemeIcon();
    }

    static toggle() {
        const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    static updateThemeIcon() {
        const icon = AppState.theme === 'light' ? '🌙' : '☀️';
        DOM.themeToggle.querySelector('.theme-icon').textContent = icon;
    }
}

// ============================================
// TIME & GREETING
// ============================================

class TimeManager {
    static updateTime() {
        const now = new Date();

        // Update time
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        DOM.currentTime.textContent = `${hours}:${minutes}`;

        // Update date
        const dateFormatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
        DOM.currentDate.textContent = dateFormatter.format(now);

        // Update greeting
        this.updateGreeting(now.getHours());
    }

    static updateGreeting(hour) {
        let greeting;

        if (hour >= 5 && hour < 12) {
            greeting = `Good Morning, ${AppState.userName}! ☀️`;
        } else if (hour >= 12 && hour < 17) {
            greeting = `Good Afternoon, ${AppState.userName}! 🌤️`;
        } else if (hour >= 17 && hour < 21) {
            greeting = `Good Evening, ${AppState.userName}! 🌅`;
        } else {
            greeting = `Good Night, ${AppState.userName}! 🌙`;
        }

        DOM.greetingText.textContent = greeting;
    }

    static startClock() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }
}

// ============================================
// USER NAME MANAGEMENT
// ============================================

class UserNameManager {
    static init() {
        this.updateDisplay();
    }

    static updateDisplay() {
        DOM.userNameDisplay.textContent = AppState.userName;
    }

    static openEditModal() {
        DOM.nameInput.value = AppState.userName;
        DOM.nameEditModal.classList.remove('hidden');
        DOM.nameInput.focus();
    }

    static closeEditModal() {
        DOM.nameEditModal.classList.add('hidden');
    }

    static saveName() {
        const name = DOM.nameInput.value.trim();
        if (name) {
            AppState.userName = name;
            DataManager.saveUserName(name);
            this.updateDisplay();
            TimeManager.updateTime();
            this.closeEditModal();
        }
    }
}

// ============================================
// TO-DO MANAGEMENT
// ============================================

class TodoManager {
    static addTodo() {
        const text = DOM.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        AppState.todos.push(todo);
        DataManager.saveTodos(AppState.todos);
        DOM.todoInput.value = '';
        this.render();
    }

    static updateTodo(id, text) {
        const todo = AppState.todos.find(t => t.id === id);
        if (todo) {
            todo.text = text;
            DataManager.saveTodos(AppState.todos);
            this.render();
        }
    }

    static toggleTodo(id) {
        const todo = AppState.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            DataManager.saveTodos(AppState.todos);
            this.render();
        }
    }

    static deleteTodo(id) {
        AppState.todos = AppState.todos.filter(t => t.id !== id);
        DataManager.saveTodos(AppState.todos);
        this.render();
    }

    static render() {
        DOM.todoList.innerHTML = '';

        if (AppState.todos.length === 0) {
            DOM.todoEmptyState.classList.remove('hidden');
            return;
        }

        DOM.todoEmptyState.classList.add('hidden');

        AppState.todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button class="todo-btn edit-todo" title="Edit">✏️</button>
                    <button class="todo-btn delete-todo" title="Delete">🗑️</button>
                </div>
            `;

            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

            const editBtn = li.querySelector('.edit-todo');
            editBtn.addEventListener('click', () => this.openEditModal(todo.id, todo.text));

            const deleteBtn = li.querySelector('.delete-todo');
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            DOM.todoList.appendChild(li);
        });
    }

    static openEditModal(id, text) {
        AppState.editingTaskId = id;
        DOM.editTaskInput.value = text;
        DOM.taskEditModal.classList.remove('hidden');
        DOM.editTaskInput.focus();
    }

    static closeEditModal() {
        DOM.taskEditModal.classList.add('hidden');
        AppState.editingTaskId = null;
    }

    static saveEdit() {
        const text = DOM.editTaskInput.value.trim();
        if (text && AppState.editingTaskId !== null) {
            this.updateTodo(AppState.editingTaskId, text);
            this.closeEditModal();
        }
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ============================================
// TIMER MANAGEMENT
// ============================================

class TimerManager {
    static init() {
        this.updateDurationDisplay();
    }

    static updateDurationDisplay() {
        AppState.timeRemaining = AppState.timerDuration * 60;
        this.updateDisplay();
    }

    static updateDisplay() {
        const minutes = Math.floor(AppState.timeRemaining / 60);
        const seconds = AppState.timeRemaining % 60;
        DOM.timerTime.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    static start() {
        if (AppState.isTimerRunning) return;

        const duration = parseInt(DOM.timerDurationInput.value) || AppState.timerDuration;
        AppState.timerDuration = duration;
        DataManager.saveTimerDuration(duration);

        if (AppState.timeRemaining === 0) {
            this.updateDurationDisplay();
        }

        AppState.isTimerRunning = true;
        this.openFocusMode();
        DOM.startTimerBtn.disabled = true;
        DOM.stopTimerBtn.disabled = false;
        DOM.timerDurationInput.disabled = true;

        AppState.timerInterval = setInterval(() => {
            AppState.timeRemaining--;
            this.updateDisplay();
            DOM.focusTimer.textContent =
                DOM.timerTime.textContent;

            if (AppState.timeRemaining <= 0) {
                this.stop();
                this.playNotification();
            }
        }, 1000);
    }

    static openFocusMode() {
        DOM.focusOverlay.classList.remove('hidden');
    }

    static closeFocusMode() {
        DOM.focusOverlay.classList.add('hidden');
    }

    static stop() {
        if (AppState.timerInterval) {
            clearInterval(AppState.timerInterval);
            AppState.timerInterval = null;
        }

        AppState.isTimerRunning = false;
        DOM.startTimerBtn.disabled = false;
        DOM.stopTimerBtn.disabled = true;
        DOM.timerDurationInput.disabled = false;
        this.closeFocusMode();
    }

    static reset() {
        this.stop();
        AppState.timerDuration = parseInt(DOM.timerDurationInput.value) || 25;
        this.updateDurationDisplay();
    }

    static playNotification() {
        // Create a simple beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // If Web Audio API fails, try basic alert
            console.log('Timer complete!');
        }
    }
}

// ============================================
// QUICK LINKS MANAGEMENT
// ============================================

class LinksManager {
    static addLink() {
        const name = DOM.linkNameInput.value.trim();
        const url = DOM.linkUrlInput.value.trim();

        if (!name || !url) return;

        // Validate URL format
        if (!this.isValidUrl(url)) {
            alert('Please enter a valid URL');
            return;
        }

        const link = {
            id: Date.now(),
            name: name,
            url: url,
            createdAt: new Date().toISOString(),
        };

        AppState.links.push(link);
        DataManager.saveLinks(AppState.links);
        DOM.linkNameInput.value = '';
        DOM.linkUrlInput.value = '';
        this.render();
    }

    static updateLink(id, name, url) {
        const link = AppState.links.find(l => l.id === id);
        if (link) {
            if (!this.isValidUrl(url)) {
                alert('Please enter a valid URL');
                return;
            }
            link.name = name;
            link.url = url;
            DataManager.saveLinks(AppState.links);
            this.render();
        }
    }

    static deleteLink(id) {
        AppState.links = AppState.links.filter(l => l.id !== id);
        DataManager.saveLinks(AppState.links);
        this.render();
    }

    static render() {
        DOM.quickLinksContainer.innerHTML = '';

        if (AppState.links.length === 0) {
            DOM.linksEmptyState.classList.remove('hidden');
            return;
        }

        DOM.linksEmptyState.classList.add('hidden');

        AppState.links.forEach(link => {
            const linkBtn = document.createElement('button');
            linkBtn.className = 'quick-link';
            linkBtn.innerHTML = `
                <span class="quick-link-name">${this.escapeHtml(link.name)}</span>
                <div class="quick-link-actions">
                    <button class="quick-link-action-btn edit-link" title="Edit">✏️</button>
                    <button class="quick-link-action-btn delete-link" title="Delete">🗑️</button>
                </div>
            `;

            // Open link on name click
            const nameSpan = linkBtn.querySelector('.quick-link-name');
            nameSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(link.url, '_blank');
            });

            // Edit button
            const editBtn = linkBtn.querySelector('.edit-link');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openEditModal(link.id, link.name, link.url);
            });

            // Delete button
            const deleteBtn = linkBtn.querySelector('.delete-link');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteLink(link.id);
            });

            DOM.quickLinksContainer.appendChild(linkBtn);
        });
    }

    static openEditModal(id, name, url) {
        AppState.editingLinkId = id;
        DOM.editLinkName.value = name;
        DOM.editLinkUrl.value = url;
        DOM.linkEditModal.classList.remove('hidden');
        DOM.editLinkName.focus();
    }

    static closeEditModal() {
        DOM.linkEditModal.classList.add('hidden');
        AppState.editingLinkId = null;
    }

    static saveEdit() {
        const name = DOM.editLinkName.value.trim();
        const url = DOM.editLinkUrl.value.trim();

        if (name && url && AppState.editingLinkId !== null) {
            this.updateLink(AppState.editingLinkId, name, url);
            this.closeEditModal();
        }
    }

    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Theme Toggle
    DOM.themeToggle.addEventListener('click', () => ThemeManager.toggle());

    // User Name
    DOM.editNameBtn.addEventListener('click', () => UserNameManager.openEditModal());
    DOM.saveNameBtn.addEventListener('click', () => UserNameManager.saveName());
    DOM.cancelNameBtn.addEventListener('click', () => UserNameManager.closeEditModal());
    DOM.nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') UserNameManager.saveName();
    });

    // To-Do List
    DOM.todoAddBtn.addEventListener('click', () => TodoManager.addTodo());
    DOM.todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') TodoManager.addTodo();
    });

    DOM.saveTaskBtn.addEventListener('click', () => TodoManager.saveEdit());
    DOM.cancelTaskBtn.addEventListener('click', () => TodoManager.closeEditModal());
    DOM.editTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') TodoManager.saveEdit();
    });

    // Timer
    DOM.startTimerBtn.addEventListener('click', () => TimerManager.start());
    DOM.stopTimerBtn.addEventListener('click', () => TimerManager.stop());
    DOM.resetTimerBtn.addEventListener('click', () => TimerManager.reset());
    DOM.exitFocusBtn.addEventListener('click', () => {
        TimerManager.closeFocusMode();
    });
    DOM.timerDurationInput.addEventListener('change', () => {
        if (!AppState.isTimerRunning) {
            AppState.timerDuration = parseInt(DOM.timerDurationInput.value) || 25;
            TimerManager.updateDurationDisplay();
        }
    });

    // Quick Links
    DOM.addLinkBtn.addEventListener('click', () => LinksManager.addLink());
    DOM.linkNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') DOM.linkUrlInput.focus();
    });
    DOM.linkUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') LinksManager.addLink();
    });

    DOM.saveLinkBtn.addEventListener('click', () => LinksManager.saveEdit());
    DOM.cancelLinkBtn.addEventListener('click', () => LinksManager.closeEditModal());
    DOM.editLinkUrl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') LinksManager.saveEdit();
    });
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Initialize managers
    ThemeManager.init();
    TimeManager.startClock();
    UserNameManager.init();
    TodoManager.render();
    TimerManager.init();
    LinksManager.render();

    // Setup event listeners
    setupEventListeners();

    // Log initialization
    console.log('Dashboard initialized successfully!');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
