import { Component, OnInit, OnDestroy  } from '@angular/core';
import { TypefinitionService } from 'src/app/_services/typefinition.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModifComponent } from './modif/modif.component';
import { Subscription } from 'rxjs';
import { UpdateService } from 'src/app/_services/update.service';

@Component({
  selector: 'app-type-finition',
  templateUrl: './type-finition.component.html',
  styleUrls: ['./type-finition.component.css']
})
export class TypeFinitionComponent implements OnInit, OnDestroy {
  typeFinitionList: any[] = [];

  modalRef!: BsModalRef;
  updateSubscription!: Subscription;

  constructor(
    private typeFinitionService: TypefinitionService,
    private modalService: BsModalService,
    private updateService: UpdateService
  ) { }

  openModal(pourcentage: any, nom: any, id:any) {
    const initialState = {
      idFinition: id,
      nomFinition: nom,
      pourcentage: pourcentage // Passer la valeur à afficher au modal
    };
    this.modalRef = this.modalService.show(ModifComponent, { initialState });
  }

  ngOnInit(): void {
    this.loadTypeFinition();
    this.updateSubscription = this.updateService.update$.subscribe(() => this.loadTypeFinition());
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  loadTypeFinition() {
    this.typeFinitionService.getTypeFinition().subscribe(
      data => {
        this.typeFinitionList = data;
      },
      error => {
        console.log('Une erreur s\'est produite lors de la récupération des Types de finition : ', error);
      }
    );
  }
}
