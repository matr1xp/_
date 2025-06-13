
// Print functionality
document.addEventListener('DOMContentLoaded', function() {
    const printButtons = document.querySelectorAll('.print-btn');
    
    printButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Expand all day details before printing
            const dayContents = document.querySelectorAll('.day-content');
            dayContents.forEach(content => {
                content.classList.add('active');
            });
            
            // Print the page
            window.print();
            
            // Optional: collapse day details again after printing
            // Uncomment if you want this behavior
            /*
            setTimeout(() => {
                dayContents.forEach(content => {
                    content.classList.remove('active');
                });
            }, 1000);
            */
        });
    });
});
