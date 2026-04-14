import { UploadedFile } from "express-fileupload";
import {randomUUID} from "node:crypto";
import path from "node:path";
import {ApiError} from "../errors/api.error";
import {ALLOWED_IMAGE_MIMETYPES, MAX_IMAGE_SIZE} from "../constants/file.constants";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import {configs} from "../configs/config";
import {DeleteObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

class S3Service {
    constructor(
        private readonly client = new S3Client({
            region: configs.AWS_S3_REGION,
            credentials: {
                accessKeyId: configs.AWS_ACCESS_KEY,
                secretAccessKey: configs.AWS_SECRET_KEY,
            },
        }),
    ) {}

    public async uploadFile(
        file: UploadedFile,
        itemType: FileItemTypeEnum,
        itemId: string,
    ): Promise<string>
    {
        this.validateFile(file);
        try {
            const filePath = this.buildPath(itemType, itemId, file.name);
            await this.client.send(
                new PutObjectCommand({
                    Bucket: configs.AWS_S3_BUCKET_NAME,
                    Key: filePath,
                    Body: file.data,
                    ContentType: file.mimetype,
                    ACL: configs.AWS_S3_ACL,
                }),
            );
            return filePath;
        } catch (error) {
            console.error("Error upload: ", error);
        }
    }

    public async deleteFile(filePath: string): Promise<void> {
        try {
            await this.client.send(
                new DeleteObjectCommand({
                    Bucket: configs.AWS_S3_BUCKET_NAME,
                    Key: filePath,
                }),
            );
        } catch (error) {
            console.error("Error delete: ", error.message);
        }
    }
    private validateFile(file: UploadedFile): void {
        if (!file) {
            throw new ApiError("File is required", 400);
        }

        if (file.size > MAX_IMAGE_SIZE) {
            throw new ApiError("File is too large (max 2MB)", 400);
        }

        if (!ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
            throw new ApiError("Invalid file type", 400);
        }
    }

    private buildPath(
        itemType: FileItemTypeEnum,
        itemId: string,
        fileName: string,
    ): string {
        return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`;
    }
}

export const s3Service = new S3Service();