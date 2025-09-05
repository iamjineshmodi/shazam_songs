/**
 * Obtains YouTube video URLs for videos based on artist name (Column D) and song name (Column C).
 * Populates corresponding YouTube URLs in Column G, starting from cell 3.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
      .addItem('Run YouTube URL Script', 'displayYouTubeURLs')
      .addItem('Create A YouTube Watchlist', 'generatePlaylistURLAndInsert')
      .addItem('Add The Playlist To Your YouTube Library', 'createYouTubePlaylist')
      .addItem('Randomize', 'randomize')
      .addToUi();
}


function displayYouTubeURLs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  
  // Loop through all sheets in the spreadsheet.
  sheets.forEach(function(sheet) {
    var data = sheet.getDataRange().getValues();
    
    // Assuming Column D contains artist names and Column C contains song names.
    var artistColumnIndex = 3; // Column D
    var songColumnIndex = 2;   // Column C
    
    // Assuming you want to display YouTube URLs in Column G, starting from cell 3.
    var youtubeURLColumnIndex = 7; // Column G
    var startRow = 3; // Start writing URLs from cell 3
    
    for (var i = startRow - 1; i < data.length; i++) {
      var artist = data[i][artistColumnIndex];
      var song = data[i][songColumnIndex];
      
      // Construct the search query to find the video on YouTube.
      var query = artist + ' ' + song + ' official video';
      
      // Use the YouTube Data API to search for videos.
      var searchResults = YouTube.Search.list('id', {
        q: query,
        type: 'video'
      });
      
      if (searchResults.items && searchResults.items.length > 0) {
        // Get the first video ID (assuming it's the official video).
        var videoId = searchResults.items[0].id.videoId;
        
        // Construct the YouTube URL.
        var youtubeURL = 'https://www.youtube.com/watch?v=' + videoId;
        
        // Set the URL in Column G.
        sheet.getRange(i + 1, youtubeURLColumnIndex).setValue(youtubeURL);
      }
    }
  });
}
function createYouTubePlaylist() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getRange('G3:G').getValues(); // Adjust this range according to your data
  var urls = data.flat().filter(String); // This will get all non-empty cells in column G
  
  var playlist = YouTube.Playlists.insert({
    snippet: {
      title: 'My Playlist',
      description: 'A private playlist created with the YouTube API'
    },
    status: {
      privacyStatus: 'public'
    }
  }, 'snippet,status');
  
  urls.forEach(function(url) {
    var videoId = url.split('v=')[1];
    var ampersandPosition = videoId.indexOf('&');
    if(ampersandPosition != -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
    
    YouTube.PlaylistItems.insert({
      snippet: {
        playlistId: playlist.id,
        resourceId: {
          kind: 'youtube#video',
          videoId: videoId
        }
      }
    }, 'snippet');
  });
}
/**
 * Custom function to generate a YouTube playlist URL with video IDs from URLs in Column G
 * and insert it into cell (C,1).
 */
function generatePlaylistURLAndInsert() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();

  // Assuming the YouTube URLs are in Column G, starting from cell G3.
  var youtubeURLColumnIndex = 7; // Column G
  var startRow = 3; // Start reading URLs from cell G3

  var videoIds = [];

  // Extract YouTube video IDs from the sheet.
  for (var i = startRow - 1; i < data.length; i++) {
    var url = data[i][youtubeURLColumnIndex - 1]; // Subtract 1 to convert to 0-based index
    if (url && url.startsWith('https://www.youtube.com/watch?v=')) {
      var videoId = url.substring(url.indexOf('=') + 1);
      videoIds.push(videoId);
    }
  }

  // Generate the playlist URL with video IDs.
  var playlistURL = 'https://www.youtube.com/watch_videos?video_ids=' + videoIds.join(',');

  // Insert the playlist URL into cell (B,2).
  sheet.getRange(1, 3).setValue(playlistURL);

  // Display a message indicating that the URL has been inserted.
  Browser.msgBox('Playlist URL inserted in cell (c,1): ' + playlistURL);
}


function randomize() {
  // line 200 to 537, there are some songs, from col A to G all informatoin relataed to a song, i want you to randomly select 50 songs and add it to line 3 to 53, copying all info from A to G

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Source data range (rows 200 to 537, columns A to G)
  var sourceStartRow = 200;
  var sourceEndRow = 537;
  var sourceData = sheet.getRange(sourceStartRow, 1, sourceEndRow - sourceStartRow + 1, 7).getValues();
  
  // Filter out empty rows (where column A is empty)
  var filteredData = sourceData.filter(function(row) {
    return row[0] !== '';
  });
  
  // Check if we have enough songs
  if (filteredData.length < 50) {
    Browser.msgBox('Not enough songs available. Found ' + filteredData.length + ' songs.');
    return;
  }
  
  // Randomly select 50 songs
  var selectedSongs = [];
  var availableIndices = [];
  
  // Create array of available indices
  for (var i = 0; i < filteredData.length; i++) {
    availableIndices.push(i);
  }
  
  // Randomly select 50 unique indices
  for (var j = 0; j < 50; j++) {
    var randomIndex = Math.floor(Math.random() * availableIndices.length);
    var selectedIndex = availableIndices[randomIndex];
    selectedSongs.push(filteredData[selectedIndex]);
    availableIndices.splice(randomIndex, 1); // Remove selected index to avoid duplicates
  }
  
  // Clear the destination range first (rows 3 to 53, columns A to G)
  sheet.getRange(3, 1, 51, 7).clearContent();
  
  // Copy selected songs to rows 3-53
  for (var k = 0; k < selectedSongs.length; k++) {
    sheet.getRange(k + 3, 1, 1, 7).setValues([selectedSongs[k]]);
  }
  
  Browser.msgBox('Successfully randomized 50 songs from rows 200-537 to rows 3-53!');

}
