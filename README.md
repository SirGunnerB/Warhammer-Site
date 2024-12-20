# Warhammer 40,000 Interactive Wiki

An interactive web resource for exploring the Warhammer 40,000 universe.

## Features

- Comprehensive faction information
- Interactive 3D model viewer
- Dynamic content generation
- Responsive design
- Advanced search functionality

## Directory Structure

```
warhammer-website/
├── css/              # Stylesheets
├── images/           # Image assets
│   └── factions/     # Faction-specific images
├── js/              # JavaScript files
├── pages/           # Generated HTML pages
├── templates/       # HTML templates
├── scrapers/        # Python scraping scripts
├── scripts/         # Utility scripts
└── static/          # Static assets
```

## Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Set up Python environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
npm start
```

## Development

- Run in development mode: `npm run dev`
- Generate faction pages: `python scripts/generate_faction_pages.py`
- Scrape new images: `python scrapers/image_scraper.py`

## Technologies Used

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js, Express
- Templating: Jinja2
- Image Processing: Pillow
- Web Scraping: BeautifulSoup4
- 3D Rendering: Three.js

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
