import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Send,
    Smile,
    Paperclip,
    Video,
    Image,
    File,
    Download,
    MoreVertical,
    Edit,
    Trash2,
    Reply,
    AtSign,
    MessageCircle,
    Eye,
    Heart,
    ThumbsUp,
    Laugh,
    Angry,
    Plus,
    Link
} from 'lucide-react';
import { useAppStore, type Task, type TaskComment, type TeamMember } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { VideoRecordingModal } from '@/components/modals/VideoRecordingModal';
import { RecordingLinkModal } from '@/components/RecordingLinkModal';
import { ImagePreviewModal } from '@/components/ImagePreviewModal';
import { toast } from '@/components/ui/sonner';

interface TaskCommentsProps {
    task: Task;
    className?: string;
}

const EMOJI_OPTIONS = [
    { emoji: '👍', name: 'thumbs_up' },
    { emoji: '❤️', name: 'heart' },
    { emoji: '😂', name: 'laugh' },
    { emoji: '😮', name: 'wow' },
    { emoji: '😢', name: 'sad' },
    { emoji: '😡', name: 'angry' },
    { emoji: '🎉', name: 'celebrate' },
    { emoji: '🚀', name: 'rocket' },
];

export const TaskComments = ({ task, className }: TaskCommentsProps) => {
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
    const [mentionQuery, setMentionQuery] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isVideoRecordingOpen, setIsVideoRecordingOpen] = useState(false);
    const [isRecordingLinkOpen, setIsRecordingLinkOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<{ url: string; name: string } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { teamMembers, addComment, updateComment, deleteComment, addReaction, removeReaction, addAttachment, removeAttachment } = useAppStore();
    const user = useAuthStore(state => state.user);

    const comments = task.comments || [];
    const attachments = task.attachments || [];

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    const getUserInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleSubmitComment = useCallback(() => {
        if (!newComment.trim() || !user) return;

        // Extract mentions from comment text
        const mentionRegex = /@(\w+)/g;
        const mentions: string[] = [];
        let match;
        while ((match = mentionRegex.exec(newComment)) !== null) {
            const mentionedUser = teamMembers.find(member =>
                member.name.toLowerCase().includes(match[1].toLowerCase())
            );
            if (mentionedUser) {
                mentions.push(mentionedUser.id);
            }
        }

        addComment(task.id, {
            taskId: task.id,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            content: newComment.trim(),
            mentions,
            attachments: [],
            reactions: [],
            parentId: replyingTo || undefined,
        });

        setNewComment('');
        setReplyingTo(null);
        setMentionQuery('');
        setShowMentions(false);
        toast.success('Comment added successfully');
    }, [newComment, user, task.id, replyingTo, teamMembers, addComment]);

    const handleEditComment = (commentId: string, content: string) => {
        updateComment(commentId, content);
        setEditingComment(null);
        setEditContent('');
        toast.success('Comment updated successfully');
    };

    const handleDeleteComment = (commentId: string) => {
        deleteComment(commentId);
        setDeleteConfirm(null);
        toast.success('Comment deleted successfully');
    };

    const handleReaction = (commentId: string, emoji: string, userName: string) => {
        if (!user) return;

        // Check if user already reacted with this emoji
        const comment = comments.find(c => c.id === commentId);
        const existingReaction = comment?.reactions.find(
            r => r.userId === user.id && r.emoji === emoji
        );

        if (existingReaction) {
            removeReaction(commentId, user.id, emoji);
            toast.success('Reaction removed');
        } else {
            addReaction(commentId, {
                emoji,
                userId: user.id,
                userName: user.name,
            });
            toast.success(`Reacted with ${emoji}`);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !user) return;

        Array.from(files).forEach(file => {
            const attachment = {
                name: file.name,
                url: URL.createObjectURL(file), // In real app, upload to server
                type: file.type.startsWith('image/') ? 'image' as const :
                    file.type.startsWith('video/') ? 'video' as const : 'file' as const,
                size: file.size,
                uploadedBy: user.id,
            };

            addAttachment(task.id, attachment);
        });

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully`);
    };

    const handleMentionInput = (value: string) => {
        setNewComment(value);

        // Check for @ mentions
        const atIndex = value.lastIndexOf('@');
        if (atIndex !== -1) {
            const query = value.slice(atIndex + 1);
            if (query.length >= 0) {
                setMentionQuery(query);
                setShowMentions(true);
            }
        } else {
            setShowMentions(false);
            setMentionQuery('');
        }
    };

    const insertMention = (member: TeamMember) => {
        const atIndex = newComment.lastIndexOf('@');
        const beforeMention = newComment.slice(0, atIndex);
        const afterMention = newComment.slice(atIndex + mentionQuery.length + 1);

        setNewComment(`${beforeMention}@${member.name} ${afterMention}`);
        setShowMentions(false);
        setMentionQuery('');
        textareaRef.current?.focus();
    };

    const filteredMembers = teamMembers.filter(member =>
        member.name.toLowerCase().includes(mentionQuery.toLowerCase())
    );

    const renderComment = (comment: TaskComment, isReply = false) => {
        const isEditing = editingComment === comment.id;
        const reactions = comment.reactions || [];

        // Group reactions by emoji
        const groupedReactions = reactions.reduce((acc, reaction) => {
            if (!acc[reaction.emoji]) {
                acc[reaction.emoji] = [];
            }
            acc[reaction.emoji].push(reaction);
            return acc;
        }, {} as Record<string, typeof reactions>);

        return (
            <div key={comment.id} className={`flex gap-3 ${isReply ? 'ml-12 mt-2' : ''}`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={comment.userAvatar} />
                    <AvatarFallback className="text-xs">
                        {getUserInitials(comment.userName)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{comment.userName}</span>
                                <span className="text-xs text-muted-foreground">
                                    {formatTime(comment.timestamp)}
                                </span>
                                {comment.edited && (
                                    <Badge variant="outline" className="text-xs px-1 py-0">
                                        edited
                                    </Badge>
                                )}
                            </div>

                            {user?.id === comment.userId && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                            <MoreVertical className="w-3 h-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setEditingComment(comment.id);
                                                setEditContent(comment.content);
                                            }}
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setDeleteConfirm(comment.id)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="space-y-2">
                                <Textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="min-h-[60px]"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleEditComment(comment.id, editContent)}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingComment(null);
                                            setEditContent('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm whitespace-pre-wrap break-words">
                                {comment.content.split(/(@\w+)/).map((part, index) => {
                                    if (part.startsWith('@')) {
                                        const memberName = part.slice(1);
                                        const member = teamMembers.find(m =>
                                            m.name.toLowerCase() === memberName.toLowerCase()
                                        );
                                        if (member) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="bg-primary/10 text-primary px-1 rounded font-medium"
                                                >
                                                    {part}
                                                </span>
                                            );
                                        }
                                    }
                                    return part;
                                })}
                            </div>
                        )}
                    </div>

                    {/* Reactions */}
                    {Object.keys(groupedReactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(groupedReactions).map(([emoji, reactionList]) => (
                                <Button
                                    key={emoji}
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => handleReaction(comment.id, emoji, user?.name || '')}
                                >
                                    <span className="mr-1">{emoji}</span>
                                    {reactionList.length}
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Comment Actions */}
                    <div className="flex items-center gap-2 mt-2">
                        <Popover open={showEmojiPicker === comment.id} onOpenChange={(open) => setShowEmojiPicker(open ? comment.id : null)}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                    <Smile className="w-3 h-3 mr-1" />
                                    React
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2">
                                <div className="flex gap-1">
                                    {EMOJI_OPTIONS.map(({ emoji, name }) => (
                                        <Button
                                            key={name}
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => {
                                                handleReaction(comment.id, emoji, user?.name || '');
                                                setShowEmojiPicker(null);
                                            }}
                                        >
                                            {emoji}
                                        </Button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => setReplyingTo(comment.id)}
                        >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                        </Button>
                    </div>

                    {/* Replies */}
                    {comments
                        .filter(c => c.parentId === comment.id)
                        .map(reply => renderComment(reply, true))}
                </div>
            </div>
        );
    };

    const mainComments = comments.filter(c => !c.parentId);

    return (
        <div className={className}>
            <Card className="shadow-soft">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Comments ({comments.length})
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Attachments Section */}
                    {attachments.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Attachments</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {attachments.map(attachment => (
                                    <div
                                        key={attachment.id}
                                        className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => attachment.type === 'image' && setImagePreview({ url: attachment.url, name: attachment.name })}
                                    >
                                        {attachment.type === 'image' ? (
                                            <Image className="w-4 h-4" />
                                        ) : attachment.type === 'video' ? (
                                            <Video className="w-4 h-4" />
                                        ) : (
                                            <File className="w-4 h-4" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-medium truncate">
                                                {attachment.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {(attachment.size / 1024).toFixed(1)}KB
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Download logic here
                                                const link = document.createElement('a');
                                                link.href = attachment.url;
                                                link.download = attachment.name;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                        >
                                            <Download className="w-3 h-3" />
                                        </Button>
                                        {user?.id === attachment.uploadedBy && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeAttachment(task.id, attachment.id);
                                                    toast.success('Attachment removed');
                                                }}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comments List */}
                    <ScrollArea className="max-h-96">
                        <div className="space-y-4">
                            {mainComments.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No comments yet. Start the conversation!</p>
                                </div>
                            ) : (
                                mainComments.map(comment => renderComment(comment))
                            )}
                        </div>
                    </ScrollArea>

                    {/* Reply indicator */}
                    {replyingTo && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                            <Reply className="w-4 h-4" />
                            Replying to {comments.find(c => c.id === replyingTo)?.userName}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-auto"
                                onClick={() => setReplyingTo(null)}
                            >
                                ×
                            </Button>
                        </div>
                    )}

                    {/* Comment Input */}
                    <div className="space-y-2">
                        <div className="relative">
                            <Textarea
                                ref={textareaRef}
                                value={newComment}
                                onChange={(e) => handleMentionInput(e.target.value)}
                                placeholder="Write a comment... Use @ to mention team members"
                                className="min-h-[80px] pr-32"
                                maxLength={2000}
                            />

                            {/* Mention dropdown */}
                            {showMentions && filteredMembers.length > 0 && (
                                <div className="absolute z-10 w-64 bg-background border rounded-lg shadow-lg mt-1">
                                    <div className="p-2 text-xs text-muted-foreground border-b">
                                        Mention someone
                                    </div>
                                    {filteredMembers.slice(0, 5).map(member => (
                                        <button
                                            key={member.id}
                                            className="w-full flex items-center gap-2 p-2 hover:bg-muted transition-colors text-left"
                                            onClick={() => insertMention(member)}
                                        >
                                            <Avatar className="w-6 h-6">
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback className="text-xs">
                                                    {getUserInitials(member.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="text-sm font-medium">{member.name}</div>
                                                <div className="text-xs text-muted-foreground">{member.role}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="absolute right-2 top-2 flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Paperclip className="w-4 h-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                        >
                                            <Video className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem onClick={() => setIsVideoRecordingOpen(true)}>
                                            <Video className="w-4 h-4 mr-2" />
                                            Record Video
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setIsRecordingLinkOpen(true)}>
                                            <Link className="w-4 h-4 mr-2" />
                                            Add Video Link
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                            <Smile className="w-4 h-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-2">
                                        <div className="grid grid-cols-4 gap-1">
                                            {EMOJI_OPTIONS.map(({ emoji, name }) => (
                                                <Button
                                                    key={name}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => {
                                                        setNewComment(prev => prev + emoji + ' ');
                                                        textareaRef.current?.focus();
                                                    }}
                                                >
                                                    {emoji}
                                                </Button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="text-xs text-muted-foreground">
                                {newComment.length}/2000 characters
                            </div>
                            <div className="flex gap-2">
                                {replyingTo && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setReplyingTo(null)}
                                    >
                                        Cancel Reply
                                    </Button>
                                )}
                                <Button
                                    onClick={handleSubmitComment}
                                    disabled={!newComment.trim()}
                                    size="sm"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {replyingTo ? 'Reply' : 'Comment'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            />

            {/* Video Recording Modal */}
            <VideoRecordingModal
                open={isVideoRecordingOpen}
                onOpenChange={setIsVideoRecordingOpen}
            />

            {/* Recording Link Modal */}
            <RecordingLinkModal
                taskId={task.id}
                open={isRecordingLinkOpen}
                onOpenChange={setIsRecordingLinkOpen}
                onRecordingAdded={() => setIsRecordingLinkOpen(false)}
            />

            {/* Image Preview Modal */}
            {imagePreview && (
                <ImagePreviewModal
                    imageUrl={imagePreview.url}
                    imageName={imagePreview.name}
                    open={!!imagePreview}
                    onOpenChange={(open) => !open && setImagePreview(null)}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteConfirm && handleDeleteComment(deleteConfirm)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
