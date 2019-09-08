const assert = require('chai').assert;
const puppeteer = require('puppeteer');

const url_Youtube = 'https://www.youtube.com/'
//Change any of the urls that belong to the Youtube domain to see whether it is possible to return to Trending
const url_1 = 'https://www.youtube.com/'
const url_2 = 'https://www.youtube.com/results?search_query=Hamish+and+Andy'
const url_3 = 'https://www.youtube.com/user/hamishandyofficial'
const url_Array = [url_1,url_2,url_3];

const url_trend = 'https://www.youtube.com/feed/trending'
//Change any of the "search_text_x" options to see different search queries
const search_text_1 = "Hamish and Andy Podcast"
const search_text_2 = "BBC News Live"
const search_text_3 = "Cooking with Gordon Ramsay"
const serach_text_array = [search_text_1, search_text_2, search_text_3]
//Change to "false" if you wish to see the browser, "true" for headless mode
var headless_toggle = true;


describe('App', function(){
//Disables mochas timeout period
  this.enableTimeouts(false);
      it('Tests if the user is correctly redirected to the Trending page when said button is clicked.', async() => {
//Create a Chrome window
            const chrome = await puppeteer.launch({ headless: headless_toggle});
//Create a new tab and go to a random url
            const tab = await chrome.newPage();
            await tab.goto(url_Array[Math.floor(Math.random() * url_Array.length)]);
//Wait several seconds for the page to load
            await tab.waitFor(2000);
//locate and click the "Trending button"
            await tab.waitForSelector('#items > .style-scope:nth-child(2) > #endpoint');
            await tab.click('#items > .style-scope:nth-child(2) > #endpoint');
//Again wait several seconds for the page to load
            await tab.waitFor(2000);
//obtain url
            let url = tab.url();
//close the browser
            await chrome.close();
            assert.equal(url_trend, url);
          });

      it('Tests if Youtube correctly reflects the view count of a video from the main page.', async() => {
//Create a Chrome window
            const chrome = await puppeteer.launch({ headless: headless_toggle});
//Create a new tab and go to youtube.com
            const tab = await chrome.newPage();
            await tab.goto(url_Youtube);
//Wait several seconds for the page to load
            await tab.waitFor(2000);
//extract details
            //var video_title = await tab.$eval('#video-title', i => i.title);
            var extract_info = await tab.$eval('#video-title', i => i.getAttribute("aria-label"));
            var elements = extract_info.split(" ");
            var views = elements[elements.length - 2];
            var view_count_a = views.replace(",", "");
//combine both results for comparison
            //var res = video_title.concat(view_count_a);
//load into the video and wait delay
            await tab.click('#video-title')
            await tab.waitFor(2000);
//extrat the same information from the video player page
            //var comp_video_title = await tab.$eval('#container > h1 > yt-formatted-string', i => i.innerHTML);
            var views_string = await tab.$eval('#count > yt-view-count-renderer > span.view-count.style-scope.yt-view-count-renderer', i => i.innerHTML);
            var comp_views = (views_string.split(" "))[0];
            var view_count_b = comp_views.replace(",","");
            //var res2 = comp_video_title.concat(view_count_b);
//close the browser
            await chrome.close();
            assert.equal(parseInt(view_count_b), parseInt(view_count_a));
          });

      it('Testing if a search on Youtube results in the correct search url.', async() => {
//Select a search query at random
            var selected_text = serach_text_array[Math.floor(Math.random() * serach_text_array.length)]
//Create a Chrome window
            const chrome = await puppeteer.launch({ headless: headless_toggle});
//Create a new tab and go to youtube.com
            const tab = await chrome.newPage();
            await tab.goto(url_Youtube);
//Wait several seconds for the page to load
            await tab.waitFor(2000);
//Fill search box with selected search query
            await tab.waitForSelector('#search > #search-form > #container #search');
            await tab.type('#search > #search-form > #container #search', selected_text);
//click the search button
            await tab.click('#search-icon-legacy');
//gather results and close the browser
            let url = tab.url();
            await chrome.close();
            selected_to_search = selected_text.replace(/\s/g,"+");
            assert.equal("https://www.youtube.com/results?search_query=".concat(selected_to_search), url);
          });
});
