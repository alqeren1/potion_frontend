# Potion Leaderboard

A responsive, interactive single-page application built with React and Next.js that displays a dynamic leaderboard for Solana memecoin traders. The app consumes a mock API to display trader data and includes functionality for filtering, sorting, and searching. Wallet connection is required to unlock the full experience.

## Submission Details
**Developer:** Joey X  
**X (Twitter):** [@joeyx_eth](https://twitter.com/joeyx_eth)  
**Email:** [alqeren1@gmail.com](mailto:alqeren1@gmail.com) 

## Live Demo

A live demo is available [here](https://potion-frontend-sigma.vercel.app/). 

## Overview

**Project Purpose:**  
This project was developed as a submission for the Potion Leaderboard frontend challenge. It replicates the Figma designs with added responsiveness and improved UX. Key features include:
- **Data Integration:** Fetches trader data from a mock API (using seedrandom for consistent demo data).
- **Filtering & Sorting:** Users can filter by various trading metrics (PNL, win rate, avg buy, etc.) and sort columns in both ascending and descending orders.
- **Search:** Dynamic search bar to filter by wallet address or Twitter handle.
- **Wallet Connection:** Users must connect their wallet to access full functionalities such as viewing trader profiles and using search/filters.
- **Responsive Design:** Optimized for both desktop and mobile views.

## Features

- **Wallet Connection:**  
  Only connected users can interact with search, filter, and view detailed profiles.

- **Search Functionality:**  
  Allows users to search by contract name or Twitter handle.

- **Dynamic Filtering:**  
  Multiple filtering options are available through a slide-out drawer or modal. Filter criteria are persisted using localStorage.

- **Sortable Columns:**  
  All columns are clickable to sort data based on the selected timeframe (daily, weekly, monthly, or all-time).

- **Pagination:**  
  Provides pagination controls to navigate through trader listings.

- **Trader Page:**  
  When you click on a trader from the leaderboard, that trader's profile comes up, with the required information.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/alqeren1/potion_frontend.git
   cd potion_frontend
   ```

2. **Install dependencies:**

    ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

   if you get errors installing, try: 
   ```bash
   npm install --force
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

   if you want to try the page from your phone in local wifi network:
  
   ```bash
   npm run dev:wifi
   ```

   Then, open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Testing & Usage

- **Mock API:**  
  The API endpoint at `/api/main` serves randomized trader data for demonstration purposes.
  The random info is generated with a seed so the initial data doesn't change if the seed is the same. 
  If you want to change the data, you can simply change the seed to a random word.

- **Wallet Integration:**  
  The app checks if the user’s wallet is connected. If not, it prompts for connection. Use Phantom wallet (or any supported wallet) to fully test the application.

- **Search & Filters:**  
  Enter a wallet address or Twitter handle in the search bar, or search for a token name or address on the profile page. Use the filters panel to refine results based on metrics like realized PNL, win rate, and more.

- **Sorting & Pagination:**  
  Click on any column header to toggle sorting order. Use pagination buttons to navigate through pages.

## Design Decisions & Assumptions

- **Framework & Libraries:**  
  Chose React with Next.js for SSR capabilities and improved SEO. Tailwind CSS was used for rapid and responsive styling.

- **Data Generation:**  
  Used the `seedrandom` library to generate consistent random data for demo purposes.

- **Wallet Requirement:**  
  Full interaction (profile views, filter usage, sorting) is restricted to connected users only, as asked.

- **Responsive Design:**  
  Special attention was given to ensure the UI adapts to various screen sizes, ensuring usability on both desktop and mobile devices.

## Deployment

For staging or production, the following steps are recommended:

1. **Build the project:**

   ```bash
   npm run build
   ```
   or
   ```
   yarn build
   ```

3. **Start the production server:**

   ```bash
   npm start
   ```
   or
   
   ```bash
   yarn start
   ```

3. **Deployment Platforms:**  
   You can deploy the application to Vercel, Netlify, or any platform that supports Next.js. The project is configured to work out of the box on Vercel with minimal configuration.


### API Response Format

A mock api has been used, random values are generated with this data format, using a seed to generate randomness in order to get consistent random data. 

**Endpoint:** `GET /api/main`

**Response Structure:**
```json
{
  "traders": [
    {
      "profilePhoto": "string (image path)",
      "followers": "number",
      "twitterHandle": "string",
      "traderName": "string",
      "traderWallet": "string (Solana address)",
      "tradeTime": "number (minutes ago)",
      "timeframes": {
        "daily": {
          "tokens": "number",
          "winRate": "number (%)",
          "winningTrades": "number",
          "losingTrades": "number",
          "avgBuySol": "number (SOL)",
          "avgEntry": "number (market cap)",
          "avgHoldMinutes": "number",
          "realizedPnlSol": "number (SOL)",
          "totalInvested": "number (SOL)"
        },
        "weekly": { /* same structure as daily */ },
        "monthly": { /* same structure as daily */ },
        "allTime": { /* same structure as daily */ }
      },
      "tokens": {
        "daily": [
          {
            "tokenPicture": "string (image path)",
            "tokenName": "string",
            "tokenAddress": "string (Solana address)",
            "tradeTime": "number (minutes ago)",
            "marketCap": "number",
            "invested": "number (SOL)",
            "realizedPnlSol": "number (SOL)",
            "buyTransactions": "number",
            "sellTransactions": "number",
            "holding": "number (SOL)",
            "avgBuy": "number (price)",
            "avgSell": "number (price)",
            "held": "number (minutes)"
          }
        ],
        "weekly": [ /* same token structure */ ],
        "monthly": [ /* same token structure */ ],
        "allTime": [ /* same token structure */ ]
      }
    }
    // ... (other traders)
  ]
}

```


 






