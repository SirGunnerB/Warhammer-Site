// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Dropdown menu functionality
document.querySelectorAll('.tab-item').forEach(item => {
    const dropdown = item.querySelector('.dropdown');
    if (dropdown) {
        item.addEventListener('mouseenter', () => {
            dropdown.style.display = 'block';
        });
        item.addEventListener('mouseleave', () => {
            dropdown.style.display = 'none';
        });
    }
});

// Dynamic content loading for featured section
const featuredContent = [
    {
        title: 'The Horus Heresy',
        description: 'The galaxy-spanning civil war that shaped the Imperium',
        image: 'images/horus-heresy.jpg'
    },
    {
        title: 'Rise of the Necrons',
        description: 'Ancient dynasty awakens from million-year slumber',
        image: 'images/necrons.jpg'
    },
    {
        title: 'Tyranid Invasion',
        description: 'The growing shadow of the Great Devourer',
        image: 'images/tyranids.jpg'
    }
];

// Load featured content
function loadFeaturedContent() {
    const featuredGrid = document.querySelector('.featured-grid');
    if (!featuredGrid) return; // Exit if element doesn't exist
    
    featuredContent.forEach(content => {
        const article = document.createElement('article');
        article.className = 'featured-item';
        article.innerHTML = `
            <div class="featured-image">
                <img src="${content.image}" alt="${content.title}" onerror="this.src='/images/placeholder.jpg'">
            </div>
            <h3>${content.title}</h3>
            <p>${content.description}</p>
        `;
        featuredGrid.appendChild(article);
    });
}

// Intersection Observer for animation triggers
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections for animations
document.addEventListener('DOMContentLoaded', () => {
    // Observe faction cards
    document.querySelectorAll('.faction-card').forEach(card => {
        observer.observe(card);
    });

    // Observe character cards
    document.querySelectorAll('.character-card').forEach(card => {
        observer.observe(card);
    });

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Load featured content
    loadFeaturedContent();

    // Image error handling
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = '/images/placeholder.jpg';
        });
    });

    // Fix navigation paths for faction and character links
    document.querySelectorAll('a[href^="/pages/"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Ensure we're not double-nesting paths
            if (href.includes('/pages/pages/')) {
                e.preventDefault();
                const fixedPath = href.replace('/pages/pages/', '/pages/');
                window.location.href = fixedPath;
            }
        });
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Mobile menu toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const navigation = document.querySelector('nav');

if (mobileMenuButton && navigation) {
    mobileMenuButton.addEventListener('click', () => {
        navigation.classList.toggle('active');
        mobileMenuButton.classList.toggle('active');
    });
}
