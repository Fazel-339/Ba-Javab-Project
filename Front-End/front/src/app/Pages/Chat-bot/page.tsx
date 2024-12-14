"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/Components/Navbar";
import Sidebar from "@/app/Components/Sidebar";



const ChatBotPage: React.FC = () => {
    const [selectedMode, setSelectedMode] = useState<string | null>(null);
    const [messages, setMessages] = useState<{ type: string; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);




    // ذخیره چت در سرور
    const saveChatMessage = async (message: string, sender: "user" | "ai") => {
        try {
            const token = localStorage.getItem("token");
            await fetch("http://localhost:4000/api/save-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message,
                    sender,
                    mode: selectedMode,
                }),
            });
        } catch (error) {
            console.error("خطا در ذخیره چت:", error);
        }
    };




    // بارگذاری سابقه چت از سرور
    const loadChatHistory = async (mode: string) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:4000/api/chat-history?mode=${mode}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("خطای سرور:", errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const history = await response.json();
            console.log("تاریخچه دریافت‌شده از سرور:", history); // لاگ پیام‌ها

            const formattedHistory = history.flatMap((item: any) =>
                item.messages.map((msg: any) => ({
                    type: msg.sender === "user" ? "user" : "ai",
                    text: msg.text,
                }))
            );

            setMessages(formattedHistory);
        } catch (error) {
            console.error("خطا در بارگذاری سابقه چت:", error);
        }
    };



    const loadChatById = async (chatId: string) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:4000/api/chat/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const chat = await response.json();
                setMessages(chat.messages.map((msg: any) => ({
                    type: msg.sender,
                    text: msg.text,
                })));
            }
        } catch (error) {
            console.error("خطا در بارگذاری چت:", error);
        }
    };




    // انتخاب حالت و بارگذاری سابقه چت
    const HandleModeSelect = (mode: string) => {
        setSelectedMode(mode);
        localStorage.setItem("selectedMode", mode); // ذخیره حالت انتخاب‌شده
        setMessages([]); // پاکسازی پیام‌ها
        loadChatHistory(mode); // بارگذاری تاریخچه چت برای حالت جدید
    };


    useEffect(() => {
        const savedMode = localStorage.getItem("selectedMode");
        if (savedMode) {
            setSelectedMode(savedMode);
            loadChatHistory(savedMode);
        }
    }, []);


    // ارسال پیام و ذخیره آن
    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        const newMessage = { type: "user", text: input };
        setMessages([...messages, newMessage]);

        // ذخیره پیام کاربر
        await saveChatMessage(input, "user");

        setInput("");

        const aiResponse = await fetch("http://localhost:4000/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: input, mode: selectedMode }),
        }).then((res) => res.json());

        const aiMessage = { type: "ai", text: aiResponse.answer || "پاسخی از سرور دریافت نشد." };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        // ذخیره پاسخ AI
        await saveChatMessage(aiResponse.answer || "پاسخی از سرور دریافت نشد.", "ai");
    };




    return (
        <>
            <Navbar />
            <h1>لطفا یک حالت را انتخاب کنید</h1>
            <button onClick={() => HandleModeSelect("solve")}>حل سوالات</button>
            <button onClick={() => HandleModeSelect("ask")}>طرح سوال</button>
            <button onClick={() => HandleModeSelect("chat")}>گفتگو با باجواب</button>

            {selectedMode && (
                <>
                    <p>
                        شما در حال کار با حالت{" "}
                        {selectedMode === "solve"
                            ? "حل سوالات"
                            : selectedMode === "ask"
                                ? "طرح سوال"
                                : "گفتگو با باجواب"}{" "}
                        هستید.
                    </p>
                    <div
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            marginTop: "20px",
                            height: "300px",
                            overflowY: "scroll",
                        }}
                    >
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                style={{ textAlign: message.type === "user" ? "right" : "left" }}
                            >
                                <strong>{message.type === "user" ? "شما" : "AI"}: </strong>
                                {message.text}
                            </div>
                        ))}

                        {/* صفحه اصلی چت */}
                        <div style={{ flex: 1, padding: "10px" }}>
                            {selectedChatId ? (
                                <ChatWindow chatId={selectedChatId} />
                            ) : (
                                <p>یک گفتگو را انتخاب کنید.</p>
                            )}
                        </div>

                    </div>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="پیام خود را وارد کنید..."
                        style={{ width: "80%", padding: "8px", marginTop: "10px" }}
                    />
                    <button
                        onClick={handleSendMessage}
                        style={{ padding: "8px 12px", marginLeft: "5px" }}
                    >
                        ارسال
                    </button>


                    {/* سایدبار */}
                    <Sidebar onSelectChat={(chatId) => {
                        setSelectedChatId(chatId);
                        loadChatById(chatId);
                    }} />



                </>
            )}
        </>
    );
};

export default ChatBotPage;
