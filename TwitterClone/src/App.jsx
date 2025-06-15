import { createSignal, onMount } from 'solid-js'
import { fetchTweets, createTweet, fetchUrlContent } from './services/api'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'

function App() {
  const [tweets, setTweets] = createSignal([]);
  const [newTweet, setNewTweet] = createSignal('');
  const [urlInput, setUrlInput] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  onMount(async () => {
    try {
      const fetchedTweets = await fetchTweets();
      setTweets(fetchedTweets);
    } catch (err) {
      setError('Failed to load tweets');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTweet().trim()) return;

    try {
      setLoading(true);
      const tweet = await createTweet({
        content: newTweet(),
        author: 'You',
        username: '@you',
        timestamp: new Date().toLocaleTimeString(),
        likes: 0,
        retweets: 0,
        replies: 0,
      });
      setTweets([tweet, ...tweets()]);
      setNewTweet('');
      setError('');
    } catch (err) {
      setError('Failed to create tweet');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput().trim()) return;

    try {
      setLoading(true);
      const tweet = await fetchUrlContent(urlInput());
      setTweets([tweet, ...tweets()]);
      setUrlInput('');
      setError('');
    } catch (err) {
      setError('Failed to fetch URL content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <aside class="w-64 p-4 fixed h-screen">
        <div class="mb-4">
          <svg viewBox="0 0 24 24" class="w-8 h-8 text-white" fill="currentColor" aria-label="Twitter logo">
            <title>Twitter Logo</title>
            <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></g>
          </svg>
        </div>
        <nav class="space-y-2">
          <a href="/home" class="nav-link active">
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor" aria-label="Home icon">
              <title>Home</title>
              <g><path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z" /></g>
            </svg>
            Home
          </a>
          <a href="/explore" class="nav-link">
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor" aria-label="Explore icon">
              <title>Explore</title>
              <g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" /></g>
            </svg>
            Explore
          </a>
          <a href="/notifications" class="nav-link">
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor" aria-label="Notifications icon">
              <title>Notifications</title>
              <g><path d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2c-4.058 0-7.49 3.021-7.999 7.051L2.866 20H17.14l-1.147-10.958zM12 3.75c2.379 0 4.356 1.72 4.79 3.998H7.21c.434-2.278 2.411-3.998 4.79-3.998zM4.388 18.5l1.147-10.5h13.93l1.147 10.5H4.388z" /></g>
            </svg>
            Notifications
          </a>
          <a href="/messages" class="nav-link">
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor" aria-label="Messages icon">
              <title>Messages</title>
              <g><path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z" /></g>
            </svg>
            Messages
          </a>
          <a href="/bookmarks" class="nav-link">
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor" aria-label="Bookmarks icon">
              <title>Bookmarks</title>
              <g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" /></g>
            </svg>
            Bookmarks
          </a>
          <a href="/profile" class="nav-link">
            <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor" aria-label="Profile icon">
              <title>Profile</title>
              <g><path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z" /></g>
            </svg>
            Profile
          </a>
        </nav>
        <button type="button" class="btn-primary w-full mt-4">Tweet</button>
      </aside>

      {/* Main Content */}
      <main class="ml-64 flex-1 border-x border-gray-800">
        <div class="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-gray-800 p-4">
          <h1 class="text-xl font-bold">Home</h1>
        </div>

        {/* URL Input Form */}
        <div class="p-4 border-b border-gray-800">
          <form onSubmit={handleUrlSubmit} class="flex gap-4">
            <input
              type="url"
              class="flex-1 bg-gray-900 rounded-lg px-4 py-2"
              placeholder="Enter URL to fetch content"
              value={urlInput()}
              onInput={(e) => setUrlInput(e.target.value)}
            />
            <button type="submit" class="btn-secondary" disabled={loading()}>
              {loading() ? 'Loading...' : 'Fetch URL'}
            </button>
          </form>
        </div>

        {/* Tweet Composer */}
        <div class="p-4 border-b border-gray-800">
          <form onSubmit={handleSubmit} class="flex gap-4">
            <div class="w-12 h-12 rounded-full bg-gray-600 flex-shrink-0" />
            <div class="flex-1">
              <textarea
                class="tweet-input"
                placeholder="What's happening?"
                value={newTweet()}
                onInput={(e) => setNewTweet(e.target.value)}
                rows="3"
              />
              <div class="flex justify-between items-center mt-4">
                <div class="flex gap-2">
                  <button type="button" class="text-[#1d9bf0] hover:bg-[#1d9bf0]/10 p-2 rounded-full">
                    <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-label="Add media">
                      <title>Add Media</title>
                      <g><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z" /></g>
                    </svg>
                  </button>
                </div>
                <button type="submit" class="btn-secondary" disabled={loading()}>
                  {loading() ? 'Posting...' : 'Tweet'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error() && (
          <div class="p-4 bg-red-900/50 text-red-200">
            {error()}
          </div>
        )}

        {/* Tweet Feed */}
        <div>
          {tweets().map((tweet) => (
            <div key={tweet.id} class="tweet-card">
              <div class="flex gap-4">
                <div class="w-12 h-12 rounded-full bg-gray-600 flex-shrink-0" />
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span class="font-bold">{tweet.author}</span>
                    <span class="text-gray-500">{tweet.username}</span>
                    <span class="text-gray-500">·</span>
                    <span class="text-gray-500">{tweet.timestamp}</span>
                  </div>
                  <p class="mt-2 whitespace-pre-wrap">{tweet.content}</p>
                  <div class="flex justify-between mt-4 max-w-md">
                    <button type="button" class="tweet-actions">
                      <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-label="Reply">
                        <title>Reply</title>
                        <g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" /></g>
                      </svg>
                      <span>{tweet.replies}</span>
                    </button>
                    <button type="button" class="tweet-actions">
                      <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-label="Retweet">
                        <title>Retweet</title>
                        <g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" /></g>
                      </svg>
                      <span>{tweet.retweets}</span>
                    </button>
                    <button type="button" class="tweet-actions">
                      <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-label="Like">
                        <title>Like</title>
                        <g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" /></g>
                      </svg>
                      <span>{tweet.likes}</span>
                    </button>
                    <button type="button" class="tweet-actions">
                      <svg viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor" aria-label="Share">
                        <title>Share</title>
                        <g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" /></g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside class="w-80 p-4 hidden lg:block">
        <div class="bg-gray-900 rounded-2xl p-4">
          <h2 class="text-xl font-bold mb-4">What's happening</h2>
          <div class="space-y-4">
            <div class="hover:bg-gray-800 p-3 rounded-xl transition-colors">
              <p class="text-sm text-gray-500">Trending in Technology</p>
              <p class="font-bold">#SolidJS</p>
              <p class="text-sm text-gray-500">50.4K posts</p>
            </div>
            <div class="hover:bg-gray-800 p-3 rounded-xl transition-colors">
              <p class="text-sm text-gray-500">Trending in Programming</p>
              <p class="font-bold">#WebDev</p>
              <p class="text-sm text-gray-500">25.2K posts</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default App
