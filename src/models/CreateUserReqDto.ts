/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CreateIdentityDto } from './CreateIdentityDto';
import type { CreateUserOptionsDto } from './CreateUserOptionsDto';

export type CreateUserReqDto = {
    /**
     * 账户当前状态
     */
    status?: CreateUserReqDto.status;
    /**
     * 邮箱
     */
    email?: string;
    /**
     * 密码加密类型，支持 sm2 和 rsa
     */
    passwordEncryptType?: CreateUserReqDto.passwordEncryptType;
    /**
     * 手机号
     */
    phone?: string;
    /**
     * 手机区号
     */
    phoneCountryCode?: string;
    /**
     * 用户名，用户池内唯一
     */
    username?: string;
    /**
     * 用户真实名称，不具备唯一性
     */
    name?: string;
    /**
     * 昵称
     */
    nickname?: string;
    /**
     * 头像链接
     */
    photo?: string;
    /**
     * 性别
     */
    gender?: CreateUserReqDto.gender;
    /**
     * 邮箱是否验证
     */
    emailVerified?: boolean;
    /**
     * 手机号是否验证
     */
    phoneVerified?: boolean;
    /**
     * 出生日期
     */
    birthdate?: string;
    /**
     * 所在国家
     */
    country?: string;
    /**
     * 所在省份
     */
    province?: string;
    /**
     * 所在城市
     */
    city?: string;
    /**
     * 所处地址
     */
    address?: string;
    /**
     * 所处街道地址
     */
    streetAddress?: string;
    /**
     * 邮政编码号
     */
    postalCode?: string;
    /**
     * 第三方外部 ID
     */
    externalId?: string;
    /**
     * 用户所属部门 ID 列表
     */
    departmentIds?: Array<string>;
    /**
     * 自定义数据，传入的对象中的 key 必须先在用户池定义相关自定义字段
     */
    customData?: any;
    /**
     * 密码。可选加密方式进行加密，通过 passwordEncryptType 参数进行加密方法选择，默认为未加密
     */
    password?: string;
    /**
     * 是否首次登录时重新设置密码
     */
    resetPasswordOnFisrtLogin?: boolean;
    /**
     * 租户 ID
     */
    tenantIds?: Array<string>;
    /**
     * 第三方身份源（建议调用绑定接口进行绑定）
     */
    identities?: Array<CreateIdentityDto>;
    /**
     * 可选参数
     */
    options?: CreateUserOptionsDto;
};

export namespace CreateUserReqDto {

    /**
     * 账户当前状态
     */
    export enum status {
        SUSPENDED = 'Suspended',
        RESIGNED = 'Resigned',
        ACTIVATED = 'Activated',
        ARCHIVED = 'Archived',
    }

    /**
     * 密码加密类型，支持 sm2 和 rsa
     */
    export enum passwordEncryptType {
        SM2 = 'sm2',
        RSA = 'rsa',
        NONE = 'none',
    }

    /**
     * 性别
     */
    export enum gender {
        M = 'M',
        W = 'W',
        U = 'U',
    }


}