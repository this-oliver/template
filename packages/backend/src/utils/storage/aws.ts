import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import type { GenericBucket } from "./types";


class AwsBucket implements GenericBucket {
	s3Client: S3Client;
	bucketName: string;
	bucketRegion: string;

	constructor(config: { accessKeyId: string; secretAccessKey: string; bucketName: string; bucketRegion: string; bucketEndpoint?: string;}) {
		this.s3Client = new S3Client({ 
			region: config.bucketRegion,
			endpoint: config.bucketEndpoint,
			credentials: { 
				accessKeyId: config.accessKeyId,
				secretAccessKey: config.secretAccessKey
			},
			forcePathStyle: true // required with localstack
		});

		this.bucketName = config.bucketName;
		this.bucketRegion = config.bucketRegion;
	}

	async uploadFile (file: Express.Multer.File, config?: { name?: string }): Promise<string> {
		const params: PutObjectCommandInput = {
			Bucket: this.bucketName,
			Key: config?.name || file.originalname,
			Body: file.buffer,
			ContentType: file.mimetype,
			ACL: "public-read",
		};

		await this.s3Client.send(new PutObjectCommand(params));

		// return signed url
		// TODO: replace with the actual AWS url
		return `http://${this.bucketName}.s3.${this.bucketRegion}.localhost:4566/${params.Key}`;
	}

	/**
   * Removes a file from the bucket and returns true if successful.
   */
	async removeFile(url: string): Promise<boolean> {
		try {
			const filename = url.split("/").pop();

			// remove file from bucket
			await this.s3Client.send(new PutObjectCommand({
				Bucket: this.bucketName,
				Key: filename,
			}));

			return true;
		} catch (error) {
			return false;
		}
	}
}

export { AwsBucket };