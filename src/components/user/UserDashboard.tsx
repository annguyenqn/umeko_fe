'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserDetailsResponse } from "@/types/User";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { Progress } from "@/components/ui/progress";
import { ReviewHistoryItem } from "@/types/User";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { cn } from "@/lib/utils";
import { Calendar, ArrowUp, BarChart3, Award, Clock, BookOpen, Star } from "lucide-react";
import Loading from "@/components/ui/loading";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface UserDashboardProps {
    data: UserDetailsResponse;
}


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};


export default function UserDashboard({ data }: UserDashboardProps) {
    const [loading, setLoading] = useState(true);
    const [reviewHistoryChartData, setReviewHistoryChartData] = useState<
        { date: string; wordsReviewed: number }[]
    >([]);
    const [statusDistribution, setStatusDistribution] = useState<
        { name: string; value: number; color: string }[]
    >([]);
    const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('week');

    const [filterStatus, setFilterStatus] = useState<string>('all');


    useEffect(() => {
        // Tính toán dữ liệu biểu đồ ôn tập theo ngày
        const countByDate: Record<string, number> = {};
        data.reviewHistory.forEach((item: ReviewHistoryItem) => {
            const date = new Date(item.reviewDate).toISOString().split("T")[0];
            countByDate[date] = (countByDate[date] || 0) + 1;
        });

        const chartData = Object.entries(countByDate).map(([date, count]) => ({
            date,
            wordsReviewed: count,
        })).sort((a, b) => a.date.localeCompare(b.date));

        setReviewHistoryChartData(chartData);

        // Tính toán phân phối trạng thái học tập
        const statusCounts: Record<string, number> = {
            new: 0,
            learning: 0,
            mastered: 0,
            forgotten: 0,
            graduated: 0
        };

        data.vocab.vocabList.forEach(item => {
            statusCounts[item.learningStatus] = (statusCounts[item.learningStatus] || 0) + 1;
        });

        const statusColors = {
            new: "#9CA3AF", // gray
            learning: "#3B82F6", // blue
            mastered: "#10B981", // green
            forgotten: "#EF4444", // red
            graduated: "#8B5CF6" // purple
        };

        const distribution = Object.entries(statusCounts).map(([status, count]) => ({
            name: status,
            value: count,
            color: statusColors[status as keyof typeof statusColors]
        }));

        setStatusDistribution(distribution);
        setLoading(false);
    }, [data]);

    // Tính tốc độ học từ mới
    const calculateLearningRate = () => {
        if (data.reviewHistory.length <= 1) return "N/A";

        const dates = [...new Set(data.reviewHistory.map(review =>
            new Date(review.reviewDate).toISOString().split('T')[0]
        ))];

        if (dates.length <= 1) return "N/A";

        // Xếp theo thứ tự tăng dần
        dates.sort();

        // Số từ mỗi ngày
        const totalDays = dates.length;
        return (data.progress.totalWordsLearned / totalDays).toFixed(1);
    };

    // Tính thời gian dự kiến để hoàn thành 1000 từ
    const calculateEstimatedCompletion = () => {
        const learningRate = parseFloat(calculateLearningRate());
        if (isNaN(learningRate) || learningRate === 0) return "N/A";

        const wordsRemaining = 1000 - data.progress.totalWordsLearned;
        const daysRemaining = Math.ceil(wordsRemaining / learningRate);

        if (daysRemaining <= 0) return "Đã hoàn thành";
        if (daysRemaining > 365) return "Hơn 1 năm";
        if (daysRemaining > 30) return `Khoảng ${Math.ceil(daysRemaining / 30)} tháng`;
        return `${daysRemaining} ngày`;
    };

    // Xác định các cột mốc tiếp theo
    const nextMilestone = () => {
        const milestones = [10, 25, 50, 100, 250, 500, 750, 1000];
        for (const milestone of milestones) {
            if (data.progress.totalWordsLearned < milestone) {
                return milestone;
            }
        }
        return 1000; // Mốc cuối cùng
    };

    // Tìm các từ có kết quả tốt nhất (dựa trên tỷ lệ again/good)
    // const getBestPerformingWords = () => {
    //     const wordPerformance: Record<string, { total: number, good: number, vocab?: VocabItem }> = {};

    //     data.reviewHistory.forEach(review => {
    //         if (!wordPerformance[review.vocabId]) {
    //             wordPerformance[review.vocabId] = { total: 0, good: 0 };

    //             // Tìm thông tin từ tương ứng
    //             const vocabItem = data.vocab.vocabList.find(v => v.id === review.vocabId);
    //             if (vocabItem) {
    //                 wordPerformance[review.vocabId].vocab = vocabItem;
    //             }
    //         }

    //         wordPerformance[review.vocabId].total++;
    //         if (review.result === "good") {
    //             wordPerformance[review.vocabId].good++;
    //         }
    //     });

    //     return Object.values(wordPerformance)
    //         .filter(item => item.total > 0 && item.vocab)
    //         .sort((a, b) => (b.good / b.total) - (a.good / a.total))
    //         .slice(0, 3);
    // };

    if (loading) {
        return (
            <div className="text-center py-10">
                <Loading />
            </div>
        );
    }

    return (
        <motion.div
            className="container mx-auto p-6 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="flex justify-between items-center" variants={itemVariants}>
                <h1 className="text-3xl font-bold">Trang Tổng Quan Học Tập</h1>
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                        Xin chào, <span className="font-medium">{data.user.firstName} {data.user.lastName}</span>
                    </p>
                </div>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Card className="relative overflow-hidden border-blue-300 dark:border-blue-800 bg-white dark:bg-gray-950 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 to-transparent dark:from-blue-900/20 dark:to-transparent pointer-events-none" />
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="flex items-center space-x-2">
                                <div className="flex justify-center items-center p-1 rounded-md bg-blue-100 dark:bg-blue-900/30">
                                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-blue-800 dark:text-blue-300 font-bold">Tổng Số Từ Đã Học</span>
                            </CardTitle>
                            <CardDescription>
                                Cập nhật đến {new Date(data.progress.lastReview).toLocaleDateString('vi-VN')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="relative">
                            <motion.p
                                className="text-4xl font-bold !text-blue-700 !dark:text-blue-300"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                                style={{ color: 'var(--blue-700)', textShadow: 'none' }}
                            >
                                {data.vocab.vocabList.length}
                            </motion.p>
                            <Progress
                                value={(data.vocab.vocabList.length / 1000) * 100}
                                className="w-full mt-2 h-2 bg-blue-100 dark:bg-blue-900/30"
                                indicatorClassName="bg-blue-600 dark:bg-blue-500"
                            />
                            <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                                {data.vocab.vocabList.length} / 1000 từ mục tiêu
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>


                <motion.div variants={itemVariants}>
                    <Card className="relative overflow-hidden border-green-300 dark:border-green-800 bg-white dark:bg-gray-950 hover:bg-green-50 dark:hover:bg-green-950/50 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-100/80 to-transparent dark:from-green-900/20 dark:to-transparent pointer-events-none" />
                        <div className="absolute left-0 top-0 h-full w-1 bg-green-500"></div>
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="flex items-center space-x-2">
                                <div className="flex justify-center items-center p-1 rounded-md bg-green-100 dark:bg-green-900/30">
                                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-green-800 dark:text-green-300 font-bold">Tổng Lượt Ôn Tập</span>
                            </CardTitle>
                            <CardDescription>Số lần bạn đã ôn tập</CardDescription>
                        </CardHeader>
                        <CardContent className="relative">
                            <motion.p
                                className="text-4xl font-bold !text-green-700 !dark:text-green-300"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                style={{ color: 'var(--green-700)', textShadow: 'none' }}
                            >
                                {data.progress.totalReviews}
                            </motion.p>
                            <div className="mt-4 flex justify-between items-center">
                                <p className="text-sm font-medium text-green-700 dark:text-green-400">Tốc độ học:</p>
                                <Badge className="bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-800 dark:text-green-200 font-medium">{calculateLearningRate()} từ/ngày</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="relative overflow-hidden border-purple-300 dark:border-purple-800 bg-white dark:bg-gray-950 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/80 to-transparent dark:from-purple-900/20 dark:to-transparent pointer-events-none" />
                        <div className="absolute left-0 top-0 h-full w-1 bg-purple-500"></div>
                        <CardHeader className="pb-2 relative">
                            <CardTitle className="flex items-center space-x-2">
                                <div className="flex justify-center items-center p-1 rounded-md bg-purple-100 dark:bg-purple-900/30">
                                    <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-purple-800 dark:text-purple-300 font-bold">Tiến Độ & Mục Tiêu</span>
                            </CardTitle>
                            <CardDescription>Tiến độ học của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-purple-700 dark:text-purple-400">Mục tiêu tiếp theo:</span>
                                <Badge variant="outline" className="border-purple-400 text-purple-800 hover:bg-purple-300 dark:border-purple-600 dark:text-purple-200 font-medium">{nextMilestone()} từ</Badge>
                            </div>
                            <Progress
                                value={(data.vocab.vocabList.length / nextMilestone()) * 100}
                                className="w-full h-2 bg-purple-100 dark:bg-purple-900/30"
                                indicatorClassName="bg-purple-600 dark:bg-purple-500"
                            />

                            <div className="mt-4 flex justify-between items-center">
                                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Hoàn thành dự kiến:</p>
                                <Badge variant="secondary" className="bg-purple-200 text-purple-800 hover:bg-purple-300 dark:bg-purple-800 dark:text-purple-200 font-medium">{calculateEstimatedCompletion()}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

            </motion.div>

            <motion.div variants={itemVariants}>
                <Tabs defaultValue="reviews" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="reviews">Lịch Sử Ôn Tập</TabsTrigger>
                        <TabsTrigger value="analytics">Phân Tích</TabsTrigger>
                        {/* <TabsTrigger value="vocabulary">Từ Vựng</TabsTrigger> */}
                        <TabsTrigger value="insights">Phát Hiện</TabsTrigger>
                    </TabsList>

                    <TabsContent value="reviews">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center w-full">
                                    {/* Bên trái: Tiêu đề và mô tả */}
                                    <div className="flex flex-col gap-1">
                                        <CardTitle>Danh sách từ vựng đã ôn tập</CardTitle>
                                        <CardDescription>Thông tin từ lịch sử ôn tập</CardDescription>
                                    </div>

                                    {/* Bên phải: Select filter */}
                                    <Select onValueChange={(value) => setFilterStatus(value)} defaultValue="all">
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="learning">Learning</SelectItem>
                                            <SelectItem value="mastered">Mastered</SelectItem>
                                            <SelectItem value="forgotten">Forgotten</SelectItem>
                                            <SelectItem value="graduated">Graduated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px] w-full">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>STT</TableHead>
                                                <TableHead>Từ Vựng</TableHead>
                                                <TableHead>Furigana</TableHead>
                                                <TableHead>Ý Nghĩa</TableHead>
                                                <TableHead>Ngày Ôn Gần Nhất</TableHead>
                                                <TableHead>Trạng Thái</TableHead>
                                                {/* <TableHead>Kết Quả Gần Nhất</TableHead> */}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Array.from(
                                                new Map(
                                                    data.reviewHistory
                                                        .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())
                                                        .map((review) => [review.vocabId, review])
                                                ).values()
                                            )
                                                .filter((review) => {
                                                    const vocabItem = data.vocab.vocabList.find((v) => v.id === review.vocabId);
                                                    return filterStatus === 'all' || vocabItem?.learningStatus === filterStatus;
                                                })
                                                .map((review, index) => {
                                                    const vocabItem = data.vocab.vocabList.find((v) => v.id === review.vocabId);
                                                    return (
                                                        <TableRow key={review.vocabId}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell className="font-medium">{vocabItem?.vocab ?? 'N/A'}</TableCell>
                                                            <TableCell>{vocabItem?.furigana ?? 'N/A'}</TableCell>
                                                            <TableCell>{vocabItem?.mean_vi ?? 'N/A'}</TableCell>
                                                            <TableCell>{new Date(review.reviewDate).toLocaleDateString('vi-VN')}</TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    className={cn(
                                                                        vocabItem?.learningStatus === 'new' && 'bg-gray-500',
                                                                        vocabItem?.learningStatus === 'learning' && 'bg-blue-500',
                                                                        vocabItem?.learningStatus === 'mastered' && 'bg-green-600',
                                                                        vocabItem?.learningStatus === 'forgotten' && 'bg-red-500',
                                                                        vocabItem?.learningStatus === 'graduated' && 'bg-purple-500'
                                                                    )}
                                                                >
                                                                    {vocabItem?.learningStatus ?? 'N/A'}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>


                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <BarChart3 className="w-5 h-5 text-blue-500" />
                                        <span>Phân Bố Trạng Thái Từ Vựng</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center">
                                    <div className="h-[300px] w-full max-w-md">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {statusDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value, name) => [`${value} từ`, name]}
                                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                                <div className="px-6 pb-4">
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {statusDistribution.map((entry, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                                <span className="text-sm">{entry.name}: {entry.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>

                            <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <ArrowUp className="w-5 h-5 text-green-500" />
                                        <span>Tiến Độ Học Tập</span>
                                    </CardTitle>
                                    <div className="flex space-x-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant={selectedView === 'day' ? 'default' : 'outline'}
                                            onClick={() => setSelectedView('day')}
                                        >
                                            Ngày
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={selectedView === 'week' ? 'default' : 'outline'}
                                            onClick={() => setSelectedView('week')}
                                        >
                                            Tuần
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={selectedView === 'month' ? 'default' : 'outline'}
                                            onClick={() => setSelectedView('month')}
                                        >
                                            Tháng
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={reviewHistoryChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip
                                                formatter={(value) => [`${value} từ`, 'Số từ ôn tập']}
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="wordsReviewed"
                                                stroke="#8884d8"
                                                activeDot={{ r: 8 }}
                                                name="Số từ ôn tập"
                                                strokeWidth={2}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* <TabsContent value="vocabulary">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bộ Sưu Tập Từ Vựng</CardTitle>
                                <CardDescription>Tất cả từ vựng bạn đang học</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {data.vocab.vocabList.map((vocab, index) => (
                                        <motion.div
                                            key={vocab.id}
                                            className="rounded-lg border bg-card text-card-foreground shadow overflow-hidden"
                                            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <div className="h-32 relative">
                                                <img
                                                    src={vocab.image_link}
                                                    alt={vocab.vocab}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/api/placeholder/400/320';
                                                    }}
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <Badge
                                                        className={cn(
                                                            vocab.learningStatus === 'new' && 'bg-gray-500',
                                                            vocab.learningStatus === 'learning' && 'bg-blue-500',
                                                            vocab.learningStatus === 'mastered' && 'bg-green-600',
                                                            vocab.learningStatus === 'forgotten' && 'bg-red-500',
                                                            vocab.learningStatus === 'graduated' && 'bg-purple-500'
                                                        )}
                                                    >
                                                        {vocab.learningStatus}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="text-xl font-bold">{vocab.vocab}</h3>
                                                    <span className="text-sm text-muted-foreground">{vocab.furigana}</span>
                                                </div>
                                                <p className="text-sm">{vocab.mean_vi}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{vocab.mean_en}</p>
                                                <div className="mt-3 flex justify-between items-center">
                                                    <Badge variant="outline">{vocab.word_type}</Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="p-0 h-8 w-8"
                                                        onClick={() => {
                                                            const audio = new Audio(vocab.sound_link);
                                                            audio.play();
                                                        }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent> */}

                    <TabsContent value="insights">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        <span>Thành Tựu</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <motion.div
                                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                            whileHover={{ x: 5 }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-primary/20 p-2 rounded-full">
                                                    <BookOpen className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">Người Học Mới</h3>
                                                    <p className="text-sm text-muted-foreground">Học 10 từ đầu tiên</p>
                                                </div>
                                            </div>
                                            <Badge variant={data.progress.totalWordsLearned >= 10 ? "default" : "outline"}>
                                                {data.progress.totalWordsLearned >= 10 ? "Đạt được" : `${data.progress.totalWordsLearned}/10`}
                                            </Badge>
                                        </motion.div>

                                        <motion.div
                                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                            whileHover={{ x: 5 }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-primary/20 p-2 rounded-full">
                                                    <Calendar className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">Đều Đặn</h3>
                                                    <p className="text-sm text-muted-foreground">Ôn tập 5 ngày liên tiếp</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                Sắp tới
                                            </Badge>
                                        </motion.div>

                                        <motion.div
                                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                            whileHover={{ x: 5 }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-primary/20 p-2 rounded-full">
                                                    <Award className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">Người Học Tinh Túy</h3>
                                                    <p className="text-sm text-muted-foreground">Đạt 100 từ vựng</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                {data.progress.totalWordsLearned}/100
                                            </Badge>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-1">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <span>Sắp Tới Lịch Ôn Tập</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-6">
                                        <p className="text-muted-foreground">
                                            Dựa trên dữ liệu hiện tại, bạn chưa có từ vựng nào trong lịch ôn tập sắp tới.
                                        </p>
                                        <p className="text-sm mt-2">
                                            Học thêm từ mới để hệ thống thiết lập lịch ôn tập hiệu quả!
                                        </p>
                                        <Link href="/vocabulary" className="mt-4">
                                            <Button className="mt-4">Học Từ Mới</Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Phân Tích Học Tập</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-muted p-4 rounded-lg">
                                            <h3 className="font-medium text-lg mb-2">Nhịp Độ Học Tập</h3>
                                            <p className="text-3xl font-bold">{calculateLearningRate()}</p>
                                            <p className="text-sm text-muted-foreground">từ/ngày</p>
                                            <div className="mt-3">
                                                <p className="text-sm">
                                                    {parseFloat(calculateLearningRate()) > 5
                                                        ? "Tốc độ học rất tốt! Giữ vững nhịp độ này nhé."
                                                        : "Hãy cố gắng tăng tốc độ học để đạt mục tiêu sớm hơn."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-muted p-4 rounded-lg">
                                            <h3 className="font-medium text-lg mb-2">Tỷ Lệ Nhớ</h3>
                                            <p className="text-3xl font-bold">
                                                {data.reviewHistory.filter(r => r.result === "good").length > 0
                                                    ? `${Math.round((data.reviewHistory.filter(r => r.result === "good").length / data.reviewHistory.length) * 100)}%`
                                                    : "0%"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">tỷ lệ trả lời đúng</p>
                                            <div className="mt-3">
                                                <p className="text-sm">
                                                    {data.reviewHistory.filter(r => r.result === "good").length > 0
                                                        ? "Hãy tiếp tục ôn tập để cải thiện tỷ lệ nhớ."
                                                        : "Bắt đầu với các từ đơn giản để xây dựng nền tảng vững chắc."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-muted p-4 rounded-lg">
                                            <h3 className="font-medium text-lg mb-2">Dự Báo</h3>
                                            <p className="text-3xl font-bold">{calculateEstimatedCompletion()}</p>
                                            <p className="text-sm text-muted-foreground">để đạt 1000 từ</p>
                                            <div className="mt-3">
                                                <p className="text-sm">
                                                    {calculateEstimatedCompletion() !== "N/A" && calculateEstimatedCompletion() !== "Đã hoàn thành"
                                                        ? "Tiếp tục duy trì việc học hàng ngày để đạt mục tiêu."
                                                        : "Thiết lập mục tiêu học tập cụ thể để theo dõi tiến độ."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="font-medium text-lg mb-4">Thời Gian Học Tập Hiệu Quả</h3>
                                        <div className="bg-muted p-4 rounded-lg">
                                            <p className="text-sm mb-4">
                                                Dựa trên dữ liệu học tập của bạn, thời điểm sau đây có thể là lúc bạn học hiệu quả nhất:
                                            </p>

                                            <div className="grid grid-cols-7 gap-2">
                                                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                                                    <motion.div
                                                        key={day}
                                                        className="bg-background p-2 rounded text-center"
                                                        whileHover={{ y: -2 }}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                    >
                                                        <p className="font-medium">{day}</p>
                                                        <div className={`h-16 rounded-sm mt-2 ${index === new Date().getDay() ? 'bg-primary/30' : 'bg-primary/10'}`}>
                                                        </div>
                                                        <p className="text-xs mt-1 text-muted-foreground">
                                                            {index === new Date().getDay() ? 'Hôm nay' : ''}
                                                        </p>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <p className="text-sm mt-4 text-center text-muted-foreground">
                                                Bạn cần học nhiều hơn để có thể phân tích thời gian học tập hiệu quả nhất.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>

            <motion.div
                className="mt-10"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Gợi Ý Nâng Cao</CardTitle>
                        <CardDescription>Dựa trên hoạt động học tập của bạn</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex flex-col bg-muted/40 p-4 rounded-lg"
                            >
                                <h3 className="font-medium mb-2 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                                    Học Từ Mới Hàng Ngày
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Thiết lập mục tiêu học 5-10 từ mới mỗi ngày để cải thiện vốn từ vựng nhanh chóng.
                                </p>
                                <Button size="sm" className="mt-auto self-start">Đặt Mục Tiêu</Button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex flex-col bg-muted/40 p-4 rounded-lg"
                            >
                                <h3 className="font-medium mb-2 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                    Đặt Nhắc Nhở
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Thiết lập thông báo nhắc nhở ôn tập vào thời điểm phù hợp với lịch trình của bạn.
                                </p>
                                <Button size="sm" className="mt-auto self-start">Thiết Lập</Button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex flex-col bg-muted/40 p-4 rounded-lg"
                            >
                                <h3 className="font-medium mb-2 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    Thời Gian Ôn Tập Hiệu Quả
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Phân tích cho thấy ôn tập ngắn và thường xuyên hiệu quả hơn các buổi dài.
                                </p>
                                <Button size="sm" className="mt-auto self-start">Tìm Hiểu Thêm</Button>
                            </motion.div>
                        </div>

                        <div className="mt-8 p-4 bg-primary/5 rounded-lg">
                            <h3 className="font-medium mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                Lời Khuyên Của Ngày
                            </h3>
                            <div className="mt-2 p-3 bg-background rounded">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-sm italic"
                                >
                                    &quot;Việc ôn tập phân tán (spaced repetition) có thể giúp ghi nhớ từ vựng tốt hơn 250% so với học tập tập trung. Hãy duy trì việc ôn tập ngắn mỗi ngày thay vì học dồn một lúc.&quot;
                                </motion.p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}