import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ForumPostCard from '@/components/ForumPostCard';
import { getPostByUser } from '@/adapters/postAdapter';
import { getUserById } from '@/adapters/userAdapter';
import { Post } from '@/types/post';

interface UserProfile {
  id: number;
  username: string;
  pronouns?: string;
  bio?: string;
  profilePicture?: string;
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userData = await getUserById(parseInt(userId));
          console.log("This is the user's data",userData);
          setUser(userData[0] as UserProfile);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    const fetchUserPosts = async () => {
      if (userId) {
        try {
          const postsData = await getPostByUser(parseInt(userId));
          console.log("This is the posts data",postsData);
          setPosts(postsData[0] as Post[]);
        } catch (error) {
          console.error('Error fetching user posts:', error);
        }
      }
    };

    Promise.all([fetchUserData(), fetchUserPosts()]).finally(() => {
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-8">User not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col items-center mb-8">
        <img 
          src={user.profilePicture || '/default-avatar.png'} 
          alt={user.username} 
          className="w-32 h-32 rounded-full border-2 border-accent object-cover mb-4" 
        />
        <h1 className="text-3xl font-bold text-accent">
          {user.username} {user.pronouns && <span className="text-xl text-accent">({user.pronouns})</span>}
        </h1>
        {user.bio && (
          <p className="mt-4 text-accent text-center max-w-xl">
            {user.bio}
          </p>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-accent mb-4 text-center">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-accent">No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
              <ForumPostCard
                username={post.username}
                postId={post.id}
                pronouns={post.pronouns}
                avatarUrl={post.profilePicture || '/default-avatar.png'}
                title={post.title}
                content={post.body}
                date={new Date(post.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                likes={post.likes}
                comments={post.comments}
                categoryName={post.categoryName}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfilePage; 