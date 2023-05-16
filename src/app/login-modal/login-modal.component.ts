import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit {
  email!: string;
  password!: string;
  @Input() loginFunction!: Function; // Recibe la referencia del método login

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

  login() {
    console.log(`Email: ${this.email}, Password: ${this.password}`);
    
    this.loginFunction(this.email,this.password);
    // Aquí puedes hacer la lógica para autenticar al usuario
    // Si el usuario se autentica con éxito, puedes cerrar el modal
    this.modalController.dismiss();
  }
  
}
