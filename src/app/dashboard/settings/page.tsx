"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGES, LanguageCode } from "@/lib/i18n/translations";
import type { UserProfile } from "@/types/api";

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { language: currentLang, setLanguage: setGlobalLanguage, t } = useLanguage();

  const [name, setName] = useState("");
  const [language, setLanguageState] = useState<LanguageCode>(currentLang);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [timeZone, setTimeZone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [birthTimeKnown, setBirthTimeKnown] = useState(true);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [plan, setPlan] = useState("free");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          const u: UserProfile = data.user;
          setName(u.name || "");
          const userLang = (u.language as LanguageCode) || currentLang || "en";
          setLanguageState(userLang);
          setGlobalLanguage(userLang);
          setDateOfBirth(u.dateOfBirth || "");
          setTimeOfBirth(u.timeOfBirth || "");
          setPlaceOfBirth(u.placeOfBirth || "");
          setTimeZone(u.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
          setBirthTimeKnown(u.birthTimeKnown ?? true);
          setLatitude(u.latitude?.toString() || "");
          setLongitude(u.longitude?.toString() || "");
          setPlan(u.plan || "free");
        }
      })
      .catch(() => showToast("error", "Failed to load profile details"))
      .finally(() => setIsLoading(false));
  }, [showToast, currentLang, setGlobalLanguage]);

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    setGlobalLanguage(newLang);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          language,
          dateOfBirth: dateOfBirth || null,
          timeOfBirth: timeOfBirth || null,
          placeOfBirth: placeOfBirth || null,
          timeZone,
          birthTimeKnown,
          latitude: latitude === "" ? null : Number(latitude),
          longitude: longitude === "" ? null : Number(longitude),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to save profile");
        setIsSaving(false);
        return;
      }

      setGlobalLanguage(language);
      showToast("success", "Profile updated successfully!");
    } catch {
      showToast("error", "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      if (res.ok) {
        showToast("info", "Account deleted");
        router.push("/login");
      } else {
        const data = await res.json();
        showToast("error", data.error || "Failed to delete account");
      }
    } catch {
      showToast("error", "Network error during account deletion");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletePassword("");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-8 glass-card-l1 animate-pulse w-48 rounded-lg" />
        <div className="h-64 glass-card-l2 animate-pulse rounded-card" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gold-gradient tracking-[0.08em]">
          {t("settings.title", "Profile & Settings")}
        </h1>
        <p className="mt-1 text-text-muted text-sm font-sans">
          {t("settings.subtitle", "Manage your personal details, birth information, and subscription preferences.")}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Info Card */}
        <div className="glass-card-l2 rounded-card p-6 md:p-8 space-y-5 shadow-2xl">
          <h2 className="font-serif text-2xl font-bold text-text-primary border-b border-gold/15 pb-4">
            {t("settings.personalInfo", "Personal Information")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                {t("kundli.name", "Full Name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                {t("common.preferredLanguage", "Preferred Language")}
              </label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
                className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Birth Details Card */}
        <div className="glass-card-l2 rounded-card p-6 md:p-8 space-y-5 shadow-2xl">
          <h2 className="font-serif text-2xl font-bold text-text-primary border-b border-gold/15 pb-4">
            {t("settings.birthDetails", "Birth Details (For Kundli & Horoscope)")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                {t("kundli.dob", "Date of Birth")}
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                {t("kundli.tob", "Time of Birth")}
              </label>
              <input
                type="time"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                disabled={!birthTimeKnown}
                className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              />
              <label className="mt-2 flex items-center gap-2 text-xs text-text-muted normal-case tracking-normal">
                <input type="checkbox" checked={!birthTimeKnown} onChange={(event) => setBirthTimeKnown(!event.target.checked)} />
                Exact birth time is unknown
              </label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Birth timezone</label>
              <input
                type="text"
                value={timeZone}
                onChange={(event) => setTimeZone(event.target.value)}
                placeholder="Asia/Kolkata"
                className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Latitude</label>
              <input
                type="number"
                min="-90"
                max="90"
                step="any"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                placeholder="19.0760"
                className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Longitude</label>
              <input
                type="number"
                min="-180"
                max="180"
                step="any"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                placeholder="72.8777"
                className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                {t("kundli.pob", "Place of Birth")}
              </label>
              <input
                type="text"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                placeholder="e.g. Mumbai, India"
                className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Subscription Plan Card */}
        <div className="glass-card-l2 rounded-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 font-sans">
            <span className="text-xs text-text-muted uppercase tracking-widest font-semibold">
              {t("settings.activePlan", "Active Plan")}
            </span>
            <div className="font-serif text-3xl font-bold text-gold capitalize mt-1 tracking-wide">{plan} Plan</div>
            <p className="text-text-muted text-xs mt-1">
              {plan === "free" ? "Free tier with watermarked Kundli & basic predictions." : "Full premium access unlocked with unlimited AI chat."}
            </p>
          </div>
          <Link
            href="/dashboard/upgrade"
            className="shimmer-sweep bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold font-bold rounded-pill px-7 py-3 text-sm text-center transition-all shrink-0 shadow-[0_0_15px_rgba(243,198,105,0.15)]"
          >
            {t("dash.upgrade", "Manage Plan ✨")}
          </Link>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="shimmer-sweep bg-gold hover:bg-gold-light text-background font-bold text-sm px-9 py-3.5 rounded-pill transition-all active:scale-[0.97] disabled:opacity-50 shadow-[0_0_20px_rgba(243,198,105,0.25)]"
          >
            {isSaving ? t("common.saving", "Saving...") : t("common.save", "Save Changes")}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="glass-card-l2 border-red-500/30 rounded-card p-6 md:p-8 space-y-4 shadow-xl">
        <h3 className="font-serif text-xl font-bold text-red-400">{t("settings.dangerZone", "Danger Zone")}</h3>
        <p className="text-text-muted text-xs font-sans">
          Deleting your account will permanently remove all your saved Kundlis, predictions, and AI chat history.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-semibold px-5 py-2.5 rounded-xl transition-all font-sans"
        >
          {t("common.delete", "Delete Account")}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card-l3 rounded-card p-8 max-w-md w-full space-y-5 border-red-500/40 shadow-2xl animate-fade-slide-up">
            <h3 className="font-serif text-2xl font-bold text-text-primary">{t("common.delete", "Delete Account")}?</h3>
            <p className="text-text-muted text-sm font-sans leading-relaxed">
              Are you sure you want to delete your account? This action is permanent and cannot be undone.
            </p>
            <div>
              <label htmlFor="delete-password" className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Current password
              </label>
              <input
                id="delete-password"
                type="password"
                autoComplete="current-password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                className="w-full bg-[#05050B]/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-red-500/50"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 font-sans">
              <button
                type="button"
                onClick={() => { setShowDeleteModal(false); setDeletePassword(""); }}
                className="px-5 py-2.5 text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                {t("common.cancel", "Cancel")}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-lg"
              >
                {isDeleting ? t("common.deleting", "Deleting...") : t("common.confirm", "Confirm Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
