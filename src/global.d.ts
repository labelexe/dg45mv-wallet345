declare module '*.png' {
    import { ImageSourcePropType } from 'react-native';
    const value: ImageSourcePropType;
    export default value;
 }

declare module '*.jpg' {
    import { ImageSourcePropType } from 'react-native';
    const value: ImageSourcePropType;
    export default value;
}

type VideoType = number | { uri?: string | undefined; headers?: { [key: string]: string; } | undefined; type?: string | undefined; };

declare module '*.mp4' {
    const value: VideoType;
    export default value;
}
