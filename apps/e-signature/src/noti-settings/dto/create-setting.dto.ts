import { IsBoolean, IsDefined } from 'class-validator';
import { BaseDto } from '../../base/dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingDto extends BaseDto {
  /**
   * 서명이 시작됨
   */
  @IsDefined()
  @IsBoolean()
  @ApiProperty({
    description: '서명이 시작됨 on/off [true or false]',
    example: 'true',
  })
  signingStarted: boolean;

  /**
   * 서명이 완료됨
   */
  @IsDefined()
  @IsBoolean()
  @ApiProperty({
    description: '서명이 완료됨 on/off [true or false]',
    example: 'true',
  })
  signingComplete: boolean;

  /**
   * 서명자가 서명을 거절함
   */
  @IsDefined()
  @IsBoolean()
  @ApiProperty({
    description: '서명자가 서명을 거절함 on/off [true or false]',
    example: 'true',
  })
  declineSignatures: boolean;

  /**
   * 서명자가 서명을 취소함
   */
  @IsDefined()
  @IsBoolean()
  @ApiProperty({
    description: '서명자가 서명을 취소함 on/off [true or false]',
    example: 'true',
  })
  canceledSignatures: boolean;

  /**
   * 서명 요청 취소함
   */
  @IsDefined()
  @IsBoolean()
  @ApiProperty({
    description: '서명 요청 취소함 on/off [true or false]',
    example: 'true',
  })
  canceledSignatureReq: boolean;

  /**
   * 서명 요청할 차례
   */
  @IsDefined()
  @IsBoolean()
  @ApiProperty({
    description: '서명 요청할 차례 on/off [true or false]',
    example: 'true',
  })
  turnForSignature: boolean;

  /**
   * 모든 서명 요청 알림 끄기
   */
  @IsDefined()
  @IsBoolean()
  @ApiProperty({
    description: '모든 서명 요청 알림 끄기 on/off [true or false]',
    example: 'true',
  })
  disableNotiForSignatureReq: boolean;
}
