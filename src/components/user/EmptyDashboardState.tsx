// 📁 components/EmptyDashboardState.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, ArrowRight, Sparkles } from "lucide-react";

export default function EmptyDashboardState() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <motion.div
                className="text-center mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-3xl font-bold tracking-tight mb-2">Chào mừng đến với Trang Tổng Quan Học Tập</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Bạn chưa có từ vựng nào trong hệ thống. Hãy thêm từ mới để bắt đầu hành trình học tập!
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
            >
                <motion.div variants={itemVariants}>
                    <Card className="h-full border-2 border-primary/20 shadow-md">
                        <CardHeader className="pb-2">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    repeatDelay: 1
                                }}
                                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                            >
                                <Plus className="h-8 w-8 text-primary" />
                            </motion.div>
                            <CardTitle className="text-center">Thêm Từ Vựng Mới</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            <p>Thêm từ vựng mới để bắt đầu hành trình học tập của bạn. Mỗi từ vựng sẽ được theo dõi và ôn tập theo phương pháp khoa học.</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full gap-2"
                                asChild
                            >
                                <Link href="/vocabulary">
                                    <Plus size={16} /> Thêm từ mới ngay
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="h-full border border-muted shadow-sm">
                        <CardHeader className="pb-2">
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"
                            >
                                <Sparkles className="h-8 w-8 text-muted-foreground" />
                            </motion.div>
                            <CardTitle className="text-center">Lợi ích của việc ôn tập</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground">
                            <p>Hệ thống sẽ giúp bạn ôn tập đúng thời điểm, tăng khả năng ghi nhớ lâu dài và tiết kiệm thời gian học tập.</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mx-auto max-w-2xl"
            >
                <Card className="bg-primary/5 border-none">
                    <CardContent className="pt-6 pb-4">
                        <div className="flex items-start space-x-4">
                            <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-medium text-foreground">Hướng dẫn nhanh</h3>
                                <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                                    <motion.li
                                        className="flex items-start"
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1.0 }}
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-[10px] font-medium text-foreground">
                                            1
                                        </span>
                                        <span className="ml-3 flex-1">Thêm từ vựng mới ở trang từ vựng</span>
                                    </motion.li>
                                    <motion.li
                                        className="flex items-start"
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1.2 }}
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-[10px] font-medium text-foreground">
                                            2
                                        </span>
                                        <span className="ml-3 flex-1">Ôn tập thường xuyên với Học tập</span>
                                    </motion.li>
                                    <motion.li
                                        className="flex items-start"
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 1.4 }}
                                    >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-[10px] font-medium text-foreground">
                                            3
                                        </span>
                                        <span className="ml-3 flex-1">Theo dõi tiến độ học tập tại tiến độ học</span>
                                    </motion.li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-primary/5 px-6 py-4">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            asChild
                        >
                            <Link href="/vocabulary">
                                <BookOpen size={16} />
                                Bắt đầu hành trình học tập
                                <ArrowRight size={16} className="ml-auto" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}