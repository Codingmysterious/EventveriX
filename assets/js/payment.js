document.addEventListener('DOMContentLoaded', function() {
    // Get form data from localStorage
    const formData = JSON.parse(localStorage.getItem('contributionFormData'));
    
    if (!formData) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set event title
    const eventTitles = {
        'birthday': 'Birthday Celebration',
        'farewell': 'Farewell Party',
        'trust': 'Trust Donation',
        'newyear': 'New Year Event',
        'religious': 'Religious Function',
        'other': 'Social Gathering'
    };
    
    document.getElementById('eventTitle').textContent = eventTitles[formData.eventType] || 'Event Contribution';
    
    // Form submission
    const paymentForm = document.getElementById('paymentForm');
    
    paymentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get payment values
        const screenshotFile = document.getElementById('screenshot').files[0];
        const transactionId = document.getElementById('transactionId').value;
        const amount = document.getElementById('amount').value;
        
        if (!screenshotFile || !transactionId || !amount) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Convert screenshot to base64
        const screenshot = await toBase64(screenshotFile);
        
        // Create complete contribution object
        const contribution = {
            ...formData,
            screenshot,
            transactionId,
            amount,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        // Save to localStorage (or Firebase if configured)
        saveContribution(contribution);
        
        // Redirect to thank you page with data
        localStorage.setItem('thankYouData', JSON.stringify({
            event: eventTitles[formData.eventType] || 'Event',
            amount: `₹${amount}`,
            transactionId
        }));
        
        window.location.href = 'thankyou.html';
    });
    
    // Helper function to convert file to base64
    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    // Save contribution to storage
    function saveContribution(contribution) {
        // Try to use Firebase if configured
        if (typeof firebase !== 'undefined' && firebase.apps.length) {
            firebase.database().ref('contributions').push(contribution);
        } else {
            // Fallback to localStorage
            let contributions = JSON.parse(localStorage.getItem('contributions') || '[]');
            contributions.push(contribution);
            localStorage.setItem('contributions', JSON.stringify(contributions));
        }
    }
});