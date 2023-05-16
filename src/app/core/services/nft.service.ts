// src/app/ethereum.service.ts
import { Injectable } from '@angular/core';
import Web3 from 'web3';
import {environment} from "@environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, lastValueFrom, map, Observable, throwError} from "rxjs";
import {INftDataPayload, INftSignatureData, ISetNftPayload} from "../models/nft.model";

@Injectable({
  providedIn: 'root',
})
export class NftService {
  private web3: Web3;
  private contract: any;
  private account: string;
  private contractAddress = '0xbA600A26e0abc12ab4636AE411fECbB76e1DEEb4';
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {
    this.web3 = new Web3((window as any).ethereum);
    this.getContractAbi()
      .subscribe((abi: any) => {
        this.contract = new this.web3.eth.Contract(abi, this.contractAddress);
      });

  }

  async connectWallet() {
    if (!(window as any).ethereum) {
      alert('Please install MetaMask first.');
      return;
    }
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      console.log(accounts);
      return accounts[0];
    } catch (error) {
      console.error("User rejected the request.");
    }
  }

  async delegatedMint(signature: string, account: string, id: number, amount: number, data: string, publicId: string): Promise<any> {
    try {
      const result = await this.contract.methods
        .delegatedMint(signature, account, id, amount, data)
        .send({ from: account });
      return await lastValueFrom(this.setNft({public_id: publicId, tx: result.transactionHash}));
    } catch (error) {
      console.error(error);
    }
  }

  async mintNFT(data: INftDataPayload): Promise<any> {
   const result: INftSignatureData = await lastValueFrom(this.getDataForNftMinting(data));
    return await this.delegatedMint(result.signature, result.account, result.id, result.amount, result.data, data.public_id);
  }

  getDataForNftMinting(data: INftDataPayload): Observable<INftSignatureData> {
    return this.http.post<INftSignatureData>(`${this.apiUrl}/sign-nft`, data)
      .pipe(
        map((res) => res?.data),
        catchError((err: HttpErrorResponse) => throwError(err))
      );
  }

  getContractAbi() {
    return this.http.get('./assets/data/NFTContractABI.json');
  }

  private setNft(data: ISetNftPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/nft`, data);
  }
}
