# Shazam to Youtube (with Spreadsheet)

This Google Apps Script project allows you to automatically convert your Shazam music history into YouTube playlists. The script searches for YouTube videos based on your Shazam data and creates playlists you can watch or add to your YouTube library.

## Features

- **Automatic YouTube URL Generation**: Finds YouTube videos for songs based on artist and song names
- **Playlist Creation**: Generates YouTube playlist URLs for easy viewing
- **YouTube Library Integration**: Add playlists directly to your YouTube account
- **Randomizer**: Randomly select 50 songs from your collection for variety
- **Batch Processing**: Works across multiple sheets in your spreadsheet

## Prerequisites

1. **Google Account** with access to Google Sheets and Google Apps Script
2. **Shazam Account** with music history
3. **YouTube Data API v3** enabled (for playlist creation functionality)

## Setup Instructions

### Step 1: Export Your Shazam Data

1. Open the Shazam website
2. Go to your **Library** or **My Music**
3. Export your Shazam history as a CSV file:
4. Save the CSV file to your device or cloud storage

### Step 2: Set Up Google Spreadsheet

1. Create a new Google Spreadsheet
2. Open your downloaded Shazam CSV file
3. Copy all rows and columns from the CSV
4. Paste the data into your Google Spreadsheet starting from row 200
(The rows are like this: Index	TagTime	Name Artist	URL	TrackKey)

### Step 3: Install the Apps Script

1. In your Google Spreadsheet, go to **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy and paste the provided script code
4. Save the project with a name like "Shazam YouTube Playlist"
5. Return to your spreadsheet and refresh the page

   
## Usage

After setup, you'll see a new **Custom Menu** in your spreadsheet with the following options:

### 1. Run YouTube URL Script
- Searches YouTube for videos matching your songs
- Populates Column G with YouTube URLs
- Starts from row 3 and processes all songs
- Uses "artist + song + official video" as search query

### 2. Create A YouTube Watchlist
- Generates a single YouTube playlist URL from all videos in Column G
- Places the playlist URL in cell C1
- Creates a playlist you can watch in your browser

### 3. Add The Playlist To Your YouTube Library
- Creates an actual playlist in your YouTube account
- Adds all videos from Column G to the playlist
- Requires YouTube Data API to be enabled
- Creates a public playlist by default

### 4. Randomize
- Randomly selects 50 songs from rows 200-537
- Copies selected songs to rows 3-53
- Useful for creating variety playlists from large collections
- Clears previous data in the destination range

## Data Structure Requirements

Your spreadsheet should have:
- **Song names** in Column C
- **Artist names** in Column D
- YouTube URLs will be populated in **Column G**
- Songs should start from **row 3** (rows 1-2 can be headers)

## Troubleshooting

### Common Issues:

1. **No YouTube URLs appearing**:
   - Check that Column C has song names and Column D has artist names
   - Verify the data starts from row 3
   - Some songs might not be found on YouTube

2. **Playlist creation not working**:
   - Ensure YouTube Data API v3 is enabled in Services
   - Check that Column G contains valid YouTube URLs
   - Verify your Google account has YouTube access

3. **Script permissions**:
   - You may need to authorize the script to access Google Sheets and YouTube
   - Follow the permission prompts when first running the script
