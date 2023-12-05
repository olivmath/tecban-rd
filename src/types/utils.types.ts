import { TpftAcronym, TpftCode, TpftMaturityDate, TpftUnitPrice } from "./tpft.types";

export type OperationId = {
  index: string;
  bankCode: string;
  date: string;
  toString: () => string;
};

export type TPFtInfo = {
  acronym: TpftAcronym;
  code: TpftCode;
  maturityDate: TpftMaturityDate;
  unitPrice: TpftUnitPrice;
  floatUnitPrice: number;
}