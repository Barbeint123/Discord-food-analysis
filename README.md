### Background
During Covid, a group of friends and I started a Discord channel where we'd post pictures of our dinners and rate them on a 10-point scale. The tradition stuck around long after Covid ended.

As of 22.01.2026, 319 food posts have been made in the channel. This repository contains: 1) a Discord bot that collects those posts into a .json file, and 2) pandas-based analysis to extract statistics — best rated dish, harshest critic, and so on.

### Files
The repository consists of the following files:

- **`index.js`**  
  Connects to the Discord channel using the Discord Developer Portal API, extracts all relevant food posts, and writes them to `food.json`.

- **`food.json`**  
  A structured dataset containing all collected food posts and ratings.

- **`data_analysis.ipynb`**  
  A Jupyter Notebook performing exploratory data analysis and computing various statistics from the dataset.

- **`example.json`**  
  An example dataset which was created to gain an idea of what kind of data I would need to extract from the discord channel using the discord API
