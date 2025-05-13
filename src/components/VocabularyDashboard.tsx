'use client'
import React, { useState } from "react";
import { motion } from "framer-motion";
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
    BarChart3, ArrowUp, Star, BookOpen,
    Calendar, Award, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    ResponsiveContainer, PieChart, Pie, Cell, LineChart,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line
} from "recharts";

// Types for the component
export interface VocabItem {
    id: string;
    vocab: string;
    furigana: string;
    mean_vi: string;
    mean_en: string;
    word_type: string;
    image_link: string;
    sound_link: string;
    learningStatus: 'new' | 'learning' | 'mastered' | 'forgotten' | 'graduated';
}

export interface ReviewHistoryItem {
    vocabId: string;
    reviewDate: string;
    result: "good" | "bad" | "again";
}

export interface ProgressData {
    totalWordsLearned: number;
    // Add other progress metrics as needed
}

export interface ChartDataItem {
    date: string;
    wordsReviewed: number;
}

export interface StatusDistributionItem {
    name: string;
    value: number;
    color: string;
}

export interface VocabularyDashboardProps {
    vocab: {
        vocabList: VocabItem[];
    };
    reviewHistory: ReviewHistoryItem[];
    progress: ProgressData;
    statusDistribution: StatusDistributionItem[];
    reviewHistoryChartData: ChartDataItem[];
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export const VocabularyDashboard: React.FC<VocabularyDashboardProps> = ({
    vocab,
    reviewHistory,
    progress,
    statusDistribution,
    reviewHistoryChartData
}) => {
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [selectedView, setSelectedView] = useState<"day" | "week" | "month">("day");

    // Helper functions
    const calculateLearningRate = (): string => {
        if (reviewHistory.length === 0) return "0";

        // Get unique dates from review history
        const uniqueDates = new Set(reviewHistory.map(r =>
            new Date(r.reviewDate).toLocaleDateString('vi-VN')
        ));

        // Calculate words per day
        const wordsPerDay = (progress.totalWordsLearned / uniqueDates.size).toFixed(1);
        return wordsPerDay;
    };

    const calculateEstimatedCompletion = (): string => {
        const learningRate = parseFloat(calculateLearningRate());
        if (learningRate <= 0) return "N/A";

        const wordsToReach1000 = 1000 - progress.totalWordsLearned;
        if (wordsToReach1000 <= 0) return "Đã hoàn thành";

        const daysNeeded = Math.ceil(wordsToReach1000 / learningRate);
        return `${daysNeeded} ngày`;
    };

    return (
        <motion.div variants={itemVariants}>
            <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="reviews">Lịch Sử Ôn Tập</TabsTrigger>
                    <TabsTrigger value="analytics">Phân Tích</TabsTrigger>
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
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.from(
                                            new Map(
                                                reviewHistory
                                                    .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())
                                                    .map((review) => [review.vocabId, review])
                                            ).values()
                                        )
                                            .filter((review) => {
                                                const vocabItem = vocab.vocabList.find((v) => v.id === review.vocabId);
                                                return filterStatus === 'all' || vocabItem?.learningStatus === filterStatus;
                                            })
                                            .map((review, index) => {
                                                const vocabItem = vocab.vocabList.find((v) => v.id === review.vocabId);
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
                                        <Badge variant={progress.totalWordsLearned >= 10 ? "default" : "outline"}>
                                            {progress.totalWordsLearned >= 10 ? "Đạt được" : `${progress.totalWordsLearned}/10`}
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
                                            {progress.totalWordsLearned}/100
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
                                            {reviewHistory.filter(r => r.result === "good").length > 0
                                                ? `${Math.round((reviewHistory.filter(r => r.result === "good").length / reviewHistory.length) * 100)}%`
                                                : "0%"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">tỷ lệ trả lời đúng</p>
                                        <div className="mt-3">
                                            <p className="text-sm">
                                                {reviewHistory.filter(r => r.result === "good").length > 0
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
    );
};

export default VocabularyDashboard;