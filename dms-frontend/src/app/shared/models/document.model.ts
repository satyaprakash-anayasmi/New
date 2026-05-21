export interface DocumentResponse {
    id: number;
    title: string;
    filename: string;
    fileType: string;
    fileSize: number;
    status: string;
    uploaderId: number;
    uploaderUsername: string;
    reviewerId?: number;
    reviewerUsername?: string;
    comments?: string;
    createdAt: string;
    updatedAt: string;
}
