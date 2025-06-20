import { createSignal, createEffect, onMount } from "solid-js";
import { sendMessage, postToTwitter, fetchHistory } from "./services/api";
import "./App.css";

function App() {
	const [messages, setMessages] = createSignal([]); // {query, answer, id, posted, edited}
	const [input, setInput] = createSignal("");
	const [isLoading, setIsLoading] = createSignal(false);
	const [error, setError] = createSignal(null);
	const [current, setCurrent] = createSignal(null); // {query, answer, id, posted, edited}
	const [history, setHistory] = createSignal([]);
	let messagesEndRef;

	onMount(async () => {
		try {
			const data = await fetchHistory();
			setHistory(data);
		} catch (e) {
			// handle error if needed
		}
	});

	createEffect(() => {
		messages();
		if (messagesEndRef) messagesEndRef.scrollIntoView({ behavior: "smooth" });
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
			setIsLoading(true);
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
			setIsLoading(false);
		}
	};

	return (
		<div class="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			<div class="welcome-message">
				<h1>Welcome to AI Post Manager</h1>
				<p>Ask me to post on a certain topic, edit the answer, and post to Twitter!</p>
			</div>

			{/* Textarea and Post to Twitter button on top */}
			{current() && (
				<div style={{ margin: '24px 0' }}>
					{/* <label htmlFor="editable-answer" style={{ fontWeight: 'bold' }}>Edit the answer before posting:</label> */}
					<textarea
						id="editable-answer"
						value={current().edited}
						onInput={handleEdit}
						rows={8}
						style={{ width: "70%", minWidth: 300, maxWidth: 700, display: 'block', margin: '16px auto' }}
						disabled={current().posted}
					/>
					<br />
					<button type="button" onClick={handlePost} disabled={isLoading() || current().posted} class="send-button" style={{ display: 'block', margin: '0 auto' }}>
						{isLoading() ? "Posting..." : current().posted ? "Posted!" : "Post to Twitter"}
					</button>
				</div>
			)}

			{error() && <div class="error-message">{error()}</div>}

			<div style={{ marginTop: 'auto' }}>
				<form onSubmit={handleSubmit} class="chat-input-form">
					<input
						type="text"
						value={input()}
						onInput={(e) => setInput(e.currentTarget.value)}
						placeholder="Type your topic..."
						class="chat-input"
						disabled={isLoading()}
					/>
					<button type="submit" class="send-button" disabled={isLoading() || !input().trim()}>
						{isLoading() ? "Loading..." : "Generate Post"}
					</button>
				</form>
			</div>

			{/* History at the utmost bottom */}
			<div class="history-section">
				<h2 class="history-title">Post Generation History</h2>
				<ul
					class="history-list"
					style={{
						"max-height": current() ? "180px" : "320px",
						"transition": "max-height 0.3s"
					}}
				>
					{history().map((item) => (
						<li key={item.id} class="history-item">
							<div class="history-query"><b>Q:</b> {item.query}</div>
							<div class="history-answer"><b>A:</b> {item.edited_answer || item.answer}</div>
							{item.tweeted
								? <span class="history-status posted">(Posted)</span>
								: <span class="history-status not-posted">(Not posted)</span>
							}
						</li>
					))}
				</ul>
			</div>
			<div ref={messagesEndRef} />
		</div>
	);
}

export default App;
