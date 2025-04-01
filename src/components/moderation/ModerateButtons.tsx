
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, MoreHorizontal, AlertTriangle } from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from '@/lib/redux/hooks';
import { approvePost, rejectPost, addToWhitelist, addToBlacklist } from '@/lib/redux/moderationSlice';
import { toast } from "sonner";

interface ModerateButtonsProps {
  postId: string;
  username: string;
  onViewDetails?: () => void;
}

const ModerateButtons: React.FC<ModerateButtonsProps> = ({ postId, username, onViewDetails }) => {
  const dispatch = useAppDispatch();
  
  const handleApprove = () => {
    dispatch(approvePost(postId));
    toast('Post approved', {
      description: 'This content has been approved for AI training'
    });
  };
  
  const handleReject = () => {
    dispatch(rejectPost(postId));
    toast('Post rejected', {
      description: 'This content has been rejected and removed from the feed'
    });
  };
  
  const handleAddToWhitelist = () => {
    dispatch(addToWhitelist(username));
    toast('User added to whitelist', {
      description: `All content from ${username} will be automatically approved`,
    });
  };
  
  const handleAddToBlacklist = () => {
    dispatch(addToBlacklist(username));
    toast('User added to blacklist', {
      description: `All content from ${username} will be automatically rejected`,
    });
  };
  
  const handleRetrainAI = () => {
    toast('AI retraining initiated', {
      description: 'This post will be used to improve the AI model'
    });
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-green-600/20 text-green-500 hover:bg-green-600/30 hover:text-green-500"
        onClick={handleApprove}
      >
        <Check className="mr-1 h-3 w-3" />
        Approve
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="bg-alert-high/20 text-alert-high hover:bg-alert-high/30 hover:text-alert-high"
        onClick={handleReject}
      >
        <X className="mr-1 h-3 w-3" />
        Reject
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card border-border">
          <DropdownMenuItem onClick={handleRetrainAI}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Retrain AI with this post</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleAddToWhitelist}>Add to whitelist</DropdownMenuItem>
          <DropdownMenuItem onClick={handleAddToBlacklist}>Add to blacklist</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ModerateButtons;
