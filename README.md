# PE Valuator Pro

![PE Valuator Pro](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&h=600)

PE Valuator Pro is a web application designed to monitor and analyze secondary market valuations. It provides comprehensive tools for generating detailed pricing reports, tracking market data points, and managing private equity portfolio valuations on the secondary market.

## Features

- **Dynamic Pricing Reports**: Generate detailed valuation reports with customizable qualitative factors
- **Market Data Management**: Track and analyze secondary market pricing data points
- **Provider Integration**: Manage multiple data providers and their historical pricing information
- **Portfolio Monitoring**: Monitor your private equity portfolio's secondary market values
- **Advanced Analytics**: Utilize sophisticated pricing algorithms with configurable parameters
- **PDF Export**: Export professional reports with customizable details and formatting

## Technology Stack

- React 18.3
- TypeScript
- Tailwind CSS
- Lucide Icons
- PDF Generation (jsPDF)
- Vite Build System
- PostgreSQL
- Prisma ORM

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

## Database Setup

1. Install PostgreSQL on your system if you haven't already:
   ```bash
   # For Ubuntu/Debian
   sudo apt install postgresql

   # For macOS using Homebrew
   brew install postgresql
   ```

2. Start the PostgreSQL service:
   ```bash
   # For Ubuntu/Debian
   sudo service postgresql start

   # For macOS
   brew services start postgresql
   ```

3. Create a new database:
   ```bash
   createdb pricing_tool
   ```

## Environment Setup

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Configure your `.env` file with your PostgreSQL credentials:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/pricing_tool
   ```

   Replace `your_password` with your PostgreSQL password and adjust the port number if needed.

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/edouard17712/pe-valuator-pro.git
```

2. Install dependencies:
```bash
cd pe-valuator-pro
npm install
```

3. Initialize the database:
```bash
npx prisma generate
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Database Schema

The application uses Prisma ORM with the following main models:
- `Provider`: Data providers and their information
- `DataPoint`: Market pricing data points
- `Report`: Valuation reports with pricing details
- `QualitativeFactor`: Factors affecting valuations
- `Settings`: Asset class-specific pricing parameters

## Usage

1. **Dashboard**: Access key metrics and recent reports from the main dashboard
2. **Data Providers**: Manage your pricing data sources
3. **Data Points**: Input and track market pricing data
4. **Reports**: Generate and manage valuation reports
5. **Settings**: Configure pricing parameters and qualitative factors
