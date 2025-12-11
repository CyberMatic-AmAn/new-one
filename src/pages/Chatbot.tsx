import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  reasoning_details?: any;
}

const API_KEY =
  import.meta.env.VITE_OPENROUTER_API_KEY ||
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm your AI interview coach. Ask me anything about interviews.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // 1️⃣ Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // 2️⃣ Send to OpenRouter (CLIENT SIDE)
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "x-ai/grok-4.1-fast",
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
              ...(m.reasoning_details
                ? { reasoning_details: m.reasoning_details }
                : {}),
            })),
            reasoning: { enabled: true },
          }),
        }
      );

      const result = await response.json();
      const assistant = result.choices[0].message;

      //  Add assistant message (with reasoning preserved)
      const assistantMessage: Message = {
        id: updatedMessages.length + 1,
        role: "assistant",
        content: assistant.content,
        reasoning_details: assistant.reasoning_details,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: "⚠️ Failed to reach OpenRouter.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="h-[calc(100vh-2rem)]">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-accent" />
            AI Interview Coach
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col h-[calc(100%-5rem)] p-0">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 border-2 border-accent">
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 border-2 border-primary">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-6 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about interviews..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend} disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;

// import { useState, useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Send, Bot, User, Mic as MicIcon } from "lucide-react";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// interface Message {
//   id: number;
//   role: "user" | "assistant";
//   content: string;
// }

// const API_KEY =
//   import.meta.env.VITE_OPENROUTER_API_KEY ||
//   process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

// const MURF_API_KEY = import.meta.env.VITE_MURF_API_KEY!;
// const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY!;

// const Chatbot = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       role: "assistant",
//       content: "Hello! I'm your AI interview coach. Ask me anything about interviews.",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const workletNodeRef = useRef<AudioWorkletNode | null>(null);
//   const socketRef = useRef<WebSocket | null>(null);

//   // 🗣️ Text-to-Speech (Murf)
//   const speakAI = async (text: string) => {
//     try {
//       const res = await fetch("https://api.murf.ai/v1/speech/stream", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "api-key": MURF_API_KEY,
//         },
//         body: JSON.stringify({
//           text,
//           voiceId: "Matthew",
//           model: "FALCON",
//           multiNativeLocale: "en-US",
//         }),
//       });
//       const audioBlob = await res.blob();
//       const audio = new Audio(URL.createObjectURL(audioBlob));
//       await audio.play();
//     } catch (e) {
//       console.error("TTS error", e);
//     }
//   };

//   // 🎤 Speech-to-Text (Deepgram Flux + AudioWorklet)
//   const startVoiceListen = async () => {
//     if (socketRef.current) return;

//     const socket = new WebSocket(
//       `wss://api.deepgram.com/v2/listen?model=flux-general-en&encoding=linear16&sample_rate=16000`,
//       ["token", DEEPGRAM_API_KEY]
//     );

//     socketRef.current = socket;

//     socket.onopen = async () => {
//       const audioCtx = new AudioContext({ sampleRate: 16000 });
//       await audioCtx.audioWorklet.addModule("/audioRecorderWorkletProcessor.js");
//       const workletNode = new AudioWorkletNode(audioCtx, "recorder-node");

//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const source = audioCtx.createMediaStreamSource(stream);

//       source.connect(workletNode);
//       workletNode.connect(audioCtx.destination);

//       workletNode.port.onmessage = (event) => {
//         const float32Data = event.data as Float32Array;
//         const pcm16 = convertFloat32To16BitPCM(float32Data);

//         if (socket.readyState === WebSocket.OPEN) {
//           socket.send(pcm16);
//         }
//       };

//       workletNodeRef.current = workletNode;
//     };

//     socket.onmessage = (msg) => {
//       const data = JSON.parse(msg.data);
//       const transcript = data?.channel?.alternatives?.[0]?.transcript;
//       if (transcript && transcript.trim()) {
//         addUserMessage(transcript);
//       }
//     };

//     socket.onclose = () => {
//       socketRef.current = null;
//     };
//   };

//   const convertFloat32To16BitPCM = (float32Array: Float32Array) => {
//     const pcm16Buffer = new ArrayBuffer(float32Array.length * 2);
//     const view = new DataView(pcm16Buffer);
//     let offset = 0;
//     for (let i = 0; i < float32Array.length; i++, offset += 2) {
//       const s = Math.max(-1, Math.min(1, float32Array[i]));
//       view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
//     }
//     return pcm16Buffer;
//   };

//   const addUserMessage = (text: string) => {
//     const msg: Message = {
//       id: messages.length + 1,
//       role: "user",
//       content: text,
//     };
//     setMessages((prev) => [...prev, msg]);
//     submitToLLM(text);
//   };

//   const submitToLLM = async (text: string) => {
//     setLoading(true);
//     try {
//       const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "x-ai/grok-4.1-fast",
//           messages: [...messages, { role: "user", content: text }].map(m => ({
//             role: m.role,
//             content: m.content
//           })),
//         }),
//       });
//       const result = await resp.json();
//       const reply = result.choices[0].message.content;

//       setMessages((prev) => [
//         ...prev,
//         { id: prev.length + 1, role: "assistant", content: reply },
//       ]);

//       await speakAI(reply);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background p-4">
//       <Card className="h-[calc(100vh-2rem)]">
//         <CardHeader className="border-b">
//           <CardTitle className="flex items-center gap-2">
//             <Bot className="h-6 w-6 text-accent" />
//             AI Interview Coach
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="flex flex-col h-[calc(100%-5rem)] p-0">
//           <ScrollArea className="flex-1 p-6">
//             <div className="space-y-4">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex gap-3 ${
//                     message.role === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   {message.role === "assistant" && (
//                     <Avatar className="h-8 w-8 border-2 border-accent">
//                       <AvatarFallback>
//                         <Bot className="h-4 w-4" />
//                       </AvatarFallback>
//                     </Avatar>
//                   )}
//                   <div
//                     className={`max-w-[80%] rounded-lg p-4 ${
//                       message.role === "user"
//                         ? "bg-accent text-accent-foreground"
//                         : "bg-secondary"
//                     }`}
//                   >
//                     <p className="text-sm whitespace-pre-wrap">{message.content}</p>
//                   </div>
//                   {message.role === "user" && (
//                     <Avatar className="h-8 w-8 border-2 border-primary">
//                       <AvatarFallback>
//                         <User className="h-4 w-4" />
//                       </AvatarFallback>
//                     </Avatar>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>

//           <div className="p-6 border-t flex gap-2">
//             <Input
//               placeholder="Ask about interviews..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && submitToLLM(input)}
//             />
//             <Button onClick={() => submitToLLM(input)} disabled={loading}>
//               <Send className="h-4 w-4" />
//             </Button>
//             <Button onClick={startVoiceListen}>
//               <MicIcon className="h-5 w-5" />
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Chatbot;




