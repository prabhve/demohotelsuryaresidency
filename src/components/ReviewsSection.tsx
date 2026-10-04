import React, { useState } from 'react';
import { initialReviews } from '../data/hotelData';
import { Review } from '../types/hotel';
import { Star, CheckCircle, Plus, Sparkles, X } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface ReviewsSectionProps {
  currentLang?: 'en' | 'hi';
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  // New review form state
  const [guestName, setGuestName] = useState('');
  const [guestLocation, setGuestLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [stayType, setStayType] = useState<
    'Business' | 'Family' | 'Solo' | 'Couple' | 'Banquet Event'
  >('Business');
  const [comment, setComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !comment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      guestName,
      guestLocation: guestLocation || 'Singrauli Guest',
      rating,
      date: 'Just now',
      stayType,
      comment,
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setShowAddReviewModal(false);
    setGuestName('');
    setGuestLocation('');
    setComment('');
  };

  return (
    <section id="reviews" className="py-20 bg-stone-900/60 border-t border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VERIFIED GUEST FEEDBACK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 tracking-tight">
              Trusted by Corporate Executives & Families
            </h2>
            <p className="mt-3 text-stone-400 text-sm sm:text-base leading-relaxed">
              Read authentic experiences from NTPC engineers, business consultants, and families who made Hotel Surya Residency their home in Singrauli.
            </p>
          </div>
        </ScrollReveal>

        {/* Overall Rating Banner */}
        <ScrollReveal delay={100} direction="up">
          <div className="mb-12 p-6 rounded-3xl bg-stone-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-5xl font-serif-luxury font-bold text-amber-400">
                4.2
              </div>
              <div>
                <div className="flex text-amber-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <h4 className="font-bold text-stone-100 text-sm sm:text-base">
                  Overall Guest Rating
                </h4>
                <p className="text-xs text-stone-400">
                  Based on 450+ Verified Google Reviews
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddReviewModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((rev, idx) => (
            <ScrollReveal key={rev.id} delay={idx * 75} direction="up">
              <div className="h-full rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl shadow-black/40">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-serif-luxury font-bold text-base text-stone-100">
                        {rev.guestName}
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">{rev.guestLocation}</p>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex text-amber-400">
                        {[...Array(Math.floor(rev.rating))].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-stone-500 mt-1">{rev.date}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="px-2.5 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-300 font-medium">
                    {rev.stayType} Stay
                  </span>
                  {rev.verified && (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Stay</span>
                    </span>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif-luxury font-bold text-lg text-stone-100">
                Share Your Stay Experience
              </h3>
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajeshwar Sharma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Your City / Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NTPC Consultant, Delhi"
                    value={guestLocation}
                    onChange={(e) => setGuestLocation(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Type of Stay
                  </label>
                  <select
                    value={stayType}
                    onChange={(e) => setStayType(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  >
                    <option value="Business">Business Trip</option>
                    <option value="Family">Family Vacation</option>
                    <option value="Couple">Couple Stay</option>
                    <option value="Banquet Event">Banquet / Wedding</option>
                    <option value="Solo">Solo Traveler</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Star Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-amber-400 font-bold ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Your Review & Comments *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about the room cleanliness, food at Surya Rasoi, power backup, or staff service..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
