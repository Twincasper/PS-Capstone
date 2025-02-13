import React from 'react';
import DOMPurify from "dompurify";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar.tsx"
import { Button } from "./ui/button.tsx"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card.tsx"
import { ThumbsUp, MessageCircle, Share2, Edit, Trash2 } from 'lucide-react';

interface ForumPostCardProps {
  username: string;
  avatarUrl: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  onClick?: () => void
  currentUserUsername?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ForumPostCard: React.FC<ForumPostCardProps & { onClick?: () => void }> = ({
  username,
  avatarUrl,
  title,
  content,
  date,
  likes,
  comments,
  onClick,
  currentUserUsername,
  onEdit,
  onDelete,
}) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  const truncatedContent = sanitizedContent.length > 200
      ? `${sanitizedContent.substring(0, 200)}...`
      : sanitizedContent;

  const showActions = currentUserUsername === username;

  return (
    <Card className="w-full max-w-2xl mx-auto my-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={username} />
          {/*<AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>*/}
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{username}</h2>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div
            className="text-gray-700 prose"
            dangerouslySetInnerHTML={{__html: truncatedContent}}
        />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-4">
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{comments}</span>
          </Button>
        </div>
        {showActions && (
            <div className="flex gap-2">
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
        )}
        {/*<Button variant="ghost" size="sm">*/}
        {/*  <Share2 className="w-4 h-4" />*/}
        {/*</Button>*/}
      </CardFooter>
    </Card>
  );
};

export default ForumPostCard;

