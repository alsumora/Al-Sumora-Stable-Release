import React from 'react';
import { HERITAGE_IMAGES } from '../data/products';
import { Award, ShieldCheck, Sparkles, Clock, Globe, Heart } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Header */}
      <section className="bg-[#2c1810] text-white py-20 border-b border-[#825425]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#fdc087]">
            HANDCRAFTED LUXURY LEATHER • EST. 1984
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#fbf9f4]">
            Preserving the Soul of Fine Leathercraft
          </h1>
          <p className="text-sm sm:text-base text-[#d3c3be] leading-relaxed">
            For four decades, Al Sumora has remained dedicated to uncompromising saddlery traditions, organic vegetable tanning, and hand saddle-stitching—now proudly launching across India with pan-India express delivery, and expanding worldwide.
          </p>
        </div>
      </section>

      {/* Story & Workshop Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#825425]">
              Mastery in Every Stitch
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#090100] leading-tight">
              An Unhurried Process of Perfection
            </h2>
            <p className="text-xs sm:text-sm text-[#504440] leading-relaxed">
              In an era of mass industrial automation, Al Sumora stands firmly behind slow craftsmanship. A single Executive Briefcase requires over 36 hours of individual artisan labor—from precision hand-cutting with a bone knife to edge burnishing with natural beeswax.
            </p>
            <p className="text-xs sm:text-sm text-[#504440] leading-relaxed">
              We select fewer than 3% of full-grain hides from certified premium tanneries, ensuring every piece possesses unique grain character, exceptional tensile strength, and the ability to age into a glorious golden patina.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#d3c3be]/40 text-xs text-[#090100]">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#825425]" />
                <div>
                  <div className="font-bold">36+ Hours</div>
                  <div className="text-[10px] text-[#827470]">Hand Labor Per Bag</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#825425]" />
                <div>
                  <div className="font-bold">100% Organic</div>
                  <div className="text-[10px] text-[#827470]">Vegetable Tanned Hides</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src={HERITAGE_IMAGES.stitching}
              alt="Artisan hand-stitching leather with two needles"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover rounded-xl shadow-md border border-[#d3c3be]/40"
            />
            <img
              src={HERITAGE_IMAGES.tools}
              alt="Authentic leathercraft tools and brass hardware"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover rounded-xl shadow-md border border-[#d3c3be]/40 mt-8"
            />
          </div>
        </div>
      </section>

      {/* The Al Sumora Philosophy Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#825425]">
            Our Pillars
          </span>
          <h2 className="font-display font-bold text-3xl text-[#090100] mt-1">
            The House Philosophy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-xl border border-[#d3c3be]/40 space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#f0eee9] flex items-center justify-center text-[#825425]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#090100]">1. Vegetable Tanning</h3>
            <p className="text-xs text-[#504440] leading-relaxed">
              We exclusively utilize traditional vegetable tanning using natural tree barks (chestnut, mimosa, oak). Zero toxic chemicals—pure eco-friendly craftsmanship.
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl border border-[#d3c3be]/40 space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#f0eee9] flex items-center justify-center text-[#825425]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#090100]">2. Saddle Stitching</h3>
            <p className="text-xs text-[#504440] leading-relaxed">
              Every seam is sewn using traditional two-needle saddle stitching with waxed linen thread. If one thread ever severs, the other holds firmly intact.
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl border border-[#d3c3be]/40 space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#f0eee9] flex items-center justify-center text-[#825425]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#090100]">3. The Living Patina</h3>
            <p className="text-xs text-[#504440] leading-relaxed">
              Full-grain leather absorbs sunlight, ambient oils, and life experiences, deepening into a rich luster that becomes uniquely yours over time.
            </p>
          </div>
        </div>
      </section>

      {/* Artisan Portrait Showcase */}
      <section className="bg-[#f5f3ee] py-16 border-y border-[#d3c3be]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <img
              src={HERITAGE_IMAGES.artisan}
              alt="Master Artisan inspecting raw hide"
              referrerPolicy="no-referrer"
              className="w-full h-96 object-cover rounded-xl shadow-xl border border-[#d3c3be]/60"
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#825425]">
              Hands of Tradition
            </span>
            <h2 className="font-display font-bold text-3xl text-[#090100]">
              Meet Our Master Artisans
            </h2>
            <p className="text-xs sm:text-sm text-[#504440] leading-relaxed">
              "When you hold an Al Sumora leather creation, you are touching decades of passed-down craftsmanship and dedication to perfection in every stitch."
            </p>
            <div className="pt-2 text-xs font-serif font-bold text-[#825425]">
              — Master Artisan, Al Sumora Leather Studio
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
