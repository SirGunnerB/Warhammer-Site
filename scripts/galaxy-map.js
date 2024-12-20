class GalaxyMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // Galaxy sectors
        this.sectors = {
            'Segmentum Solar': { x: 0.5, y: 0.5, color: '#ffeb3b' },
            'Segmentum Obscurus': { x: 0.5, y: 0.2, color: '#f44336' },
            'Segmentum Pacificus': { x: 0.2, y: 0.5, color: '#4caf50' },
            'Segmentum Ultima': { x: 0.8, y: 0.5, color: '#2196f3' },
            'Segmentum Tempestus': { x: 0.5, y: 0.8, color: '#9c27b0' }
        };

        // Planet data with coordinates relative to sectors
        this.planets = {
            'Terra': { 
                sector: 'Segmentum Solar',
                relativeX: 0,
                relativeY: 0,
                type: 'throne',
                description: 'Throne World of the Imperium'
            },
            'Mars': {
                sector: 'Segmentum Solar',
                relativeX: 0.05,
                relativeY: 0.02,
                type: 'forge',
                description: 'Primary Forge World of the Mechanicus'
            },
            'Macragge': {
                sector: 'Segmentum Ultima',
                relativeX: -0.2,
                relativeY: 0.1,
                type: 'chapter',
                description: 'Home of the Ultramarines'
            },
            'Cadia': {
                sector: 'Segmentum Obscurus',
                relativeX: 0.1,
                relativeY: -0.1,
                type: 'fortress',
                description: 'Former Guardian of the Eye of Terror'
            },
            'Armageddon': {
                sector: 'Segmentum Solar',
                relativeX: 0.3,
                relativeY: 0.2,
                type: 'hive',
                description: 'Site of Multiple Major Wars'
            },
            'Baal': {
                sector: 'Segmentum Pacificus',
                relativeX: 0.15,
                relativeY: -0.1,
                type: 'chapter',
                description: 'Homeworld of the Blood Angels'
            },
            'Fenris': {
                sector: 'Segmentum Obscurus',
                relativeX: -0.2,
                relativeY: 0.1,
                type: 'chapter',
                description: 'Frozen homeworld of the Space Wolves'
            },
            'Necromunda': {
                sector: 'Segmentum Solar',
                relativeX: 0.2,
                relativeY: -0.15,
                type: 'hive',
                description: 'Major Hive World and Industrial Center'
            },
            'Prospero': {
                sector: 'Segmentum Ultima',
                relativeX: 0.3,
                relativeY: 0.2,
                type: 'ruins',
                description: 'Former homeworld of the Thousand Sons, now in ruins'
            }
        };

        // Add zoom and pan properties
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.minScale = 0.5;
        this.maxScale = 3;

        // Add travel routes
        this.routes = [
            {
                name: 'Astronomican Route',
                points: ['Terra', 'Macragge'],
                color: '#ffeb3b',
                type: 'stable',
                description: 'Primary Astronomican-guided route to Ultramar'
            },
            {
                name: 'Cadian Gate',
                points: ['Terra', 'Cadia'],
                color: '#f44336',
                type: 'dangerous',
                description: 'Strategic corridor near the Eye of Terror'
            },
            {
                name: 'Forge Route',
                points: ['Terra', 'Mars'],
                color: '#4caf50',
                type: 'stable',
                description: 'Ancient route between Terra and Mars'
            },
            {
                name: 'Blood Angels Path',
                points: ['Terra', 'Baal'],
                color: '#ff9800',
                type: 'stable',
                description: 'Route to the Blood Angels homeworld'
            },
            {
                name: 'Fenrisian Route',
                points: ['Terra', 'Fenris'],
                color: '#2196f3',
                type: 'dangerous',
                description: 'Treacherous path through the Warp storms'
            },
            {
                name: 'Hive Network',
                points: ['Terra', 'Necromunda'],
                color: '#9c27b0',
                type: 'stable',
                description: 'Major trade route to Necromunda'
            }
        ];

        // Add historical events for planets
        this.planetEvents = {
            'Terra': [
                { date: 'M30', event: 'Unification Wars', description: 'Emperor unifies Terra' },
                { date: 'M31', event: 'Horus Heresy', description: 'Civil War devastates the Imperium' },
                { date: 'M31-Present', event: 'Seat of the Imperium', description: 'Center of Imperial power' }
            ],
            'Mars': [
                { date: 'Pre-M30', event: 'Age of Technology', description: 'Peak of human technological achievement' },
                { date: 'M31', event: 'Schism of Mars', description: 'Civil war during the Horus Heresy' },
                { date: 'M31-Present', event: 'Forge World', description: 'Primary forge world of the Mechanicus' }
            ],
            'Macragge': [
                { date: 'M30', event: 'Discovery', description: 'Roboute Guilliman arrives' },
                { date: 'M31', event: 'Capital of Ultramar', description: 'Becomes center of the 500 Worlds' },
                { date: 'M41', event: 'Tyrannic War', description: 'Defeat of Hive Fleet Behemoth' }
            ],
            'Cadia': [
                { date: 'M31', event: 'Fortification', description: 'Fortified against Chaos incursions' },
                { date: 'M32-M41', event: 'Black Crusades', description: 'Repels multiple Chaos invasions' },
                { date: 'M42', event: 'The Fall', description: 'Destruction during 13th Black Crusade' }
            ]
        };

        // Add search functionality
        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.placeholder = 'Search planets...';
        this.searchInput.className = 'map-search';
        this.container.appendChild(this.searchInput);

        this.searchResults = document.createElement('div');
        this.searchResults.className = 'search-results';
        this.container.appendChild(this.searchResults);

        this.setupEventListeners();
        this.setupSearch();
        this.draw();
        this.startRouteAnimation();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / this.width;
            const y = (e.clientY - rect.top) / this.height;
            
            this.handleHover(x, y);
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / this.width;
            const y = (e.clientY - rect.top) / this.height;
            
            this.handleClick(x, y);
        });

        // Add zoom event listener
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate zoom
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale * zoomFactor));
            
            // Adjust offset to zoom towards mouse position
            if (newScale !== this.scale) {
                const scaleChange = newScale - this.scale;
                this.offsetX -= (mouseX - this.offsetX) * (scaleChange / this.scale);
                this.offsetY -= (mouseY - this.offsetY) * (scaleChange / this.scale);
                this.scale = newScale;
                this.draw();
            }
        });

        // Add pan event listeners
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.isDragging = true;
            this.lastX = e.clientX - rect.left;
            this.lastY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (this.isDragging) {
                this.offsetX += x - this.lastX;
                this.offsetY += y - this.lastY;
                this.lastX = x;
                this.lastY = y;
                this.draw();
            } else {
                this.handleHover(
                    (x - this.offsetX) / this.scale,
                    (y - this.offsetY) / this.scale
                );
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
        });

        // Add reset view button listener
        const resetButton = document.getElementById('reset-view');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.scale = 1;
                this.offsetX = 0;
                this.offsetY = 0;
                this.draw();
            });
        }

        window.addEventListener('resize', () => {
            this.width = this.container.clientWidth;
            this.height = this.container.clientHeight;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.draw();
        });
    }

    setupSearch() {
        this.searchInput.addEventListener('input', () => {
            const query = this.searchInput.value.toLowerCase();
            if (query.length < 2) {
                this.searchResults.innerHTML = '';
                return;
            }

            const results = Object.entries(this.planets)
                .filter(([name]) => name.toLowerCase().includes(query))
                .slice(0, 5);

            this.searchResults.innerHTML = results.length ? results.map(([name, data]) => `
                <div class="search-result" data-planet="${name}">
                    <h4>${name}</h4>
                    <p>${data.description}</p>
                </div>
            `).join('') : '<div class="no-results">No planets found</div>';

            this.searchResults.querySelectorAll('.search-result').forEach(result => {
                result.addEventListener('click', () => {
                    const planetName = result.dataset.planet;
                    this.focusOnPlanet(planetName);
                    this.searchInput.value = '';
                    this.searchResults.innerHTML = '';
                });
            });
        });
    }

    focusOnPlanet(planetName) {
        const planet = this.planets[planetName];
        const sector = this.sectors[planet.sector];
        
        // Calculate target position
        const targetX = (sector.x + planet.relativeX) * this.width;
        const targetY = (sector.y + planet.relativeY) * this.height;
        
        // Animate to position
        const startX = this.offsetX;
        const startY = this.offsetY;
        const startScale = this.scale;
        const targetScale = 2;
        
        const animate = (progress) => {
            this.scale = startScale + (targetScale - startScale) * progress;
            this.offsetX = startX + (this.width / 2 - targetX * this.scale - startX) * progress;
            this.offsetY = startY + (this.height / 2 - targetY * this.scale - startY) * progress;
            this.draw();
        };

        this.animateValue(animate, 1000);
    }

    animateValue(callback, duration) {
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            callback(this.easeInOutCubic(progress));
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    drawSector(name, data) {
        const centerX = data.x * this.width;
        const centerY = data.y * this.height;
        const radius = Math.min(this.width, this.height) * 0.15;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = data.color + '33'; // Add transparency
        this.ctx.fill();
        this.ctx.strokeStyle = data.color;
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(name, centerX, centerY - radius - 10);
    }

    drawPlanet(name, data) {
        const sector = this.sectors[data.sector];
        const centerX = (sector.x + data.relativeX) * this.width;
        const centerY = (sector.y + data.relativeY) * this.height;
        
        // Draw planet
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = this.getPlanetColor(data.type);
        this.ctx.fill();

        // Draw name
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(name, centerX, centerY - 10);

        // Store planet position for interaction
        data.screenX = centerX;
        data.screenY = centerY;
    }

    getPlanetColor(type) {
        const colors = {
            'throne': '#ffd700',
            'forge': '#ff4400',
            'chapter': '#0044ff',
            'fortress': '#00ff44',
            'hive': '#ff0044',
            'ruins': '#666666'
        };
        return colors[type] || '#ffffff';
    }

    handleHover(x, y) {
        let hoveredPlanet = null;
        for (const [name, data] of Object.entries(this.planets)) {
            const dx = x * this.width - data.screenX;
            const dy = y * this.height - data.screenY;
            if (dx * dx + dy * dy < 100) { // 10px radius for interaction
                hoveredPlanet = { name, data };
                break;
            }
        }

        if (hoveredPlanet !== this.selectedPlanet) {
            this.selectedPlanet = hoveredPlanet;
            this.draw();
            this.showEnhancedTooltip(hoveredPlanet);
        }
    }

    handleClick(x, y) {
        for (const [name, data] of Object.entries(this.planets)) {
            const dx = x * this.width - data.screenX;
            const dy = y * this.height - data.screenY;
            if (dx * dx + dy * dy < 100) { // 10px radius for interaction
                window.location.href = `${name.toLowerCase()}.html`;
                break;
            }
        }
    }

    showEnhancedTooltip(planet) {
        const tooltip = document.getElementById('map-tooltip');
        if (!planet) {
            if (tooltip) tooltip.style.display = 'none';
            return;
        }

        if (!tooltip) {
            const newTooltip = document.createElement('div');
            newTooltip.id = 'map-tooltip';
            this.container.appendChild(newTooltip);
        }

        const tooltipElement = document.getElementById('map-tooltip');
        tooltipElement.innerHTML = `
            <h4>${planet.name}</h4>
            <p class="planet-type">${planet.data.type.charAt(0).toUpperCase() + planet.data.type.slice(1)} World</p>
            <p class="planet-desc">${planet.data.description}</p>
            <p class="planet-sector">Sector: ${planet.data.sector}</p>
            <div class="planet-routes">
                <h5>Connected Routes:</h5>
                <ul>
                    ${this.routes
                        .filter(route => route.points.includes(planet.name))
                        .map(route => `
                            <li class="route-${route.type}">
                                ${route.name}: ${route.description}
                            </li>
                        `).join('')}
                </ul>
            </div>
            <button class="show-timeline">View Timeline</button>
        `;

        const timelineButton = tooltipElement.querySelector('.show-timeline');
        timelineButton.addEventListener('click', () => {
            this.showPlanetTimeline(planet.name);
        });

        tooltipElement.style.display = 'block';
        
        // Position tooltip
        const x = planet.data.screenX + 20;
        const y = planet.data.screenY - 20;
        tooltipElement.style.left = `${Math.min(x, this.width - 300)}px`;
        tooltipElement.style.top = `${Math.max(20, y)}px`;
    }

    showPlanetTimeline(planetName) {
        const events = this.planetEvents[planetName];
        if (!events) return;

        const timeline = document.createElement('div');
        timeline.className = 'planet-timeline';
        timeline.innerHTML = `
            <h3>${planetName} Timeline</h3>
            <div class="timeline-events">
                ${events.map(event => `
                    <div class="timeline-event">
                        <div class="event-date">${event.date}</div>
                        <div class="event-content">
                            <h4>${event.event}</h4>
                            <p>${event.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        const existingTimeline = document.querySelector('.planet-timeline');
        if (existingTimeline) {
            existingTimeline.remove();
        }
        this.container.appendChild(timeline);
    }

    drawRoute(route, progress) {
        const start = this.planets[route.points[0]];
        const end = this.planets[route.points[1]];
        
        const startSector = this.sectors[start.sector];
        const endSector = this.sectors[end.sector];
        
        const startX = (startSector.x + start.relativeX) * this.width * this.scale + this.offsetX;
        const startY = (startSector.y + start.relativeY) * this.height * this.scale + this.offsetY;
        const endX = (endSector.x + end.relativeX) * this.width * this.scale + this.offsetX;
        const endY = (endSector.y + end.relativeY) * this.height * this.scale + this.offsetY;

        // Draw route path
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(
            startX + (endX - startX) * progress,
            startY + (endY - startY) * progress
        );
        
        // Style based on route type
        this.ctx.strokeStyle = route.color;
        this.ctx.lineWidth = route.type === 'dangerous' ? 3 : 2;
        if (route.type === 'dangerous') {
            this.ctx.setLineDash([5, 5]);
        } else {
            this.ctx.setLineDash([]);
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    startRouteAnimation() {
        let progress = 0;
        const animate = () => {
            progress += 0.005;
            if (progress > 1) progress = 0;
            
            this.draw();
            this.routes.forEach(route => this.drawRoute(route, progress));
            
            requestAnimationFrame(animate);
        };
        animate();
    }

    draw() {
        // Transform for zoom and pan
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);

        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(
            -this.offsetX / this.scale,
            -this.offsetY / this.scale,
            this.width / this.scale,
            this.height / this.scale
        );

        // Draw background stars
        for (let i = 0; i < 200; i++) {
            const x = (Math.random() * this.width - this.offsetX) / this.scale;
            const y = (Math.random() * this.height - this.offsetY) / this.scale;
            const radius = Math.random() * 1.5;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
            this.ctx.fill();
        }

        // Draw sectors and planets
        for (const [name, data] of Object.entries(this.sectors)) {
            this.drawSector(name, data);
        }

        // Draw routes
        this.routes.forEach(route => this.drawRoute(route, 1));

        // Draw planets
        for (const [name, data] of Object.entries(this.planets)) {
            this.drawPlanet(name, data);
        }

        // Highlight selected planet
        if (this.selectedPlanet) {
            const data = this.selectedPlanet.data;
            const sector = this.sectors[data.sector];
            const x = (sector.x + data.relativeX) * this.width;
            const y = (sector.y + data.relativeY) * this.height;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.lineWidth = 1;
        }

        this.ctx.restore();
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const map = new GalaxyMap('galaxy-map');
});
