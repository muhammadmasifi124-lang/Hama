import React, { useState } from 'react';
import { X, Share2, PlusSquare, ExternalLink, Check, Smartphone, Tablet, Copy } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const standaloneUrl = 'https://ais-pre-swfpgogozo2m5sakowurpf-926243328196.europe-west2.run.app';

  const handleCopy = () => {
    navigator.clipboard.writeText(standaloneUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs text-right" dir="rtl">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E4E0D6] animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E4E0D6] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#2F6B5E]/10 text-[#2F6B5E] flex items-center justify-center shrink-0">
              <Tablet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg text-[#23291F]">خستنەسەر شاشەی ئایپاد (iPad)</h3>
              <p className="text-xs text-[#6B7263]">بۆ ئەوەی وەک ئەپڵیکەیشنێکی سەربەخۆ لە پۆل بەکاری بهێنیت</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7263] hover:text-[#23291F] p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-6">
          {/* Step 1 */}
          <div className="flex items-start gap-3 bg-[#FAF8F4] p-3.5 rounded-2xl border border-[#E4E0D6]">
            <div className="w-7 h-7 rounded-full bg-[#2F6B5E] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              ١
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-[#23291F] mb-1">کردنەوە لە وێبگەڕی سەفاری (Safari)</h4>
              <p className="text-xs text-[#6B7263] leading-relaxed mb-2.5">
                تکایە ئەم بەستەرە ڕاستەوخۆیە بکەرەوە لە تابی نوێی Safari:
              </p>
              
              <div className="bg-white p-2 rounded-xl border border-[#E4E0D6] flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono text-[#2F6B5E] truncate select-all ltr text-left flex-1 px-1">
                  {standaloneUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#23291F] rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#6B7263]" />}
                  <span>{copied ? 'کۆپیکرا' : 'کۆپیکردن'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={standaloneUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#2F6B5E] hover:bg-[#25574c] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>کلیک بکە بۆ کردنەوەی ڕاستەوخۆ لە Safari</span>
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 bg-[#FAF8F4] p-3.5 rounded-2xl border border-[#E4E0D6]">
            <div className="w-7 h-7 rounded-full bg-[#2F6B5E] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              ٢
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-[#23291F] mb-1">داگرتنی دوگمەی هاوبەشکردن (Share)</h4>
              <p className="text-xs text-[#6B7263] leading-relaxed">
                لە بەشی سەرەوەی وێبگەڕی سەفاری لە ئایپادەکەتدا، کرتە لەسەر دوگمەی هاوبەشکردن <span className="inline-flex items-center px-1.5 py-0.5 bg-white border border-[#E4E0D6] rounded text-emerald-800 font-bold mx-1">
                  <Share2 className="w-3.5 h-3.5 inline ml-1 text-[#2F6B5E]" />
                  (چوارگۆشە بە تیر بەرەو سەرەوە)
                </span> بکە.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 bg-[#FAF8F4] p-3.5 rounded-2xl border border-[#E4E0D6]">
            <div className="w-7 h-7 rounded-full bg-[#2F6B5E] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              ٣
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-[#23291F] mb-1">هەڵبژاردنی "Add to Home Screen"</h4>
              <p className="text-xs text-[#6B7263] leading-relaxed">
                لە لیستەکەدا کەمێک بەرەو خوارەوە بڕۆ و کرتە لەسەر <span className="inline-flex items-center px-1.5 py-0.5 bg-white border border-[#E4E0D6] rounded text-emerald-800 font-bold mx-1">
                  <PlusSquare className="w-3.5 h-3.5 inline ml-1 text-[#2F6B5E]" />
                  Add to Home Screen
                </span> (یان بە عەرەبی "إضافة إلى الصفحة الرئيسية") بکە.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              ٤
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm text-emerald-900 mb-1">داگرتنی دوگمەی Add (زیادکردن)</h4>
              <p className="text-xs text-emerald-800/90 leading-relaxed">
                لە گۆشەی سەرەوەی لای ڕاست داگرە لەسەر <strong>Add</strong>. ئێستا ئایکۆنی تایبەتی <strong>"تۆماری نمرە"</strong> دەچێتە سەر شاشەی سەرەکی ئایپادەکەت وەک ئەپێک، و کاتێک دەیکەیتەوە تەواوی شاشەکە بە شێوەیەکی گەورە و خێرا بەبێ هیچ تێکچوونێک کاردەکات!
              </p>
            </div>
          </div>
        </div>

        {/* Benefits badge */}
        <div className="bg-[#FAF8F4] p-3 rounded-xl border border-[#E4E0D6] text-xs text-[#6B7263] mb-5">
          <span className="font-bold text-[#23291F]">سوودەکانی لە پۆلدا:</span> دەتوانیت بەبێ هێڵی ئینتەرنێتیش بەکاریبهێنیت، لە شاشەی تەواو (Full Screen) دەکرێتەوە و لە کاتی نمرە داناندا پەڕەکە ڕاناگیرێت.
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#2F6B5E] hover:bg-[#25574c] text-white font-bold rounded-2xl shadow-sm text-xs transition cursor-pointer"
        >
          تێگەیشتم، زۆر سوپاس
        </button>
      </div>
    </div>
  );
};
