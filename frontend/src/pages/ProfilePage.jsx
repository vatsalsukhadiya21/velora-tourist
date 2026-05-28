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
import PageContainer from '../components/layout/PageContainer';
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
  const [postsTotalElements, setPostsTotalElements] = useState(0);
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
        setPostsTotalElements(data.totalElements ?? content.length);
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
  const experienceCount = postsTotalElements || posts.length;

  return (
    <PageTransition>
      <section className="relative border-b border-line/50">
        <div className="h-28 sm:h-36 bg-gradient-to-br from-accent/15 via-violet/10 to-surface overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-1/4 w-32 h-32 bg-accent/10 rounded-full blur-[60px]" />
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-violet/10 rounded-full blur-[80px]" />
          </div>
        </div>

        <PageContainer size="feed" className="relative -mt-12 sm:-mt-14 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="shrink-0"
            >
              <Avatar
                user={profileUser}
                size="2xl"
                shape="rounded"
                showRing
                className="border-4 border-surface shadow-xl shadow-black/20"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="flex-1 min-w-0 pt-1 sm:pt-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-1">
                    Traveler
                  </p>
                  <h1 className="text-xl sm:text-2xl font-bold font-[Outfit] text-foreground leading-tight truncate">
                    {profileUser.displayName || profileUser.username}
                  </h1>
                  <p className="text-sm text-muted mt-0.5">@{profileUser.username}</p>
                </div>
                {isOwnProfile && (
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={PencilSquareIcon}
                    onClick={openEditModal}
                    className="shrink-0"
                  >
                    Edit
                  </Button>
                )}
              </div>

              {profileUser.bio ? (
                <p className="text-foreground/75 text-sm leading-relaxed max-w-xl mb-4">
                  {profileUser.bio}
                </p>
              ) : isOwnProfile ? (
                <p className="text-faint text-sm mb-4 italic">
                  Add a bio to tell travelers about yourself
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <StatPill
                  icon={GlobeAltIcon}
                  label={`${experienceCount} ${experienceCount === 1 ? 'story' : 'stories'}`}
                />
                {profileUser.country && (
                  <StatPill icon={MapPinIcon} label={profileUser.country} />
                )}
              </div>
            </motion.div>
          </div>
        </PageContainer>
      </section>

      <section className="py-8 sm:py-10">
        <PageContainer size="feed">
        <h2 className="text-lg sm:text-xl font-bold font-[Outfit] text-foreground mb-6">
          {isOwnProfile ? 'Your stories' : `${profileUser.displayName || profileUser.username}'s stories`}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {posts.map((post) => (
                <ExperienceCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  isLiked={likedPosts.has(post.id)}
                  variant="feed"
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
        </PageContainer>
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

function StatPill({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-line text-xs text-muted">
      <Icon className="w-3.5 h-3.5 shrink-0 text-faint" />
      {label}
    </span>
  );
}
