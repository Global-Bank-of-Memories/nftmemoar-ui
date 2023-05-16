import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class Sha1Service {
  hashString(str: string): string {
    const sha1Hash = crypto.SHA1(str);
    return sha1Hash.toString(crypto.enc.Hex);
  }
}
