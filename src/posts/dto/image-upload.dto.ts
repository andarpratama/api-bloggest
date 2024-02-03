// image-upload.dto.ts

import { IsNotEmpty } from 'class-validator';

export class ImageUploadDto {
  @IsNotEmpty()
  file: any; // This will hold the image file

  @IsNotEmpty()
  title: string; // Add any other necessary properties for your image
}
