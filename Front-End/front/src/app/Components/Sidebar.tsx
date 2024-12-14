import React, { useEffect, useState } from "react";

interface Chat {
    id: string;
    name: string;
    mode: string;
    createdAt: string;
}

const Sidebar: React.FC<{ onSelectChat: (chatId: string) => void }> = ({ onSelectChat }) => {
    const [chats, setChats] = useState<Chat[]>([]);

    useEffect(() => {
        const fetchChats = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:4000/api/chat-list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setChats(data);
            } else {
                console.error("خطا در دریافت لیست گفتگوها");
            }
        };

        fetchChats();
    }, []);

    return (
        <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "10px" }}>
            <h2>گفتگوها</h2>
            {chats.map((chat) => (
                <div
                    key={chat.id}
                    style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                    }}
                    onClick={() => onSelectChat(chat.id)}
                >
                    <strong>{chat.name}</strong>
                    <br />
                    <small>({chat.mode})</small>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
