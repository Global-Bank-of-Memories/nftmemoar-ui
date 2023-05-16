import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {catchError, forkJoin, from, Observable, throwError, map, switchMap} from 'rxjs';
import StellarSdk, { Asset, Keypair, Operation, Server, TransactionBuilder } from 'stellar-sdk';
import {Buffer} from "buffer";
import {GBM_DESTINATION_PUBLIC_WALLET_ID, GBM_NETWORK_PASSPHRASE} from "../models/wallet.model";
import {AuthService} from "./auth.service";
import {filter, tap} from "rxjs/operators";
import StellarHDWallet from "stellar-hd-wallet";
import CryptoJS from 'crypto-js';

(window as any)['Buffer'] = Buffer;

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = environment.apiUrl;
  transaction!: any;
  constructor(
    private http: HttpClient,
  ) {
  }

  getWalletData() {
    return this.http.get(`${this.apiUrl}/wallet`)
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }

  getKeychain(): Observable<any> {
    return this.http.get(`${this.apiUrl}/keychain`).pipe(
      filter(Boolean),
      map((res: any) => res?.data)
    );
  }

  public sendTransfer(fromWallet: string, price: number, password: string): Observable<string> {
    const server = new Server(environment.stellar);
    const sourceKeypair = Keypair.fromPublicKey(fromWallet || '');
    const sourcePublicKey = sourceKeypair.publicKey();

    return forkJoin([from(server.loadAccount(sourcePublicKey)), from(server.fetchBaseFee())])
      .pipe(
        map(([acc, baseFee]) => {
        this.transaction = new TransactionBuilder(acc, {
          fee: String(baseFee),
          networkPassphrase: GBM_NETWORK_PASSPHRASE
        })
          .addOperation(
            Operation.payment({
              destination: GBM_DESTINATION_PUBLIC_WALLET_ID,
              asset: Asset.native(),
              amount: Number(price).toFixed(7)
            })
          )
          .setTimeout(0)
          .build();
        }),
        switchMap(() => this.getKeychain()),
        map(keychain => {
          const mnemonic = this.getMnemonic(keychain, password);
          this.signTransaction(mnemonic);
          console.log(this.transaction.toXDR('base64'));
          return this.transaction.toXDR('base64');
        }),
      );
  }

  public signTransaction(passphrase: string): string {
    try {
      const secret = StellarHDWallet.fromMnemonic(passphrase, GBM_NETWORK_PASSPHRASE);
      const source = Keypair.fromSecret(secret.getSecret(0));
      this.transaction.sign(source);
      return this.transaction.toXDR('base64');
    } catch (err) {
      return '';
    }
  }

  private getMnemonic(keychain: string, password: string): string {
    try {
      let passphrase = password;
      if (password && password.length < 32) {
        while (passphrase.length < 32) {
          passphrase += password;
        }
      }

      let iv = password;
      if (password && password.length < 16) {
        while (iv.length < 16) {
          iv += password;
        }
      }

      const key = CryptoJS.enc.Utf8.parse(passphrase.slice(0, 32));
      const iv1 = CryptoJS.enc.Utf8.parse(iv.slice(0, 16));
      const plainText = CryptoJS.AES.decrypt(keychain.replace(/\n/g, ''), key, {
        keySize: 16,
        iv: iv1,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const descryptedData = plainText.toString(CryptoJS.enc.Utf8).split(',');
      const mnemonicItem = !!descryptedData ? descryptedData.find(item => item.includes('mnemonic')) : null;
      const mnemonic = !!mnemonicItem ? mnemonicItem.split(':') : '';

      return !!mnemonic ? mnemonic[1] : '';
    } catch (err) {
      return '';
    }
  }
}
