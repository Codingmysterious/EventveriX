document.addEventListener('DOMContentLoaded', function() {
    // Get thank you data from localStorage
    const thankYouData = JSON.parse(localStorage.getItem('thankYouData'));
    
    if (!thankYouData) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set details
    document.getElementById('detailEvent').textContent = thankYouData.event;
    document.getElementById('detailAmount').textContent = thankYouData.amount;
    document.getElementById('detailTransaction').textContent = thankYouData.transactionId;
    
    // Clear the data
    localStorage.removeItem('thankYouData');
    localStorage.removeItem('contributionFormData');
    
    // Initialize confetti
    initConfetti();
});

function initConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const pieces = [];
    const colors = ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    // Create confetti pieces
    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            rotation: Math.random() * 360,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            sway: Math.random() * 2 - 1,
            swaySpeed: Math.random() * 0.02
        });
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let stillActive = false;
        
        pieces.forEach(p => {
            p.y += p.speed;
            p.x += p.sway;
            p.rotation += p.sway * 5;
            p.sway += Math.sin(Date.now() * p.swaySpeed) * 0.5;
            
            if (p.y < canvas.height) {
                stillActive = true;
            }
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            
            ctx.restore();
        });
        
        if (stillActive) {
            requestAnimationFrame(animate);
        }
    }
    
    // Start animation
    setTimeout(animate, 500);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}