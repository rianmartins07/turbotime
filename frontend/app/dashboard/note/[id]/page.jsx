"use client";

import {useEffect, useState, useRef} from "react";
import {useRouter, useParams, usePathname} from "next/navigation";
import {notesAPI, getToken} from "@/api";
import Dropdown from "@/components/ui/Dropdown";

export default function NoteEditor() {
    const router = useRouter();
    const params = useParams();
    const pathname = usePathname();
    const id = params?.id || (pathname?.endsWith("/new") ? "new" : null);

    const [note, setNote] = useState({
        title: "",
        content: "",
        category: "Random Thoughts",
    });

    const [categories, setCategories] = useState([]);
    const [lastEdited, setLastEdited] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const noteIdRef = useRef(null);
    const saveTimeoutRef = useRef(null);
    const isCreatingRef = useRef(false);
    const previousIdRef = useRef(null);

    useEffect(() => {
        async function loadCategories() {
            try {
                const categoriesData = await notesAPI.getCategories();
                setCategories(categoriesData);
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        }
        loadCategories();
    }, []);

    useEffect(() => {
        if (previousIdRef.current !== null && previousIdRef.current !== id) {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = null;
            }

            setNote({
                title: "",
                content: "",
                category: "Random Thoughts",
            });
            setLastEdited(null);
            setError("");
            setIsSaving(false);
            noteIdRef.current = null;
        }
        previousIdRef.current = id;
    }, [id]);

    useEffect(() => {
        let isMounted = true;
        let abortController = new AbortController();

        async function load() {
            if (id === "new" && isCreatingRef.current) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError("");

                const token = getToken();
                if (!token) {
                    router.push("/registration");
                    return;
                }

                const categoriesData = await notesAPI.getCategories();
                if (!isMounted || abortController.signal.aborted) return;
                setCategories(categoriesData);

                if (id === "new") {
                    if (isCreatingRef.current) {
                        setIsLoading(false);
                        return;
                    }
                    isCreatingRef.current = true;

                    const defaultCategory =
                        categoriesData[0]?.name || "Random Thoughts";
                    const newNote = await notesAPI.create({
                        title: "Note Title",
                        content: "Pour your heart out...",
                        category: defaultCategory,
                    });

                    if (abortController.signal.aborted || !isMounted) {
                        isCreatingRef.current = false;
                        return;
                    }

                    if (!newNote?.id) {
                        throw new Error("Failed to create note");
                    }

                    noteIdRef.current = newNote.id;
                    setIsLoading(false);
                    isCreatingRef.current = false;

                    router.replace(`/dashboard/note/${newNote.id}`);
                    return;
                }

                const data = await notesAPI.getById(id);
                if (abortController.signal.aborted || !isMounted) return;

                noteIdRef.current = data.id;
                const defaultCategory =
                    categoriesData[0]?.name || "Random Thoughts";
                setNote({
                    title: data.title || "",
                    content: data.content || "",
                    category: data.category || defaultCategory,
                });
                setLastEdited(data.updated_at || data.created_at);
            } catch (err) {
                if (abortController.signal.aborted || !isMounted) return;
                setError(err.message || "Failed to load note");
                isCreatingRef.current = false;
            } finally {
                if (isMounted && !abortController.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        if (id) {
            load();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
            abortController.abort();

            if (id === "new") {
                isCreatingRef.current = false;
            }

            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = null;
            }
        };
    }, [id, router]);

    const autoSave = async (updatedFields) => {
        const currentId = noteIdRef.current || id;
        if (!currentId || currentId === "new") return;

        const updated = {...note, ...updatedFields};
        setNote(updated);

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = null;
        }

        saveTimeoutRef.current = setTimeout(async () => {
            const saveId = noteIdRef.current || id;
            if (!saveId || saveId === "new") {
                setIsSaving(false);
                return;
            }

            try {
                setIsSaving(true);
                const saved = await notesAPI.patch(saveId, updated);
                setLastEdited(saved.updated_at || saved.created_at);
            } catch (err) {
                setError(err.message || "Failed to save note");
            } finally {
                setIsSaving(false);
            }
        }, 350);
    };

    const formatLastEdited = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const handleClose = () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = null;
        }
        router.push("/dashboard");
    };

    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = null;
            }
        };
    }, [id]);

    const handleCategorySelect = (category) => {
        autoSave({category});
    };

    if (isLoading) {
        return (
            <main className="w-full bg-[#faf1e3] min-h-screen flex items-center justify-center">
                <p className="text-[#88632a]">Loading note...</p>
            </main>
        );
    }

    const categoryData = categories.find((cat) => cat.name === note.category);
    const categoryColor =
        categoryData?.color || categories[0]?.color || "#ef9c66";
    const backgroundColor = `${categoryColor}7F`;

    return (
        <main className="w-full bg-[#faf1e3] min-h-screen">
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl mx-auto pt-6 mb-4 flex items-center justify-between">
                    <Dropdown
                        value={note.category}
                        options={categories}
                        onChange={handleCategorySelect}
                    />

                    <button
                        onClick={handleClose}
                        className="text-[#957139] text-4xl font-bold hover:opacity-70">
                        ×
                    </button>
                </div>

                {isSaving && (
                    <div className="w-full max-w-4xl mx-auto mb-4">
                        <span className="text-[12px] font-inria text-black opacity-70">
                            Saving...
                        </span>
                    </div>
                )}

                <div
                    className="w-full max-w-4xl mx-auto rounded-[10px] p-4 lg:p-6 shadow-[1px_1px_2px_#0003] relative overflow-hidden"
                    style={{
                        backgroundColor,
                        border: `3px solid ${categoryColor}`,
                    }}>
                    {/* LAST EDITED */}
                    {lastEdited && (
                        <p className="absolute top-4 right-6 text-[12px] font-inria text-black opacity-70">
                            Last Edited: {formatLastEdited(lastEdited)}
                        </p>
                    )}

                    <input
                        value={note.title}
                        placeholder="Title..."
                        onChange={(e) => autoSave({title: e.target.value})}
                        className="w-full bg-transparent text-[24px] lg:text-[28px] font-inria font-bold outline-none mb-4 text-black placeholder:text-black/50 break-words"
                        style={{
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                        }}
                    />

                    <textarea
                        value={note.content}
                        placeholder="Write your thoughts here..."
                        onChange={(e) => autoSave({content: e.target.value})}
                        className="w-full min-h-[400px] bg-transparent text-[14px] lg:text-[16px] font-inria outline-none resize-y text-black placeholder:text-black/50 break-words"
                        style={{
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                        }}
                    />

                    {error && (
                        <div className="w-full mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
