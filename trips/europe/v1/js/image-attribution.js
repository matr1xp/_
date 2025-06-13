/**
 * Image Attribution Handler
 * Adds proper attribution to all images in the gallery
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add attribution information to the bottom of the gallery section
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;
    
    // Create attribution container
    const attributionContainer = document.createElement('div');
    attributionContainer.className = 'attribution-container';
    attributionContainer.innerHTML = `
        <h3>Image Attributions</h3>
        <p>All images used in this itinerary are credited to their respective owners and sources.</p>
        <div class="attribution-list">
            <h4>London</h4>
            <ul>
                <li>British Museum colonnade in the snow - Source: The British Museum Images</li>
                <li>Christmas Events at The London Eye - Source: The London Eye</li>
                <li>Tower of London in the snow - Source: Alamy</li>
                <li>Hyde Park Winter Wonderland - Source: Hyde Park Winter Wonderland</li>
                <li>Christmas in Covent Garden - Source: Covent Garden</li>
                <li>Harry Potter Studio Tour London - Source: Periodic Adventures</li>
            </ul>
            
            <h4>Paris</h4>
            <ul>
                <li>Snowy Eiffel Tower - Source: StockCake</li>
                <li>Louvre Pyramid - Source: Le Louvre</li>
                <li>A restored Notre Dame cathedral - Source: NPR</li>
                <li>Christmas lights Champs-Elysees Arc de Triomphe - Source: Alamy</li>
                <li>Disney Enchanted Christmas - Source: Disneyland Paris News</li>
                <li>Eurostar train - Source: Seat 61</li>
            </ul>
            
            <h4>Italy</h4>
            <ul>
                <li>Milan's Duomo Cathedral in winter with snow - Source: Alamy</li>
                <li>Milan Italy in winter, Christmas tree in front of Milan Cathedral - Source: Alamy</li>
                <li>Venice at Christmas: Lights in St Mark's Square - Source: Guidedtoursinvenice</li>
                <li>Christmas in Venice - Source: Visit Venezia</li>
                <li>Venice in Winter: Gondola ride - Source: Walks Of Italy</li>
                <li>The Duomo Cathedral With Snow During Winter - Source: Art.com</li>
                <li>Florence in Winter - Source: Tourist Italy</li>
                <li>The Magic Of Christmas In Florence - Source: Leisure Italy</li>
                <li>Snow at the Colosseum - Source: CNN</li>
                <li>Christmas Mass at Vatican - Source: The Roman Guy</li>
                <li>Rome: Trevi Fountain at Night while Snowing - Source: Dreamstime.com</li>
            </ul>
        </div>
    `;
    
    // Add attribution container to the gallery section
    gallerySection.querySelector('.container').appendChild(attributionContainer);
    
    // Add click event to gallery items to show larger image with attribution
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const caption = this.querySelector('.gallery-item-caption').innerHTML;
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            modal.innerHTML = `
                <div class="gallery-modal-content">
                    <span class="close-modal">&times;</span>
                    <img src="${imgSrc}" alt="">
                    <div class="modal-caption">
                        ${caption}
                    </div>
                </div>
            `;
            
            // Add modal to body
            document.body.appendChild(modal);
            
            // Close modal on click
            modal.querySelector('.close-modal').addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            // Close modal when clicking outside the image
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        });
    });
});