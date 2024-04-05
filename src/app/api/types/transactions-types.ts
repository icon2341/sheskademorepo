import {UUID} from "node:crypto";

export type Transaction = {
	id: UUID
	event_id: UUID
	guest_id: string
	user_id: string
	amount: number
	transaction_at: Date
	status: TransactionStatus
	payment_method: PaymentMethod
	created_at: Date
}

export enum TransactionStatus {
	PENDING = "pending",
	COMPLETED = "completed",
	FAILED = "failed"
}

export enum PaymentMethod {
	CARD = "card",
	PAYPAL = "paypal",
	ACSS_DEBIT = "acss_debit",
	AFFIRM = "affirm",
	AFTERPAY_CLEARPAY = "afterpay_clearpay",
	KLARNA = "klarna",
	LINK = "link",
	US_BANK_ACCOUNT = "us_bank_account",
}