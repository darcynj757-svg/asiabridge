import { DashboardLayout } from "@/components/DashboardLayout";
import { useListRfqs, getListRfqsQueryKey, useListMessages, getListMessagesQueryKey, useCreateMessage } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare } from "lucide-react";

export default function DashboardMessages() {
  const { user } = useAuth();
  const [selectedRfqId, setSelectedRfqId] = useState<number | null>(null);
  const [content, setContent] = useState("");

  const { data: rfqs } = useListRfqs({
    query: { queryKey: getListRfqsQueryKey() }
  });

  const { data: messages, refetch: refetchMessages } = useListMessages(
    selectedRfqId ?? 0,
    { query: { enabled: !!selectedRfqId, queryKey: getListMessagesQueryKey(selectedRfqId ?? 0) } }
  );

  const sendMutation = useCreateMessage({
    mutation: {
      onSuccess: () => {
        setContent("");
        refetchMessages();
      }
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedRfqId) return;
    sendMutation.mutate({ id: selectedRfqId, data: { content } });
  };

  const selectedRfq = rfqs?.find((r) => r.id === selectedRfqId);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0D1B2A]">Messages</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 flex overflow-hidden" style={{ height: "calc(100vh - 220px)", minHeight: 400 }}>
        <div className="w-72 border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {!rfqs?.length ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              rfqs.map((rfq) => {
                const counterpart = user?.role === "supplier" ? rfq.buyerName : rfq.supplierName;
                const isActive = rfq.id === selectedRfqId;
                return (
                  <button
                    key={rfq.id}
                    onClick={() => setSelectedRfqId(rfq.id)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors hover:bg-gray-50 ${isActive ? "bg-gray-50 border-l-2 border-l-[#F7941D]" : ""}`}
                  >
                    <p className="text-sm font-medium text-[#0D1B2A] truncate">{rfq.productTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{counterpart}</p>
                    <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      rfq.status === "new" ? "bg-blue-100 text-blue-700" :
                      rfq.status === "negotiating" ? "bg-purple-100 text-purple-700" :
                      rfq.status === "contracted" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{rfq.status}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {!selectedRfqId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="h-12 w-12 mb-3 opacity-20" />
              <p className="font-medium">Select a conversation</p>
              <p className="text-sm mt-1">Choose a contact from the left to start messaging</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-200">
                <p className="font-semibold text-[#0D1B2A]">{selectedRfq?.productTitle}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {user?.role === "supplier" ? selectedRfq?.buyerName : selectedRfq?.supplierName}
                </p>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages?.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-8">No messages yet. Start the conversation!</div>
                )}
                {messages?.map((msg) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                      <span className="text-xs text-gray-400 mb-1">{msg.senderName}</span>
                      <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] text-sm ${isMine ? "bg-[#0D1B2A] text-white" : "bg-gray-100 text-[#0D1B2A]"}`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex gap-2">
                <Input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={sendMutation.isPending} className="bg-[#F7941D] hover:bg-[#e0830c] text-white">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
