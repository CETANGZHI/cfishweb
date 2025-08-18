import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  MoreHorizontal,
  Reply,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Edit,
  Trash2,
  User,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Separator } from './ui/separator';

// 点赞按钮组件
export const LikeButton = ({ 
  itemId, 
  itemType = 'nft', 
  initialLikes = 0, 
  initialIsLiked = false,
  size = 'default',
  showCount = true 
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (isLiked) {
        setLikes(prev => prev - 1);
        setIsLiked(false);
      } else {
        setLikes(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = size === 'small' ? 'h-4 w-4' : 'h-5 w-5';
  const buttonSize = size === 'small' ? 'sm' : 'default';

  return (
    <Button
      variant="ghost"
      size={buttonSize}
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
    >
      <Heart 
        className={`${iconSize} ${isLiked ? 'fill-current' : ''} transition-all`} 
      />
      {showCount && <span className="text-sm">{likes}</span>}
    </Button>
  );
};

// 分享按钮组件
export const ShareButton = ({ 
  itemId, 
  itemType = 'nft', 
  title = '',
  size = 'default' 
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const url = `${window.location.origin}/${itemType}/${itemId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: title || `Check out this ${itemType}`,
          url: url
        });
      } else {
        // 复制到剪贴板
        await navigator.clipboard.writeText(url);
        // 这里可以显示一个toast通知
        console.log('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Failed to share:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const iconSize = size === 'small' ? 'h-4 w-4' : 'h-5 w-5';
  const buttonSize = size === 'small' ? 'sm' : 'default';

  return (
    <Button
      variant="ghost"
      size={buttonSize}
      onClick={handleShare}
      disabled={isSharing}
      className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
    >
      <Share2 className={iconSize} />
      <span className="text-sm">Share</span>
    </Button>
  );
};

// 评论组件
export const CommentSection = ({ 
  itemId, 
  itemType = 'nft',
  allowReplies = true,
  maxDepth = 3 
}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

  // 模拟评论数据
  useEffect(() => {
    const mockComments = [
      {
        id: '1',
        author: {
          id: 'user1',
          name: 'CryptoArtist',
          avatar: '/api/placeholder/32/32',
          verified: true
        },
        content: 'Amazing artwork! The colors and composition are absolutely stunning. 🎨',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: 12,
        isLiked: false,
        replies: [
          {
            id: '2',
            author: {
              id: 'user2',
              name: 'NFTCollector',
              avatar: '/api/placeholder/32/32',
              verified: false
            },
            content: 'I totally agree! This piece has such unique style.',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            likes: 5,
            isLiked: true,
            replies: []
          }
        ]
      },
      {
        id: '3',
        author: {
          id: 'user3',
          name: 'DigitalDreamer',
          avatar: '/api/placeholder/32/32',
          verified: false
        },
        content: 'How long did it take you to create this masterpiece?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        likes: 3,
        isLiked: false,
        replies: []
      }
    ];
    
    setComments(mockComments);
  }, [itemId]);

  const handleSubmitComment = async (content, parentId = null) => {
    if (!content.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCommentObj = {
        id: Date.now().toString(),
        author: {
          id: 'current-user',
          name: 'You',
          avatar: '/api/placeholder/32/32',
          verified: false
        },
        content: content.trim(),
        timestamp: new Date(),
        likes: 0,
        isLiked: false,
        replies: []
      };

      if (parentId) {
        // 添加回复
        setComments(prev => 
          prev.map(comment => 
            comment.id === parentId 
              ? { ...comment, replies: [...comment.replies, newCommentObj] }
              : comment
          )
        );
        setReplyingTo(null);
      } else {
        // 添加新评论
        setComments(prev => [newCommentObj, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId, isReply = false, parentId = null) => {
    try {
      if (isReply && parentId) {
        setComments(prev =>
          prev.map(comment =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies: comment.replies.map(reply =>
                    reply.id === commentId
                      ? {
                          ...reply,
                          likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                          isLiked: !reply.isLiked
                        }
                      : reply
                  )
                }
              : comment
          )
        );
      } else {
        setComments(prev =>
          prev.map(comment =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                  isLiked: !comment.isLiked
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const CommentItem = ({ comment, isReply = false, parentId = null, depth = 0 }) => (
    <div className={`${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>
            {comment.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">
              {comment.author.name}
            </span>
            {comment.author.verified && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                ✓
              </Badge>
            )}
            <span className="text-xs text-gray-400">
              {formatTimeAgo(comment.timestamp)}
            </span>
          </div>
          
          <p className="text-gray-300 text-sm mb-2">
            {comment.content}
          </p>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikeComment(comment.id, isReply, parentId)}
              className={`p-0 h-auto text-xs ${comment.isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
            >
              <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
              {comment.likes}
            </Button>
            
            {allowReplies && depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
                className="p-0 h-auto text-xs text-gray-400 hover:text-blue-500"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto text-gray-400 hover:text-white"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem className="text-xs">
                  <Flag className="h-3 w-3 mr-2" />
                  Report
                </DropdownMenuItem>
                {comment.author.id === 'current-user' && (
                  <>
                    <DropdownMenuItem className="text-xs">
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs text-red-500">
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* 回复输入框 */}
          {replyingTo === comment.id && (
            <div className="mt-3">
              <div className="flex gap-2">
                <Input
                  placeholder={`Reply to ${comment.author.name}...`}
                  className="flex-1 bg-gray-800 border-gray-600 text-white text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleSubmitComment(e.target.value, comment.id);
                      e.target.value = '';
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                  variant="ghost"
                  className="text-gray-400"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {/* 回复列表 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                  parentId={comment.id}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-gray-400" />
          <span className="font-medium text-white">
            Comments ({comments.length})
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 新评论输入 */}
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                onClick={() => handleSubmitComment(newComment)}
                disabled={!newComment.trim() || isSubmitting}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="bg-gray-700" />
        
        {/* 评论列表 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// 社交统计组件
export const SocialStats = ({ 
  likes = 0, 
  comments = 0, 
  shares = 0,
  views = 0 
}) => {
  return (
    <div className="flex items-center gap-6 text-sm text-gray-400">
      <div className="flex items-center gap-1">
        <Heart className="h-4 w-4" />
        <span>{likes.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="h-4 w-4" />
        <span>{comments.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <Share2 className="h-4 w-4" />
        <span>{shares.toLocaleString()}</span>
      </div>
      {views > 0 && (
        <div className="flex items-center gap-1">
          <span>👁️</span>
          <span>{views.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

export default {
  LikeButton,
  ShareButton,
  CommentSection,
  SocialStats
};

