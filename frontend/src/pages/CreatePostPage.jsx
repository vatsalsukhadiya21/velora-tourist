import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  XMarkIcon,
  PhotoIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import PageTransition from '../components/layout/PageTransition';
import Button from '../components/ui/Button';
import { createPost, getCategories } from '../api/postApi';
import { COUNTRIES } from '../utils/constants';

const MAX_IMAGES = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ─── Form State ───
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    country: '',
    city: '',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // ─── Fetch categories ───
  useEffect(() => {
    getCategories()
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  // ─── Cleanup object URLs ───
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Field change ───
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ─── Image handling ───
  const addImages = useCallback(
    (files) => {
      const validFiles = Array.from(files).filter((f) =>
        ACCEPTED_TYPES.includes(f.type)
      );
      const remaining = MAX_IMAGES - images.length;
      const newFiles = validFiles.slice(0, remaining);

      if (newFiles.length === 0) return;

      const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
      setImages((prev) => [...prev, ...newFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);
      if (errors.images) setErrors((prev) => ({ ...prev, images: '' }));
    },
    [images.length, errors.images]
  );

  const removeImage = useCallback(
    (index) => {
      URL.revokeObjectURL(previews[index]);
      setImages((prev) => prev.filter((_, i) => i !== index));
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    },
    [previews]
  );

  // ─── Drag & Drop ───
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) addImages(e.dataTransfer.files);
  };

  // ─── Validation ───
  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    else if (formData.title.length > 100) errs.title = 'Title must be under 100 characters';
    if (!formData.description.trim()) errs.description = 'Tell us about your experience';
    if (!formData.categoryId) errs.categoryId = 'Select a category';
    if (!formData.country) errs.country = 'Select a country';
    if (images.length === 0) errs.images = 'Add at least one photo';
    return errs;
  };

  // ─── Submit ───
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const postData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        categoryId: Number(formData.categoryId),
        country: formData.country,
        city: formData.city.trim() || null,
      };
      const { data } = await createPost(postData, images);
      navigate(`/post/${data.id}`, { replace: true });
    } catch (err) {
      setErrors({
        submit:
          err.response?.data?.message ||
          'Failed to create experience. Please try again.',
      });
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-[Outfit] mb-2">
            Share Your <span className="gradient-text">Experience</span>
          </h1>
          <p className="text-muted">
            Tell the world about your travel adventure
          </p>
        </motion.div>

        {/* ─── Submit Error ─── */}
        <AnimatePresence>
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger"
            >
              {errors.submit}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ═══════════════════════════════════
              IMAGE UPLOAD
              ═══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <label className="block text-sm font-semibold text-foreground mb-3">
              Photos <span className="text-rose">*</span>
              <span className="text-faint font-normal ml-2">
                {images.length}/{MAX_IMAGES}
              </span>
            </label>

            {images.length === 0 ? (
              /* Empty drop zone */
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                  dragActive
                    ? 'border-accent bg-accent/5'
                    : errors.images
                    ? 'border-danger/40 bg-danger/5'
                    : 'border-line-light hover:border-accent/50 hover:bg-card'
                }`}
              >
                <CloudArrowUpIcon
                  className={`w-12 h-12 mb-4 ${
                    dragActive ? 'text-accent' : 'text-faint'
                  }`}
                />
                <p className="text-foreground font-medium mb-1">
                  {dragActive ? 'Drop images here' : 'Drag & drop your images'}
                </p>
                <p className="text-sm text-muted mb-3">or click to browse</p>
                <p className="text-xs text-faint">
                  JPEG, PNG, WebP · Max {MAX_IMAGES} images
                </p>
              </div>
            ) : (
              /* Image previews grid */
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {previews.map((src, i) => (
                  <motion.div
                    key={src}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-xl overflow-hidden group"
                  >
                    <img
                      src={src}
                      alt={`Upload ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-danger transition-all"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded-md">
                        Cover
                      </span>
                    )}
                  </motion.div>
                ))}

                {images.length < MAX_IMAGES && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className="aspect-square rounded-xl border-2 border-dashed border-line-light hover:border-accent/50 flex flex-col items-center justify-center text-faint hover:text-accent transition-colors"
                  >
                    <PlusIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs">Add</span>
                  </button>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              multiple
              onChange={(e) => addImages(e.target.files)}
              className="hidden"
            />

            {errors.images && (
              <p className="text-xs text-danger mt-2">{errors.images}</p>
            )}
          </motion.div>

          {/* ═══════════════════════════════════
              TITLE
              ═══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-semibold text-foreground mb-2">
              Title <span className="text-rose">*</span>
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="A breathtaking sunset in Santorini..."
              maxLength={100}
              className={`input-field ${errors.title ? '!border-danger' : ''}`}
            />
            <div className="flex justify-between mt-1.5">
              {errors.title ? (
                <p className="text-xs text-danger">{errors.title}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-faint">
                {formData.title.length}/100
              </span>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════
              DESCRIPTION
              ═══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-semibold text-foreground mb-2">
              Your Story <span className="text-rose">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about this experience. What made it special? What would you recommend to other travelers?"
              rows={8}
              className={`textarea-field ${
                errors.description ? '!border-danger' : ''
              }`}
            />
            {errors.description && (
              <p className="text-xs text-danger mt-1.5">
                {errors.description}
              </p>
            )}
          </motion.div>

          {/* ═══════════════════════════════════
              CATEGORY + LOCATION
              ═══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Category <span className="text-rose">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={`input-field !appearance-none ${
                  errors.categoryId ? '!border-danger' : ''
                } ${!formData.categoryId ? 'text-faint' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-danger mt-1.5">
                  {errors.categoryId}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Country <span className="text-rose">*</span>
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`input-field !appearance-none ${
                  errors.country ? '!border-danger' : ''
                } ${!formData.country ? 'text-faint' : ''}`}
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-xs text-danger mt-1.5">
                  {errors.country}
                </p>
              )}
            </div>
          </motion.div>

          {/* City */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="block text-sm font-semibold text-foreground mb-2">
              City{' '}
              <span className="text-faint font-normal text-xs">(optional)</span>
            </label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Kyoto, Santorini, Marrakech"
              className="input-field"
            />
          </motion.div>

          {/* ═══════════════════════════════════
              SUBMIT
              ═══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center gap-4"
          >
            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={submitting}
              leftIcon={PhotoIcon}
              className="sm:w-auto"
            >
              Share Experience
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => navigate(-1)}
              className="sm:w-auto"
            >
              Cancel
            </Button>
          </motion.div>
        </form>
      </div>
    </PageTransition>
  );
}
