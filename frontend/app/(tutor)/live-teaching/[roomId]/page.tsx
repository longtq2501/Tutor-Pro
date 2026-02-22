import { LiveRoomFeature } from '@/features/live-room';

interface PageProps {
    params: Promise<{ roomId: string }>;
}

export default async function LiveRoomPage({ params }: PageProps) {
    const { roomId } = await params;
    return <LiveRoomFeature roomId={roomId} />;
}
