import React, { useState, useEffect, useContext } from 'react';
import DOMPurify from 'dompurify';
import { useParams, useNavigate } from 'react-router-dom';
import { deletePost, getPost, updatePost } from '@/adapters/postAdapter';
import { getCommentsByPost, createComment, updateComment, deleteComment } from '@/adapters/commentAdapter';
import ForumPostCard from '@/components/ForumPostCard';
import CommentCard from '@/components/CommentCard';
import { Button } from '@/components/ui/button';
import CurrentUserContext from '@/context/current-user-context';
import ReactQuill from 'react-quill';
import EditPostModal from '@/components/EditPostModal';
import EditCommentModal from '@/components/EditCommentModal'; // Import the EditCommentModal

interface Comment {
    id: number;
    body: string;
    createdAt: string;
    username: string;
    profilePicture: string;
    pronouns?: string;
    userId: number;
}

interface Post {
    id: number;
    title: string;
    body: string;
    createdAt: string;
    likes: number;
    comments: number;
    username: string;
    profilePicture: string;
    categoryId: number;
    pronouns?: string;
}

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { currentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [editingComment, setEditingComment] = useState<Comment | null>(null); // State for editing comment

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postData = await getPost(Number(id));
                const commentsData = await getCommentsByPost(Number(id));
                setPost(postData[0]);
                setComments(commentsData[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
                navigate('/not-found');
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleDeletePost = async (postId: number) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await deletePost(postId);
            navigate('/');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleSavePost = (updatedPost: Post) => {
        console.log('Updated post', updatedPost);
        setPost(updatedPost[0]);
        setEditingPost(null);
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !currentUser) return;

        try {
            await createComment({
                body: newComment,
                userId: currentUser.id,
                postId: Number(id),
            });

            const updatedComments = await getCommentsByPost(Number(id));
            setComments(updatedComments[0]);
            setNewComment('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await deleteComment(commentId);
            const updatedComments = await getCommentsByPost(Number(id));
            setComments(updatedComments[0]);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleSaveComment = async (updatedComment: Comment) => {
        try {
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === updatedComment.id ? updatedComment : comment
                )
            );

            const refreshedComments = await getCommentsByPost(Number(id));
            setComments(refreshedComments[0]);

            setEditingComment(null);
        } catch (error) {
            console.error('Error saving comment:', error);
        }
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Post Section */}
            <div className="mb-8">
                <ForumPostCard
                    username={post.username}
                    pronouns={post.pronouns}
                    avatarUrl={post.profilePicture}
                    title={post.title}
                    content={DOMPurify.sanitize(post.body)}
                    date={new Date(post.createdAt).toLocaleDateString()}
                    likes={post.likes}
                    comments={post.comments}
                    currentUserUsername={currentUser?.username}
                    onEdit={() => setEditingPost(post)}
                    onDelete={() => handleDeletePost(post.id)}
                    onClick={undefined}
                    isDetailView={true}
                />
            </div>

            {/* Comment Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>

                {/* Comment Input */}
                {currentUser && (
                    <div className="mb-6">
                        <ReactQuill
                            theme="snow"
                            value={newComment}
                            onChange={setNewComment}
                            className="bg-white rounded-md"
                            modules={{
                                toolbar: [
                                    ['bold', 'italic', 'underline', 'strike'],
                                    ['blockquote', 'code-block'],
                                    [{ header: 1 }, { header: 2 }],
                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                    [{ script: 'sub' }, { script: 'super' }],
                                    ['link', 'image'],
                                    ['clean'],
                                ],
                            }}
                        />
                        <Button
                            onClick={handleCommentSubmit}
                            disabled={commentLoading || !newComment.trim()}
                        >
                            {commentLoading ? 'Posting...' : 'Post Comment'}
                        </Button>
                    </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.map(
                        (comment) =>
                            comment && (
                                <CommentCard
                                    key={comment.id}
                                    username={comment.username}
                                    pronouns={comment.pronouns}
                                    avatarUrl={comment.profilePicture}
                                    content={comment.body}
                                    date={new Date(comment.createdAt).toLocaleDateString()}
                                    currentUserUsername={currentUser?.username}
                                    onEdit={() => setEditingComment(comment)}
                                    onDelete={() => handleDeleteComment(comment.id)}
                                />
                            )
                    )}
                </div>
            </div>

            {/* Edit Post Modal */}
            {editingPost && (
                <EditPostModal
                    post={editingPost}
                    onClose={() => setEditingPost(null)}
                    onSave={handleSavePost}
                />
            )}

            {/* Edit Comment Modal */}
            {editingComment && (
                <EditCommentModal
                    comment={editingComment}
                    onClose={() => setEditingComment(null)}
                    onSave={handleSaveComment}
                />
            )}
        </div>
    );
};

export default PostDetail;