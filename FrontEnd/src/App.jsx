import { createSignal, createEffect } from "solid-js";
import { sendMessage } from "./services/api";
import "./App.css";

function App() {
	const [messages, setMessages] = createSignal([]);
	const [input, setInput] = createSignal("");
	const [isLoading, setIsLoading] = createSignal(false);
	const [error, setError] = createSignal(null);
	let messagesEndRef;

	const scrollToBottom = () => {
		messagesEndRef?.scrollIntoView({ behavior: "smooth" });
	};

	createEffect(() => {
		messages();
		scrollToBottom();
	});

	const formatTimestamp = (date) => {
		return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input().trim() || isLoading()) return;

		const userMessage = {
			id: Date.now(),
			text: input(),
			isUser: true,
			timestamp: Date.now(),
		};

		setMessages([...messages(), userMessage]);
		setInput("");
		setIsLoading(true);
		setError(null);

		try {
			const response = await sendMessage(userMessage.text);

			const aiMessage = {
				id: Date.now() + 1,
				text: response,
				isUser: false,
				timestamp: Date.now(),
			};

			setMessages((prev) => [...prev, aiMessage]);
		} catch (error) {
			console.error("Error:", error);
			setError(error.message);
			const errorMessage = {
				id: Date.now() + 1,
				text: error.message || "Sorry, there was an error processing your request. Please try again.",
				isUser: false,
				timestamp: Date.now(),
				isError: true
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div class="chat-container">
			<div class="welcome-message">
				<h1>Welcome to AI Post Manager</h1>
				<p>Ask me to post on certain topic, I will help you with that!</p>
			</div>

			<div class="chat-messages">
				{messages().map((message) => (
					<div
						key={message.id}
						class={`message-item ${message.isUser ? "user-message" : "ai-message"} ${message.isError ? "error-message" : ""}`}
					>
						<span class="message-text">{message.text}</span>
						<span class="message-timestamp">
							{formatTimestamp(message.timestamp)}
						</span>
					</div>
				))}
				{isLoading() && (
					<div class="message-item ai-message">
						<span class="message-text">Thinking...</span>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<form onSubmit={handleSubmit} class="chat-input-form">
				<input
					type="text"
					value={input()}
					onInput={(e) => setInput(e.currentTarget.value)}
					placeholder="Type your message..."
					class="chat-input"
					disabled={isLoading()}
				/>
				<button type="submit" class="send-button" disabled={isLoading()}>
					{isLoading() ? "Sending..." : "Send"}
				</button>
			</form>
		</div>
	);
}

export default App;
