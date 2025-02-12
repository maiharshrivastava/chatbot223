"use client";

import { useState } from "react";
import axios from "axios";
import styles from "./Chatbot.module.css"; // Import your CSS module

const Chat = () => {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://107.170.5.236:8000/generate", {
        prompt: `### Human: ${input}\n\n### Assistant:`,
        max_tokens: 100,
        temperature: 0.8,
        top_p: 0.95,
      });

      const aiMessage = { role: "assistant", content: response.data.response };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.chatbotContainer}>
      <div className={styles.header}>Chat with VolkAI</div>
      <div className={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.role === "user" ? styles.userMessage : styles.botMessage}
          >
            <strong>{msg.role === "user" ? "You" : "VolkAI"}:</strong> {msg.content}
          </div>
        ))}
        {loading && <p style={{ color: "#333" }}>VolkAI is typing...</p>}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.inputField}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className={styles.sendButton}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
