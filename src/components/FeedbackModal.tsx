import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  name: string;
  opinions: string;
}

interface FeedbackModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ open, setOpen }) => {
  const [email, setEmail] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const { toast } = useToast()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('https://n8n.jom.lol/webhook/tarifficu', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          // Correctly map the API response to the Comment interface
          setComments(data.map(item => ({ name: item.name || 'N/A', opinions: item.opinions || 'N/A' })));
        } else {
          console.error('Invalid data format from API:', data);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load comments."
          });
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to load comments."
        });
       }
    };

    if (showComments) {
      fetchComments();
    }
  }, [showComments, toast]);

  const handleSubmit = async () => {
    if (email && feedback) {
      try {
        const response = await fetch('https://n8n.jom.lol/webhook/tarifficu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: email,
            opinions: feedback,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);

        toast({
            title: "Success!",
            description: "Successfully submitted feedback."
        })
      } catch (error) {
        console.error('Error:', error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Failed to submit feedback."
        })
      }

      setEmail("");
      setFeedback("");
    }
    setOpen(false); // Close the modal after submit
  };

 const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
 
      <DialogTitle>Feedback Form</DialogTitle>
      {!showComments ? (
        <>
          <div className="grid gap-4 py-4 mt-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Name or Email
              </Label>
              <Input
                id="email"
                className="col-span-3"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your name or email"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opinion" className="text-right">
                Opinion
              </Label>
              <Textarea
                id="opinion"
                className="col-span-3"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your feedback"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              className="bg-[#76b0d8] hover:bg-[#a8d4f0] text-white px-3 py-2 rounded shadow"
              onClick={toggleComments}
            >
              View Comments
            </Button>
            <Button type="submit" className="bg-[#2c516b] hover:bg-[#5a7f99] text-white px-3 py-2 rounded shadow" onClick={handleSubmit} >
              Submit
            </Button>
          </DialogFooter>
        </>
      ) : (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
          <ul className="space-y-3">
            {comments.map((comment, index) => (
              <li key={index} className="bg-secondary rounded-md p-4 shadow-sm">
                <div className="font-semibold">{comment.name}</div>
                <div className="text-sm text-muted-foreground">{comment.opinions}</div>
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button
              type="button"
              className="bg-[#76b0d8] hover:bg-[#a8d4f0] text-white px-3 py-2 rounded shadow"
              onClick={toggleComments}
            >
              Close Comments
            </Button>
          </DialogFooter>
        </div>
      )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
