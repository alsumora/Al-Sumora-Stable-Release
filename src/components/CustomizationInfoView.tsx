import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, FileText, Image as ImageIcon, Sparkle, Clock, HeartHandshake } from 'lucide-react';

interface CustomizationInfoViewProps {
  onNavigateToShop: () => void;
}

export const CustomizationInfoView: React.FC<CustomizationInfoViewProps> = ({
  onNavigateToShop,
}) => {
  return (
    <div className="w-full bg-[#fbf9f4] py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
        {/* Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0eee9] border border-[#d3c3be] text-[11px] font-semibold tracking-widest text-[#825425] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pure Leather Personalization</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#090100] tracking-tight">
            Customization & Engraving Info
          </h1>
          <p className="text-sm sm:text-base text-[#504440] max-w-2xl mx-auto leading-relaxed">
            Every Al Sumora pure leather article can be personalized to create a unique heirloom. Here is everything you need to know about how custom orders work, how they look, and the terms.
          </p>
        </div>

        {/* Step-by-Step Process */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#d3c3be]/70 shadow-xs space-y-6">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#090100]">
            How Customization Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-xl bg-[#fbf9f4] border border-[#d3c3be]/60 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#825425] text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-sm text-[#090100]">Name to Engrave</h3>
              <p className="text-xs text-[#504440] leading-relaxed">
                Provide the full name, initials, or custom text. We hot-stamp with precision brass typography directly into the full-grain leather.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fbf9f4] border border-[#d3c3be]/60 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#825425] text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-sm text-[#090100]">Placement & Notes</h3>
              <p className="text-xs text-[#504440] leading-relaxed">
                Choose the location (Corner, Front Center, Top Flap, or Inside Tag) and add any specific instructions in the description box.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#fbf9f4] border border-[#d3c3be]/60 space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#825425] text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-sm text-[#090100]">Reference Images</h3>
              <p className="text-xs text-[#504440] leading-relaxed">
                Attach reference photos, sketches, or sample typography so our craftspeople follow your exact vision.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Preview / Examples */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#d3c3be]/70 shadow-xs space-y-6">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-[#090100]">
            How the Finished Engraving Looks
          </h2>
          <p className="text-xs sm:text-sm text-[#504440]">
            Our leather craftsmen use heated brass dies to imprint your name permanently into the grain.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Visual Example Card 1 */}
            <div className="rounded-xl p-5 bg-[#090100] text-white flex flex-col justify-between h-44 relative overflow-hidden shadow-inner border border-[#3e2b24]">
              <div className="text-[10px] text-[#fdc087] uppercase tracking-widest font-semibold">
                Gold Foil Stamping • Example
              </div>
              <div className="self-end border border-[#f5d77f]/50 bg-[#090100]/80 backdrop-blur-xs px-3 py-1.5 rounded text-[#f5d77f] font-serif font-bold text-sm tracking-[0.2em] uppercase">
                A. K. SHARMA
              </div>
              <div className="text-[10px] text-[#d3c3be]">
                Sharp, crisp metallic 24K gold imprint on dark leather
              </div>
            </div>

            {/* Visual Example Card 2 */}
            <div className="rounded-xl p-5 bg-[#59392b] text-white flex flex-col justify-between h-44 relative overflow-hidden shadow-inner border border-[#825425]">
              <div className="text-[10px] text-[#fdc087] uppercase tracking-widest font-semibold">
                Blind Deboss (Plain) • Example
              </div>
              <div className="self-center border border-[#3a2016]/40 bg-[#3a2016]/60 backdrop-blur-xs px-4 py-2 rounded text-[#221009] font-serif font-bold text-base tracking-[0.25em] uppercase">
                VIKRAMADITYA
              </div>
              <div className="text-[10px] text-[#d3c3be]">
                Deep, rich heat-pressed natural indentation in the leather
              </div>
            </div>
          </div>
        </div>

        {/* Customization Terms & Conditions */}
        <div id="customization-terms" className="bg-white rounded-2xl p-6 sm:p-8 border border-[#825425]/40 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-[#825425]">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#090100]">
              Customization Terms & Conditions
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#504440] leading-relaxed divide-y divide-[#f0eee9]">
            <div className="pt-2 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#825425] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#090100] block mb-0.5">1. Accuracy of Name & Details</strong>
                <span>Please ensure the spelling of the name or initials is accurate. Once the engraving process begins, text modifications cannot be made.</span>
              </div>
            </div>

            <div className="pt-3 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#825425] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#090100] block mb-0.5">2. Non-Returnable Policy on Custom Items</strong>
                <span>Because customized products are crafted individually for you with personalized text and specifications, custom engraved items cannot be returned or exchanged unless there is a manufacturing defect or spelling error on our end.</span>
              </div>
            </div>

            <div className="pt-3 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#825425] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#090100] block mb-0.5">3. Handcrafting & Dispatch Time</strong>
                <span>Personalized items take an additional 1-2 working days for individual stamping, quality inspection, and finishing before dispatch. Express shipping across India is completely free.</span>
              </div>
            </div>

            <div className="pt-3 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#825425] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#090100] block mb-0.5">4. Reference Images & Feasibility</strong>
                <span>When you attach reference images, our craftsmen will match them as closely as possible within the physical stamping area of the selected leather product.</span>
              </div>
            </div>

            <div className="pt-3 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#825425] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#090100] block mb-0.5">5. Leather Authenticity</strong>
                <span>Each hide has natural grain characteristics and variations, making your personalized piece one-of-a-kind.</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA to Shop */}
        <div className="text-center pt-4">
          <button
            onClick={onNavigateToShop}
            className="inline-flex items-center gap-2 bg-[#090100] hover:bg-[#825425] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <span>Explore Collection & Customize</span>
            <ArrowRight className="w-4 h-4 text-[#fdc087]" />
          </button>
        </div>
      </div>
    </div>
  );
};
