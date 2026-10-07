import React, { useState } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import {
  X,
  PlusCircle,
  Edit2,
  Trash2,
  Link2,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  FolderArchive
} from 'lucide-react';
import { ResourceType, Priority, ResourceStatus, Difficulty } from '../../types/library';

export const ManageModal: React.FC = () => {
  const resources = useLibraryStore((s) => s.resources);
  const sections = useLibraryStore((s) => s.sections);
  const addResource = useLibraryStore((s) => s.addResource);
  const updateResource = useLibraryStore((s) => s.updateResource);
  const deleteResource = useLibraryStore((s) => s.deleteResource);
  const addRelationship = useLibraryStore((s) => s.addRelationship);
  const closeModal = useLibraryStore((s) => s.closeModal);

  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'relation' | 'import'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ResourceType>('PDF');
  const [category, setCategory] = useState(sections[0]?.id || 'java');
  const [subCategory, setSubCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('MUST_LEARN');
  const [status, setStatus] = useState<ResourceStatus>('NOT_STARTED');
  const [difficulty, setDifficulty] = useState<Difficulty>('INTERMEDIATE');
  const [tagsInput, setTagsInput] = useState('Java, SystemDesign');
  const [url, setUrl] = useState('');

  // Relationship form state
  const [relSourceId, setRelSourceId] = useState(resources[0]?.id || '');
  const [relTargetId, setRelTargetId] = useState(resources[1]?.id || '');
  const [relType, setRelType] = useState<'PREREQUISITE' | 'NEXT' | 'RELATED' | 'BUILDS_ON'>('PREREQUISITE');
  const [relReason, setRelReason] = useState('Essential prerequisite concept before studying the target.');

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (editingId) {
      updateResource(editingId, {
        title,
        author,
        description,
        type,
        category,
        subCategory: subCategory || 'General',
        priority,
        status,
        difficulty,
        tags,
        url: url || undefined,
      });
      showNotification(`Updated "${title}"! Shelves recalculated.`);
      setEditingId(null);
    } else {
      addResource({
        title,
        author,
        description,
        type,
        resourceType: type,
        category,
        subCategory: subCategory || 'General',
        priority,
        status,
        readingStatus: status,
        difficulty,
        tags,
        topics: tags,
        whatIsThisBookFor: `For learning and mastering ${title} in the ${category} collection.`,
        summary: description || title,
        keyTakeaways: [
          `Core principles of ${title}`,
          'Implementation patterns and real-world trade-offs',
        ],
        prerequisites: ['Foundational domain familiarity'],
        recommendedNext: ['Advanced engineering and case studies'],
        source: 'uploaded_pdf',
        url: url || undefined,
        progress: 0,
        totalPages: 240,
        currentPage: 1,
        contentSample: [
          `# ${title}\n\n**Author:** ${author}\n\n${description}`,
          `## Core Foundations & In-Depth Topics\n\nThis resource is dynamically positioned within your 3D personal knowledge library. All relationships and shelf coordinates are computed in real time.`
        ]
      });
      showNotification(`Added "${title}" directly to the 3D library!`);
    }

    // Reset Form
    setTitle('');
    setAuthor('');
    setDescription('');
    setUrl('');
  };

  const handleEditClick = (res: typeof resources[0]) => {
    setEditingId(res.id);
    setTitle(res.title);
    setAuthor(res.author);
    setDescription(res.description || res.summary || '');
    setType(res.resourceType || res.type || 'BOOK');
    setCategory(res.category);
    setSubCategory(res.subCategory);
    setPriority(res.priority);
    setStatus(res.readingStatus || res.status || 'READING');
    setDifficulty(res.difficulty);
    setTagsInput(res.tags.join(', '));
    setUrl(res.url || '');
    setActiveTab('add');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the 3D Library?`)) {
      deleteResource(id);
      showNotification(`Removed "${name}" and updated 3D shelves.`);
    }
  };

  const handleCreateRelationship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relSourceId || !relTargetId || relSourceId === relTargetId) return;

    addRelationship({
      sourceId: relSourceId,
      targetId: relTargetId,
      type: relType,
      reason: relReason,
    });
    showNotification('Connected knowledge relationship!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-xl pointer-events-auto">
      <div className="relative w-full max-w-4xl h-[85vh] rounded-3xl cyber-glass-dense border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cyan-900/40 flex items-center justify-between gap-4 bg-[#040814]/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                SYSTEM CONSOLE // RESOURCE MANAGER
              </div>
              <h2 className="text-base font-bold text-slate-100 font-['Outfit']">
                KNOWLEDGE ARCHIVE CONSOLE
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Add, edit, organize resources and define neural knowledge connections
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-cyan-950/40 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-6 py-2 border-b border-cyan-900/30 bg-[#040814]/50 flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              setActiveTab('add');
              setEditingId(null);
            }}
            className={`px-4 py-2 rounded-xl font-semibold cursor-pointer transition-all ${
              activeTab === 'add'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            {editingId ? 'Edit Tome' : '+ Add Tome'}
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl font-semibold cursor-pointer transition-all ${
              activeTab === 'list'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            Manage Catalog ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('relation')}
            className={`px-4 py-2 rounded-xl font-semibold cursor-pointer transition-colors ${
              activeTab === 'relation'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            Connect Relationships
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-xl font-semibold cursor-pointer transition-colors ${
              activeTab === 'import'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            ZIP / Batch Import
          </button>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className="px-6 py-2 bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {notification}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* TAB 1: ADD / EDIT RESOURCE */}
          {activeTab === 'add' && (
            <form onSubmit={handleSaveResource} className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Book / Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. High Performance MySQL"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Author / Creator *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Baron Schwartz"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description & Key Takeaways
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of topics covered, system patterns, and practical value..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200"
                  >
                    <option value="PDF">PDF</option>
                    <option value="BOOK">BOOK</option>
                    <option value="GITHUB">GITHUB</option>
                    <option value="GOOGLE_DRIVE">GOOGLE DRIVE</option>
                    <option value="WEBSITE">WEBSITE</option>
                    <option value="VIDEO">VIDEO</option>
                    <option value="ARTICLE">ARTICLE</option>
                    <option value="NOTE">NOTE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200"
                  >
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200"
                  >
                    <option value="MUST_LEARN">⭐ MUST LEARN (Top Shelf)</option>
                    <option value="CURRENT_FOCUS">🔥 CURRENT FOCUS</option>
                    <option value="CRITICAL">🔴 CRITICAL</option>
                    <option value="HIGH">🟠 HIGH</option>
                    <option value="MEDIUM">🟡 MEDIUM</option>
                    <option value="LOW">🟢 LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                    <option value="EXPERT">EXPERT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Java, Concurrency, SpringBoot"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL or File Path
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/... or /library/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  {editingId ? 'Save Changes' : '+ Add Book to 3D Shelves'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CATALOG LIST & DELETE */}
          {activeTab === 'list' && (
            <div className="space-y-2">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {res.category}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        {res.priority}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-200 truncate mt-0.5">
                      {res.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      by {res.author}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(res)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(res.id, res.title)}
                      className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-400 cursor-pointer"
                      title="Delete from Library"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: RELATIONSHIPS */}
          {activeTab === 'relation' && (
            <form onSubmit={handleCreateRelationship} className="max-w-xl mx-auto space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-900/40 text-xs text-purple-300">
                Connect two concepts in the knowledge graph. The recommendation engine will intelligently display prerequisites and next recommendations!
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Source Resource
                </label>
                <select
                  value={relSourceId}
                  onChange={(e) => setRelSourceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200"
                >
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Relationship Type
                </label>
                <select
                  value={relType}
                  onChange={(e) => setRelType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200"
                >
                  <option value="PREREQUISITE">PREREQUISITE (Learn First)</option>
                  <option value="NEXT">NEXT (Recommended Step)</option>
                  <option value="BUILDS_ON">BUILDS ON (Direct Continuation)</option>
                  <option value="RELATED">RELATED (Connected Domain)</option>
                  <option value="ADVANCED">ADVANCED (Deep Dive)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Resource
                </label>
                <select
                  value={relTargetId}
                  onChange={(e) => setRelTargetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200"
                >
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Educational Explanation (WHY?)
                </label>
                <input
                  type="text"
                  required
                  value={relReason}
                  onChange={(e) => setRelReason(e.target.value)}
                  placeholder="e.g. Recommended next because it builds directly on collections..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                Create Knowledge Connection
              </button>
            </form>
          )}

          {/* TAB 4: ZIP IMPORT ARCHITECTURE */}
          {activeTab === 'import' && (
            <div className="max-w-xl mx-auto space-y-6 text-center">
              <div className="p-8 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-900/60 flex flex-col items-center">
                <FolderArchive className="w-12 h-12 text-amber-400 mb-4" />
                <h3 className="text-base font-bold text-slate-100 font-['Outfit'] mb-1">
                  Ready for ZIP & PDF Ingestion
                </h3>
                <p className="text-xs text-slate-400 max-w-md mb-6">
                  The data pipeline is designed to extract folder structures (e.g. /Java/..., /DSA/..., /System Design/...) and automatically place hundreds of PDF tomes onto dynamic 3D library shelves.
                </p>

                <label className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg transition-all inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Select library.zip or PDF Folder
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        showNotification(`Processed ${e.target.files[0].name}! 3D Shelves generated.`);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
