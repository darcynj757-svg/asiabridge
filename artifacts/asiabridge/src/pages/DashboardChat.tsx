import { DashboardLayout } from "@/components/DashboardLayout";
import { useGetRfq, getGetRfqQueryKey, useListMessages, getListMessagesQueryKey, useCreateMessage, useUpdateRfq } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { RfqUpdateStatus } from "@workspace/api-client-react/src/generated/api.schemas";
import { Send } from "lucide-react";

export default function DashboardChat({ params }: { params: { rfqId: string } }) {
  const rfqId = parseInt(params.rfqId);
  const { user } = useAuth();
  const [content, setContent] = useState("");

  const { data: rfq, refetch: refetchRfq } = useGetRfq(rfqId, {
    query: { queryKey: getGetRfqQueryKey(rfqId) }
  });

  const { data: messages, refetch: refetchMessages } = useListMessages(rfqId, {
    query: { queryKey: getListMessagesQueryKey(rfqId) }
  });

  const sendMutation = useCreateMessage({
    mutation: {
      onSuccess: () => {
        setContent("");
        refetchMessages();
      }
    }
  });

  const statusMutation = useUpdateRfq({
    mutation: {
      onSuccess: () => refetchRfq()
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendMutation.mutate({ id: rfqId, data: { content } });
  };

  const updateStatus = (status: RfqUpdateStatus) => {
    statusMutation.mutate({ id: rfqId, data: { status } });
  };

  if (!rfq) return null;

  const steps: RfqUpdateStatus[] = ['new', 'quoted', 'negotiating', 'contracted', 'shipped'];
  const currentStepIdx = steps.indexOf(rfq.status as RfqUpdateStatus);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sidebar">Deal Workspace</h1>
        <p className="text-muted-foreground">{rfq.productTitle} with {user?.role === 'supplier' ? rfq.buyerName : rfq.supplierName}</p>
      </div>

      {/* Stepper */}
      <div className="bg-white p-6 rounded-lg border border-border mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${idx <= currentStepIdx ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-400'}`}>
                {idx + 1}
              </div>
              <span className={`text-xs uppercase font-semibold ${idx <= currentStepIdx ? 'text-sidebar' : 'text-gray-400'}`}>{step}</span>
              {user?.role === 'supplier' && idx > currentStepIdx && (
                <Button variant="link" size="sm" className="text-[10px] h-6 mt-1" onClick={() => updateStatus(step)}>Mark as {step}</Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[500px]">
        {/* Deal Info */}
        <div className="w-full lg:w-1/3 bg-white rounded-lg border border-border p-6 flex flex-col">
          <h3 className="font-bold text-sidebar mb-4">Deal Information</h3>
          <div className="space-y-4 text-sm">
            <div><span className="text-muted-foreground block">Product</span><span className="font-medium">{rfq.productTitle}</span></div>
            <div><span className="text-muted-foreground block">Quantity Requested</span><span className="font-medium">{rfq.quantity}</span></div>
            <div><span className="text-muted-foreground block">Initial Message</span><p className="bg-gray-50 p-3 rounded mt-1">{rfq.message}</p></div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 bg-white rounded-lg border border-border flex flex-col">
          <div className="p-4 border-b border-border font-bold">Messages</div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages?.map(msg => {
              const isMine = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className={`text-xs text-muted-foreground mb-1`}>{msg.senderName}</div>
                  <div className={`px-4 py-2 rounded-lg max-w-[80%] ${isMine ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-sidebar'}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={handleSend} className="p-4 border-t border-border flex gap-2">
            <Input 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="Type your message..." 
              className="flex-1"
            />
            <Button type="submit" disabled={sendMutation.isPending}><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
