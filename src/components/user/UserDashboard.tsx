// 📁 components/UserDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { ScrollArea } from "@/components/ui/ScrollArea";
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
import Loading from "@/components/ui/loading";
import { UserDetailsResponse, ReviewHistoryItem } from "@/types/User";


interface UserDashboardProps {
    data: UserDetailsResponse;
}

export default function UserDashboard({ data }: UserDashboardProps) {
    const [loading, setLoading] = useState(true);
    const [reviewHistoryChartData, setReviewHistoryChartData] = useState<
        { date: string; wordsReviewed: number }[]
    >([]);

    useEffect(() => {
        const countByDate: Record<string, number> = {};
        data.reviewHistory.forEach((item: ReviewHistoryItem) => {
            const date = new Date(item.reviewDate).toISOString().split("T")[0];
            countByDate[date] = (countByDate[date] || 0) + 1;
        });
        const chartData = Object.entries(countByDate).map(([date, count]) => ({
            date,
            wordsReviewed: count,
        }));
        setReviewHistoryChartData(chartData);
        setLoading(false);
    }, [data]);

    if (loading) {
        return (
            <div className="text-center py-10">
                <Loading />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Trang Tổng Quan Học Tập</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tổng Số Từ Đã Học</CardTitle>
                        <CardDescription>
                            Cập nhật đến {new Date(data.progress.lastReview).toLocaleDateString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-semibold">{data.progress.totalWordsLearned}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tổng Lượt Ôn Tập</CardTitle>
                        <CardDescription>Số lần bạn đã ôn tập</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-semibold">{data.progress.totalReviews}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tiến Độ Học</CardTitle>
                        <CardDescription>Phần trăm từ vựng đã nắm vững</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Progress value={(data.progress.totalWordsLearned / 1000) * 100} className="w-full" />
                        <p className="mt-2 text-sm text-muted-foreground">
                            {data.progress.totalWordsLearned} / 1000 từ mục tiêu
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="reviews">Lịch Ôn Tập</TabsTrigger>
                    <TabsTrigger value="stats">Thống Kê</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách từ vựng đã ôn tập</CardTitle>
                            <CardDescription>Thông tin từ reviewHistory</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Từ Vựng</TableHead>
                                            <TableHead>Trạng Thái</TableHead>
                                            <TableHead>Ngày Ôn</TableHead>
                                            <TableHead>Kết Quả</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {data.reviewHistory.map((review, index) => {
                                            const vocabItem = data.vocab.vocabList.find(
                                                (v) => v.id === review.vocabId
                                            );
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{vocabItem?.vocab ?? 'N/A'}</TableCell>
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
                                                    <TableCell>{new Date(review.reviewDate).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={cn(
                                                                review.result === "again" ? "bg-red-500" : "bg-green-500"
                                                            )}
                                                        >
                                                            {review.result}
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

                <TabsContent value="stats">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thống Kê Chi Tiết</CardTitle>
                            <CardDescription>Lịch sử ôn tập theo ngày</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={reviewHistoryChartData}>
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
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
