import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  async saveMovieToPermanentStorage(fileName: string) {
    /// TODO : S3에 파일 저장 처리
    /// TDDO : S3 bucket의 public/temp -> public/attachedFiles 키로 이동 후 public/temp키 삭제
  }
}
