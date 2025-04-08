// app/lessons/[level]/loading.tsx
import Loading from "@/components/ui/loading";

export default function LoadingPage() {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loading />
        </div>
    );
}
