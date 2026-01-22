### Background
At the onset of Covid, days grew dark and gloomy. Daily tasks were plagued by fatigue, and even mustering the strength to cook a decent dinner seemed pointless.
To combat this malaise, my friends and I created a Discord channel in which we would post pictures of our dinners and subsequently rate them on a 10-point scale.
This tradition has continued and prospered even after Covid.

As of 22.01.2026, 319 such food posts have been made in the Discord channel. 
This substantial dataset lends itself well to data analysis, which is what this repository consists of: 1) the collection of these Discord posts into a .json format, and 
2) pandas-based analysis to extract interesting statistics, e.g, "which dish is best rated", "who is the harshest food critic", and so on.

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
