# Sleep Calculator

A beautiful, minimalist sleep cycle calculator inspired by the original [sleepyti.me](https://sleepyti.me). Calculate optimal bedtime and wake times based on 90-minute sleep cycles.

## Features

- **Two Calculator Modes**:
  - Calculate ideal bedtimes when you need to wake up at a specific time
  - Calculate ideal wake times when going to bed right now

- **Sleep Science**: Uses 90-minute sleep cycle intervals to help you wake up feeling refreshed

- **Dark Braun-Inspired Design**: Minimalist, functional aesthetic with warm amber accents perfect for evening use

- **Responsive**: Works beautifully on mobile and desktop

## Tech Stack

- **Templating**: Jinja2
- **Styling**: Tailwind CSS with custom Braun-inspired theme
- **Build**: Python with uv package manager
- **Deploy**: Netlify

## Development

### Prerequisites

- Python 3.8+
- Node.js 18+
- [uv](https://github.com/astral-sh/uv) package manager

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   uv sync
   npm install
   ```

3. Build the site:
   ```bash
   uv run python main.py
   npm run build
   ```

4. View the site:
   ```bash
   # Serve the build directory with any static server
   cd build && python -m http.server 8000
   ```

### Development Workflow

Watch mode for CSS changes:
```bash
npm run dev
```

Build for production:
```bash
uv run python main.py && npm run build
```

## Deployment

The site is configured for Netlify deployment. Simply connect your repository to Netlify and it will automatically build and deploy using the `netlify.toml` configuration.

## How It Works

### Sleep Cycles

Sleep occurs in cycles of approximately 90 minutes, progressing through stages from light sleep to deep sleep and REM sleep. Waking up between cycles (rather than during a cycle) helps you feel more refreshed and alert.

### The Calculation

- Each sleep cycle = 90 minutes
- Average time to fall asleep = 14 minutes
- Recommended sleep = 4-6 cycles (6-9 hours)

The calculator works backwards from your wake time or forwards from the current time to suggest optimal times that align with complete sleep cycles.

## License

MIT

## Credits

Inspired by the original [sleepyti.me](https://sleepyti.me) by David Strauß
