import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TypefinitionService } from 'src/app/_services/typefinition.service';
import { UpdateService } from 'src/app/_services/update.service';

@Component({
  selector: 'app-modif',
  templateUrl: './modif.component.html',
  styleUrls: ['./modif.component.css']
})
export class ModifComponent {
  @Input() idFinition: any;
  @Input() nomFinition: any;
  @Input() pourcentage: any;

  constructor(
    public modalRef: BsModalRef,
    private typeFinitionService: TypefinitionService,
    private updateService: UpdateService
  ) {}

  closeModal() {
    this.modalRef.hide(); // Ferme le modal
  }

  submitForm(): void {
    this.typeFinitionService.saveFinition(this.idFinition.toString(), this.nomFinition.toString(), this.pourcentage.toString()).subscribe(
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
