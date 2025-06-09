document.addEventListener('DOMContentLoaded', function() {
    // Check admin login
    checkAdminLogin();

    // Initialize the admin panel
    initAdminPanel();
});

function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showLoginModal();
    }
}

function initAdminPanel() {
    // Tab switching functionality
    setupTabs();

    // Search functionality
    setupSearch();

    // Filter functionality
    setupFilters();

    // Export functionality
    setupExport();

    // Load initial data
    loadDashboard();
}

function setupTabs() {
    const tabs = document.querySelectorAll('.admin-nav li');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab') + 'Tab';
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            
            // Update page title
            document.getElementById('adminPageTitle').textContent = this.textContent.trim();
            
            // Load appropriate data
            switch(tabId) {
                case 'dashboardTab':
                    loadDashboard();
                    break;
                case 'contributionsTab':
                case 'pendingTab':
                case 'verifiedTab':
                    loadContributions();
                    break;
                case 'exportTab':
                    // Nothing needed here
                    break;
            }
        });
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        showLoginModal();
    });
}

function setupSearch() {
    const searchInput = document.getElementById('adminSearchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const activeTab = document.querySelector('.admin-tab.active').id;
            
            let tableBody;
            
            if (activeTab === 'dashboardTab') {
                tableBody = document.getElementById('recentContributions');
            } else if (activeTab === 'contributionsTab' || 
                      activeTab === 'pendingTab' || 
                      activeTab === 'verifiedTab') {
                tableBody = document.getElementById('allContributions');
            }
            
            if (tableBody) {
                const rows = tableBody.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    let shouldShow = false;
                    
                    // Check each cell (except the last one which contains buttons)
                    for (let i = 0; i < cells.length - 1; i++) {
                        if (cells[i].textContent.toLowerCase().includes(searchTerm)) {
                            shouldShow = true;
                            break;
                        }
                    }
                    
                    row.style.display = shouldShow ? '' : 'none';
                });
            }
        });
    }
}

function setupFilters() {
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            loadContributions();
        });
    }
}

function setupExport() {
    const exportBtn = document.getElementById('exportBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportData();
        });
    }
}

function loadDashboard() {
    getContributions().then(contributions => {
        // Update stats
        updateStats(contributions);
        
        // Show recent contributions (last 5)
        showRecentContributions(contributions.slice(-5).reverse());
    });
}

function updateStats(contributions) {
    document.getElementById('totalContributions').textContent = contributions.length;
    
    const verified = contributions.filter(c => c.status === 'verified').length;
    document.getElementById('verifiedContributions').textContent = verified;
    
    document.getElementById('pendingContributions').textContent = contributions.length - verified;
    
    const totalAmount = contributions.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
    document.getElementById('totalAmount').textContent = `₹${totalAmount.toFixed(2)}`;
}

function showRecentContributions(contributions) {
    const tbody = document.getElementById('recentContributions');
    tbody.innerHTML = '';
    
    const eventTitles = {
        'birthday': 'Birthday',
        'farewell': 'Farewell',
        'trust': 'Trust',
        'newyear': 'New Year',
        'religious': 'Religious',
        'other': 'Other'
    };
    
    contributions.forEach(contribution => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${contribution.name}</td>
            <td>${eventTitles[contribution.eventType] || 'Event'}</td>
            <td>₹${contribution.amount || '0'}</td>
            <td><span class="status-badge ${contribution.status}">${contribution.status}</span></td>
            <td>${formatDate(contribution.date)}</td>
            <td>
                <button class="action-btn view-btn" data-id="${contribution.transactionId}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Add event listeners to view buttons
    setupViewButtons();
}

function loadContributions() {
    const eventFilter = document.getElementById('filterEvent')?.value || 'all';
    const statusFilter = document.getElementById('filterStatus')?.value || 'all';
    const activeTab = document.querySelector('.admin-nav li.active').getAttribute('data-tab');
    
    getContributions().then(contributions => {
        // Apply filters based on active tab
        let filtered = contributions;
        
        // First apply tab-specific filter
        switch(activeTab) {
            case 'pending':
                filtered = filtered.filter(c => c.status === 'pending');
                break;
            case 'verified':
                filtered = filtered.filter(c => c.status === 'verified');
                break;
            case 'contributions':
                if (statusFilter !== 'all') {
                    filtered = filtered.filter(c => c.status === statusFilter);
                }
                break;
        }
        
        // Then apply event filter if not 'all'
        if (eventFilter !== 'all') {
            filtered = filtered.filter(c => c.eventType === eventFilter);
        }
        
        // Show in table
        showAllContributions(filtered);
    });
}

function showAllContributions(contributions) {
    const tbody = document.getElementById('allContributions');
    tbody.innerHTML = '';
    
    const eventTitles = {
        'birthday': 'Birthday',
        'farewell': 'Farewell',
        'trust': 'Trust',
        'newyear': 'New Year',
        'religious': 'Religious',
        'other': 'Other'
    };
    
    contributions.forEach(contribution => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${contribution.name}</td>
            <td>${contribution.mobile}</td>
            <td>${eventTitles[contribution.eventType] || 'Event'}</td>
            <td>₹${contribution.amount || '0'}</td>
            <td>${contribution.transactionId}</td>
            <td><span class="status-badge ${contribution.status}">${contribution.status}</span></td>
            <td>
                <button class="action-btn view-btn" data-id="${contribution.transactionId}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Add event listeners to view buttons
    setupViewButtons();
}

function setupViewButtons() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showContributionDetails(id);
        });
    });
}

function showContributionDetails(transactionId) {
    getContributions().then(contributions => {
        const contribution = contributions.find(c => c.transactionId === transactionId);
        
        if (!contribution) {
            alert('Contribution not found');
            return;
        }
        
        const eventTitles = {
            'birthday': 'Birthday Celebration',
            'farewell': 'Farewell Party',
            'trust': 'Trust Donation',
            'newyear': 'New Year Event',
            'religious': 'Religious Function',
            'other': 'Social Gathering'
        };
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="modal-row">
                <div class="modal-label">Name:</div>
                <div class="modal-value">${contribution.name}</div>
            </div>
            <div class="modal-row">
                <div class="modal-label">Mobile:</div>
                <div class="modal-value">${contribution.mobile}</div>
            </div>
            <div class="modal-row">
                <div class="modal-label">Event:</div>
                <div class="modal-value">${eventTitles[contribution.eventType] || 'Event'}</div>
            </div>
            <div class="modal-row">
                <div class="modal-label">Amount:</div>
                <div class="modal-value">₹${contribution.amount || '0'}</div>
            </div>
            <div class="modal-row">
                <div class="modal-label">Transaction ID:</div>
                <div class="modal-value">${contribution.transactionId}</div>
            </div>
            <div class="modal-row">
                <div class="modal-label">Date:</div>
                <div class="modal-value">${formatDateTime(contribution.date)}</div>
            </div>
            ${contribution.isEmployee ? `
            <div class="modal-row">
                <div class="modal-label">Company:</div>
                <div class="modal-value">${contribution.company || '-'}</div>
            </div>
            <div class="modal-row">
                <div class="modal-label">Employee ID:</div>
                <div class="modal-value">${contribution.employeeId || '-'}</div>
            </div>
            ` : ''}
            <div class="modal-row">
                <div class="modal-label">Payment Proof:</div>
                <div class="modal-value">
                    <img src="${contribution.screenshot}" alt="Payment Proof" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                </div>
            </div>
        `;
        
        // Set up action buttons
        document.getElementById('verifyBtn').onclick = function() {
            updateContributionStatus(transactionId, 'verified');
        };
        
        document.getElementById('pendingBtn').onclick = function() {
            updateContributionStatus(transactionId, 'pending');
        };
        
        document.getElementById('deleteBtn').onclick = function() {
            if (confirm('Are you sure you want to delete this entry?')) {
                deleteContribution(transactionId);
            }
        };
        
        // Show modal
        document.getElementById('detailModal').style.display = 'flex';
        
        // Close modal
        document.querySelector('.close-modal').onclick = function() {
            document.getElementById('detailModal').style.display = 'none';
        };
    });
}

function updateContributionStatus(transactionId, status) {
    getContributions().then(contributions => {
        const index = contributions.findIndex(c => c.transactionId === transactionId);
        
        if (index !== -1) {
            contributions[index].status = status;
            saveAllContributions(contributions).then(() => {
                alert('Status updated successfully');
                document.getElementById('detailModal').style.display = 'none';
                
                // Refresh the current view
                const activeTab = document.querySelector('.admin-nav li.active').getAttribute('data-tab');
                if (activeTab === 'dashboard') {
                    loadDashboard();
                } else {
                    loadContributions();
                }
            });
        }
    });
}

function deleteContribution(transactionId) {
    getContributions().then(contributions => {
        const filtered = contributions.filter(c => c.transactionId !== transactionId);
        saveAllContributions(filtered).then(() => {
            alert('Entry deleted successfully');
            document.getElementById('detailModal').style.display = 'none';
            
            // Refresh the current view
            const activeTab = document.querySelector('.admin-nav li.active').getAttribute('data-tab');
            if (activeTab === 'dashboard') {
                loadDashboard();
            } else {
                loadContributions();
            }
        });
    });
}

function exportData() {
    const eventFilter = document.getElementById('exportEventType').value;
    const statusFilter = document.getElementById('exportStatus').value;
    const format = document.getElementById('exportFormat').value;
    
    getContributions().then(contributions => {
        // Apply filters
        let filtered = contributions;
        
        if (eventFilter !== 'all') {
            filtered = filtered.filter(c => c.eventType === eventFilter);
        }
        
        if (statusFilter !== 'all') {
            filtered = filtered.filter(c => c.status === statusFilter);
        }
        
        // Prepare data
        const eventTitles = {
            'birthday': 'Birthday',
            'farewell': 'Farewell',
            'trust': 'Trust',
            'newyear': 'New Year',
            'religious': 'Religious',
            'other': 'Other'
        };
        
        const data = filtered.map(c => ({
            Name: c.name,
            Mobile: c.mobile,
            Event: eventTitles[c.eventType] || 'Event',
            Amount: `₹${c.amount || '0'}`,
            'Transaction ID': c.transactionId,
            Status: c.status,
            'Company/Organization': c.isEmployee ? c.company : 'N/A',
            'Employee ID': c.isEmployee ? c.employeeId : 'N/A',
            Date: formatDateTime(c.date)
        }));
        
        // Export based on format
        if (format === 'excel') {
            exportToCSV(data);
        } else {
            exportToJSON(data);
        }
    });
}

function exportToCSV(data) {
    if (data.length === 0) {
        alert('No data to export');
        return;
    }
    
    // Extract headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csv += values.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contributions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToJSON(data) {
    if (data.length === 0) {
        alert('No data to export');
        return;
    }
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contributions_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Helper function to get contributions from storage
function getContributions() {
    return new Promise((resolve) => {
        if (typeof firebase !== 'undefined' && firebase.apps.length) {
            // Get from Firebase
            firebase.database().ref('contributions').once('value', snapshot => {
                const data = snapshot.val();
                const contributions = data ? Object.values(data) : [];
                resolve(contributions);
            });
        } else {
            // Get from localStorage
            const contributions = JSON.parse(localStorage.getItem('contributions') || '[]');

            resolve(contributions);
        }
    });
}

// Helper function to save all contributions to storage
function saveAllContributions(contributions) {
    return new Promise((resolve) => {
        if (typeof firebase !== 'undefined' && firebase.apps.length) {
            // Save to Firebase
            firebase.database().ref('contributions').set(contributions).then(() => {
                resolve();
            });
        } else {
            // Save to localStorage
            localStorage.setItem('contributions', JSON.stringify(contributions));
            resolve();
        }
    });
}

// Helper functions for date formatting
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Login modal functionality
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'flex';
    
    // Login button
    document.getElementById('loginBtn').addEventListener('click', function() {
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        // Simple auth (in real app, use Firebase Auth or proper backend)
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('adminLoggedIn', 'true');
            modal.style.display = 'none';
            initAdminPanel();
        } else {
            alert('Invalid username or password');
        }
    });
    
    // Close modal
    document.querySelector('.close-modal')?.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Also close when clicking outside modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}