"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    BookOpen,
    Trash2,
    Search,
    Save,
    X,
    FileText,
    Star,
    Calendar,
    User
} from 'lucide-react';

// Types
interface CustomVocabEntry {
    id: string;
    user_id: string;
    vocabSet?: CustomVocabSet;
    word: string;
    meaning: string;
    example?: string;
    difficulty_level: number;
    created_at: Date;
}

interface CustomVocabSet {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    created_at: Date;
    entries?: CustomVocabEntry[];
}

interface User {
    id: string;
    name: string;
    email: string;
}

// Mock data
const mockUser: User = {
    id: '1',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@example.com'
};

const VocabularyManager: React.FC = () => {
    const [vocabSets, setVocabSets] = useState<CustomVocabSet[]>([]);
    const [selectedSet, setSelectedSet] = useState<CustomVocabSet | null>(null);
    const [isCreateSetOpen, setIsCreateSetOpen] = useState(false);
    const [isAddWordOpen, setIsAddWordOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [newSet, setNewSet] = useState({
        name: '',
        description: ''
    });

    const [newWord, setNewWord] = useState({
        word: '',
        meaning: '',
        example: '',
        difficulty_level: 1
    });

    useEffect(() => {
        const mockSets: CustomVocabSet[] = [
            {
                id: '1',
                user_id: mockUser.id,
                name: 'Business English',
                description: 'Từ vựng kinh doanh cơ bản',
                created_at: new Date('2024-01-15'),
                entries: [
                    {
                        id: '1',
                        user_id: mockUser.id,
                        word: 'negotiate',
                        meaning: 'đàm phán, thương lượng',
                        example: 'We need to negotiate the contract terms.',
                        difficulty_level: 3,
                        created_at: new Date('2024-01-15')
                    },
                    {
                        id: '2',
                        user_id: mockUser.id,
                        word: 'revenue',
                        meaning: 'doanh thu',
                        example: "The company's revenue increased by 20% this year.",
                        difficulty_level: 2,
                        created_at: new Date('2024-01-16')
                    }
                ]
            },
            {
                id: '2',
                user_id: mockUser.id,
                name: 'IELTS Vocabulary',
                description: 'Từ vựng luyện thi IELTS',
                created_at: new Date('2024-01-20'),
                entries: []
            }
        ];
        setVocabSets(mockSets);
    }, []);

    const createVocabSet = () => {
        if (!newSet.name.trim()) return;

        const vocabSet: CustomVocabSet = {
            id: Date.now().toString(),
            user_id: mockUser.id,
            name: newSet.name,
            description: newSet.description,
            created_at: new Date(),
            entries: []
        };

        setVocabSets(prev => [...prev, vocabSet]);
        setNewSet({ name: '', description: '' });
        setIsCreateSetOpen(false);
    };

    const addWordToSet = () => {
        if (!selectedSet || !newWord.word.trim() || !newWord.meaning.trim()) return;

        const word: CustomVocabEntry = {
            id: Date.now().toString(),
            user_id: mockUser.id,
            word: newWord.word,
            meaning: newWord.meaning,
            example: newWord.example,
            difficulty_level: newWord.difficulty_level,
            created_at: new Date()
        };

        setVocabSets(prev => prev.map(set =>
            set.id === selectedSet.id
                ? { ...set, entries: [...(set.entries || []), word] }
                : set
        ));

        setNewWord({ word: '', meaning: '', example: '', difficulty_level: 1 });
        setIsAddWordOpen(false);
    };

    const deleteVocabSet = (setId: string) => {
        setVocabSets(prev => prev.filter(set => set.id !== setId));
        if (selectedSet?.id === setId) {
            setSelectedSet(null);
        }
    };

    const deleteWord = (wordId: string) => {
        if (!selectedSet) return;

        setVocabSets(prev => prev.map(set =>
            set.id === selectedSet.id
                ? { ...set, entries: set.entries?.filter(entry => entry.id !== wordId) || [] }
                : set
        ));
    };

    const filteredWords = selectedSet?.entries?.filter(entry =>
        entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getDifficultyColor = (level: number) => {
        switch (level) {
            case 1: return 'bg-green-500';
            case 2: return 'bg-yellow-500';
            case 3: return 'bg-orange-500';
            case 4: return 'bg-red-500';
            case 5: return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
    };

    return (
        <>
            <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
                <div className="container mx-auto p-6 max-w-7xl">
                    {/* Header */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="flex items-center justify-between mb-8"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-xl bg-gray-600 dark:bg-gray-700">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsCreateSetOpen(true)}
                                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Tạo tệp mới</span>
                            </motion.button>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Vocab Sets List */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="lg:col-span-1"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Tệp từ vựng ({vocabSets.length})
                                </h2>

                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {vocabSets.map((set, index) => (
                                            <motion.div
                                                key={set.id}
                                                initial="hidden"
                                                animate="visible"
                                                exit="hidden"
                                                variants={itemVariants}
                                                transition={{ delay: index * 0.1 }}
                                                onClick={() => setSelectedSet(set)}
                                                className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedSet?.id === set.id
                                                    ? 'bg-gray-700 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium">{set.name}</h3>
                                                        {set.description && (
                                                            <p
                                                                className={`text-sm mt-1 ${selectedSet?.id === set.id
                                                                    ? 'text-gray-300'
                                                                    : 'text-gray-600 dark:text-gray-400'
                                                                    }`}
                                                            >
                                                                {set.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center mt-2 space-x-4 text-xs">
                                                            <span className="flex items-center">
                                                                <Calendar className="w-3 h-3 mr-1" />
                                                                {set.created_at.toLocaleDateString('vi-VN')}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Star className="w-3 h-3 mr-1" />
                                                                {set.entries?.length || 0} từ
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteVocabSet(set.id);
                                                        }}
                                                        className={`p-1 rounded hover:bg-red-500 hover:text-white transition-colors ${selectedSet?.id === set.id
                                                            ? 'text-gray-300'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* Vocabulary Words */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="lg:col-span-2"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                {selectedSet ? (
                                    <>
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    {selectedSet.name}
                                                </h2>
                                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                    {selectedSet.entries?.length || 0} từ vựng
                                                </p>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setIsAddWordOpen(true)}
                                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-md transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Thêm từ</span>
                                            </motion.button>
                                        </div>

                                        {/* Search */}
                                        <div className="relative mb-6">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Tìm kiếm từ vựng..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border transition-colors bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                                            />
                                        </div>

                                        {/* Words List */}
                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                            <AnimatePresence>
                                                {filteredWords.map((entry, index) => (
                                                    <motion.div
                                                        key={entry.id}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="hidden"
                                                        variants={itemVariants}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="p-4 rounded-lg border transition-all hover:shadow-md bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-3 mb-2">
                                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                                        {entry.word}
                                                                    </h3>
                                                                    <div
                                                                        className={`w-3 h-3 rounded-full ${getDifficultyColor(
                                                                            entry.difficulty_level
                                                                        )}`}
                                                                        title={`Độ khó: ${entry.difficulty_level}/5`}
                                                                    />
                                                                </div>
                                                                <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                                    {entry.meaning}
                                                                </p>
                                                                {entry.example && (
                                                                    <p className="text-sm italic text-gray-600 dark:text-gray-400">
                                                                        {entry.example}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <button
                                                                onClick={() => deleteWord(entry.id)}
                                                                className="p-2 rounded hover:bg-red-500 hover:text-white transition-colors text-gray-500 dark:text-gray-400"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            {filteredWords.length === 0 && (
                                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                    {searchTerm
                                                        ? 'Không tìm thấy từ vựng nào'
                                                        : 'Chưa có từ vựng nào trong tệp này'}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">Chọn một tệp từ vựng để xem chi tiết</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {isCreateSetOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setIsCreateSetOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Tạo tệp từ vựng mới
                                </h3>
                                <button
                                    onClick={() => setIsCreateSetOpen(false)}
                                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Tên tệp từ vựng *
                                    </label>
                                    <input
                                        type="text"
                                        value={newSet.name}
                                        onChange={(e) => setNewSet({ ...newSet, name: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border transition-colors bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                                        placeholder="Ví dụ: Business English"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Mô tả
                                    </label>
                                    <textarea
                                        value={newSet.description}
                                        onChange={(e) => setNewSet({ ...newSet, description: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border transition-colors resize-none bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                                        rows={3}
                                        placeholder="Mô tả ngắn về tệp từ vựng này..."
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => setIsCreateSetOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border transition-colors border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={createVocabSet}
                                    disabled={!newSet.name.trim()}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:bg-gray-600"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Tạo tệp</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            <AnimatePresence>
                {isAddWordOpen && selectedSet && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setIsAddWordOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Thêm từ vựng mới
                                </h3>
                                <button
                                    onClick={() => setIsAddWordOpen(false)}
                                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Từ vựng *
                                    </label>
                                    <input
                                        type="text"
                                        value={newWord.word}
                                        onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border transition-colors bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                                        placeholder="Ví dụ: negotiate"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Nghĩa *
                                    </label>
                                    <input
                                        type="text"
                                        value={newWord.meaning}
                                        onChange={(e) => setNewWord({ ...newWord, meaning: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border transition-colors bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                                        placeholder="Ví dụ: đàm phán, thương lượng"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Ví dụ
                                    </label>
                                    <textarea
                                        value={newWord.example}
                                        onChange={(e) => setNewWord({ ...newWord, example: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border transition-colors resize-none bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                                        rows={2}
                                        placeholder="Ví dụ: We need to negotiate the contract terms."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Độ khó (1-5)
                                    </label>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setNewWord({ ...newWord, difficulty_level: level })}
                                                className={`w-8 h-8 rounded-full transition-colors text-white font-medium ${newWord.difficulty_level === level
                                                        ? getDifficultyColor(level)
                                                        : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => setIsAddWordOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border transition-colors border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={addWordToSet}
                                    disabled={!newWord.word.trim() || !newWord.meaning.trim()}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:bg-gray-600"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Thêm từ</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


        </>

    );
};

export default VocabularyManager;
