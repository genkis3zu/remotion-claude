import { Img, staticFile, useVideoConfig, spring, useCurrentFrame } from 'remotion';

export const SmartImage = ({ src, type }: { src: string, type: 'bg' | 'insert' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 挿入画像の場合はポップアップアニメーションをつける
    const scale = type === 'insert' ? spring({
        frame,
        fps,
        config: { damping: 12 },
        from: 0,
        to: 1,
    }) : 1; // 背景は固定、またはゆっくりズーム

    return (
        <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: type === 'insert' ? 10 : -1, // 挿入画像は手前
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Img
                src={src}
                style={{
                    transform: `scale(${scale})`,
                    borderRadius: type === 'insert' ? 20 : 0,
                    boxShadow: type === 'insert' ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
                    // 背景画像は少し暗くして文字を見やすくする
                    filter: type === 'bg' ? 'brightness(0.6)' : 'none',
                    maxWidth: type === 'insert' ? '80%' : '100%',
                    maxHeight: type === 'insert' ? '80%' : '100%',
                    objectFit: type === 'bg' ? 'cover' : 'contain',
                    width: type === 'bg' ? '100%' : 'auto',
                    height: type === 'bg' ? '100%' : 'auto',
                }}
            />
        </div>
    );
};
