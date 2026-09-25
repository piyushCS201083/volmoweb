/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Newspaper,
  Image as ImageIcon,
  Video,
  Briefcase,
  Calculator,
  Plus,
  Trash2,
  Edit3,
  Save,
  Undo2,
  Check,
  X,
  Sparkles,
  Calendar,
  User,
  Clock,
  Tag,
  ArrowRight,
  ExternalLink,
  Layers,
  Search,
  Fuel,
  IndianRupee,
  Copy,
} from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useSiteConfig } from "../../SiteConfigContext";
import {
  MediaArticle,
  CompanyPhoto,
  CompanyVideo,
  CareerOpening,
  MediaBlogsPageConfig,
} from "../../types";
import { DEFAULT_MEDIA_BLOGS_PAGE_CONFIG } from "../../data/mediaBlogsData";

interface MediaBlogsCMSProps {
  onShowToast: (msg: string) => void;
}

export default function MediaBlogsCMS({ onShowToast }: MediaBlogsCMSProps) {
  const {
    mediaArticlesData,
    companyPhotosData,
    companyVideosData,
    careerOpeningsData,
    mediaBlogsPageConfig,
    updateMediaArticles,
    updateSingleMediaArticle,
    addMediaArticle,
    deleteMediaArticle,
    updateCompanyPhotos,
    updateSingleCompanyPhoto,
    addCompanyPhoto,
    deleteCompanyPhoto,
    updateCompanyVideos,
    updateSingleCompanyVideo,
    addCompanyVideo,
    deleteCompanyVideo,
    updateCareerOpenings,
    updateSingleCareerOpening,
    addCareerOpening,
    deleteCareerOpening,
    updateMediaBlogsPageConfig,
  } = useSiteConfig();

  const [activeSubTab, setActiveSubTab] = useState<
    "articles" | "photos" | "videos" | "careers" | "settings"
  >("articles");

  // Search & category filters
  const [articleSearch, setArticleSearch] = useState("");
  const [articleCategoryFilter, setArticleCategoryFilter] = useState<string>("all");

  // Modal editing states
  const [editingArticle, setEditingArticle] = useState<MediaArticle | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);

  const [editingPhoto, setEditingPhoto] = useState<CompanyPhoto | null>(null);
  const [isNewPhoto, setIsNewPhoto] = useState(false);

  const [editingVideo, setEditingVideo] = useState<CompanyVideo | null>(null);
  const [isNewVideo, setIsNewVideo] = useState(false);

  const [editingCareer, setEditingCareer] = useState<CareerOpening | null>(null);
  const [isNewCareer, setIsNewCareer] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<MediaBlogsPageConfig>(
    mediaBlogsPageConfig || DEFAULT_MEDIA_BLOGS_PAGE_CONFIG
  );

  // Sync settingsForm if mediaBlogsPageConfig changes externally
  React.useEffect(() => {
    if (mediaBlogsPageConfig) {
      setSettingsForm(mediaBlogsPageConfig);
    }
  }, [mediaBlogsPageConfig]);

  // ==========================================
  // ARTICLE HANDLERS
  // ==========================================
  const handleStartCreateArticle = () => {
    const newArt: MediaArticle = {
      id: `article-${Date.now()}`,
      category: "News",
      title: "New Volmo Electric Announcement",
      summary: "Short summary highlighting the news, breakthrough, or event...",
      content:
        "Detailed report describing the milestone, technological advancement, customer impact, and company vision for clean green urban transit.",
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      author: "Volmo Corporate Communications",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
      tag: "Announcement",
    };
    setEditingArticle(newArt);
    setIsNewArticle(true);
  };

  const handleSaveArticle = () => {
    if (!editingArticle) return;
    if (!editingArticle.title.trim()) {
      alert("Article title cannot be empty.");
      return;
    }

    if (isNewArticle) {
      addMediaArticle(editingArticle);
      onShowToast("New article published successfully!");
    } else {
      updateSingleMediaArticle(editingArticle.id, editingArticle);
      onShowToast("Article updated in real time!");
    }
    setEditingArticle(null);
    setIsNewArticle(false);
  };

  const handleDuplicateArticle = (article: MediaArticle) => {
    const copy: MediaArticle = {
      ...article,
      id: `article-${Date.now()}`,
      title: `${article.title} (Copy)`,
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
    addMediaArticle(copy);
    onShowToast("Article duplicated!");
  };

  // ==========================================
  // PHOTO HANDLERS
  // ==========================================
  const handleStartCreatePhoto = () => {
    const newPh: CompanyPhoto = {
      id: `photo-${Date.now()}`,
      title: "State-of-the-Art Plant View",
      caption: "High-precision testing checkpoint ensuring zero-defect electric scooter deliveries.",
      category: "Manufacturing",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
    setEditingPhoto(newPh);
    setIsNewPhoto(true);
  };

  const handleSavePhoto = () => {
    if (!editingPhoto) return;
    if (!editingPhoto.title.trim()) {
      alert("Photo title cannot be empty.");
      return;
    }

    if (isNewPhoto) {
      addCompanyPhoto(editingPhoto);
      onShowToast("New photo added to media gallery!");
    } else {
      updateSingleCompanyPhoto(editingPhoto.id, editingPhoto);
      onShowToast("Photo details updated!");
    }
    setEditingPhoto(null);
    setIsNewPhoto(false);
  };

  // ==========================================
  // VIDEO HANDLERS
  // ==========================================
  const handleStartCreateVideo = () => {
    const newVid: CompanyVideo = {
      id: `video-${Date.now()}`,
      title: "Volmo Electric Walkaround & Feature Spotlight",
      description: "Exclusive deep-dive tour of our high-torque BLDC powertrain and smart digital cockpit.",
      duration: "3:30 mins",
      thumbnailUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
      videoUrl: "https://youtube.com/@volmoelectrical",
      category: "Engineering",
    };
    setEditingVideo(newVid);
    setIsNewVideo(true);
  };

  const handleSaveVideo = () => {
    if (!editingVideo) return;
    if (!editingVideo.title.trim()) {
      alert("Video title cannot be empty.");
      return;
    }

    if (isNewVideo) {
      addCompanyVideo(editingVideo);
      onShowToast("New video tour added!");
    } else {
      updateSingleCompanyVideo(editingVideo.id, editingVideo);
      onShowToast("Video tour updated!");
    }
    setEditingVideo(null);
    setIsNewVideo(false);
  };

  // ==========================================
  // CAREER HANDLERS
  // ==========================================
  const handleStartCreateCareer = () => {
    const newJob: CareerOpening = {
      id: `job-${Date.now()}`,
      title: "Senior EV Systems Engineer",
      department: "Engineering & R&D",
      location: "Jaipur Plant, Rajasthan",
      type: "Full-Time",
      experience: "3-6 Years",
      summary: "Lead our next-generation electric scooter powertrain architecture and BMS thermal safety verification.",
      keySkills: ["EV Powertrain", "BMS Calibration", "CAN/UART", "Quality Assurance"],
      responsibilities: [
        "Architect and test high-efficiency controller algorithms and regenerative braking curves.",
        "Oversee bench dynamometer testing under extreme Indian temperature conditions.",
        "Collaborate with battery chemistry experts on cell safety and IP67 waterproof standards.",
      ],
      badge: "Urgent Opening",
    };
    setEditingCareer(newJob);
    setIsNewCareer(true);
  };

  const handleSaveCareer = () => {
    if (!editingCareer) return;
    if (!editingCareer.title.trim()) {
      alert("Job title cannot be empty.");
      return;
    }

    if (isNewCareer) {
      addCareerOpening(editingCareer);
      onShowToast("New career opening posted!");
    } else {
      updateSingleCareerOpening(editingCareer.id, editingCareer);
      onShowToast("Career opening updated!");
    }
    setEditingCareer(null);
    setIsNewCareer(false);
  };

  // ==========================================
  // SETTINGS HANDLER
  // ==========================================
  const handleSaveSettings = () => {
    updateMediaBlogsPageConfig(settingsForm);
    onShowToast("Media, Blogs & Calculator settings saved in real time!");
  };

  // Filtered articles
  const filteredArticles = mediaArticlesData.filter((art) => {
    const matchCat =
      articleCategoryFilter === "all" ||
      art.category.toLowerCase() === articleCategoryFilter.toLowerCase();
    const matchQuery =
      articleSearch.trim() === "" ||
      art.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.summary.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.author.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.tag.toLowerCase().includes(articleSearch.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 text-white">
      {/* Sub-Header & Navigation */}
      <div className="p-6 pb-4 bg-slate-900 border-b border-slate-800 space-y-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase tracking-wider text-white">
                Media, Blogs &amp; EV Calculator CMS
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Real-Time Reactive
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit news articles, factory photos, road test video walkarounds, career postings, and live EV savings calculator metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeSubTab === "articles" && (
              <button
                type="button"
                onClick={handleStartCreateArticle}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Plus size={14} />
                <span>Publish New Article</span>
              </button>
            )}
            {activeSubTab === "photos" && (
              <button
                type="button"
                onClick={handleStartCreatePhoto}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Gallery Photo</span>
              </button>
            )}
            {activeSubTab === "videos" && (
              <button
                type="button"
                onClick={handleStartCreateVideo}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Video Tour</span>
              </button>
            )}
            {activeSubTab === "careers" && (
              <button
                type="button"
                onClick={handleStartCreateCareer}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Plus size={14} />
                <span>Post Job Opening</span>
              </button>
            )}
            {activeSubTab === "settings" && (
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Save size={14} />
                <span>Save All Settings</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tabs Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {[
            {
              id: "articles",
              label: "Articles & News",
              icon: Newspaper,
              count: mediaArticlesData.length,
            },
            {
              id: "photos",
              label: "Company Photos",
              icon: ImageIcon,
              count: companyPhotosData.length,
            },
            {
              id: "videos",
              label: "Video Tours",
              icon: Video,
              count: companyVideosData.length,
            },
            {
              id: "careers",
              label: "Careers & Openings",
              icon: Briefcase,
              count: careerOpeningsData.length,
            },
            {
              id: "settings",
              label: "Calculator & Page Config",
              icon: Calculator,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? "bg-emerald-400 text-slate-950 font-black"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* ==================================================== */}
        {/* TAB 1: ARTICLES & BLOGS                              */}
        {/* ==================================================== */}
        {activeSubTab === "articles" && (
          <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  placeholder="Search articles by title, tag, author..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-slate-700 placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={articleCategoryFilter}
                  onChange={(e) => setArticleCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Categories ({mediaArticlesData.length})</option>
                  <option value="News">News</option>
                  <option value="Press Release">Press Release</option>
                  <option value="Tech Blog">Tech Blog</option>
                  <option value="Event">Event</option>
                </select>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col transition-all group shadow-sm"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold bg-slate-900/90 backdrop-blur-sm text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                        {art.category}
                      </span>
                      {art.tag && (
                        <span className="text-[10px] font-mono bg-slate-900/90 backdrop-blur-sm text-slate-300 px-2 py-0.5 rounded-full">
                          #{art.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-500" />
                          {art.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-500" />
                          {art.readTime}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {art.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                        By {art.author}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDuplicateArticle(art)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Duplicate Article"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingArticle({ ...art });
                            setIsNewArticle(false);
                          }}
                          className="p-1.5 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete article "${art.title}"?`)) {
                              deleteMediaArticle(art.id);
                              onShowToast("Article deleted.");
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: COMPANY PHOTOS                                */}
        {/* ==================================================== */}
        {activeSubTab === "photos" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {companyPhotosData.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-mono font-bold bg-slate-900/90 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {photo.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{photo.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{photo.caption}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                      <span>{photo.date}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPhoto({ ...photo });
                            setIsNewPhoto(false);
                          }}
                          className="p-1 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete photo "${photo.title}"?`)) {
                              deleteCompanyPhoto(photo.id);
                              onShowToast("Photo removed from media gallery.");
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: VIDEO TOURS                                   */}
        {/* ==================================================== */}
        {activeSubTab === "videos" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {companyVideosData.map((vid) => (
                <div
                  key={vid.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-mono font-bold bg-slate-900/90 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                        {vid.category}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white flex items-center gap-1">
                      <Clock size={10} />
                      {vid.duration}
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{vid.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{vid.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                      <span className="text-slate-500 font-mono text-[10px] truncate max-w-[140px]">
                        {vid.videoUrl ? "Custom Link" : "YouTube"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingVideo({ ...vid });
                            setIsNewVideo(false);
                          }}
                          className="p-1 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete video "${vid.title}"?`)) {
                              deleteCompanyVideo(vid.id);
                              onShowToast("Video tour deleted.");
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: CAREER OPENINGS                               */}
        {/* ==================================================== */}
        {activeSubTab === "careers" && (
          <div className="space-y-4">
            <div className="space-y-3">
              {careerOpeningsData.map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{job.title}</h4>
                      {job.badge && (
                        <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                          {job.badge}
                        </span>
                      )}
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                        {job.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span>Dept: <strong className="text-slate-200">{job.department}</strong></span>
                      <span>Loc: <strong className="text-slate-200">{job.location}</strong></span>
                      <span>Exp: <strong className="text-emerald-400">{job.experience}</strong></span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{job.summary}</p>

                    {job.keySkills && job.keySkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.keySkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-md"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCareer({ ...job });
                        setIsNewCareer(false);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete opening "${job.title}"?`)) {
                          deleteCareerOpening(job.id);
                          onShowToast("Career opening removed.");
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="Delete Opening"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: CALCULATOR & PAGE CONFIG                      */}
        {/* ==================================================== */}
        {activeSubTab === "settings" && (
          <div className="space-y-6 max-w-4xl">
            {/* Hero Header Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold block border-b border-slate-800 pb-2">
                1. Page Hero Banner &amp; Headline
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Top Highlight Pill Badge
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroBadge}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Main Hero Title
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Hero Subtitle Narrative
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Savings Calculator Parameters */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold block border-b border-slate-800 pb-2">
                2. Live EV Savings Calculator Economics
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Calculator Section Title
                  </label>
                  <input
                    type="text"
                    value={settingsForm.calculatorTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, calculatorTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Calculator Badge
                  </label>
                  <input
                    type="text"
                    value={settingsForm.calculatorBadge}
                    onChange={(e) => setSettingsForm({ ...settingsForm, calculatorBadge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Calculator Subtitle
                  </label>
                  <input
                    type="text"
                    value={settingsForm.calculatorSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, calculatorSubtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="space-y-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <label className="text-xs text-emerald-400 font-bold uppercase tracking-wider block flex items-center justify-between">
                    <span>Volmo Cost / KM (₹)</span>
                    <span className="font-mono text-[10px] text-slate-400">Sub-10 paise guaranteed</span>
                  </label>
                  <input
                    type="number"
                    step="0.005"
                    min="0.05"
                    max="0.5"
                    value={settingsForm.volmoCostPerKm}
                    onChange={(e) => setSettingsForm({ ...settingsForm, volmoCostPerKm: parseFloat(e.target.value) || 0.085 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    e.g. 0.085 = 8.5 paise per km.
                  </span>
                </div>

                <div className="space-y-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                    Default Daily Commute (KM)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="150"
                    value={settingsForm.defaultDailyKm}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultDailyKm: parseInt(e.target.value) || 30 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white"
                  />
                </div>

                <div className="space-y-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                    Default Petrol Price (₹/L)
                  </label>
                  <input
                    type="number"
                    min="80"
                    max="150"
                    value={settingsForm.defaultPetrolPrice}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultPetrolPrice: parseFloat(e.target.value) || 105 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white"
                  />
                </div>

                <div className="space-y-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                    Default Petrol Mileage (KM/L)
                  </label>
                  <input
                    type="number"
                    min="25"
                    max="65"
                    value={settingsForm.defaultPetrolMileage}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultPetrolMileage: parseFloat(e.target.value) || 40 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white"
                  />
                </div>

                <div className="space-y-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                    Default Electricity Tariff (₹/Unit)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="4"
                    max="15"
                    value={settingsForm.defaultElecRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultElecRate: parseFloat(e.target.value) || 7.0 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white"
                  />
                </div>

                <div className="space-y-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                    Annual Maintenance Saved (₹)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max="20000"
                    value={settingsForm.annualMaintenanceSaved}
                    onChange={(e) => setSettingsForm({ ...settingsForm, annualMaintenanceSaved: parseInt(e.target.value) || 4200 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white"
                  />
                </div>
              </div>
            </div>

            {/* Careers Section Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold block border-b border-slate-800 pb-2">
                3. Careers Section Narrative
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Careers Section Badge
                  </label>
                  <input
                    type="text"
                    value={settingsForm.careersBadge}
                    onChange={(e) => setSettingsForm({ ...settingsForm, careersBadge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Careers Section Title
                  </label>
                  <input
                    type="text"
                    value={settingsForm.careersTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, careersTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Careers Section Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.careersSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, careersSubtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSettingsForm(DEFAULT_MEDIA_BLOGS_PAGE_CONFIG)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                Reset to Factory Defaults
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer"
              >
                <Save size={14} />
                <span>Save All Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* MODAL 1: EDIT / CREATE ARTICLE                       */}
      {/* ==================================================== */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Newspaper size={16} className="text-emerald-400" />
                <span>{isNewArticle ? "Publish New Article" : "Edit Article"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="e.g. Volmo Electric Crosses 10,000+ Zero-Emission Scooters on Indian Roads"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Category
                  </label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="News">News</option>
                    <option value="Press Release">Press Release</option>
                    <option value="Tech Blog">Tech Blog</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Tag / Badge
                  </label>
                  <input
                    type="text"
                    value={editingArticle.tag}
                    onChange={(e) => setEditingArticle({ ...editingArticle, tag: e.target.value })}
                    placeholder="e.g. Milestone, Tech"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={editingArticle.readTime}
                    onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                    placeholder="e.g. 4 min read"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Date
                  </label>
                  <input
                    type="text"
                    value={editingArticle.date}
                    onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                    placeholder="e.g. September 2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Author / Desk
                  </label>
                  <input
                    type="text"
                    value={editingArticle.author}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    placeholder="e.g. Volmo Corporate Communications"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Short Summary (Shown in card)
                </label>
                <textarea
                  rows={2}
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  placeholder="Summary blurb..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Full Article Content
                </label>
                <textarea
                  rows={6}
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  placeholder="Write the full news article or blog post here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-sans leading-relaxed"
                />
              </div>

              {/* Image Uploader */}
              <ImageUploader
                label="Article Cover Photo"
                value={editingArticle.image}
                onChange={(newVal) => setEditingArticle({ ...editingArticle, image: newVal })}
                helperText="Upload or choose from presets"
                aspectRatio="video"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveArticle}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {isNewArticle ? "Publish Article" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: EDIT / CREATE PHOTO                         */}
      {/* ==================================================== */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={16} className="text-emerald-400" />
                <span>{isNewPhoto ? "Add New Photo" : "Edit Photo"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Photo Title *
                </label>
                <input
                  type="text"
                  value={editingPhoto.title}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  placeholder="e.g. High-Precision Robotic Chassis Welding Plant"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Category
                  </label>
                  <select
                    value={editingPhoto.category}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Showroom">Showroom</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Date
                  </label>
                  <input
                    type="text"
                    value={editingPhoto.date}
                    onChange={(e) => setEditingPhoto({ ...editingPhoto, date: e.target.value })}
                    placeholder="e.g. August 2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Caption
                </label>
                <textarea
                  rows={2}
                  value={editingPhoto.caption}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                  placeholder="Description of the photo..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              {/* Image Uploader */}
              <ImageUploader
                label="Photo Image"
                value={editingPhoto.imageUrl}
                onChange={(newVal) => setEditingPhoto({ ...editingPhoto, imageUrl: newVal })}
                aspectRatio="video"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {isNewPhoto ? "Add Photo" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: EDIT / CREATE VIDEO                         */}
      {/* ==================================================== */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Video size={16} className="text-cyan-400" />
                <span>{isNewVideo ? "Add Video Tour" : "Edit Video Tour"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingVideo(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  placeholder="e.g. Inside the Volmo Factory: Frame Rigidity Test"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Category
                  </label>
                  <select
                    value={editingVideo.category}
                    onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Road Test">Road Test</option>
                    <option value="Walkaround">Walkaround</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingVideo.duration}
                    onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    placeholder="e.g. 4:15 mins"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Video URL / YouTube Link (Optional)
                </label>
                <input
                  type="text"
                  value={editingVideo.videoUrl || ""}
                  onChange={(e) => setEditingVideo({ ...editingVideo, videoUrl: e.target.value })}
                  placeholder="e.g. https://youtube.com/@volmoelectrical"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingVideo.description}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  placeholder="What happens in this video..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              {/* Thumbnail Uploader */}
              <ImageUploader
                label="Video Thumbnail"
                value={editingVideo.thumbnailUrl}
                onChange={(newVal) => setEditingVideo({ ...editingVideo, thumbnailUrl: newVal })}
                aspectRatio="video"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingVideo(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveVideo}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {isNewVideo ? "Add Video" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 4: EDIT / CREATE CAREER OPENING                */}
      {/* ==================================================== */}
      {editingCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase size={16} className="text-emerald-400" />
                <span>{isNewCareer ? "Post New Opening" : "Edit Job Opening"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingCareer(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Job Position Title *
                </label>
                <input
                  type="text"
                  value={editingCareer.title}
                  onChange={(e) => setEditingCareer({ ...editingCareer, title: e.target.value })}
                  placeholder="e.g. EV Powertrain Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Department
                  </label>
                  <input
                    type="text"
                    value={editingCareer.department}
                    onChange={(e) => setEditingCareer({ ...editingCareer, department: e.target.value })}
                    placeholder="e.g. Manufacturing & Production"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingCareer.location}
                    onChange={(e) => setEditingCareer({ ...editingCareer, location: e.target.value })}
                    placeholder="e.g. Jaipur Plant, Rajasthan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Job Type
                  </label>
                  <select
                    value={editingCareer.type}
                    onChange={(e) => setEditingCareer({ ...editingCareer, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={editingCareer.experience}
                    onChange={(e) => setEditingCareer({ ...editingCareer, experience: e.target.value })}
                    placeholder="e.g. 2-5 Years"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Highlight Badge
                  </label>
                  <input
                    type="text"
                    value={editingCareer.badge || ""}
                    onChange={(e) => setEditingCareer({ ...editingCareer, badge: e.target.value })}
                    placeholder="e.g. Urgent Opening"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Role Summary
                </label>
                <textarea
                  rows={2}
                  value={editingCareer.summary}
                  onChange={(e) => setEditingCareer({ ...editingCareer, summary: e.target.value })}
                  placeholder="Overview of the position..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Key Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingCareer.keySkills ? editingCareer.keySkills.join(", ") : ""}
                  onChange={(e) =>
                    setEditingCareer({
                      ...editingCareer,
                      keySkills: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. EV Powertrain, BMS Firmware, ISO 9001"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Key Responsibilities (one per line)
                </label>
                <textarea
                  rows={4}
                  value={editingCareer.responsibilities ? editingCareer.responsibilities.join("\n") : ""}
                  onChange={(e) =>
                    setEditingCareer({
                      ...editingCareer,
                      responsibilities: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Line 1: Supervise end-of-line vehicle testing&#10;Line 2: Conduct quality audits on motor wiring"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingCareer(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCareer}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {isNewCareer ? "Post Opening" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
