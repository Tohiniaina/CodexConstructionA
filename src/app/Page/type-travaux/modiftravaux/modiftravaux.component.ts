import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TypetravauxService } from 'src/app/_services/typetravaux.service';
import { UpdateService } from 'src/app/_services/update.service';

@Component({
  selector: 'app-modif',
  templateUrl: './modiftravaux.component.html',
  styleUrls: ['./modiftravaux.component.css']
})
export class ModifTravauxComponent {
  @Input() idTravaux: any;
  @Input() nomTravaux: any;
  @Input() pu: any;

  constructor(
    public modalRef: BsModalRef,
    private typeTravauxService: TypetravauxService,
    private updateService: UpdateService
  ) {}

  closeModal() {
    this.modalRef.hide(); // Ferme le modal
  }

  submitForm(): void {
    console.log("go");
    this.typeTravauxService.saveTravaux(this.idTravaux.toString(), this.pu.toString()).subscribe(
      data => {
        this.updateService.notifyUpdate();
      },
      error => {
        console.error('Error', error);
      }
    );
    this.modalRef.hide();
  }
}
