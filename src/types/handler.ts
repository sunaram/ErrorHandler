export type HandlerOptions = {
    errorTypes?: {
        [key: string]: { statusCode?: number; message?: string; log?: Function | boolean | undefined };
    };
    isDevelopment?: boolean;
    log?: Function | boolean | undefined;
};

