import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { LoginModalComponent } from './login-modal/login-modal.component';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef;
  @ViewChild('loginModal') loginModal: any;
  user$!: Observable<firebase.default.User | null>;
  images: string[] = [];
  
  constructor(private modalController: ModalController,private afAuth: AngularFireAuth, private storage: AngularFireStorage) {
    this.user$ = this.afAuth.authState;
  }

  async login(email: string, password: string) {
    debugger
    await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.afAuth.signOut();
  }
  async showLoginForm() {
    const modal = await this.modalController.create({
      component: LoginModalComponent,componentProps: {
        loginFunction: this.login.bind(this), // Pasa la referencia del método login
      },
    });
    return await modal.present();
  }
  async uploadImage() {
    const canvas = this.canvasElement.nativeElement;
    const dataUrl = canvas.toDataURL('image/jpeg');
    const blob = this.dataURLtoBlob(dataUrl);
    console.log('Objeto Blob:', blob);
    const filePath = `images/${new Date().getTime()}.jpeg`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, blob);

    try {
      await task;
      fileRef.getDownloadURL().subscribe(downloadURL => {
        console.log('URL de la imagen:', downloadURL);
        this.images.push(downloadURL);
      }, error => {
        console.error(error);
      });
    } catch (error) {
      console.error(error);
    }
  }
  dataURLtoBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: 'image/jpeg' });
  }
  
  async ngAfterViewInit() {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 4096 },
          height: { ideal: 2160 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.nativeElement.srcObject = stream;
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  }

  capture() {
    const canvas = this.canvasElement.nativeElement;
    const video = this.videoElement.nativeElement;
    const desiredWidth = 280; // Anchura deseada para la imagen en el lienzo
    canvas.width = desiredWidth;
    canvas.height = (desiredWidth / video.videoWidth) * video.videoHeight;
    
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  }
  
}
function last(): import("rxjs").OperatorFunction<import("firebase/compat").default.storage.UploadTaskSnapshot | undefined, unknown> {
  throw new Error('Function not implemented.');
}

function switchMap(arg0: () => Observable<any>): import("rxjs").OperatorFunction<unknown, unknown> {
  throw new Error('Function not implemented.');
}

