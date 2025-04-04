// components/UserDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/Table";
import { ScrollArea } from "../ui/ScrollArea";
import { cn } from "@/lib/utils";
import { Progress } from "@radix-ui/react-progress";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import Loading from "../ui/loading";
// import { fetchUserProgress, fetchUserReviews } from "@/lib/api"; // Giả định API calls

interface UserProgress {
    totalWordsLearned: number;
    totalReviews: number;
    lastReview: string;
}

interface Review {
    vocab: string;
    nextReview: string;
    repetitionCount: number;
    efFactor: number;
    interval: number;
    lastResult: string;
}

interface ReviewHistory {
    date: string;
    wordsReviewed: number;
}

export default function UserDashboard({ userId }: { userId: string }) {
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewHistory, setReviewHistory] = useState<ReviewHistory[]>([]);

    useEffect(() => {
        // Fake data
        const fakeProgress: UserProgress = {
            totalWordsLearned: 150,
            totalReviews: 320,
            lastReview: "2025-04-02T10:00:00Z",
        };

        const fakeReviews: Review[] = [
            {
                vocab: "食べる (taberu)",
                nextReview: "2025-04-04T08:00:00Z",
                repetitionCount: 3,
                efFactor: 2.5,
                interval: 4,
                lastResult: "pass",
            },
            {
                vocab: "行く (iku)",
                nextReview: "2025-04-05T09:00:00Z",
                repetitionCount: 2,
                efFactor: 2.3,
                interval: 2,
                lastResult: "fail",
            },
            {
                vocab: "飲む (nomu)",
                nextReview: "2025-04-06T14:00:00Z",
                repetitionCount: 5,
                efFactor: 2.8,
                interval: 6,
                lastResult: "pass",
            },
            {
                vocab: "見る (miru)",
                nextReview: "2025-04-07T10:00:00Z",
                repetitionCount: 1,
                efFactor: 2.5,
                interval: 1,
                lastResult: "pass",
            },
        ];

        const fakeReviewHistory: ReviewHistory[] = [
            { date: "2025-03-28", wordsReviewed: 5 },
            { date: "2025-03-29", wordsReviewed: 8 },
            { date: "2025-03-30", wordsReviewed: 3 },
            { date: "2025-03-31", wordsReviewed: 10 },
            { date: "2025-04-01", wordsReviewed: 7 },
            { date: "2025-04-02", wordsReviewed: 6 },
        ];
        // Simulate API call
        const loadData = async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập delay
                setProgress(fakeProgress);
                setReviews(fakeReviews);
                setReviewHistory(fakeReviewHistory);
            } catch (error) {
                console.error("Error loading fake data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    if (loading) {
        return <div className="text-center py-10"><Loading /></div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-bold">Trang Tổng Quan Học Tập</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tổng Số Từ Đã Học</CardTitle>
                        <CardDescription>
                            Cập nhật đến{" "}
                            {progress?.lastReview
                                ? new Date(progress.lastReview).toLocaleDateString()
                                : "Chưa có dữ liệu"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-semibold">{progress?.totalWordsLearned ?? 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tổng Lượt Ôn Tập</CardTitle>
                        <CardDescription>Số lần bạn đã ôn tập</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-semibold">{progress?.totalReviews ?? 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tiến Độ Học</CardTitle>
                        <CardDescription>Phần trăm từ vựng đã nắm vững</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress
                            value={((progress?.totalWordsLearned ?? 0) / 1000) * 100}
                            className="w-full"
                        />
                        <p className="mt-2 text-sm text-muted-foreground">
                            {progress?.totalWordsLearned ?? 0} / 1000 từ mục tiêu
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for Detailed Info */}
            <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="reviews">Lịch Ôn Tập</TabsTrigger>
                    <TabsTrigger value="stats">Thống Kê</TabsTrigger>
                </TabsList>

                {/* Upcoming Reviews */}
                <TabsContent value="reviews">
                    <Card>
                        <CardHeader>
                            <CardTitle>Các Từ Cần Ôn Tập Sắp Tới</CardTitle>
                            <CardDescription>Danh sách từ vựng và thời gian ôn tập tiếp theo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Từ Vựng</TableHead>
                                            <TableHead>Lần Ôn Tiếp Theo</TableHead>
                                            <TableHead>Số Lần Lặp</TableHead>
                                            <TableHead>EF Factor</TableHead>
                                            <TableHead>Kết Quả Lần Cuối</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reviews.map((review, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{review.vocab}</TableCell>
                                                <TableCell>{new Date(review.nextReview).toLocaleDateString()}</TableCell>
                                                <TableCell>{review.repetitionCount}</TableCell>
                                                <TableCell>{review.efFactor.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={cn(
                                                            review.lastResult === "pass" ? "bg-green-500" : "bg-red-500"
                                                        )}
                                                    >
                                                        {review.lastResult}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Stats with Chart */}
                <TabsContent value="stats">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thống Kê Chi Tiết</CardTitle>
                            <CardDescription>Các chỉ số học tập của bạn</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-sm font-medium">Tỷ lệ thành công ôn tập</p>
                                    <Progress value={75} className="w-full" />
                                    <p className="text-sm text-muted-foreground">75% (dựa trên lịch sử ôn tập)</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Thời gian trung bình giữa các lần ôn</p>
                                    <p className="text-lg font-semibold">3.5 ngày</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium mb-4">Lịch Sử Ôn Tập (Số từ ôn tập theo ngày)</p>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={reviewHistory}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="wordsReviewed"
                                                stroke="#8884d8"
                                                activeDot={{ r: 8 }}
                                                name="Số từ ôn tập"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}