import React, { useState } from 'react';
import { initialReviews } from '../data/hotelData';
import { Review } from '../types/hotel';
import { Star, MessageSquareQuote, CheckCircle, Plus, Sparkles, X, ThumbsUp } from 'lucide-react';

interface ReviewsSectionProps {
  currentLang: 'en' | 'hi';
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ currentLang }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  // New review form
  const [guestName, setGuestName] = useState('');
  const [guestLocation, setGuestLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [stayType, setStayType] = useState<'Business' | 'Family' | 'Solo' | 'Couple' | 'Banquet Event'>('Business');
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

  const t = {
    en: {
      subtitle: 'VERIFIED GUEST FEEDBACK',
      title: 'Trusted by Corporate Executives & Families',
      desc: 'Read authentic experiences from NTPC engineers, business consultants, and families who made Hotel Surya Residency their home in Singrauli.',
      overallRating: 'Overall Guest Rating',
      basedOn: 'Based on 450+ Verified Google Reviews',
      writeReviewBtn: 'Write a Review',
      modalTitle: 'Share Your Stay Experience',
    },
    hi: {
      subtitle: 'सत्यापित अतिथि समीक्षाएं',
      title: 'व्यापारिक अधिकारियों व परिवारों का विश्वास',
      desc: 'एनटीपीसी इंजीनियरों, कॉरपोरेट अधिकारियों और परिवारों के वास्तविक अनुभव पढ़ें।',
      overallRating: 'समग्र अतिथि रेटिंग',
      basedOn: '450+ सत्यापित गूगल समीक्षाओं पर आधारित',
      writeReviewBtn: 'समीक्षा लिखें',
      modalTitle: 'अपना अनुभव साझा करें',
    },
  }[currentLang];

  return (
    <section id="reviews" className="py-20 bg-stone-900/60 border-t border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {t.subtitle}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-stone-100 tracking-tight">
            {t.title}
          </h2>
          <p className="mt-3 text-stone-400 text-sm sm:text-base leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Rating Summary Bar */}
        <div className="max-w-4xl mx-auto mb-12 p-6 rounded-3xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="text-4xl sm:text-5xl font-serif-luxury font-bold text-amber-400">
              4.2
            </div>
            <div>
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs font-bold text-stone-200 mt-1">{t.overallRating}</p>
              <p className="text-[11px] text-stone-400">{t.basedOn}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddReviewModal(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.writeReviewBtn}</span>
            </button>

            <a
              href="https://www.google.com/maps/place/Hotel+Surya+Residency/@24.0811013,82.6596934,187m"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-500/40 text-stone-300 text-xs font-bold transition-colors"
            >
              Google Maps Reviews ↗
            </a>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-stone-950 border border-stone-800 flex flex-col justify-between hover:border-amber-500/40 transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(Math.floor(rev.rating))].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-amber-300 text-[10px] font-bold border border-stone-800">
                    {rev.stayType} Stay
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-stone-200">{rev.guestName}</h4>
                  <p className="text-[10px] text-stone-400">{rev.guestLocation} • {rev.date}</p>
                </div>
                {rev.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Stay</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif-luxury font-bold text-lg text-stone-100">
                {t.modalTitle}
              </h3>
              <button
                onClick={() => setShowAddReviewModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100"
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
                  placeholder="e.g. Anand Srivastava"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  City / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. NTPC Consultant / Varanasi"
                  value={guestLocation}
                  onChange={(e) => setGuestLocation(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Rating (1 to 5 Stars)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value, 10))}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3/5 Good)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Stay Type
                  </label>
                  <select
                    value={stayType}
                    onChange={(e) => setStayType(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                  >
                    <option value="Business">Business (NTPC/NCL)</option>
                    <option value="Family">Family Vacation</option>
                    <option value="Couple">Couple</option>
                    <option value="Solo">Solo Traveler</option>
                    <option value="Banquet Event">Banquet / Marriage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Your Feedback *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about room cleanliness, food taste, staff behavior..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 outline-none"
                ></textarea>
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
                  className="px-6 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
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
