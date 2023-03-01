declare module 'react-native-randombytes' {
    export function randomBytes(length: number, cb: (error: Error?, buffer: Buffer?) => void): Buffer?;
}