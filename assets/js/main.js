document.addEventListener('DOMContentLoaded', function() {
    // Toggle employee fields
    const isEmployeeCheckbox = document.getElementById('isEmployee');
    const employeeFields = document.getElementById('employeeFields');
    
    isEmployeeCheckbox.addEventListener('change', function() {
        if (this.checked) {
            employeeFields.classList.remove('hidden');
        } else {
            employeeFields.classList.add('hidden');
        }
    });
    
    // Form submission
    const contributionForm = document.getElementById('contributionForm');
    
    contributionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const eventType = document.getElementById('eventType').value;
        const name = document.getElementById('name').value;
        const mobile = document.getElementById('mobile').value;
        const isEmployee = document.getElementById('isEmployee').checked;
        const company = isEmployee ? document.getElementById('company').value : '';
        const employeeId = isEmployee ? document.getElementById('employeeId').value : '';
        const photoFile = document.getElementById('photo').files[0];
        
        // Basic validation
        if (!eventType || !name || !mobile) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Store form data in localStorage to pass to next page
        const formData = {
            eventType,
            name,
            mobile,
            isEmployee,
            company,
            employeeId,
            photo: photoFile ? await toBase64(photoFile) : null
        };
        
        localStorage.setItem('contributionFormData', JSON.stringify(formData));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
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
});