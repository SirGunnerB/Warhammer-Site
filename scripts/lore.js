// Make sections collapsible
document.addEventListener('DOMContentLoaded', function() {
    // Collapsible sections
    const headers = document.querySelectorAll('.article-main h2');
    headers.forEach(header => {
        const section = header.nextElementSibling;
        if (section && section.tagName !== 'DIV') {
            header.addEventListener('click', () => {
                header.classList.toggle('expanded');
                section.classList.toggle('collapsed');
            });
        }
    });

    // Timeline animations
    const timelineEvents = document.querySelectorAll('.timeline-event');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineEvents.forEach(event => {
        event.style.opacity = '0';
        event.style.transform = 'translateY(20px)';
        event.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(event);
    });

    // Sidebar hover effects
    const sidebarItems = document.querySelectorAll('.article-sidebar > div');
    sidebarItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-2px)';
            item.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
    });

    // Navigation link animations
    const navLinks = document.querySelectorAll('.article-navigation a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const underline = link.querySelector('::after');
            if (underline) {
                underline.style.transform = 'translateX(0)';
            }
        });

        link.addEventListener('mouseleave', () => {
            const underline = link.querySelector('::after');
            if (underline) {
                underline.style.transform = 'translateX(-100%)';
            }
        });
    });
});
