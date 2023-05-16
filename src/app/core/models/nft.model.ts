export interface INftDataPayload {
  public_id: string;
  recipient_address: string;
}
export interface INftSignatureData {
  signature: string;
  account: string;
  id: number;
  amount: number;
  data: any;
  URI: any;
}

export interface ISetNftPayload {
  public_id: string;
  tx: string;
}
