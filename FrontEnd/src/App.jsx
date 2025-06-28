import { createSignal, createEffect, onMount } from "solid-js";
import { sendMessage, postToTwitter, fetchHistory } from "./services/api";
import "./App.css";

function App() {
	const [messages, setMessages] = createSignal([]);
	const [input, setInput] = createSignal("");
	const [isLoading, setIsLoading] = createSignal(false);
	const [isPosting, setIsPosting] = createSignal(false);
	const [error, setError] = createSignal(null);
	const [current, setCurrent] = createSignal(null);
	const [history, setHistory] = createSignal([]);
	const [page, setPage] = createSignal("home");
	const [theme, setTheme] = createSignal("light");
	const ITEMS_PER_PAGE = 5;
	const [historyPage, setHistoryPage] = createSignal(1);
	let messagesEndRef;

	onMount(async () => {
		try {
			const data = await fetchHistory();
			setHistory(data);
		} catch (e) {
		}
	});

	createEffect(() => {
		messages();
		if (messagesEndRef) messagesEndRef.scrollIntoView({ behavior: "smooth" });
	});

	createEffect(() => {
		document.body.classList.remove('light-theme', 'dark-theme');
		document.body.classList.add(theme() === 'dark' ? 'dark-theme' : 'light-theme');
	});

	const formatTimestamp = (date) => {
		return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input().trim() || isLoading()) return;
		setIsLoading(true);
		setError(null);
		try {
			const res = await sendMessage(input());
			const qa = {
				query: input(),
				answer: res.response,
				id: res.id,
				posted: false,
				edited: res.response,
				timestamp: Date.now(),
			};
			setCurrent(qa);
			setMessages((prev) => [...prev, qa]);
			setInput("");
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (e) => {
		setCurrent((cur) => ({ ...cur, edited: e.target.value }));
	};

	const handlePost = async () => {
		if (!current() || current().posted) return;
		try {
			setIsPosting(true);
			const res = await postToTwitter(current().id, current().edited);
			if (res.status === "success") {
				setCurrent((cur) => ({ ...cur, posted: true }));
				setMessages((prev) => prev.map(q => q.id === current().id ? { ...q, posted: true, edited: current().edited } : q));
				alert('Posted to Twitter!');
			} else {
				alert(`Failed to post: ${res.detail || "Unknown error"}`);
			}
		} catch (error) {
			alert(`Failed to post: ${error.message}`);
		} finally {
			setIsPosting(false);
		}
	};

	const toggleTheme = () => {
		setTheme(theme() === 'light' ? 'dark' : 'light');
	};

	const paginatedHistory = () => {
		const start = (historyPage() - 1) * ITEMS_PER_PAGE;
		return history().slice(start, start + ITEMS_PER_PAGE);
	};

	const totalPages = () => Math.ceil(history().length / ITEMS_PER_PAGE);

	return (
		<div class={`app-root ${theme() === 'dark' ? 'dark-theme' : 'light-theme'}`}>
			<aside class="sidebar">
				<div class="logo-section" onClick={() => setPage('home')} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setPage('home'); }} style={{ cursor: 'pointer' }}>
					<svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none">
						<title>Web Icon</title>
						<circle cx="12" cy="12" r="10" stroke="#0A66C2" stroke-width="2" fill="#EAF1FB"/>
						<path d="M2 12h20" stroke="#0A66C2" stroke-width="1.5"/>
						<path d="M12 2a10 10 0 0 1 0 20a10 10 0 0 1 0-20z" stroke="#0A66C2" stroke-width="1.5" fill="none"/>
						<ellipse cx="12" cy="12" rx="5" ry="10" stroke="#0A66C2" stroke-width="1.5" fill="none"/>
						<ellipse cx="12" cy="12" rx="10" ry="5" stroke="#0A66C2" stroke-width="1.5" fill="none"/>
					</svg>
					<span class="app-title" style={{ fontFamily: 'Arial, sans-serif' }}>BackSlash.AI</span>
				</div>
				<nav class="nav-links">
					<button type="button" class={`nav-link${page() === 'home' ? ' active' : ''}`} onClick={() => setPage('home')}>Home</button>
					<button type="button" class={`nav-link${page() === 'history' ? ' active' : ''}`} onClick={() => setPage('history')}>History</button>
				</nav>
				<div class="sidebar-bottom">
					<button
						type="button"
						class="light-dark-toggle-switch"
						onClick={toggleTheme}
						aria-label={theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
					>
						<span class={`toggle-track${theme() === 'dark' ? ' dark' : ''}`}> 
							<span class="toggle-icon toggle-moon">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<title>Moon Icon</title>
									<path d="M21 12.79A9 9 0 0 1 12.79 3a7 7 0 1 0 8.21 9.79z" fill="#b4cdff"/>
								</svg>
							</span>
							<span class={`toggle-thumb${theme() === 'dark' ? ' dark' : ''}`} />
							<span class="toggle-icon toggle-sun">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<title>Sun Icon</title>
									<circle cx="12" cy="12" r="5" fill="#FFC700"/>
									{[...Array(8)].map((_,i) => (
										<rect key={`sunray-${i*45}`} x="11" y="2" width="2" height="3" rx="1" fill="#FFC700" transform={`rotate(${i*45} 12 12)`}/>
									))}
								</svg>
							</span>
						</span>
					</button>
					<div class="user-info" style={{ fontFamily: 'Arial, sans-serif' }}>
						<span class="user-full-name">Sagar Deep Saha</span>
						<span class="user-short-name"> </span>
					</div>
				</div>
			</aside>
			<main class="main-content">
				{page() === 'home' && (
					<>
						<div class="welcome-section">
							<h1>Welcome to BackSlash.AI</h1>
							<p>Generate, edit, and manage AI-powered Twitter posts with ease.</p>
						</div>
						{!current() && (
							<div class="feature-cards">
								<div class="feature-card">AI-Powered Twitter Post Generation</div>
								<div class="feature-card">Edit & Refine Before Posting</div>
								<div class="feature-card">Track Post History & Status</div>
							</div>
						)}
						{current() && (
							<div style={{ margin: '12px 0 0 0' }}>
								<textarea
									id="editable-answer"
									value={current().edited}
									onInput={handleEdit}
									rows={8}
									style={{ width: "100%", minWidth: 800, maxWidth: '100vw', display: 'block', margin: '0 auto' }}
									disabled={current().posted}
								/>
								<br />
								<button type="button" onClick={handlePost} disabled={isPosting() || current().posted} class="send-button" style={{ display: 'block', margin: '2px auto 4px auto' }}>
									{isPosting() ? "Posting..." : current().posted ? "Posted!" : "Post to Twitter"}
								</button>
							</div>
						)}
						{error() && <div class="error-message">{error()}</div>}
						<div class="chat-input-area">
							<input
								type="text"
								value={input()}
								onInput={(e) => setInput(e.currentTarget.value)}
								placeholder="Ask me anything..."
								class="chat-input"
								disabled={isLoading()}
							/>
							<button
								type="submit"
								class="send-button"
								disabled={isLoading() || !input().trim()}
								onClick={handleSubmit}
							>
								<span class={`arrows-svg${isLoading() ? ' spinning' : ''}`}>
									<svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
										<title>Animated Arrows</title>
										<g>
											<path d="M4 11h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											<path d="M8 7l4 4-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											<path d="M28 11h-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
											<path d="M24 7l-4 4 4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</g>
									</svg>
								</span>
								Generate
							</button>
						</div>
					</>
				)}
				{page() === 'history' && (
					<div class="history-section">
						<h2 class="history-title">Post Generation History</h2>
						<ul
							class="history-list"
							style={{
								"max-height": "520px",
								"transition": "max-height 0.3s"
							}}
						>
							{paginatedHistory().map((item) => (
								<li key={item.id} class="history-item">
									<div class="history-query"><b>Q:</b> {item.query}</div>
									<div class="history-answer"><b>A:</b> {item.edited_answer || item.answer}</div>
									{item.tweeted
										? <span class="history-status posted">(Posted)</span>
										: <>
											<span class="history-status not-posted">(Not posted)</span>
											<button
												type="button"
												class="history-post-btn"
												style={{ marginLeft: '12px' }}
												disabled={isPosting()}
												onClick={async () => {
													setIsPosting(true);
													try {
														const res = await postToTwitter(item.id, item.edited_answer || item.answer);
														if (res.status === "success") {
															setHistory((prev) => prev.map(q => q.id === item.id ? { ...q, tweeted: true } : q));
															alert('Posted to Twitter!');
														} else {
															alert(`Failed to post: ${res.detail || "Unknown error"}`);
														}
													} catch (error) {
														alert(`Failed to post: ${error.message}`);
													} finally {
														setIsPosting(false);
													}
												}}
											>
												{isPosting() ? "Posting..." : "Post to Twitter"}
											</button>
										</>
									}
								</li>
							))}
						</ul>
						<div class="pagination-controls">
							<button
								type="button"
								disabled={historyPage() === 1}
								onClick={() => setHistoryPage(historyPage() - 1)}
							>
								Previous
							</button>
							<span>Page {historyPage()} of {totalPages()}</span>
							<button
								type="button"
								disabled={historyPage() === totalPages()}
								onClick={() => setHistoryPage(historyPage() + 1)}
							>
								Next
							</button>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</main>
		</div>
	);
}

export default App;