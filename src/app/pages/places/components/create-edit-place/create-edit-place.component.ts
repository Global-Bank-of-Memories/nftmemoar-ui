import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PlacesService} from '../../../../core/services/places.service';
import {WalletService} from '../../../../core/services/wallet.service';
import {AuthService} from '../../../../core/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Unsubscribable} from '../../../../core/models/unsubscribable';
import {switchMap, takeUntil} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {NftService} from '../../../../core/services/nft.service';
import {INftDataPayload} from '../../../../core/models/nft.model';
import {FileUpload} from "primeng/fileupload";

@Component({
  selector: 'app-create-edit-place',
  templateUrl: './create-edit-place.component.html',
  styleUrls: ['./create-edit-place.component.scss']
})
export class CreateEditPlaceComponent extends Unsubscribable implements OnInit {
  titleCreate: string = 'Create Place';
  titleEdit: string = 'Edit Place';
  editMode: boolean = false;
  isNftMinted: boolean = false;
  memoForm!: FormGroup;
  photoUrl: string = '';
  videoUrl: string = '';
  qrUrl: string = '';
  defaultPosition = {
    lat: 50.4501,
    lon: 30.5234,
  }
  price: {
    gbm: number,
    usd: number,
  } = {
    gbm: 0,
    usd: 0,
  }
  isSubmitting: boolean = false;
  isMinting: boolean = false;
  memoId: string = '';
  selectedPhoto: File = null;
  selectedVideo: File = null;
  markerOptions: google.maps.MarkerOptions = {
    animation: google.maps.Animation.DROP,
    draggable: true,
  }
  fitModes = [
    {
      label: 'Cover image',
      value: 'cover_image'
    },
    {
      label: 'Contain image',
      value: 'contain_image'
    },
    {
      label: 'Fit width',
      value: 'fit_width'
    },
    {
      label: 'Fit height',
      value: 'fit_height'
    }
  ];
  dashboardPath: string = '/places';
  editPath: string = '/places/edit';
  formFieldsMapping = {
    name: 'name',
    description: 'description',
    embeddedUrl: 'embedded_url',
    repeatVideo: 'repeat_video',
    cropVideoByFrame: 'crop_video_by_frame',
    chromaKeyColor: 'chroma_key_color',
    fitMode: 'fit_mode',
    lat: 'lat',
    lon: 'lon',
  }
  marketPlaces = [
    {
      label: 'OKX',
      value: 'okx'
    }
  ];
  nftData = {
    id: 0,
    contractAddress: '',
  }
  account;
  @ViewChild('videoFileUpload') videoFileUpload: FileUpload;
  @ViewChild('imgFileUpload') imgFileUpload: FileUpload;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private placesService: PlacesService,
    private walletService: WalletService,
    private nftService: NftService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        filter(res => res && res.id),
        tap(res => {
          this.editMode = true;
          this.memoId = res.id;
        }),
        switchMap(res => this.placesService.getPlaceDetails(res.id)),
        takeUntil(this.destroyed$),
      )
      .subscribe((res: any) => {
        const memo = res.data;
        this.isNftMinted = memo.nft_minted;
        this.memoForm.patchValue({
          name: memo.name,
          description: memo.description,
          embeddedUrl: memo.embedded_url,
          repeatVideo: memo.repeat_video,
          cropVideoByFrame: memo.crop_video_by_frame,
          chromaKeyColor: memo.chroma_key_color,
          fitMode: memo.fit_mode,
          lat: Number(memo.coordinates.split(':')[1].split(',')[0]),
          lng: Number(memo.coordinates.split(':')[2].replace('}', '')),
        });
        this.photoUrl = memo.photo_url;
        this.videoUrl = memo.video_url;
        this.qrUrl = memo.qr_url;
      });
    this.authService.setWalletData();
    this.initForm();
  }

  onVideoUpload(event: any) {
    this.selectedVideo = null;
    this.videoUrl = '';
    this.videoUrl = URL.createObjectURL(event.files[0]);
    this.selectedVideo = event.files[0];
    console.log(this.videoUrl);
    this.getPrice();
    this.videoFileUpload.clear();
    return true;
  }

  onPhotoUpload(event: any) {
    this.photoUrl = event.files[0].objectURL.changingThisBreaksApplicationSecurity;
    this.selectedPhoto = event.files[0];
    this.getPrice();
    this.imgFileUpload.clear();
  }

  onMapClick(event: any) {
    this.memoForm.patchValue({
      lat: event.latLng.lat(),
      lon: event.latLng.lng(),
    });
  }
  onPositionChanged(event: any) {
    this.memoForm.patchValue({
      lat: event.latLng.lat(),
      lon: event.latLng.lng(),
    });
  }

  onSubmit() {
    if (this.memoForm.invalid || ((!this.selectedPhoto || !this.selectedVideo) && !this.editMode)) {
      this.memoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const userWalletPublicKey = this.authService.walletData.value.public_key;
    const formData = new FormData();

    for (const key in this.memoForm.value) {
      if (this.formFieldsMapping[key] && this.memoForm.value[key]) {
        formData.append(this.formFieldsMapping[key], this.memoForm.value[key]);
      }
    }
    if (this.editMode) {
      formData.append('public_id', this.memoId);
      this.placesService
        .editDigitalMemory(formData)
        .subscribe((res: any) => {
          this.isSubmitting = false;
        });
    } else {
      formData.append('photo', this.selectedPhoto);
      formData.append('video', this.selectedVideo);
      this.walletService
        .sendTransfer(userWalletPublicKey, this.price.gbm, this.memoForm.value.password)
        .subscribe((res) => {
          const xdr = res;
          formData.append('transaction_xdr', xdr);
          this.placesService.createDigitalMemory(formData)
            .subscribe((res: any) => {

              this.router.navigate([`${this.editPath}/${res.data.public_id}`]);
            });
        });
    }
  }

  editMemo() {
  }

  getPrice(): void {
    if (!this.selectedPhoto || !this.selectedVideo) {
      return;
    }
    const formData = {
      photo_size: this.selectedPhoto.size,
      video_size: this.selectedVideo.size
    }
    this.placesService
      .getCreationPrice(formData)
      .subscribe((res: any) => {
        this.price = res.data.extend_amount;
      });
  }

  async connectWallet() {
   this.account = await this.nftService.connectWallet();
  }

  async mintNFT() {
    this.isMinting = true;
    const data: INftDataPayload = {
      public_id: this.memoId,
      recipient_address: this.account,
    }

    const result = await this.nftService.mintNFT(data);
    this.nftService.setNft({public_id: result.publicId, tx: result.tx}).subscribe(() => {
      this.nftData.id = result.id;
      this.nftData.contractAddress = result.contractAddress;
      this.isNftMinted = true;
      this.isMinting = false;
    })
  }

  private initForm(): void {
    this.memoForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      embeddedUrl: [
        '',
        [Validators.pattern(/^(http|https):\/\/[^ "]+$/)],
      ],
      repeatVideo: [false],
      cropVideoByFrame: [false],
      chromakeyColor: ['', Validators.pattern(/^#[0-9A-Fa-f]{6}$/)],
      fitMode: [this.fitModes[0].value, Validators.required],
      lat: [this.defaultPosition.lat, Validators.required],
      lon: [this.defaultPosition.lon, Validators.required],
      password: ['', Validators.required],
    });
  }
}
