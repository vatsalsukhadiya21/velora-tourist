import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPinIcon,
  PencilSquareIcon,
  CameraIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import PageTransition from '../components/layout/PageTransition';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ExperienceCard from '../components/cards/ExperienceCard';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeletonGrid, ProfileSkeleton } from '../components/ui/SkeletonLoader';
import { getUserById, updateProfile } from '../api/userApi';
import { getPostsByUser } from '../api/postApi';
import { toggleLike } from '../api/likeApi';
import { useAuth } from '../hooks/useAuth';
import { COUNTRIES } from '../utils/constants';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated, refreshUser } = useAuth();

  // ─── Profile State ───
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ─── Posts ───
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsPage, setPostsPage] = useState(0);
  const [postsTotalPages, setPostsTotalPages] = useState(0);
  const [postsLoadingMore, setPostsLoadingMore] = useState(false);

  // ─── Like tracking ───
  const [likedPosts, setLikedPosts] = useState(new Set());

  // ─── Edit Modal ───
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    displayName: '',
    bio: '',
    country: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const avatarInputRef = useRef(null);

  const isOwnProfile = isAuthenticated && currentUser?.id === Number(id);

  // ─── Fetch Profile ───
  useEffect(() => {
    setLoading(true);
    setError('');
    getUserById(id)
      .then(({ data }) => {
        setProfileUser(data);
        setEditData({
          displayName: data.displayName || '',
          bio: data.bio || '',
          country: data.country || '',
        });
      })
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  // ─── Fetch Posts ───
  const fetchPosts = useCallback(
    async (reset = false) => {
      const page = reset ? 0 : postsPage + 1;
      if (reset) setPostsLoading(true);
      else setPostsLoadingMore(true);

      try {
        const { data } = await getPostsByUser(id, page, 12);
        const content = data.content || [];
        if (reset) setPosts(content);
        else setPosts((prev) => [...prev, ...content]);
        setPostsTotalPages(data.totalPages || 0);
        setPostsPage(page);
      } catch {
        /* silent */
      } finally {
        setPostsLoading(false);
        setPostsLoadingMore(false);
      }
    },
    [id, postsPage]
  );

  useEffect(() => {
    if (id) fetchPosts(true);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Like Handler (closure-safe) ───
  const handleLike = useCallback(
    async (postId) => {
      if (!isAuthenticated) return;
      try {
        await toggleLike(postId);
        let wasLiked = false;
        setLikedPosts((prev) => {
          const next = new Set(prev);
          wasLiked = next.has(postId);
          if (wasLiked) next.delete(postId);
          else next.add(postId);
          return next;
        });
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likeCount: wasLiked
                    ? Math.max(0, (p.likeCount || 1) - 1)
                    : (p.likeCount || 0) + 1,
                }
              : p
          )
        );
      } catch {
        /* silent */
      }
    },
    [isAuthenticated]
  );

  // ─── Edit Handlers ───
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setEditError('');
    try {
      const formData = new FormData();
      formData.append('displayName', editData.displayName.trim());
      formData.append('bio', editData.bio.trim());
      formData.append('country', editData.country);
      if (avatarFile) formData.append('avatar', avatarFile);

      const { data } = await updateProfile(formData);
      setProfileUser(data);
      if (refreshUser) refreshUser();
      setEditOpen(false);
      setAvatarFile(null);
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    } catch (err) {
      setEditError(
        err.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = () => {
    setEditData({
      displayName: profileUser?.displayName || '',
      bio: profileUser?.bio || '',
      country: profileUser?.country || '',
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditError('');
    setEditOpen(true);
  };

  // ─── Loading / Error ───
  if (loading) return <ProfileSkeleton />;

  if (error || !profileUser) {
    return (
      <PageTransition>
        <EmptyState
          icon={GlobeAltIcon}
          title="User not found"
          description="This profile doesn't exist or has been removed."
          actionLabel="Back to Explore"
          actionTo="/explore"
          className="min-h-[60vh]"
        />
      </PageTransition>
    );
  }

  const hasMorePosts = postsPage + 1 < postsTotalPages;
  const totalPostCount = posts.length;

  return (
    <PageTransition>
      {/* ═══════════════════════════════════
          PROFILE HEADER
          ═══════════════════════════════════ */}
      <section className="relative">
        {/* Cover gradient */}
        <div className="h-40 sm:h-52 md:h-64 bg-gradient-to-br from-accent/20 via-violet/15 to-surface rounded-b-3xl overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-1/4 w-40 h-40 bg-accent/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-1/3 w-56 h-56 bg-violet/10 rounded-full blur-[100px]" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-14 sm:-mt-16 flex flex-col sm:flex-row items-start gap-5 pb-6">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Avatar
                user={profileUser}
                size="2xl"
                shape="rounded"
                showRing
                className="border-4 border-surface"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 pt-2 sm:pt-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-[Outfit] text-foreground">
                  {profileUser.displayName || profileUser.username}
                </h1>
                {isOwnProfile && (
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={PencilSquareIcon}
                    onClick={openEditModal}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
              <p className="text-muted text-sm mb-2">
                @{profileUser.username}
              </p>
              {profileUser.bio && (
                <p className="text-foreground/80 text-sm max-w-xl mb-3 leading-relaxed">
                  {profileUser.bio}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                {profileUser.country && (
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="w-4 h-4" />
                    {profileUser.country}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <GlobeAltIcon className="w-4 h-4" />
                  {totalPostCount}{' '}
                  {totalPostCount === 1 ? 'experience' : 'experiences'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-line-light to-transparent" />
      </div>

      {/* ═══════════════════════════════════
          USER POSTS
          ═══════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-bold font-[Outfit] text-foreground mb-8">
          {isOwnProfile ? 'Your' : `${profileUser.displayName || profileUser.username}'s`}{' '}
          Experiences
        </h2>

        {postsLoading ? (
          <CardSkeletonGrid count={6} />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={GlobeAltIcon}
            title={isOwnProfile ? 'No experiences yet' : 'No experiences shared'}
            description={
              isOwnProfile
                ? 'Share your first travel experience with the community!'
                : 'This user hasn\'t shared any experiences yet.'
            }
            actionLabel={isOwnProfile ? 'Share an Experience' : undefined}
            actionTo={isOwnProfile ? '/create' : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ExperienceCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  isLiked={likedPosts.has(post.id)}
                />
              ))}
            </div>

            {hasMorePosts && (
              <div className="mt-12 flex justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  isLoading={postsLoadingMore}
                  onClick={() => fetchPosts(false)}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ═══════════════════════════════════
          EDIT PROFILE MODAL
          ═══════════════════════════════════ */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profile"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button isLoading={saving} onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Edit Error */}
          <AnimatePresence>
            {editError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger"
              >
                {editError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar
                user={
                  avatarPreview
                    ? { ...profileUser, avatarUrl: avatarPreview }
                    : profileUser
                }
                size="xl"
                shape="rounded"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CameraIcon className="w-6 h-6 text-white" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Profile Photo
              </p>
              <p className="text-xs text-muted">Click to change</p>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Display Name
            </label>
            <input
              name="displayName"
              value={editData.displayName}
              onChange={handleEditChange}
              placeholder="Your display name"
              className="input-field"
              maxLength={50}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={editData.bio}
              onChange={handleEditChange}
              placeholder="Tell others about yourself..."
              rows={3}
              className="textarea-field"
              maxLength={300}
            />
            <span className="block text-right text-xs text-faint mt-1">
              {editData.bio.length}/300
            </span>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Country
            </label>
            <select
              name="country"
              value={editData.country}
              onChange={handleEditChange}
              className="input-field !appearance-none"
            >
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
